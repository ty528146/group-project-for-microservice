// Check Off Specific Todos By Clicking
$("ul").on("click", "li", function(){
    $(this).toggleClass("completed");
});

//Click on X to delete Todo
$("ul").on("click", "span", function(event){
    $(this).parent().fadeOut(500,function(){
        $(this).remove();
    });
    event.stopPropagation();
});
/*
$("input[type='text']").keypress(function(event){
    if(event.which === 13){
        //grabbing new todo text from input
        var todoText = $(this).val();
        $(this).val("");
        //create a new li and add to ul
        $("ul").append("<li><span><i class='fa fa-trash'></i></span> " + todoText + "</li>")
    }
});
*/
$(".fa-plus").click(function(){
    $("input[type='text']").fadeToggle();
});


$(document).ready(function() {
    $(".displayoption").hide();
});
$(".fadefire").on("click",function(){$(".displayoption").toggle();});


function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

$(function() {
    $("#but1").click(function() {
        $(".fullscreen-container").fadeTo(200, 1);
    });
    $("#but2").click(function() {
        $(".fullscreen-container").fadeOut(200);
    });
});