//EDIT ADDRESS MODAL
var address_modal = document.getElementById('address-modal');
var modal_btn = document.getElementById('new-address-btn');
var form_add_addresss = document.getElementById('form-add-address');
var submit_address = document.getElementById('submit-address');
var closeBtnIntro = document.getElementsByClassName('address-closeBtn')[0];

//LISTENERS for open click, close click, outside click
modal_btn.addEventListener('click', openModalAddress);
closeBtnIntro.addEventListener('click', closeModalAddress);
window.addEventListener('click', outsideClickAddress);

function openModalAddress(){
    address_modal.style.display='block';
    submit_address.addEventListener('click', function(e){
    e.preventDefault();
    console.log("HERE");
    if((form_add_addresss.inputStreet.value != null) && (form_add_addresss.inputStreet.value != "") && 
        (form_add_addresss.inputBldg.value != null) && (form_add_addresss.inputBldg.value != "") &&
        (form_add_addresss.inputCity.value != null) && (form_add_addresss.inputCity.value != "") ){ 

      console.log("new address added");
      address_modal.style.display='none';
      
      $(form_add_addresss).submit()

    }
  });
}

function closeModalAddress(){
  address_modal.style.display='none';
}

function outsideClickAddress(e){
  if(e.target == address_modal){
    address_modal.style.display='none';
  }
}

// FOR SUBMITTING PAYMENT METHOD
$(document).ready(function(){
  $("div.place-order").click(function(){
      $("form#payment").submit()
  })
})