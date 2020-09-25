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
    
    if(!req.session.tracker){
        req.session.tracker = []
    }

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

    // res.render("home-admin.hbs")
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
    
    
    req.session.today =  getDateToday()
            
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
            res.render("products-admin.hbs")
        }
    }
    
    else{
        res.render("products.hbs")
    }

    // res.render("products-admin.hbs")
    
})

app.get("/about", (req, res)=>{

    // if(req.session.email){
    //     res.render("home-user.hbs",{
    //         firstname: req.session.first_name,
    //         lastname: req.session.last_name
    //     })
    // }

    // else{
        res.render("about.hbs")
    // }
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
        let new_subtotal = parseFloat(req.session.subtotal) + parseFloat(subtotal)
        req.session.subtotal = parseFloat(new_subtotal).toFixed(2)
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
        // req.session.cart.push(item)
        res.render("cart-user.hbs", {cart:req.session.cart, subtotal:req.session.subtotal})
    }
   
})

app.get("/cart", (req, res)=>{
    res.render("cart-user.hbs", {
        cart:req.session.cart, 
        subtotal: parseFloat(req.session.subtotal).toFixed(2)})
})

app.post("/removeitem", urlencoder, (req,res)=>{
    let decrease = req.session.cart[parseInt(req.body.cartitem, 10)].total
    req.session.subtotal -= decrease
    
    req.session.cart.splice(parseInt(req.body.cartitem, 10),1)
    res.render("cart-user.hbs", {cart:req.session.cart, subtotal:  parseFloat(req.session.subtotal).toFixed(2)})
})

app.get("/checkout", (req, res)=>{

    today=getDateTime()

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


app.post("/new-address", urlencoder, (req,res)=>{
    req.session.new_street = req.body.new_street
    req.session.new_bldg = req.body.new_bldg
    req.session.new_city = req.body.new_city

    today=getDateTime()

    res.render("checkout-user.hbs", {
        street: req.session.new_street,
        bldg: req.session.new_bldg,
        city: req.session.new_city,
        date: today,
        order: req.session.cart,
        subtotal: parseFloat(req.session.subtotal).toFixed(2),
        quantity: req.session.quantity
    })
})

app.post("/place_order", urlencoder, (req,res)=>{
    
    let address = ""
    let name = req.session.first_name+" "+req.session.last_name
    let order = ""
    let today = getDateToday()
    let time=getTodayTime()
    let number = getOrderNumber()

    if(req.body.payment){

        if(req.session.new_street != undefined){
            address = address + req.session.new_street + ", " + req.session.new_bldg + ", " + req.session.new_city
        }

        else if(req.session.street != undefined){
            address = address + req.session.street + ", " + req.session.bldg + ", " + req.session.city
        }

        for(let i=0; i< req.session.cart.length; i++){
            if(req.session.cart[i].qty6x6 != undefined){
                order = order + req.session.cart[i].qty6x6 +"x " + req.session.cart[i].name +" (6x6 inches)\n"
            }
            else if(req.session.cart[i].qty7x8 != undefined){
                order = order + req.session.cart[i].qty7x8 +"x " + req.session.cart[i].name +" (7x8 inches)\n"
            }
            else if(req.session.cart[i].qty10x12 != undefined){
                order = order + req.session.cart[i].qty10x12 +"x " + req.session.cart[i].name +" (10x12s inches)\n"
            }
        }

        db.collection("orders").add({
            address: address,
            date: today,
            method: req.body.payment,
            order: order,
            ordered_by: name,
            payment: req.session.subtotal,
            progress: "Order Received",
            time: time,
            number: number
    
          }).then(function(doc){
            console.log("Document written with UID: ", doc.id);
            req.session.cart = []
            res.redirect("/ordertracker")
          }).catch(function(error) {
            console.error("Error adding document: ", error);
        });  

    }
    else{
        if(req.session.new_street != undefined){
            res.render("checkout-user.hbs", {
                street: req.session.new_street,
                bldg: req.session.new_bldg,
                city: req.session.new_city,
                date: today,
                order: req.session.cart,
                subtotal: req.session.subtotal,
                quantity: req.session.quantity
            })
        }

        else if(req.session.street != undefined){
            res.render("checkout-user.hbs", {
                street: req.session.street,
                bldg: req.session.bldg,
                city: req.session.city,
                date: today,
                order: req.session.cart,
                subtotal: req.session.subtotal,
                quantity: req.session.quantity
            })
        }

    }
    
})

app.get("/ordertracker", (req, res)=>{

    req.session.today =  getDateToday()
    let name = req.session.first_name+" "+req.session.last_name
    let order={}

    db.collection("orders").get().then((snapshot) => {
        snapshot.forEach((doc) => {
            
            if((name == (doc.data().ordered_by)) && (req.session.today === (doc.data().date))){
                order = {
                    progress: doc.data().progress,
                    date: req.session.today,
                    order_number: doc.data().number,
                    order: doc.data().order,
                    payment: doc.data().payment,
                    method: doc.data().method,
                    address: doc.data().address
                }
                req.session.tracker.push(order) 
            }

        }, (err)=>{
            console.log("Error is" +err)
        })
        res.render("tracker-user.hbs", {
            tracker: req.session.tracker
        })
    }); 


})

app.get("/history", (req, res)=>{
    let name = req.session.first_name+" "+req.session.last_name
    let history={}
    
    if(!req.session.order_history){
        req.session.order_history = []

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
                    req.session.order_history.push(history)    
                }
            }, (err)=>{
                console.log("Error is" +err)
            })
            res.render("history-user.hbs", {
                history: req.session.order_history
            })
        }); 
    }

    else{
        res.render("history-user.hbs", {
            history: req.session.order_history
        })
    }
    

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

