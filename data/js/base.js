var clipboard;  // Contains a string of filenames which might be the source of a cut or copy.
var isCopy;     // 'true' signals that the contents of the clipboard should be copied, rather than moved.
var fs;         // Contains the most recent file-system update object.


// Sends the string 'cmd' to the cli interface. If 'userWait' is false, the command is executed immediately,
// else the command is appended to the CLI where the user can confirm or modify the command.
function sendCommand(cmd, userWait)
{
	alert('Command:\n' + cmd);
};


// Returns a string of the names of the currently selected files.
// This these pathnames will be relative to the current working directory
// if 'isAbsolute' is false and absolute if 'isAbsolute' is true.
function getSelectedFiles(isAbsolute)
{
	var selected = '';
	$('div#file-system .ui-selected').each(function(idx) {
		selected += '"' + (isAbsolute ? fs.cwd + '/' : "") + $(this).text() + '" ';
	});

	return selected;
};


// Interprets a JSON-encoded string as an object describing the current working directory and its contents.
function updateFileSystem(json_fs)
{
	fs = JSON.parse(json_fs);
	updatePathBar(fs.cwd);
	updateFileIcons(fs);
};


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
		sendCommand('cd ' + $(this).text(), false);
	});
};


// Expects an object which at least has a cwd property.
function updateFileIcons(fs)
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
		$fs_div.append('<div class="file"><div class="icon"></div><div class="text">' + fs.files[idx] + '</div></div>')
	}


	// Make each folder create an event when it is double-clicked.
	$fs_div.find('div.folder').dblclick(function(e) {
		alert('cd ' + $(this).text());
	});


	// Make each of the newly created files and folders selectable.
	$fs_div.selectable({

		filter: 'div.file, div.folder',

		selected: function(e, ui) {

			// Whenever a '.ui-selectee' is selected, it also becomes draggable.
			$(ui.selected).draggable({

				containment: 'document',
				scroll: false,
				distance: 5,
				opacity: 0.35,

				helper: function() {
					var rv = $('<div id="draggable-helper"></div>');
					$fs_div.find('div.ui-selected').clone().appendTo(rv);
					return rv[0];
				},

				start: function(e, ui) {
					$fs_div.selectable('disable');
				},

				stop: function(e, ui) {
					$fs_div.selectable('enable');
				}
			});
		},

		unselected: function(e, ui) {
			$(ui.unselected).draggable('destroy');
		}
	});

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
	/*
	var fs = {
		cwd: "/home/user/is/getting/stranger/and/stranger/and/longer/than/long",
		folders: ["folder1", "folder2"],
		files: ["This file has a long name.txt", "file2.txt", "this_is_also_quite_long.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt", "file2.txt"]
	};
	*/
	var fs = { cwd: "/home/user", folders: ["folder1", "folder2"], files: ["This file has a long name.txt", "file2.txt", "this_is_also_quite_long.txt"]}
	fs = JSON.stringify(fs);
	updateFileSystem(fs);


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
	});

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
		sendCommand('cd ~', false);
	});

	$('div#new-file-icon').on('click', function(e) {
		sendCommand('touch ', true);
	});

	$('div#new-folder-icon').on('click', function(e) {
		sendCommand('mkdir ', true);
	});

	$('div#cut-icon').on('click', function(e) {
		isCopy = false;
		clipboard = getSelectedFiles(true);
	});

	$('div#copy-icon').on('click', function(e) {
		isCopy = true;
		clipboard = getSelectedFiles(true);
	});

	$('div#paste-icon').on('click', function(e)
	{
		if (clipboard)
		{
			sendCommand((isCopy ? 'cp ' : 'mv ') + clipboard + '.', true);
			clipboard = '';
		}
		else
		{
			alert('The clipboard is empty.');
		}
	});

	$('div#trash-icon').on('click', function(e) {
		sendCommand('rm ' + getSelectedFiles(false), true);
	});

	$('div#logout-icon').on('click', function(e) {
		alert('logout');
	});


	// Assign an action handler to the document so that meta+Enter can prompt an event:
	$(document).on('keydown', function(e) {

		// If enter is pressed when meta key is held, then...
		if(e.metaKey && e.which == 13)
		{
			var $selection = $('div#file-system div.ui-selected');
			sendCommand(getSelectedFiles(true));
		}
	});
});
