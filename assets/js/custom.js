//menu header//
jQuery(document).ready(function($){
    //if you change this breakpoint in the style.css file (or _layout.scss if you use SASS), don't forget to update this value as well
    var wd = 1170;

    //primary navigation slide-in effect
    if($(window).width() > wd) {
        var headerHeight = $('.Navbar-Header').height();
        $(window).on('scroll',
        {
            previousTop: 0
        },
        function () {
            var currentTop = $(window).scrollTop();
            //check if user is scrolling up
            if (currentTop < this.previousTop ) {
                //if scrolling up...
                if (currentTop > 0 && $('.Navbar-Header').hasClass('is-fixed')) {
                    $('.Navbar-Header').addClass('is-visible');
                } else {
                    $('.Navbar-Header').removeClass('is-visible is-fixed');
                }
            } else {
                //if scrolling down...
                $('.Navbar-Header').removeClass('is-visible');
                if( currentTop > headerHeight && !$('.Navbar-Header').hasClass('is-fixed')) $('.Navbar-Header').addClass('is-fixed');
            }
            this.previousTop = currentTop;
        });
    }
});

$(document).ready(function () {

if($('.Navbar-Header-sticky').attr('data-sticky') == "true"){
	$(window).on("scroll",function(){
		var Scrl = $(window).scrollTop();
		if (Scrl > 1) {
			$('.Navbar-Header-sticky').addClass('sticky animated fadeInDown');
		}else{
			$('.Navbar-Header-sticky').removeClass('sticky animated fadeInDown');
		}
	});
	$('document').ready(function(){
		var Scrl = $(window).scrollTop();
		if (Scrl > 1) {
			$('.Navbar-Header-sticky').addClass('sticky animated fadeInDown');
		}else{
			$('.Navbar-Header-sticky').removeClass('sticky animated fadeInDown');
		}
	});
}
});

/*-----------------------------------------------------------------------------------*/
/*	End Sticky Navigation
/*-----------------------------------------------------------------------------------*/

// You can modify the upload files to pdf's, docs etc
//Currently it will upload only images

$(document).ready(function($) {

  // Upload btn on change call function
  $(".uploadlogo").change(function() {
    var filename = readURL(this);
    $(this).parent().children('span').html(filename);
  });

  // Read File and return value  
  function readURL(input) {
    var url = input.value;
    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
    if (input.files && input.files[0] && (
      ext == "png" || ext == "jpeg" || ext == "jpg" || ext == "gif" || ext == "pdf"
      )) {
      var path = $(input).val();
      var filename = path.replace(/^.*\\/, "");
      // $('.fileUpload span').html('Uploaded Proof : ' + filename);
      return "Uploaded file : "+filename;
    } else {
      $(input).val("");
      return "Only image/pdf formats are allowed!";
    }
  }
  // Upload btn end

});