app.get("/orders",(req,res)=>{
    let orders=[]
    if(login == 100){
        db.collection("orders").get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                orders.push({
                    address:doc.data().address,
                    date:doc.data().date,
                    number:doc.data().number,
                    order:doc.data().order,
                    ordered_by:doc.data().ordered_by,
                    payment:doc.data().payment,
                    progress:doc.data().progress,
                    time:doc.data().time
                })
            })
            res.render("orders.hbs",{
                orders:orders
    })
        })
    }

})

app.get("/inventory", (req, res)=>{
    let inventory=[]
    if (login == 100){
        db.collection("inventory").get().then((snapshot)=>{
            snapshot.forEach((doc)=>{
                inventory.push({
                    name: doc.data().name,
                    quantity: doc.data().quantity
                })
            })
            res.render("inventory.hbs",{
                inventory:inventory
            })

        })
        ,(err)=>{
            console.log(err)
        }
    }
})

app.get("/addproductpage", (req, res)=>{
    res.render("add-product-admin.hbs")
})

// app.post("/addproduct", urlencoder, (req, res)=>{
//     console.log(req.body.product_name)
//     console.log(req.body.product_description)
//     console.log(req.body.product_ingredients)
//     console.log(req.body.product_6x6)
//     console.log(req.body.product_7x8)
//     console.log(req.body.product_10x12)
//     console.log(req.body.product_image)

//     res.render("home-admin.hbs")

    
// })



app.get("/signout", (req,res)=>{
     login=0;
    req.session.destroy()
    res.redirect("/")
})



//FOR DAY September 24, 2020
function getDateToday(){
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
    return today
}

// FOR SUBTOTAL COMPUTATION ON CART
function computeSubtotal(price6x6, price7x8, price10x12, qty6x6, qty7x8, qty10x12){
    let priceA = price6x6 * qty6x6
    let priceB = price7x8 * qty7x8
    let priceC = price10x12 * qty10x12
    let subtotal = priceA + priceB + priceC;

    return parseFloat(subtotal).toFixed(2)
}


//FOR TIME 09/24/2020 1:00 PM
function getDateTime(){
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

    return today;
}

// FOR DATE AND TIME September 24, 2020 1:00 pm
function getTodayTime(){
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; 
    let yyyy = today.getFullYear();
    let hours = today.getHours(); 
    let minutes = today.getMinutes();

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
  
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;

    return today= month + dd +", " +yyyy + " "+strTime;
}

//FOR ORDER NUMBER
function getOrderNumber(){
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; 
    let yyyy = today.getFullYear();
    let hours = today.getHours(); 
    let minutes = today.getMinutes();
    let mil = today.getMilliseconds()
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours +''+ minutes +''+ mil;

    today= mm + dd + yyyy + strTime;
    console.log(minutes)
    console.log(mil)

    return today;
}


app.listen(process.env.PORT || 3000, function(){
    console.log("now listening to port 3000")
})


