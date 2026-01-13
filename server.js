require("dotenv").config()
const express = require("express")
const app = express()
const PORT = process.env.PORT
const path = require("path")
const http = require("http")
const jwt = require("jsonwebtoken")
const {createClient, isAuthWeakPasswordError} = require("@supabase/supabase-js")
const cookieParser = require("cookie-parser")
const SUPABASEURL = process.env.SUPABASEURL
const SUPABASEKEY = process.env.SUPABASEKEY
const SECRETKEY = process.env.SECRETKEY
const supabase = createClient(SUPABASEURL,SUPABASEKEY)
const cors = require("cors")
const multer = require("multer")
const BUCKET_NAME = "blog"


//Middlewares
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set("view engine","ejs")
app.use(express.static(path.join(__dirname,"public")))
app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true,
    methods:["POST","GET"]
}))

// Multer Memory Storage Configuration (upload buffer to Supabase Storage)
const storage = multer.memoryStorage()
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } })

// Ensure Supabase bucket exists
async function ensureBucket(bucketName) {
    try {
        const { data, error } = await supabase.storage.getBucket(bucketName)
        if (error && error.message && error.message.includes('not found')) {
            const { data: created, error: createErr } = await supabase.storage.createBucket(bucketName, { public: true })
            if (createErr) throw createErr
            return created
        }
        return data
    } catch (err) {
        // If getBucket isn't available or other error, rethrow
        throw err
    }
}


// Routes
app.get("/",(req,res)=>{
    res.render("home")
})
app.get("/signin",(req,res)=>{
    return res.redirect("http://localhost:5173")
})
app.post("/signin",async(req,res)=>{
    let {name,email,picture} = req.body
    try{
        let {data:user} = await supabase
        .from("users4")
        .select("*")
        .eq("email",email)
        .single()
        if(!user){
            let today = new Date()
            let date = String(today.getDate()).padStart(2,"0")
            let month = String(today.getMonth()+1).padStart(2,"0")
            let year = today.getFullYear()
            today = date + "/" + month + "/" + year
            let {data:insertion,err} = await supabase
            .from("users4")
            .insert([{
                name:name,
                email:email,
                picture:picture,
                date:today
            }])
            if(err){
                return res.redirect("/signin")
            }
            else{
                let token = jwt.sign({email},SECRETKEY)
                res.cookie("token",token)
                return res.status(201).redirect("/profile")
            }
        }
        else{
            let token = jwt.sign({email},SECRETKEY)
            res.cookie("token",token)
            return res.status(201).redirect("/profile")
        }
    }
    catch(err){
        return res.redirect("/signin")
    }
})

app.get("/signout",(req,res)=>{
    res.cookie("token","")
    return res.redirect("/signin")
})

// Protected Route 
const issignedin = (req,res,next) => {
    let token = req.cookies.token
    try{
        if(!token){
            return res.redirect("/signin")
        }
        else{
            let data = jwt.verify(token,SECRETKEY)
            req.user = data
            next()
        }
    }
    catch(err){
        return res.redirect("/signin")
    }
}

app.get("/profile",issignedin,async(req,res)=>{
    let {data:user} = await supabase
    .from("users4")
    .select("*")
    .eq("email",req.user.email)
    .single()
    let email = user.email
    let {data:blog} = await supabase
    .from("blogs")
    .select("*")
    .eq("email",email)

    let total = blog.length
    let name = user.name
    let picture = user.picture
    let date = user.date
    let totals = []
    blog.map((element)=>{
        totals.push(Number(element.likes))
    })
    let totallikes = 0
    for(let i = 0;i<totals.length;i++){
        totallikes = totallikes + totals[i]
    }
    res.render("profile",{email,picture,name,date,total,totallikes})
})

