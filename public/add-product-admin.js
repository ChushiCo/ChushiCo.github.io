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
    let name = document.getElementById('product_name').value;
    //  console.log("HERE")
     console.log('products/'+name+'.jpg')
     name = 'products/'+name+'.jpg'
     console.log(name)
     console.log(file)
     
    //  firebase.storage().ref('products/'+file.name)
     firebase.storage().ref(name).put(file).then(function(){
      console.log("successfully uploaded") 
     }).catch(error => { 
       console.log(error.message)
     })
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