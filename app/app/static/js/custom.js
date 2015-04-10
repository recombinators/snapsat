/******************************************************************
*******************************************************************

Template Name: Treviso
Theme URI: http://themeforest.ninetofive.me/treviso/
Description: Responsive HTML5 Template
Author: ninetofive
Author URI: http://www.ninetofive.me
Version: 1.0
							
Designed & Handcrafted by Zan from ninetofive.me
									
*******************************************************************
******************************************************************/

$(document).ready(function() { 

	//Animated scrolling		   
	$('ul.mainmenu a').click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var $target = $(this.hash);
			$target = $target.length && $target || $('[id=' + this.hash.slice(1) +']');
			if ($target.length) {
				$('ul.mainmenu li').removeClass('active');
				$(this).parent('li').addClass('active');
				var targetOffset = $target.offset().top-200;
				$('html,body').animate({scrollTop: targetOffset}, 1000);
				return false;
			}
		}
	});

	// Scroll Down Link
	$('.scrolldown').click(function() {
		var targetOffset = $('div.blockquote').offset().top-80;
		$('html,body').animate({scrollTop: targetOffset}, 1000);
	});

	// Menu Scroll Hide
	var nav = $('.menubar');
	var scroll = $('.menubar').attr('data-scroll');
	$(function(){
		$('.menubar').data('size','big');
		if (scroll == 'false') {
			nav.css({
				marginTop:'0px'
			});
		};
	});
	$(window).scroll(function(){
		if ($('body').scrollTop() > 0 && scroll == 'true') {
			if (nav.data('size') == 'big') {
				nav.data('size','small').stop().animate({
					marginTop:'0px'
				}, 300);
			}
		} else {
			if (nav.data('size') == 'small' && scroll == 'true') {
				nav.data('size','big').stop().animate({
					marginTop:'-80px'
				}, 300);
			}
			
		}
	});
	

});