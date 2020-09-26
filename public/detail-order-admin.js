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

var submitForm = document.getElementById('order-progress-form');
function changeStatus(order_id, status_num){
    console.log(status_num)
    console.log(order_id)
    let progress

    if(status_num == 1){
        progress = "Order Received";
    }
    else if(status_num == 2){
        progress = "Preparing sushi bake";
    }
    else if(status_num == 3){
        progress = "Delivery on its way";
    }
    else if(status_num == 4){
        progress = "Delivered";
    }

    // console.log("AFTER "+order_id + "  "+ progress)
    db.collection("orders").doc(order_id).update({
        progress: progress
        
    }).then(function(doc) {
        console.log("Document updated with UID: " +order_id);
        submitForm.submit();
    }).catch(function(error) {
        console.error("Error editing document: ", error);
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