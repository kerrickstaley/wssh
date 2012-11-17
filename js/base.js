

function pathBarUpdate(cwd)
{
	// TODO: interpret and add <div> elements according to cwd

	//$('div#path-bar').add('<div>/home/username</div>');  // TODO: why doesn't adding an html fragment work?
};

function fileSystemUpdate($data) {
	$('div#file-system').html($data);
};


// BUG: every time a submenu is clicked, another click is bound to each .menu-item
// BUG: after a page load, the first attempt to click a .menu-item within a popupMenu seems to have no effect.
// BUG: overlay does not cover entire document, only that part of the document which is initially visible.

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

	// fill div#file-system and div#path-bar with some initial data:
	var $fileSystemData = $(" \
		<div class='folder'> \
			<div class='folder-icon'> \
			</div> \
			<span>Folder Name</span> \
		</div> \
		<div class='file'> \
			<div class='file-icon'> \
			</div> \
			<span>File Name</span> \
		</div>"
	);

	pathBarUpdate('/home/username');
	fileSystemUpdate($fileSystemData);

	// Initially set zIndex depths in order to use overlay with menu;
	// also, show and hide relavant items.

	$('div#overlay').css('zIndex', 0).hide();
	$('div#file-system').css('z-index', 10).show();
	$('div.icons').css('z-index', 10).show();
	$('div.popup-menu').css('z-index', 20).hide();
	


	// Assign popup menu action handlers to both .icons and the background of #file-system:
	$('div#file-system .icon').on('contextmenu', function(e) {
		popupOpen($('div#icon-menu'), e.pageX, e.pageY);
		return false;
	});

	$('div#file-system:not(.icon)').on('contextmenu', function(e) {
		popupOpen($('div#space-menu'), e.pageX, e.pageY);
		return false;
	});
});
