$(document).ready(function(
){
console.log("ready");
$("#logmeout").submit(function(event){
//stop button from submitting request
event.preventDefault();
//submit ajax request on click
$.ajax({
url: "/users/login",
type:"DELETE",
success:function(){
location.assign("/");
}
});


});







});