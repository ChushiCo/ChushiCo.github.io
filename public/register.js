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

var registerUser = document.getElementById('register-user-btn');


    var register_user = document.getElementById('register-user');
    
register_user.addEventListener('click', function(e){
    e.preventDefault();
    if( ((register_user.registerFname.value != null) && (register_user.registerFname.value != "")) &&
        ((register_user.registerLname.value != null) && (register_user.registerLname.value != "")) &&
        ((register_user.registerMob.value != null) && (register_user.registerMob.value != "")) &&
        ((register_user.registerEmail.value != null) && (register_user.registerEmail.value != "")) &&
        ((register_user.registerPass.value != null) && (register_user.registerPass.value != "")) &&
        ((register_user.registerStreet.value != null) && (register_user.registerStreet.value != "")) &&
        ((register_user.registerBldg.value != null) && (register_user.registerBldg.value != "")) &&
        ((register_user.registerCity.value != null) && (register_user.registerCity.value != "")) ){
            
            let today = new Date();
            let dd = today.getDate();
            let mm = today.getMonth()+1; 
            let yyyy = today.getFullYear();
            let month;
            switch(mm){
                case 1: month="January "; break;
                case 2: month="February "; break;
                case 3: month="March "; break;
                case 4: month="April "; break;
                case 5: month="May "; break;
                case 6: month="June "; break;
                case 7: month="July "; break;
                case 8: month="August "; break;
                case 9: month="September "; break;
                case 10: month="October "; break;
                case 11: month="November "; break;
                case 12: month="December "; break;
                // default: break;
            }

            today= month + dd +", " +yyyy; 
            console.log(today.toString())

            // console.log($("#registerFname").val() +" " +$("#registerLname").val())
            
            db.collection("users").add({
                first_name: register_user.registerFname.value,
                last_name: register_user.registerLname.value,
                mob_num: parseInt(register_user.registerMob.value),
                email: register_user.registerEmail.value,
                password: register_user.registerPass.value,
                role: "Client",
                date_start: today,
                street: register_user.registerStreet.value,
                bldg: register_user.registerBldg.value,
                city: register_user.registerCity.value
            }).then(function(doc) {
                console.log("Document written with UID: ", doc.id);
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        }
        else{
            console.log("ELSE")
        }
        
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


