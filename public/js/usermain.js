$(document).ready(function(
){
    
console.log("ready");
    
var posttopage = function(todo){
console.log("Success!");
//add new todo to the dom
$messagedesc = todo.description;
if(todo.completed){

var $messagecompleted = 'checked="checked"';

}
else{

var $messagecompleted = "";

}
$messageid = todo.id;
$newmessage = $('<li class="list-group-item" ' + 'id="'+ $messageid + '"' + '></li>')
$iscompleted = $('<input type="checkbox" class="todocheck"'+ $messagecompleted +'></input>')
$($newmessage).append($messagedesc + " ", $iscompleted);

$("#thetodolist").prepend($newmessage);
}    
    
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
todos.forEach(posttopage)
},
statusCode:{404:function(){console.log("No todos found.")}}
})

//handles submission of new todos
$("#newtodosubmit").submit(function(event){
event.preventDefault();
console.log("Event captured.")
console.log(this);
var description =$("#newtodosubmit input[name=description]").val()
$("#newtodosubmit input[name=description]").val("");
$.ajax({
url:"/todos",
type:"POST",
dataType:"json",
contentType:"application/json",
data:JSON.stringify({
"description":description,
"completed":false
}),
success:posttopage,
processData: false



})


})

//handles checking and unchecking todos

$("#thetodolist").on("click",".todocheck",function(event){
var $id = $(this).parent()[0].id;
console.log(this);
var $checked = this.checked;
console.log($checked);
$.ajax({

url:"/todos" + "/" + $id,
type:"PUT",
dataType:"json",
contentType:"application/json",
data:JSON.stringify({
"completed": $checked
}),
success:function(){
console.log("Saved.")

},
processData: false



})

    

})





});