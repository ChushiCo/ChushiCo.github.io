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
  
let file = {};
function chooseFile(e){
    file = e.target.files[0];
}
var editBtn = document.getElementById('edit-btn');
var editForm = document.getElementById('edit-product-form');

editBtn.addEventListener('click', function(e){
  let inputForm = document.getElementById('edit-form');
  
  e.preventDefault();
  console.log("EDIT BUTTON")
  console.log(editForm.product_id.value)
  console.log(inputForm.product_name.value)
  console.log(inputForm.product_description.value)
  console.log(inputForm.product_ingredients.value)
  console.log(inputForm.product_price6x6.value)
  console.log(inputForm.product_price7x8.value)
  console.log(file)
  
  db.collection("products").doc(editForm.product_id.value).update({
    name: inputForm.product_name.value,
    description: inputForm.product_description.value,
    ingredients: inputForm.product_ingredients.value,
    price6x6: parseInt(inputForm.product_price6x6.value),
    price7x8: parseInt(inputForm.product_price7x8.value),
    price10x12: parseInt(inputForm.product_price10x12.value)
    
  }).then(function(doc) {
    console.log("Document updated with UID: ", editForm.product_id.value);
    editForm.submit();
    }).catch(function(error) {
    console.error("Error editing document: ", error);
  });
     
});



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