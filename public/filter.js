//  let file = {};

//  function chooseFile(e){
//    file = e.target.files[0];
//  }
 
//  function signUpButtonPressed(){
      // firebase.storage().ref('products/'+file.name)
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

// FOR NEW
db.collection("products").get().then((snapshot) => {
  snapshot.forEach((doc) => {

    let object = doc.data();
    let id_name = doc.data().name.replace(/"/g, '')
    // console.log(object)
    // console.log(id_name)
    
    document.getElementById('product-list').innerHTML+=`
    <div class="product-item" id="${doc.id}" onclick="viewDetails(this.id)"> 
      <img src="" id="${doc.data().name.replace(/"/g, '')}" class="image_list">
      <div>${doc.data().name}</div>
      <div class="product-line"></div>
      <div>₱  ${parseFloat(doc.data().price6x6).toFixed(2)} to ${parseFloat(doc.data().price10x12).toFixed(2)}</div>
    </div>`;  
    // console.log(doc.data());
    

    firebase.auth().onAuthStateChanged(user => {
      if(user){
        // console.log('products/'+doc.id+'.jpg')
        firebase.storage().ref('products/'+doc.id+'.jpg').getDownloadURL().then((imgUrl)=> {
         var img = document.getElementById(id_name);
         img.src= imgUrl
        }).catch((err)=>{
          firebase.storage().ref('products/'+doc.id+'.JPG').getDownloadURL().then((imgUrl)=> {
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


// VIEW SPECIFIC PRODUCT
function viewDetails(id){
  console.log("CLICK");

  $("#product-main").hide();
  $("#product-details").show();
  
  db.collection("products").doc(id).get().then(function(doc){
    let id_name = doc.data().name.replace(/"/g, '') + "_detail"
    // console.log(id_name)

    document.getElementById('specific-product').innerHTML+=`
    <div class="specific-product-item" id="${id}"> 

      <div class="product-detail-left">
        <img src="" id="${id_name}" class="image_detail">
        <div class="ingredients">Ingredients: ${doc.data().ingredients}</div>
        <div class="product-detail-line"></div>
        <div class="description">${doc.data().description}</div>
      </div>

      <div class="product-detail-right">
        <div class="name">${doc.data().name}</div>
        <div class="size-header">Size</div>
        <div class="price">
          <div class="size">6x6 inches</div>
          <div class="price6x6">₱  ${parseFloat(doc.data().price6x6).toFixed(2)} </div>
        </div>

        <div class="price">
          <div class="size">7x8 inches</div>
          <div class="price7x8">₱  ${parseFloat(doc.data().price7x8).toFixed(2)} </div>
        </div>

        <div class="price">
          <div class="size">10x12 inches</div>
          <div class="price10x12">₱ ${parseFloat(doc.data().price10x12).toFixed(2)}</div>
        </div>  
        
      </div>

    </div>`;  
    
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        console.log('products/'+id+'.jpg')
        firebase.storage().ref('products/'+id+'.jpg').getDownloadURL().then((imgUrl)=> {
         var img = document.getElementById(id_name);
         img.src= imgUrl
        }).catch((err)=>{
          firebase.storage().ref('products/'+id+'.JPG').getDownloadURL().then((imgUrl)=> {
            var img = document.getElementById(id_name);
            img.src= imgUrl
           })
           //COMMENTED BECAUSE USED CATCH FOR, DIFFERENT KIND OF IMAGE TYPES
          // console.log(err)
        })
      }
    })
  })


}

// FOR POPULAR
db.collection("products").orderBy("orders","desc").get().then((snapshot) => {
  snapshot.forEach((doc) => {

    let object = doc.data();
    let id_name = doc.data().name.replace(/"/g, '')
    
    document.getElementById('product-list-popular').innerHTML+=`
    <div class="product-item" id="${doc.id}" onclick="viewDetails(this.id)"> 
      <img src="" id="${doc.data().name.replace(/"/g, '')}" class="image_list">
      <div>${doc.data().name}</div>
      <div class="product-line"></div>
      <div>₱  ${parseFloat(doc.data().price6x6).toFixed(2)} to ${parseFloat(doc.data().price10x12).toFixed(2)}</div>
    </div>`;  
    

    firebase.auth().onAuthStateChanged(user => {
      if(user){
        firebase.storage().ref('products/'+doc.id+'.jpg').getDownloadURL().then((imgUrl)=> {
         var img = document.getElementById(id_name);
         img.src= imgUrl
        }).catch((err)=>{
          firebase.storage().ref('products/'+doc.id+'.JPG').getDownloadURL().then((imgUrl)=> {
            var img = document.getElementById(id_name);
            img.src= imgUrl
           })
        })
      }
    })

  });
});

// FOR LOW
db.collection("products").orderBy("price6x6","asc").get().then((snapshot) => {
  snapshot.forEach((doc) => {

    let object = doc.data();
    let id_name = doc.data().name.replace(/"/g, '')
    
    document.getElementById('product-list-low').innerHTML+=`
    <div class="product-item" id="${doc.id}" onclick="viewDetails(this.id)"> 
      <img src="" id="${doc.data().name.replace(/"/g, '')}" class="image_list">
      <div>${doc.data().name}</div>
      <div class="product-line"></div>
      <div>₱  ${parseFloat(doc.data().price6x6).toFixed(2)} to ${parseFloat(doc.data().price10x12).toFixed(2)}</div>
    </div>`;  
    

    firebase.auth().onAuthStateChanged(user => {
      if(user){
        firebase.storage().ref('products/'+doc.id+'.jpg').getDownloadURL().then((imgUrl)=> {
         var img = document.getElementById(id_name);
         img.src= imgUrl
        }).catch((err)=>{
          firebase.storage().ref('products/'+doc.id+'.JPG').getDownloadURL().then((imgUrl)=> {
            var img = document.getElementById(id_name);
            img.src= imgUrl
           })
        })
      }
    })

  });
});

// FOR HIGH
db.collection("products").orderBy("price10x12","desc").get().then((snapshot) => {
    snapshot.forEach((doc) => {
  
      let object = doc.data();
      let id_name = doc.data().name.replace(/"/g, '')
      
      document.getElementById('product-list-high').innerHTML+=`
      <div class="product-item" id="${doc.id}" onclick="viewDetails(this.id)"> 
        <img src="" id="${doc.data().name.replace(/"/g, '')}" class="image_list">
        <div>${doc.data().name}</div>
        <div class="product-line"></div>
        <div>₱  ${parseFloat(doc.data().price6x6).toFixed(2)} to ${parseFloat(doc.data().price10x12).toFixed(2)}</div>
      </div>`;  
      
  
      firebase.auth().onAuthStateChanged(user => {
        if(user){
          firebase.storage().ref('products/'+doc.id+'.jpg').getDownloadURL().then((imgUrl)=> {
           var img = document.getElementById(id_name);
           img.src= imgUrl
          }).catch((err)=>{
            firebase.storage().ref('products/'+doc.id+'.JPG').getDownloadURL().then((imgUrl)=> {
              var img = document.getElementById(id_name);
              img.src= imgUrl
             })
          })
        }
      })
  
    });
  });

// FOR 6x6
db.collection("products").orderBy("price10x12","desc").get().then((snapshot) => {
    snapshot.forEach((doc) => {
  
      let object = doc.data();
      let id_name = doc.data().name.replace(/"/g, '')
      
      document.getElementById('product-list-6x6').innerHTML+=`
      <div class="product-item" id="${doc.id}" onclick="viewDetails(this.id)"> 
        <img src="" id="${doc.data().name.replace(/"/g, '')}" class="image_list">
        <div>${doc.data().name}</div>
        <div class="product-line"></div>
        <div>₱  ${parseFloat(doc.data().price6x6).toFixed(2)}</div>
      </div>`;  
      
  
      firebase.auth().onAuthStateChanged(user => {
        if(user){
          // console.log('products/'+doc.id+'.jpg')
          firebase.storage().ref('products/'+doc.id+'.jpg').getDownloadURL().then((imgUrl)=> {
           var img = document.getElementById(id_name);
           img.src= imgUrl
          }).catch((err)=>{
            firebase.storage().ref('products/'+doc.id+'.JPG').getDownloadURL().then((imgUrl)=> {
              var img = document.getElementById(id_name);
              img.src= imgUrl
             })
          })
        }
      })
  
    });
  });

// FOR 7x8
db.collection("products").orderBy("price10x12","desc").get().then((snapshot) => {
    snapshot.forEach((doc) => {
  
      let object = doc.data();
      let id_name = doc.data().name.replace(/"/g, '')
      
      document.getElementById('product-list-7x8').innerHTML+=`
      <div class="product-item" id="${doc.id}" onclick="viewDetails(this.id)"> 
        <img src="" id="${doc.data().name.replace(/"/g, '')}" class="image_list">
        <div>${doc.data().name}</div>
        <div class="product-line"></div>
        <div>₱  ${parseFloat(doc.data().price7x8).toFixed(2)}</div>
      </div>`;  
      
  
      firebase.auth().onAuthStateChanged(user => {
        if(user){
          firebase.storage().ref('products/'+doc.id+'.jpg').getDownloadURL().then((imgUrl)=> {
           var img = document.getElementById(id_name);
           img.src= imgUrl
          }).catch((err)=>{
            firebase.storage().ref('products/'+doc.id+'.JPG').getDownloadURL().then((imgUrl)=> {
              var img = document.getElementById(id_name);
              img.src= imgUrl
             })
          })
        }
      })
  
    });
  });

  // FOR 10x12
db.collection("products").orderBy("price10x12","desc").get().then((snapshot) => {
    snapshot.forEach((doc) => {
  
      let object = doc.data();
      let id_name = doc.data().name.replace(/"/g, '')
      
      document.getElementById('product-list-10x12').innerHTML+=`
      <div class="product-item" id="${doc.id}" onclick="viewDetails(this.id)"> 
        <img src="" id="${doc.data().name.replace(/"/g, '')}" class="image_list">
        <div>${doc.data().name}</div>
        <div class="product-line"></div>
        <div>₱  ${parseFloat(doc.data().price10x12).toFixed(2)}</div>
      </div>`;  
      
  
      firebase.auth().onAuthStateChanged(user => {
        if(user){
          firebase.storage().ref('products/'+doc.id+'.jpg').getDownloadURL().then((imgUrl)=> {
           var img = document.getElementById(id_name);
           img.src= imgUrl
          }).catch((err)=>{
            firebase.storage().ref('products/'+doc.id+'.JPG').getDownloadURL().then((imgUrl)=> {
              var img = document.getElementById(id_name);
              img.src= imgUrl
             })
          })
        }
      })
  
    });
  });




// VIEW SPECIFIC PRODUCT
function viewDetails(id){
  console.log("CLICK");

  $("#product-main").hide();
  $("#product-details").show();
  
  db.collection("products").doc(id).get().then(function(doc){
    let id_name = doc.data().name.replace(/"/g, '') + "_detail"
    // console.log(id_name)

    document.getElementById('specific-product').innerHTML+=`
    <div class="specific-product-item" id="${id}"> 

      <div class="product-detail-left">
        <img src="" id="${id_name}" class="image_detail">
        <div class="ingredients">Ingredients: ${doc.data().ingredients}</div>
        <div class="product-detail-line"></div>
        <div class="description">${doc.data().description}</div>
      </div>

      <div class="product-detail-right">
        <div class="name">${doc.data().name}</div>
        <div class="size-header">Size</div>
        <div class="price">
          <div class="size">6x6 inches</div>
          <div class="price6x6">₱  ${parseFloat(doc.data().price6x6).toFixed(2)} </div>
        </div>

        <div class="price">
          <div class="size">7x8 inches</div>
          <div class="price7x8">₱  ${parseFloat(doc.data().price7x8).toFixed(2)} </div>
        </div>

        <div class="price">
          <div class="size">10x12 inches</div>
          <div class="price10x12">₱ ${parseFloat(doc.data().price10x12).toFixed(2)}</div>
        </div>  
        
      </div>

    </div>`;  
    
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        console.log('products/'+id+'.jpg')
        firebase.storage().ref('products/'+id+'.jpg').getDownloadURL().then((imgUrl)=> {
         var img = document.getElementById(id_name);
         img.src= imgUrl
        }).catch((err)=>{
          firebase.storage().ref('products/'+id+'.JPG').getDownloadURL().then((imgUrl)=> {
            var img = document.getElementById(id_name);
            img.src= imgUrl
           })
           //COMMENTED BECAUSE USED CATCH FOR, DIFFERENT KIND OF IMAGE TYPES
          // console.log(err)
        })
      }
    })
  })


}




// FOR SEARCH - NEW
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

// FOR SEARCH - POPULAR
let searchInputPopular = document.getElementById('searchInputPopular');
searchInputPopular.addEventListener('keyup', filterProductsPopular);

function filterProductsPopular(){
  // Get value of input
  let searchValue = document.getElementById('searchInputPopular').value.toUpperCase();

  // Get products
  let ul = document.getElementById('product-list-popular');
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

// FOR SEARCH - LOW
let searchInputLow = document.getElementById('searchInputLow');
searchInputLow.addEventListener('keyup', filterProductsLow);

function filterProductsLow(){
  console.log("SRCH LOW")
  // Get value of input
  let searchValue = document.getElementById('searchInputLow').value.toUpperCase();

  // Get products
  let ul = document.getElementById('product-list-low');
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

// FOR SEARCH - HIGH
let searchInputHigh = document.getElementById('searchInputHigh');
searchInputHigh.addEventListener('keyup', filterProductsHigh);

function filterProductsHigh(){
  // Get value of input
  let searchValue = document.getElementById('searchInputHigh').value.toUpperCase();

  // Get products
  let ul = document.getElementById('product-list-high');
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

// FOR SEARCH - 6x6
let searchInput6x6 = document.getElementById('searchInput6x6');
searchInput6x6.addEventListener('keyup', filterProducts6x6);

function filterProducts6x6(){
  // Get value of input
  let searchValue = document.getElementById('searchInput6x6').value.toUpperCase();

  // Get products
  let ul = document.getElementById('product-list-6x6');
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

// FOR SEARCH - 7x8
let searchInput7x8 = document.getElementById('searchInput7x8');
searchInput7x8.addEventListener('keyup', filterProducts7x8);

function filterProducts7x8(){
  // Get value of input
  let searchValue = document.getElementById('searchInput7x8').value.toUpperCase();

  // Get products
  let ul = document.getElementById('product-list-7x8');
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

// FOR SEARCH - 10x12
let searchInput10x12 = document.getElementById('searchInput10x12');
searchInput10x12.addEventListener('keyup', filterProducts10x12);

function filterProducts10x12(){
  // Get value of input
  let searchValue = document.getElementById('searchInput10x12').value.toUpperCase();

  // Get products
  let ul = document.getElementById('product-list-10x12');
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

// FOR SUBMITTING FILTER FORM
$(document).ready(function(){
  $("input.filter").click(function(){
    $("form#filter").submit()
  })

})




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






