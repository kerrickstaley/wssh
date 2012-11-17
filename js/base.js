function setIconImages() {
	$('div#file-system .folder img').attr({ src:"img/folder.png", alt:"folder", width:"48", height:"48" });
	$('div#file-system .file img').attr({ src:"img/file.png", alt:"file", width:"48", height:"48" });
}


function fileSystemUpdate($data) {
	$('div#file-system').html($data);
	setIconImages();
}


// BUG: every time a submenu is clicked, another click is bound to each .menu-item
// BUG: after a page load, the first attempt to click a .menu-item within a popupMenu seems to have no effect.

function popupOpen($menu, x, y) {

	$menu.css({ left: x, top: y, zIndex: 30, position: "absolute" }).on('click', function() {
		$menu.find('div.menu-item').on('click', function(e) {
			alert($(this).text());
			popupClose($menu);
		});
	}).show();

	$('div#overlay').css('zIndex', 20).on('click', function(e) {
		popupClose($menu);
	}).on('contextmenu', function(e) {
		popupClose($menu);
	}).show();
};

function popupClose($menu)
{
	$menu.off('click').hide();
	$('div#overlay').css('zIndex', 0).off('click').off('contextmenu').hide();
};




$(document).ready(function() {

	// fill div#file-system with some initial data
	var $fileSystemData =
	$("<div class='icon folder'> \
		<img/> \
		<span>Folder Name</span> \
	</div> \
	<div class='icon file'> \
		<img/> \
		<span>File Name</span> \
	</div>");

	fileSystemUpdate($fileSystemData);

	$('div#overlay').css('zIndex', 0).hide();
	$('div#file-system').css('z-index', 10).show();
	$('div.icons').css('z-index', 10).show();
	$('div.popup-menu').css('z-index', 20).hide();
	

	$('div#file-system .icon').on('contextmenu', function(e) {
		popupOpen($('div#icon-menu'), e.pageX, e.pageY);
		return false;
	});


	$('div#file-system:not(.icon)').on('contextmenu', function(e) {
		popupOpen($('div#space-menu'), e.pageX, e.pageY);
		return false;
	});
});
