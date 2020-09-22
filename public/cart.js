$(document).ready(function(){
    $("svg.cart-content-remove").click(function(){
        let id = $(this).attr("data-id")
        console.log(id)
        $("input#delete_id").val(id)
        $("form.remove_item").submit()
    })
})