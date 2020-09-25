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
var addBtn = document.getElementById('add-btn');
var submitForm = document.getElementById('add-product-form');

addBtn.addEventListener('click', function(e){
  let inputForm = document.getElementById('add-form');
  e.preventDefault();
  console.log("CLICK")

  db.collection("products").add({
      name: inputForm.product_name.value,
      description: inputForm.product_description.value,
      ingredients: inputForm.product_ingredients.value,
      orders: parseInt(0),
      price6x6: parseInt(inputForm.product_6x6.value),
      price7x8: parseInt(inputForm.product_7x8.value),
      price10x12: parseInt(inputForm.product_10x12.value)
  }).then(function(doc) {
      console.log("Document written with UID: ", doc.id);
      let img = doc.id
      img = 'products/'+img+'.jpg'

      firebase.storage().ref(img).put(file).then(function(){
        console.log("successfully uploaded") 
        submitForm.submit();
      }).catch(error => { 
        console.log(error.message)
      })

  })
  .catch(function(error) {
      console.error("Error adding document: ", error);
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