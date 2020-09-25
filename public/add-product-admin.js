 // Your web app's Firebase configuration
 var firebaseConfig = {
    apiKey: "AIzaSyDu8b5oa9CNk5sDIofIbFFSD3iYjaLBq6k",
    authDomain: "chushi-83100.firebaseapp.com",
    databaseURL: "https://chushi-83100.firebaseio.com",
    projectId: "chushi-83100",
    storageBucket: "chushi-83100.appspot.com",
    messagingSenderId: "406994437332",
    appId: "1:406994437332:web:992cb186eda09a2ab6e741"
};
// Initialize Firebase
var defaultProject = firebase.initializeApp(firebaseConfig);

var db = firebase.firestore(); 

// FOR SUBMITTING FILTER FORM
// $(document).ready(function(){
//     $("add-product-btn").click(function(){
//       $("form#filter").submit()
//     })
  
// })

  
let file = {};
function chooseFile(e){
    file = e.target.files[0];
}

function addProductButtonPressed(){
  // e.preventDefault();
  console.log("HERE")
  // let name = document.getElementById('product_name').value;
  // let desc = document.getElementById('product_description').value;
  // let ing = document.getElementById('product_ingredients').value;
  // let small = document.getElementById('product_6x6').value;
  // let medium = document.getElementById('product_7x8').value;
  // let large = document.getElementById('product_10x12').value;

  // console.log(name)
  // console.log(desc)
  // console.log(ing)
  // console.log(small)
  // console.log(medium)
  // console.log(large)
  // console.log("HERERERE")

  // db.collection("orders").add({
  //     first_name: first_name,
  //     last_name: last_name,
  //     mob_num: parseInt(mob_num),
  //     email: email,
  //     password: password,
  //     role: "Client",
  //     date_start: today,
  //     street: street,
  //     bldg: bldg,
  //     city: city
  // }).then(function(doc) {
  //     console.log("Document written with UID: ", doc.id);
  // })
  // .catch(function(error) {
  //     console.error("Error adding document: ", error);
  //     res.render("register.hbs")
  // });

    // e.preventDefault();
    let name = document.getElementById('product_name').value;
     console.log("HERE")
     console.log('products/'+name+'.jpg')
     name = 'products/'+name+'.jpg'
     console.log(name)
     console.log(file)
     
    // //  firebase.storage().ref('products/'+file.name)
    //  firebase.storage().ref(name).put(file).then(function(){
    //   console.log("successfully uploaded") 
    //  }).catch(error => { 
    //    console.log(error.message)
    //  })
}



   var email = "karl_david@dlsu.edu.ph";
   var password = "abcd1234";
 
   firebase
     .auth()
     .signInWithEmailAndPassword(email, password)
     .then(function (user) {
       console.log("user signed in");
 
       var user = firebase.auth().currentUser;
       if (user != null) {
         console.log(user.email);
       }
     })
     .catch(function (error) {
       if (error.code == "auth/wrong-password") {
         alert("wrong password");
       } else {
         alert(err.message);
       }
     });