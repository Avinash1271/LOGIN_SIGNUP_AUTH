const express = require('express');
const path = require('path');
const hbs = require('hbs');
require('./db/connection');
const Register = require("./models/registers");
const async = require('hbs/lib/async');
const { urlencoded } = require('express');
const { json } = require('express');
const bcrypt = require('bcryptjs/dist/bcrypt');

const app = express();
const port = process.env.PORT || 4000;

const static_path = path.join(__dirname,"../public");
const views_path = path.join(__dirname,"../templates/views");
const partials_path = path.join(__dirname,"../templates/partials");

app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",views_path);
hbs.registerPartials(partials_path);

app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/register",(req,res)=>{
    res.render("register");
})
app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/register",async (req,res)=>{
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if(password===cpassword){
            const registerData = new Register({
                firstName : req.body.firstname,
                lastName : req.body.lastname,
                email : req.body.email,
                gender : req.body.gender,
                password : req.body.password,
                confirmPassword : req.body.confirmpassword
            })

            const registered = await registerData.save();
            res.status(201).render("index");

        }else{
            res.send("password are not matching");
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

app.post("/login",async (req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;
        //console.log(`${email} , ${password}`);

        const useremail = await Register.findOne({email:email});
        // res.send(useremail.password);
        // console.log(useremail);
        // if(useremail.password===password){
        //     res.status(201).send("login successfull");
        // }else{
        //     res.send("Invalid Credentials");
        // }

        const isMatch = await bcrypt.compare(password,useremail.password);
        if(isMatch){
            res.status(201).send("login successfull");
        }else{
            res.send("Invalid Credentials");
        }

    } catch (error) {
        res.status(400).send(error);
    }
})

app.listen(port,()=>{
    console.log(`server is running at ${port}`)
})