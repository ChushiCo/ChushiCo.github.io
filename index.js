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
    
    // if(req.session.email){
    //     //user already signed in
    //     if(login == 1){
    //         res.render("home-user.hbs")
    //     }
    //     else if(login == 100){
    //         res.render("home-admin.hbs")
    //     }
    // }

    // else{
    //     // the user has not registered or logged
    //     res.render("index.hbs")
    
    // }

    res.render("home-user.hbs")
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
    req.session.today = today
            
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
                req.session.first_name = doc.data().first_name
                req.session.last_name = doc.data().last_name
                req.session.mob_num = doc.data().mob_num
                req.session.street = doc.data().street
                req.session.bldg = doc.data().bldg 
                req.session.city = doc.data().city
                
                if(doc.data().role == "Admin"){
                    login=100;
                    // console.log(doc.data().email)
                    // console.log(doc.data().password)
                }
                else{
                    login=1;
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

    // if(req.session.email){
    //     //user already signed in
    //     if(login == 1){
    //         res.render("products-user.hbs")
    //     }
    //     else if(login == 100){
    //         // res.render("home-admin.hbs")
    //     }
    // }
    
    // else{
    //     res.render("products.hbs")
    // }

    res.render("products-user.hbs")
    
})

app.get("/about", (req, res)=>{

    if(req.session.email){
        res.render("home.hbs",{
            firstname: req.session.firstname,
            lastname: req.session.lastname
        })
    }

    else{
        res.render("about.hbs")
    }
})

app.post("/filter", urlencoder, (req, res)=>{

    let filter = req.body.filter
    // console.log(filter)

    // if(req.session.email){
    //     if(login == 1){
    //         console.log("FILTER" +login)
    //         res.render("filter-user.hbs", {
    //             filter:filter
    //         })
    //     }
    //     else if(login == 100){
    //         // res.render("home-admin.hbs")
    //     }
    // }
    
    // else{
    //     res.render("filter.hbs", {
    //         filter:filter
    //     })
    // }  

    res.render("filter-user.hbs", {
        filter:filter
    })

})

app.post("/quantity-order", urlencoder, (req,res)=>{
    let product_name = req.body.product_name
    let price6x6 = req.body.price6x6
    let price7x8 = req.body.price7x8
    let price10x12 = req.body.price10x12
    let qty6x6 = req.body.qty6x6
    let qty7x8 = req.body.qty7x8
    let qty10x12 = req.body.qty10x12
    let item={}

    let total6x6 = parseFloat(price6x6 * qty6x6).toFixed(2)
    let total7x8 = parseFloat(price7x8 * qty7x8).toFixed(2)
    let total10x12 = parseFloat(price10x12 * qty10x12).toFixed(2)
    let subtotal = computeSubtotal(price6x6, price7x8, price10x12, qty6x6, qty7x8, qty10x12)
    let total_quantity = parseInt(qty6x6) + parseInt(qty7x8) + parseInt(qty10x12)

    req.session.quantity = total_quantity

    //NO ITEMS IN CART
     if(!req.session.cart){
        req.session.cart = []
        req.session.subtotal = subtotal
    }
    
    else{
        // req.session.subtotal += subtotal 
        // req.session.subtotal = parseFloat(req.session.subtotal).toFixed(2) + parseFloat(subtotal).toFixed(2) 
        let current_total = parseFloat(req.session.subtotal).toFixed(2) + parseFloat(subtotal).toFixed(2) 

        console.log(" ELSE ADD: "+current_total)
    }

    if((qty6x6>0) && (qty7x8>0) && (qty10x12>0)){

        item = {
            name: product_name,
            price6x6: price6x6,
            qty6x6: qty6x6,
            total: total6x6
        }
        req.session.cart.push(item)

        item = {
            name: product_name,
            price7x8: price7x8,
            qty7x8: qty7x8,
            total: total7x8
        }
        req.session.cart.push(item)

        item = {
            name: product_name,
            price10x12: price10x12,
            qty10x12: qty10x12,
            total: total10x12
        }
        req.session.cart.push(item)
        console.log(req.session.cart)  
 
        res.render("cart-user.hbs", {cart:req.session.cart, subtotal:req.session.subtotal})
    }

    else if((qty6x6>0) && (qty7x8>0) && (qty10x12==0)){

        item = {
            name: product_name,
            price6x6: price6x6,
            qty6x6: qty6x6,
            total: total6x6
        }
        req.session.cart.push(item)

        item = {
            name: product_name,
            price7x8: price7x8,
            qty7x8: qty7x8,
            total: total7x8
        }
        req.session.cart.push(item) 

        res.render("cart-user.hbs", {cart:req.session.cart, subtotal:req.session.subtotal})
    }

    else if((qty6x6>0) && (qty7x8==0) && (qty10x12>0)){

        item = {
            name: product_name,
            price6x6: price6x6,
            qty6x6: qty6x6,
            total: total6x6
        }
        req.session.cart.push(item)

        item = {
            name: product_name,
            price10x12: price10x12,
            qty10x12: qty10x12,
            total: total10x12
        }
        req.session.cart.push(item)

        res.render("cart-user.hbs", {cart:req.session.cart, subtotal:req.session.subtotal})
    }

    else if((qty6x6>0) && (qty7x8==0) && (qty10x12==0)){
        item = {
            name: product_name,
            price6x6: price6x6,
            qty6x6: qty6x6,
            total: total6x6
        } 

        req.session.cart.push(item)
        res.render("cart-user.hbs", {cart:req.session.cart, subtotal:req.session.subtotal})
    }

    else if((qty6x6==0) && (qty7x8>0) && (qty10x12>0)){

        item = {
            name: product_name,
            price7x8: price7x8,
            qty7x8: qty7x8,
            total: total7x8
        }
        req.session.cart.push(item)

        item = {
            name: product_name,
            price10x12: price10x12,
            qty10x12: qty10x12,
            total: total10x12
        }
        req.session.cart.push(item) 

        res.render("cart-user.hbs", {cart:req.session.cart, subtotal:req.session.subtotal})
    }

    else if((qty6x6==0) && (qty7x8>0) && (qty10x12==0)){
        item = {
            name: product_name,
            price7x8: price7x8,
            qty7x8: qty7x8,
            total: total7x8
        } 

        req.session.cart.push(item)
        res.render("cart-user.hbs", {cart:req.session.cart, subtotal:req.session.subtotal})
    }

    else if((qty6x6==0) && (qty7x8==0) && (qty10x12>0)){
        item = {
            name: product_name,
            price10x12: price10x12,
            qty10x12: qty10x12,
            total: total10x12
        }

        req.session.cart.push(item)
        res.render("cart-user.hbs", {cart:req.session.cart, subtotal:req.session.subtotal})
    }
    else{
        req.session.cart.push(item)
        res.render("cart-user.hbs", {cart:req.session.cart, subtotal:req.session.subtotal})
    }
   
})

