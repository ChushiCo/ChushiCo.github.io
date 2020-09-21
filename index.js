const express = require("express")
const session = require("express-session")
const bodyparser = require("body-parser")
const cookieparser = require("cookie-parser")
const hbs = require("hbs")
const app = express()

var admin = require("firebase-admin");

var serviceAccount = require('./chushi-83100-firebase-adminsdk-vfal3-5ad14f06c3.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chushi-83100.firebaseio.com"
});

const db = admin.firestore();


app.set("view engine", "hbs")

const urlencoder = bodyparser.urlencoded({
    extended:false
})

app.use(session({
    secret: "very secret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000 * 60 * 60 
    }
}))

app.use(express.static(__dirname + "/public"))

hbs.registerHelper('if_equal', function(a, b, opts) {
    if (a == b) {
        return opts.fn(this)
    } else {
        return opts.inverse(this)
    }
})

app.get("/", (req, res)=>{

    if(req.session.email){
        //user already signed in
        if(login == 1){
            res.render("home-user.hbs")
        }
        else if(login == 100){
            res.render("home-admin.hbs")
        }
    }

    else{
        // the user has not registered or logged
        res.render("index.hbs")
    
    }
})

app.post("/register", urlencoder, (req,res)=>{
    let first_name = req.body.first_name
    let last_name = req.body.last_name
    let mob_num = req.body.mob_num
    let email = req.body.email
    let password = req.body.password
    let street = req.body.street
    let bldg = req.body.bldg
    let city = req.body.city
    
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; 
    let yyyy = today.getFullYear();
    let month;
    switch(mm){
        case 1: month="January "; break;
        case 2: month="February "; break;
        case 3: month="March "; break;
        case 4: month="April "; break;
        case 5: month="May "; break;
        case 6: month="June "; break;
        case 7: month="July "; break;
        case 8: month="August "; break;
        case 9: month="September "; break;
        case 10: month="October "; break;
        case 11: month="November "; break;
        case 12: month="December "; break;
        // default: break;
    }

    today= month + dd +", " +yyyy; 
            
    db.collection("users").add({
        first_name: first_name,
        last_name: last_name,
        mob_num: parseInt(mob_num),
        email: email,
        password: password,
        role: "Client",
        date_start: today,
        street: street,
        bldg: bldg,
        city: city
    }).then(function(doc) {
        console.log("Document written with UID: ", doc.id);
        res.render("login-banner.hbs")
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
        res.render("register.hbs")
    });

    

})

let login=0;
app.post("/login", urlencoder, (req,res)=>{
    let email = req.body.email
    let password = req.body.password

    db.collection("users").get().then((snapshot) => {
        snapshot.forEach((doc) => {
            if((email == (doc.data().email)) && (password == (doc.data().password))){
                req.session.email = email
                req.session.password = password
                
                if(doc.data().role == "Admin"){
                    login=100;
                    console.log(doc.data().email)
                    console.log(doc.data().password)
                    console.log("login is"+login)
                }
                else{
                    login=1;
                    console.log(doc.data().email)
                    console.log(doc.data().password)
                    console.log("login is"+login)
                }       
            }
        }, (err)=>{
            console.log("Error is" +err)
        })


        if(login > 0){
            res.redirect("/")
        }
        else{
            res.render("login-banner.hbs", {
                message: "Invalid email/password"
            })    
        }   

    }); 
 
    
})

// function validUser(email, password){
//     db.collection("users").get().then((snapshot) => {
//         snapshot.forEach((doc) => {
//             if((email == (doc.data().email)) && (password == (doc.data().password))){
//                 console.log(email)
//                 return true;
//             }
//         }, (err)=>{
//             console.log("Error is"+err)
//         });
//         console.log("HERE")
//         return false;
//     }); 

// }

app.get("/register-page", (req, res)=>{
    res.render("register.hbs")
})

app.get("/login", (req, res)=>{
    res.render("login.hbs")
})

app.get("/home", (req, res)=>{
    res.redirect("/")
})

app.get("/catalog", (req, res)=>{

    if(req.session.email){
        //user already signed in
        if(login == 1){
            res.render("products-user.hbs")
        }
        else if(login == 100){
            // res.render("home-admin.hbs")
        }
    }
    
    else{
        res.render("products.hbs")
    }
    
})

app.get("/about", (req, res)=>{

    if(req.session.email){
        // res.render("home.hbs",{
        //     firstname: req.session.firstname,
        //     lastname: req.session.lastname
        // })
    }

    else{
        res.render("about.hbs")
    }
})

app.post("/filter", urlencoder, (req, res)=>{

    let filter = req.body.filter
    console.log(filter)

    if(req.session.email){
        if(login == 1){
            console.log("FILTER" +login)
            res.render("filter-user.hbs", {
                filter:filter
            })
        }
        else if(login == 100){
            // res.render("home-admin.hbs")
        }
    }
    
    else{
        res.render("filter.hbs", {
            filter:filter
        })
    }  
})

app.get("/ordertracker", (req, res)=>{
    res.render("tracker-user.hbs")
})

app.get("/history", (req, res)=>{
    res.redirect("/")
})

app.get("/cart", (req, res)=>{
    res.redirect("/")
})

app.get("/myaccount", (req, res)=>{
    res.redirect("/")
})

app.get("/inventory", (req, res)=>{
    if (login = 100){
        
    }
})


// app.get("/signout", (req,res)=>{
//      login=0;
//     req.session.destroy()
//     res.redirect("/")
// })

app.listen(3000, function(){
    console.log("now listening to port 3000")
})


