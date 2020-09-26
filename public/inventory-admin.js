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

// FOR INVENTORY
db.collection("inventory").get().then((snapshot) => {
  let x =1;
  let y=1000;
  snapshot.forEach((doc) => {
    
    let id_name = doc.data().name
    
    document.getElementById('inventory-list').innerHTML+=`
    <div class="inventory-item" id="${doc.id}"> 
      <img src="" id="${doc.data().name}" class="image_list_inventory">
      <div class="inventory-item-name">${doc.data().name}</div>

      <div class="inventory-quantity">
        <span class="quantity-subtract" onclick="subtractQuantity('${x}', '${y}')">-</span>
        <input id="${y}" class="inventory-quantity-input" type="number" value="${doc.data().quantity}" min="0"/>
        <span class="quantity-add" onclick="addQuantity('${x}', '${y}')">+</span>
      </div>

    </div>
    
    <form style="display:none">
      <input type="hidden" id="${x}" name="quantity" value="${doc.id}">
    </form>`; 
    x++;
    y++; 
    // console.log(doc.data());
    

    firebase.auth().onAuthStateChanged(user => {
      if(user){
        firebase.storage().ref('inventory/'+doc.id+'.jpg').getDownloadURL().then((imgUrl)=> {
         var img = document.getElementById(id_name);
         img.src= imgUrl
        }).catch((err)=>{
          firebase.storage().ref('inventory/'+doc.id+'.JPG').getDownloadURL().then((imgUrl)=> {
            var img = document.getElementById(id_name);
            img.src= imgUrl
           })
           //COMMENTED BECAUSE USED CATCH FOR, DIFFERENT KIND OF IMAGE TYPES
          // console.log(err)
        })
      }
    })

  });
});

function addQuantity(item_id, input_id){
  let value = $("input#"+input_id).val()
  let item = $("input#"+item_id)

  console.log(item.val())

  $(document).ready(function() {
    value = parseInt(value) + 1;
    $("input#"+input_id).val(value)

    db.collection("inventory").doc(item.val()).update({
      quantity: parseInt(value)
  
    }).then(function(doc) {
      console.log("Document updated with UID: "+ item.val());
      
    }).catch(function(error) {
      console.error("Error editing document: "+ error);
    });

  });
  
}

function subtractQuantity(item_id, input_id){
  let value = $("input#"+input_id).val()
  let item = $("input#"+item_id)

  console.log(item.val())

  $(document).ready(function() {
    value = parseInt(value) - 1;
    $("input#"+input_id).val(value)

    db.collection("inventory").doc(item.val()).update({
      quantity: parseInt(value)
  
    }).then(function(doc) {
      console.log("Document updated with UID: "+ item.val());
      
    }).catch(function(error) {
      console.error("Error editing document: "+ error);
    });

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