function computeSubtotal(price6x6, price7x8, price10x12, qty6x6, qty7x8, qty10x12){
    let priceA = price6x6 * qty6x6
    let priceB = price7x8 * qty7x8
    let priceC = price10x12 * qty10x12
    let subtotal = priceA + priceB + priceC;

    return parseFloat(subtotal).toFixed(2)
}

// function  computeQty(qty6x6, qty7x8, qty10x12){
//     let quantity = parseInt(qty6x6) + parseInt(qty7x8) + parseInt(qty10x12);
//     console.log("Q"+quantity)
// }

app.get("/ordertracker", (req, res)=>{
    // req.session.today
    // db.collection("orders").get().then((snapshot) => {
    //     snapshot.forEach((doc) => {
    //         console.log(name)
    //         console.log(doc.data().ordered_by)
    //         if((name == (doc.data().ordered_by))){
    //             history = {
    //                 date: doc.data().date,
    //                 number: doc.data().number,
    //                 payment: doc.data().payment,
    //                 order: doc.data().order,
    //                 method: doc.data().method,
    //                 address: doc.data().address
    //             }
    //             // console.log(history)
    //             req.session.order_history.push(history)    
    //         }
    //     }, (err)=>{
    //         console.log("Error is" +err)
    //     })
    //     // res.render("tracker-user.hbs")
    // }); 

    res.render("tracker-user.hbs")
    
// db.collection("inventory").add(newObject).then(function(doc) {
//     console.log("Document written with UID: ", doc.id);
// })
// .catch(function(error) {
//     console.error("Error adding document: ", error);
// });
})

app.get("/history", (req, res)=>{
    let name = req.session.first_name+" "+req.session.last_name
    console.log(req.session.first_name)
    console.log(req.session.last_name)

    let history={}

     if(!req.session.order_history){
        req.session.order_history = []
    }
    
    db.collection("orders").get().then((snapshot) => {
        snapshot.forEach((doc) => {
            if((name == (doc.data().ordered_by))){
                history = {
                    date: doc.data().date,
                    number: doc.data().number,
                    payment: doc.data().payment,
                    order: doc.data().order,
                    method: doc.data().method,
                    address: doc.data().address
                }
                // console.log(history)
                req.session.order_history.push(history)    
            }
        }, (err)=>{
            console.log("Error is" +err)
        })
        res.render("history-user.hbs", {
            history: req.session.order_history
        })
    }); 

})

app.get("/cart", (req, res)=>{
    res.render("cart-user.hbs", {
        cart:req.session.cart, 
        subtotal:req.session.subtotal})
})

app.post("/removeitem", urlencoder, (req,res)=>{
    let decrease = req.session.cart[parseInt(req.body.cartitem, 10)].total
    req.session.subtotal -= decrease
    
    req.session.cart.splice(parseInt(req.body.cartitem, 10),1)
    res.render("cart-user.hbs", {cart:req.session.cart, subtotal:  parseFloat(req.session.subtotal).toFixed(2)})
})

app.get("/checkout", (req, res)=>{

    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; 
    let yyyy = today.getFullYear();
    let hours = today.getHours(); 
    let minutes = today.getMinutes();

    if (mm < 10) {
        mm = '0' + mm;
    }
    
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;

    today= mm + "/" + dd +"/" + yyyy + " " + strTime; 

    console.log(today)
    res.render("checkout-user.hbs", {
        street: req.session.street,
        bldg: req.session.bldg,
        city: req.session.city,
        date: today,
        order: req.session.cart,
        subtotal: req.session.subtotal,
        quantity: req.session.quantity

    })

})

app.get("/myaccount", (req, res)=>{
    res.render("profile-user.hbs", {
        first_name: req.session.first_name,
        last_name: req.session.last_name,
        mob_num: req.session.mob_num,
        street: req.session.street,
        bldg: req.session.bldg,
        city: req.session.city,

    })
})




app.get("/signout", (req,res)=>{
     login=0;
    req.session.destroy()
    res.redirect("/")
})

app.listen(3000, function(){
    console.log("now listening to port 3000")
})


