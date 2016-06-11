$(document).ready(function(
){
    
console.log("ready");
    
var posttopage = function(todo){
console.log("Success!");
//add new todo to the dom
if(todo.completed){
var $messagecompleted = 'btn-success';
var text = "Done!";
var glyphicon = "glyphicon-ok";
}
else{
var $messagecompleted = "btn-secondary";
var text = "Not Done";
var glyphicon = "glyphicon-remove";
}
$messagedesc = todo.description;
$messageid = todo.id;
$newmessage = $('<div class="list-group-item" ' + 'id="'+ $messageid + '"' + '></div>')
$iscompleted = $('<div class="col-sm-4"><button class="btn '+ $messagecompleted + ' btn-block todocheck todoitembtn"><span class="glyphicon '+  glyphicon +'" aria-hidden="true"></span><span class="btntxt"> ' +  text   +'</span></button></div>')
$deletebtn = $('<div class="col-sm-4"><button class="btn btn-danger btn-block tododelete todoitembtn"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Delete</button></div>');
$editbtn = $('<div class="col-sm-4"><button class="btn btn-info btn-block todoedit todoitembtn"><span class="glyphicon glyphicon-pencil" aria-hidden="true"></span> <span class= "edittxt">Edit<span></button></div>');
$btnrow = $('<div class="row"><div class="col-sm-12"></div></div>');
$(".col-sm-12", $btnrow).append($iscompleted, $editbtn, $deletebtn);
$($newmessage).append('<p class="tododesc">' + $messagedesc + "</p> ", $btnrow);

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

if(description.trim().length == 0){
console.log("Empty todo description. No submission made.")
$("#newtodosubmit input[name=description]").val("");
return
}
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
var $parent = $(this).closest(".list-group-item");
var $id = $parent[0].id;
if($(this).hasClass("btn-success")){
$checked = false;
console.log("Now Checked!");
$(this).removeClass("btn-success");
$(this).addClass("btn-secondary");
$(".glyphicon", this).removeClass("glyphicon-ok");
$(".glyphicon", this).addClass("glyphicon-remove");
$(".btntxt", this).html(" Not Done");
}
else{
$checked = true;
console.log("Now Unchecked!");
$(this).removeClass("btn-secondary");
$(this).addClass("btn-success");
$(".glyphicon", this).removeClass("glyphicon-remove");
$(".glyphicon", this).addClass("glyphicon-ok");
$(".btntxt", this).html(" Done!");
}
   
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

//this will be the delete todo function

$("#thetodolist").on("click",".tododelete",function(event){
var $parent = $(this).closest(".list-group-item");
var $id = $parent[0].id;
console.log(this);
$.ajax({
url:"/todos" + "/" + $id,
type:"DELETE",
dataType:"json",
contentType:"application/json",
success:function(){
console.log("Deleted.")
$($parent.remove())
},
processData: false
})
    
})


//This will open the edit window.


$("#thetodolist").on("click",".todoedit, .edittodobtn",function(event){
event.preventDefault();
var $parent = $(this).closest(".list-group-item");
$(".edittxt", this).text("...Editing")
var $id = $parent[0].id;
var $desc = $("div#" + $id + ".list-group-item > p.tododesc")
var $msgdesc = $desc.html();
if($desc.css("display") == "none"){
var $newdesc = $(".edittodoinput", $parent).val();
console.log($newdesc);
$.ajax({
url:"/todos" + "/" + $id,
type:"PUT",
dataType:"json",
contentType:"application/json",
data:JSON.stringify({
"description":$newdesc
}),
success:function(){
console.log("Saved.")
$(".edittodoform", $parent).remove();
$desc.css("display", "block");
$desc.text($newdesc);
$(".edittxt", $parent).text("Edit");
},
processData: false

})

}
else{
$newform = $('<form class="form-horizontal edittodoform"></form>');
$formgroup = $('<div class="form-group"></div>');
$formrow = $('<div class="col-xs-12"></div>');
$editinput =$('<input type="text" class="form-control edittodoinput" value="' + $msgdesc + '">')
$editinputbtn = $('<button class="btn btn-success edittodobtn"><span class="glyphicon glyphicon-ok"></span> Done</button>');
$newform.append($formgroup.append($formrow.append($editinput, $editinputbtn)))
$parent.prepend($newform);
$desc.css("display", "none");
}
})

//This will submit the edit request.

$("#thetodolist").on("click",".todoedit, .edittodobtn",function(event){
event.preventDefault();
    
})

});