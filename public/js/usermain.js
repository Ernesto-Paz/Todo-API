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

//gets list of current todos for user    
$.ajax({
url:"/todos",
type:"GET",
success:function(todos){
console.log(todos);
todos.forEach(function(todo){
console.log(todo);
console.log("Success!");
//add new todo to the dom
$message = todo;
console.log(todo);
$("#thetodolist").prepend(JSON.stringify(todo));
})
},
statusCode:{404:function(){console.log("No todos found.")}}
})

$("#newtodosubmit").submit(function(event){
event.preventDefault();
console.log("Event captured.")
console.log(this);
$.ajax({
url:"/todos",
type:"POST",
dataType:"json",
contentType:"application/json",
data:JSON.stringify({
"description":$("#newtodosubmit input[name=description]").val(),
"completed":false
}),
success:function(todo){
console.log(todo);
console.log("Success!");
//add new todo to the dom
$message = todo;
console.log(todo);
$("#thetodolist").prepend(JSON.stringify(todo));
},
processData: false



})


})





});