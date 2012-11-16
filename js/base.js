$(document).ready(function(){

	//$('div#file-system').html('<img src="img/folder.png" alt="folder" width="42" height="42"/>');
	
	$('.icon').bind('contextmenu',function(e){
			var $cmenu = $(this).next();
			$('<div class="overlay"></div>').css({left : '0px', top : '0px',position: 'absolute', width:                                                   '100%', height: '100%', zIndex: '100' }).click(function() {
				$(this).remove();
				$cmenu.hide();
			}).bind('contextmenu' , function(){return false;}).appendTo(document.body);
			$(this).next().css({ left: e.pageX, top: e.pageY, zIndex: '101' }).show();
 
			return false;
			 });
 
			 $('.object-menu .first_li').live('click',function() {
				if( $(this).children().size() == 1 ) {
					alert($(this).children().text());
					$('.object-menu').hide();
					$('.overlay').hide();
				}
			 });
 
			 $('.object-menu .inner_li span').live('click',function() {
					alert($(this).text());
					$('.object-menu').hide();
					$('.overlay').hide();
			 });
 
 
			$(".first_li , .sec_li, .inner_li span").hover(function () {
				$(this).css({backgroundColor : '#E0EDFE' , cursor : 'pointer'});
			if ( $(this).children().size() >0 )
					$(this).find('.inner_li').show();	
					$(this).css({cursor : 'default'});
			}, 
			function () {
				$(this).css('background-color' , '#fff' );
				$(this).find('.inner_li').hide();
			});
			
	$('#file-system:not(.icon)').bind('contextmenu',function(e){
			var $cmenu = $(this).next();
			$('<div class="overlay"></div>').css({left : '0px', top : '0px',position: 'absolute', width:'100%', height: '100%', zIndex: '100' }).click(function() {
				$(this).remove();
				$cmenu.hide();
			}).bind('contextmenu' , function(){return false;}).appendTo(document.body);
			$(this).next().css({ left: e.pageX, top: e.pageY, zIndex: '101' }).show();
 
			return false;
			 });
 
			 $('.space-menu.first_li').live('click',function() {
				if( $(this).children().size() == 1 ) {
					alert($(this).children().text());
					$('.space-menu').hide();
					$('.overlay').hide();
				}
			 });
 
			 $('.space-menu .inner_li span').live('click',function() {
					alert($(this).text());
					$('.space-menu').hide();
					$('.overlay').hide();
			 });
 
 
			$(".first_li , .sec_li, .inner_li span").hover(function () {
				$(this).css({backgroundColor : '#E0EDFE' , cursor : 'pointer'});
			if ( $(this).children().size() >0 )
					$(this).find('.inner_li').show();	
					$(this).css({cursor : 'default'});
			}, 
			function () {
				$(this).css('background-color' , '#fff' );
				$(this).find('.inner_li').hide();
			});
 
	
});
