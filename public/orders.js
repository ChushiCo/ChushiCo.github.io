var firebaseConfig = {
    apiKey: "AIzaSyDu8b5oa9CNk5sDIofIbFFSD3iYjaLBq6k",
    authDomain: "chushi-83100.firebaseapp.com",
    databaseURL: "https://chushi-83100.firebaseio.com",
    projectId: "chushi-83100",
    storageBucket: "chushi-83100.appspot.com",
    messagingSenderId: "406994437332",
    appId: "1:406994437332:web:992cb186eda09a2ab6e741"
};



db.collection("orders").get().then((snapshot) => {

     document.getElementById('inventory').innerHTML+=`
     <div class="order-id" id="${doc.id}">
     <div>Address: ${doc.data().address}</div>
     <div class="order-date">Date: ${doc.data().date}</div>
     <div>Method: ${doc.data().method}</div>
     <div>Order Number: ${doc.data().number}</div>
     <div>Ordered By: ${doc.data().ordered_by}</div>
     <div>Payment: ${doc.data().payment}</div>
     <div>Progress: ${doc.data().progress}</div>
     <div>Time: ${doc.data().time}</div>`
})


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