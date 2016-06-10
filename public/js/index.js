$(document).ready(function(){
  $("a").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();
        console.log(this);
        console.log(this.hash);
      var hash = this.hash;
      offsettop = $(hash).offset().top - 50;
      $('html, body').animate({
        scrollTop: offsettop
      }, 1200, function(){
          
      });
    }
  });
});