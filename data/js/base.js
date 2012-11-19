// Prompts a change directory command to be (asyncronously) sent over the websocket connection.
// Assumes that 'dir' is an absolute pathname of a directory.
function requestChangeDirectory(dir)
{
	alert('cd ' + dir);
}


// Interprets a JSON-encoded string as an object describing the current working directory and its contents.
function handleChangeDirectory(fs)
{
	fs = JSON.parse(fs);
	updatePathBar(fs.cwd);
	updateFileSystem(fs);
}


// Assumes that 'dir' is an absolute pathname of a directory, and updates '#path-bar' accordingly.
function updatePathBar(dir)
{
	var path = dir.split('/');
	var $path_bar = $('div#path-bar');

	$path_bar.find('div.path-link').remove();

	for (var idx in path)
	{
		$path_bar.append('<div class="path-link">' + path[idx].concat('/') + '</div>');
	}

	$path_bar.find('div.path-link').on('click', function(e) {
		// TODO: this doesn't seem very safe
		requestChangeDirectory($(this).text());
	});
};


// Expects an object which at least has a cwd property.
function updateFileSystem(fs)
{
	var $fs_div = $('div#file-system');
	$fs_div.empty();

	// For each file and folder in 'fs' add an additional icon to '#file-system'.
	for (var idx in fs.folders)
	{
		$fs_div.append('<div class="folder"><div class="icon"></div>' + fs.folders[idx] + '</div>')
	}

	for (var idx in fs.files)
	{
		$fs_div.append('<div class="file"><div class="icon"></div>' + fs.files[idx] + '</div>')
	}


	// Make each of the newly created icons selectable:
	//$fs_div.find('div.icon').addClass('ui-state-default');  // I saw this in the tutorial. What does it do?
	$fs_div.selectable({ filter: 'div.file, div.folder' });
};


function popupOpen($menu, x, y)
{
	$menu.css({ left: x, top: y, zIndex: 30, position: "absolute" }).show();

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


// The primary wssh initialization function.
$(document).ready(function()
{
	// fill div#file-system and div#path-bar with some initial data:
	// TODO: get JSON-encoded string from file/websocket
	fs = { cwd: "/home/user", folders: ["folder1", "folder2"], files: ["file1.txt", "file2.txt"] };
	fs = JSON.stringify(fs);
	handleChangeDirectory(fs);


	// Initially set zIndex depths in order to use overlay with menu;
	// also, show and hide relavant items.
	$('div#overlay').css('zIndex', 0).hide();
	$('div#file-system').css('z-index', 10).show();
	$('div.icons').css('z-index', 10).show();
	$('div.popup-menu').css('z-index', 20).hide();
	


	// Assign popup menu action handlers to both .icons and the background of #file-system:
	$('div#file-system div.icon').on('contextmenu', function(e) {
		popupOpen($('div#icon-menu'), e.pageX, e.pageY);
		return false;
	})

	$('div#file-system:not(div.icon)').on('contextmenu', function(e) {
		popupOpen($('div#space-menu'), e.pageX, e.pageY);
		return false;
	});
	
	$(document).on('click', 'div.menu-item', function() {
			alert($(this).text());
			popupClose($('div.popup-menu'));
	});


	// Assign action handlers to each of the persistent icons:
	$('div#home-icon').on('click', function(e) {
		// TODO: could be unsafe
		requestChangeDirectory('~');
	});

	$('div#new-file-icon').on('click', function(e) {
		alert('new file');
	});

	$('div#new-folder-icon').on('click', function(e) {
		alert('new folder');
	});

	$('div#trash-icon').on('click', function(e) {
		alert('trash');
	});

	$('div#logout-icon').on('click', function(e) {
		alert('logout');
	});


	// Assign action handler to #file-system so that ctrl+Enter can prompt an event:
	// TODO: Should this be attached to 'document'?
	$(document).on('keydown', function(e) {

		// If enter is pressed when meta key is held, then...
		if(e.metaKey && e.which == 13)
		{
			var $selection = $('div#file-system div.ui-selected');
			var $files = $selection.filter('div.file');
			var $folders = $selection.filter('div.folder');

			if ($files.length == 0 && $folders.length == 1)
			{
				alert('cd ' + $folders.text());
			}
			else if ($files.length != 0 || folders.length != 0)
			{
				alert('send selected to terminal');
			}
		}
	});
});
