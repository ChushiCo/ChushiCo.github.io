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

// FOR DELETE USER
function deleteUser(user_id){
    console.log("DEL")
    console.log(user_id)

    db.collection("users").doc(user_id).delete().then(function(){
        console.log("User deleted");
      }).then(function(doc) {
        console.log("Document deleted with UID: " +user_id);
        $(document).ready(function(){
          $("form#delete-user-form").submit()
      })
      })
      .catch(function(error){
        console.log("Error in deleting item :"+error);
      });
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