app.get("/create",issignedin,(req,res)=>{
    res.render("create")
})
app.post("/create",issignedin, upload.single("file"),async(req,res)=>{
    try{
    if(!req.file){
        console.error('Create: no file in request for user', req.user && req.user.email)
        return res.redirect("/create")
    }
    let {title,content} = req.body
    let {data:user} = await supabase
    .from("users4")
    .select("*")
    .eq("email",req.user.email)
    .single()
    if(!user){    
        console.error('Create: user not found for', req.user && req.user.email)
        return res.redirect("/create")
    }
    let name = user.name
    let email = user.email
    let picture = user.picture
    let today = new Date()
    let date = String(today.getDate()).padStart(2,"0")
    let month = String(today.getMonth()+1).padStart(2,"0")
    let year = today.getFullYear()
    today = date + "/" + month + "/" + year
    try{
        await ensureBucket(BUCKET_NAME)
    }catch(bucketErr){
         console.warn('Bucket ensure warning:', bucketErr.message || bucketErr)
    }
       const filePath = `${Date.now()}-${req.file.originalname}`
        const { data: uploadData, error: uploadErr } = await supabase
            .storage
            .from(BUCKET_NAME)
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false
            })
        if (uploadErr) {
            console.error('Create: upload error', uploadErr)
            return res.redirect('/create')
        }
        
        // Get public URL for the uploaded file
        const { data: urlData, error: urlErr } = await supabase
            .storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath)
        if (urlErr) {
        }
        const publicUrl = urlData.publicUrl
        const {data:insertion,err} = await supabase
        .from("blogs")
        .insert([{
            date:today,
            email:email,
            name:name,
            picture:picture,
            blog:publicUrl,
            title:title,
            content:content,
            likes:1
        }])
        if(err){
            console.error('Create: db insert error', err)
            return res.redirect("/create")
        }
        else{
            return res.redirect("/all")
        }
}
    catch(error){
        console.error('Create: unexpected error', error)
        return res.redirect("/create")
    }
})
app.get("/other",issignedin,async(req,res)=>{
    try{
        let {data:user} = await supabase
        .from("users4")
        .select("*")
        .eq("email",req.user.email)
        .single()
        let email = user.email
        let {data:other} = await supabase
        .from("blogs")
        .select("*")

        let otherblog = []

        other.filter((blog)=>{
            if(blog.email == email){}
            else{
                otherblog.push(blog)
            }
        })

        let liked 
        otherblog.map((element)=>{
             liked = element.likedby
        })


        res.render("other",{otherblog,email,liked})
    }
    catch(err){
        return res.redirect("/profile")
    }
})
app.get("/all",issignedin,async(req,res)=>{
    let {data:user} = await supabase
    .from("users4")
    .select("*")
    .eq("email",req.user.email)
    .single()
    let email = user.email
    let {data:all} = await supabase
    .from("blogs")
    .select("*")
    .eq("email",email)
    let total = all.length
    res.render("all",{all,total})
})

app.get("/delete/:content",issignedin,async(req,res)=>{
    let content = req.params.content
    try{
        let {data:deleted} = await supabase
        .from("blogs")
        .delete()
        .eq("content",content)
        .single()
        return res.redirect("/all") 
    }
    catch(error){
        console.log(err)
    }
})
app.get("/follow/:email",issignedin,async(req,res)=>{
    let email = req.params.email
    let {data:user} = await supabase
    .from("blogs")
    .select("*")
    .eq("email",email)
    .single()
    let {data:user2} = await supabase
    .from("users4")
    .select("*")
    .eq("email",req.user.email)
    .single()
    let anotherusermemail = user2.email
    let {data:updation,err} = await supabase
    .from("blogs")
    .update({followeremail:anotherusermemail})
    .eq("email",email)
    return res.redirect("/other")
})

app.get("/like/:content",issignedin,async(req,res)=>{
    let content = req.params.content
    let {data:user} = await supabase
    .from("users4")
    .select("*")
    .eq("email",req.user.email)
    .single()
    let email = user.email
    let name = user.name
    let {data:blog} = await supabase
    .from("blogs")
    .select("*")
    .eq("content",content)
    .single()

    if(!blog){
        return res.redirect("/other")
    }

    // Normalize existing likedby to an array
    let likedbyArray = Array.isArray(blog.likedby) ? blog.likedby : (blog.likedby ? [blog.likedby] : [])

    // Only append and increment if the user hasn't already liked
    if(!likedbyArray.includes(email)){
        likedbyArray.push(email)
        let newlike = Number(blog.likes || 0) + 1
        await supabase
        .from("blogs")
        .update({ likes: newlike, likedby: likedbyArray })
        .eq("content",content)
        .single()
    }

    return res.redirect("/other")
})

app.get("/edit/:content",issignedin,async(req,res)=>{
    let content = req.params.content
    let {data:blog} = await supabase
    .from("blogs")
    .select("*")
    .eq("content",content)
    .single()
    let title = blog.title
    let date = blog.date
    res.render("edit",{title,content,date})
})

app.post("/edit",issignedin,async(req,res)=>{
    let {oldcontent,newtitle,newcontent} = req.body
    try{
        let {data:updation} = await supabase
        .from("blogs")
        .update({content:newcontent,title:newtitle})
        .eq("content",oldcontent)
        .single()
        return res.redirect("/all")
    }
    catch(error){
        return res.redirect("/edit")
    }
})


// Testing Route 
app.get("/update/:content",async(req,res)=>{
    let content = req.params.content
    let {data:blog} =  await supabase
    .from("blogs")
    .update({likes:1})
    .eq("content",content)
    .single()
    return res.redirect("/all")
})

app.get("/check/:content",issignedin,async(req,res)=>{
    let content = req.params.content
    let {data:check} = await supabase
    .from("blogs")
    .select("*")
    .eq("content",content)
    .single()
    let info = check.likedby
    for(let i = 0;i<info.length;i++){
        return res.json(info[i])
    }
})

// Listening
app.listen(PORT,()=>{
    console.log(`App is running at port ${PORT}`)
})