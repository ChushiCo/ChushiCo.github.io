//  let file = {};

//  function chooseFile(e){
//    file = e.target.files[0];
//  }
 
//  function signUpButtonPressed(){
//    firebase.storage().ref('products/'+'product1.jpg').put(file).then(function(){
//     console.log("successfully uploaded") 
//    }).catch(error => { 
//      console.log(error.message)
//    })
//  }


 

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


db.collection("products").get().then((snapshot) => {
  snapshot.forEach((doc) => {

    // firebase.auth().onAuthStateChanged(user => {
    //   console.log("HI")
    //   if(user){
    //     firebase.storage().ref('products/'+'product1.jpg').getDownloadURL().then((imgUrl)=> {
    //      var img = document.getElementById(doc.data().name.replace(/"/g, ''));
    //      img.src= imgUrl
    //      console.log(doc.data().name.replace(/"/g, ''))
    //     }).catch((err)=>{
    //       console.log(err)
    //     })
    //   }
    // })
    let object = doc.data();
    let id_name = doc.data().name.replace(/"/g, '')
    console.log(object)
    console.log(id_name)
    
    document.getElementById('product-list').innerHTML+=`
    <div class="product-item" id="${doc.id}" onclick="viewDetails(this.id)"> 
    <img src="" id="${doc.data().name.replace(/"/g, '')}">
    <div>${doc.data().name}</div>
    <div class="product-line"></div>
    <div>₱  ${parseFloat(doc.data().price6x6).toFixed(2)} to ${parseFloat(doc.data().price10x12).toFixed(2)}</div></div>`;  
    // console.log(doc.data());
    

    firebase.auth().onAuthStateChanged(user => {
      // let id_name = doc.data().name.replace(/"/g, '')
      // console.log('products/'+doc.id+'.jpg')
      if(user){
        firebase.storage().ref('products/'+ 'product1.jpg').getDownloadURL().then((imgUrl)=> {
         var img = document.getElementById(id_name);
         img.src= imgUrl
        //  console.log(doc.data().name.replace(/"/g, ''))
        }).catch((err)=>{
          console.log(err)
        })
      }
    })
  });
});

function viewDetails(id){
  console.log("CLICK");

  $("#product-main").hide();
  $("#product-details").show();

  db.collection("products").doc(id).get().then(function(doc){
    console.log(doc)
    document.getElementById('specific-product').innerHTML+=`
    <div class="specific-product-item" id="${id}"> 
      <div>Ingredients: ${doc.data().ingredients}</div>
      <div>${doc.data().description}</div>
      <div>${doc.data().name}</div>
      <div>6x6 inches ₱  ${parseFloat(doc.data().price6x6).toFixed(2)} </div>
      <div>7x8 inches ₱  ${parseFloat(doc.data().price7x8).toFixed(2)} </div>
      <div>10x12 inches ₱ ${parseFloat(doc.data().price10x12).toFixed(2)}</div>
    </div>`;  
  })


}

// FOR SEARCH
let searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keyup', filterProducts);

function filterProducts(){
  // Get value of input
  let searchValue = document.getElementById('searchInput').value.toUpperCase();

  // Get products
  let ul = document.getElementById('product-list');
  let li = ul.querySelectorAll('div.product-item');

  // Loop through product-list list
  for(let i = 0; i < li.length;i++){
    let div = li[i].getElementsByTagName('div')[0];
    // If matched
    if(div.innerHTML.toUpperCase().indexOf(searchValue) > -1){
      li[i].style.display = '';
    } else {
      li[i].style.display = 'none';
    }
  }

}




// var newObject ={
//     name: "Example",
//     quantity: 4
// }
// db.collection("inventory").add(newObject).then(function(doc) {
//     console.log("Document written with UID: ", doc.id);
// })
// .catch(function(error) {
//     console.error("Error adding document: ", error);
// });

//   db.collection("others").get().then((snapshot) => {
//     snapshot.forEach((doc) => {
//       document.getElementById('intro').innerHTML+=`${doc.data().value}`;
//     });
//   });

// db.collection("inventory").doc("dIKmVJBYaDJRWOXjU6u5").delete().then(function(){
//    console.log("Item deleted");
// })
// .catch(function(error){
//    console.log("Error in deleting item :"+errpr);
// });


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






