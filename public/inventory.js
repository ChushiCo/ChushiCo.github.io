var firebaseConfig = {
    apiKey: "AIzaSyDu8b5oa9CNk5sDIofIbFFSD3iYjaLBq6k",
    authDomain: "chushi-83100.firebaseapp.com",
    databaseURL: "https://chushi-83100.firebaseio.com",
    projectId: "chushi-83100",
    storageBucket: "chushi-83100.appspot.com",
    messagingSenderId: "406994437332",
    appId: "1:406994437332:web:992cb186eda09a2ab6e741"
};

// image:
// name:
// quantity:


db.collection("inventory").get().then((snapshot) => {

     document.getElementById('inventory').innerHTML+=`
     <div class="inventory-item" id="${doc.id}">
     <img src="" id="${doc.data().name.replace(/"/g,'')}" class="image-inv"
     <div>${doc.data().name}</div>
     <div class="inv-count">${doc.data().quantity}<div>`
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