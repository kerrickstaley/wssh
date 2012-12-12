var clipboard;  // Contains a string of filenames which might be the source of a cut or copy.
var isCopy;     // 'true' signals that the contents of the clipboard should be copied, rather than moved.
var fs;         // Contains the most recent file-system update object.
var socket;     // websocket used to communicate with backend
var file;		// used to send the file that was just clicked to the console
var terminal;   // the WsshTerminal instance

// converts an object to JSON and sends it through the websocket
function send(obj) {
	socket.send(JSON.stringify(obj));
}

// Sends the string 'cmd' to the cli interface. If 'userWait' is false, the command is executed immediately,
// else the command is appended to the CLI where the user can confirm or modify the command.
function sendCommand(cmd, userWait)
{
	send({keys: cmd});
	if (!userWait)
		send({keys: '\n'});
};


// Returns a string of the names of the currently selected files.
// This these pathnames will be relative to the current working directory
// if 'isAbsolute' is false and absolute if 'isAbsolute' is true.
function getSelectedFiles(isAbsolute)
{
	var selected = '';
	$('div#file-system .overview div.ui-selected').not('div#draggable-helper div.ui-selected').each(function(idx) {
		selected += '"' + (isAbsolute ? fs.cwd + '/' : "") + $(this).text() + '" ';
	});

	return selected;
};

// returns an array of the currently selected files
function getSelectedFilesArray() {
	var rv = [];
	$('div#file-system div.ui-selected').not('div#draggable-helper div.ui-selected').each(function() {
		rv.push(fs.cwd + '/' + $(this).text());
	});
	return rv;
}

// Interprets a JSON-encoded string as an object describing the current working directory and its contents.
function updateFileSystem(new_fs)
{
	fs = new_fs;
	updatePathBar(fs.cwd);
	updateFileIcons(fs);
};


// Assumes that 'dir' is an absolute pathname of a directory, and updates '#path-bar' accordingly.
function updatePathBar(cwd)
{
	// TODO: guard against a trailing '/'

	var dirs = cwd.split('/');
	var $path_bar = $('div#path-bar .overview');
	var re;
	var path;

	$path_bar.find('div.path-link').remove();

	for (var idx in dirs)
	{
		if (idx == 0) {
			path = '/';
		} else {
			re = new RegExp('^.*' + dirs[idx]);
			path = re.exec(cwd);
		}

		$path_link = $('<div>' + dirs[idx].concat('/') + '</div>');
		$path_link.addClass('path-link')
		$path_link.attr('id', path);
		$path_bar.append($path_link);
	}

	$path_bar.find('div.path-link').on('click', function(e) {
		sendCommand('cd ' + $(this).attr('id'), false);
	});
};


// Expects an object which at least has a cwd property.
function updateFileIcons(fs)
{
	var $fs_div = $('div#file-system .overview');
	$fs_div.empty();

	// For each file and folder in 'fs' add an additional icon to '#file-system .overview'.
	fs.ls.forEach(function(file) {
		$('<div>').addClass(file.isdir ? 'folder' : 'file')
		          .append('<div class="icon">')
		          .append($('<div>').addClass('text').text(file.name))
		          .appendTo($fs_div);
	});

	// Make each folder create an event when it is double-clicked.
	$fs_div.find('div.folder').dblclick(function(e) {
		sendCommand('cd ' + $(this).text());
	});


	var $selectable_div = $('#file-system .viewport');

	// Make each of the newly created files and folders selectable.
	$selectable_div.selectable({

		filter: 'div.file, div.folder',

		selected: function(e, ui) {

			var $selected = $(ui.selected);

			// Prevent a selected folder from being dropped onto itself:
			if ($selected.hasClass('ui-droppable'))
				$selected.droppable('disable');

			// Whenever a '.ui-selectee' is selected, it also becomes draggable.
			$(ui.selected).draggable({

				//containment: 'document',
				scroll: false,
				distance: 5,
				opacity: 0.80,

				helper: function() {

					// It should be guaranteed that there will be at least one selected.
					var $selected = $('div#file-system div.ui-selected');

					if ($selected.length == 1) {
						var $rv = $selected.filter(':first').clone();
					} else {

						var $rv = $('<div id="draggable-helper" ><div class="icon"></div></div>');
						var $first = $selected.filter(':first')
						if ($first.hasClass('folder'))
							$rv.addClass('folder');
						else
							$rv.addClass('file');

						$rv.append($selected.length);
					}

					$rv.appendTo('#file-system');
					return $rv[0];
				},

				start: function(e, ui) {
					$selectable_div.selectable('disable');
				},

				stop: function(e, ui) {
					$selectable_div.selectable('enable');
				}
			});
		},

		unselected: function(e, ui)
		{
			var $unselected = $(ui.unselected);

			$unselected.draggable('destroy');

			// Reenable the folder as droppable
			if ($unselected.hasClass('ui-droppable'))
				$unselected.droppable('enable');
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


function handleCut(e) {
	isCopy = false;
	clipboard = getSelectedFilesArray();
};


function handleCopy(e) {
	isCopy = true;
	clipboard = getSelectedFilesArray();
};


function handlePaste(e)
{
	if (clipboard && clipboard[0])
	{
		send(isCopy ? {cp: [clipboard, fs.cwd]} : {mv: [clipboard, fs.cwd]});
		clipboard = [];
	}
	else
	{
		alert('The clipboard is empty.');
	}
};


function terminalInit()
{
	terminal = new WsshTerminal(undefined, $("#vt100")[0]);
}

function doConnect() {
	var $shadeDiv = $('<div>').css({
		position: 'absolute',
		left: 0,
		top: 0,
		width: '100%',
		height: '100%',
		'background-color': '#000000',
		opacity: 0.5,
		'z-index': 20
	}).appendTo('body');
	
	var $authButton = $('<button type="button">Connect</button>').css({
		position: 'absolute',
		left: '50%',
		top: '50%',
		'font-size': 'xx-large'
	}).appendTo($shadeDiv).click(function(e) {		
		var $dialogDiv = $(
			  '<div title="Connect"><form><fieldset>'
			+   '<label for="username">Username</label>'
			+   '<input type="text" name="username" id="username" class="ui-widget-content" />'
			+   '<label for="password">Password</label>'
			+   '<input type="password" name="password" id="password" class="ui-widget-content />'
			+   '<label for="host">Host</label>'
			+   '<input type="text" name="host" id="host" class="ui-widget-content" />'
			+   '<label for="port">Port</label>'
			+   '<input type="text" name="port" id="port" class="ui-widget-content" />'
			+ '</fieldset></form></div>'
		).dialog({
			buttons: {
				'Connect': function() {
					send({
						connect: [
							$('#username').val(),
							$('#password').val(),
							$('#host').val(),
							parseInt($('#port').val())
						]
					});
					send({
						keys: 'export PROMPT_COMMAND=\'printf "\\033]0;%s\\007" "${PWD}"\'\n'
					});
					$shadeDiv.remove();
					$(this).dialog('close');
				}
			}
		});
	});
}

var esc_progress = 0;
var cwd = '';
function socketOnmessage(e) {
	var obj = JSON.parse(e.data);
	if (obj.fs) {
		updateFileSystem(obj.fs);
	} else if (obj.output) {
		for (var i = 0; i < obj.output.length; i++) {
			if (esc_progress == 4 && obj.output[i] != '\007') {
				cwd += obj.output[i];
			} else if (esc_progress == 4 && obj.output[i] == '\007') {
				esc_progress = 0;
				// for some reason PROMPT_COMMAND isn't the only thing setting the window title
				if (cwd.indexOf('@') == -1) {
					fs.cwd = cwd;
					send({ls: cwd});
				}
				cwd = '';
			} else if (obj.output[i] == '\033]0;'[esc_progress])
				esc_progress++;
			else
				esc_progress = 0;
		}
		terminal.vt100(obj.output);
	} else if (obj.ls) {
		var files = [];
		obj.ls.forEach(function(file) {
			if (!file.name.match(/^\..*/))
				files.push(file);
		});
		fs.ls = files;
		updateFileIcons(fs);
	}
}

function menuController(text)
{
	var files = "";
	var inSelectedFiles = false;
	if(!getSelectedFiles(false))
	{
		files = file;
	}
	else
	{
		getSelectedFilesArray().forEach(function(selectedFile){
			console.log(selectedFile);
			if(selectedFile == (fs.cwd + '/' + file))
				inSelectedFiles = true;
		});
		if(inSelectedFiles)
			files = getSelectedFiles();
		else
			files = file;
	}
	
	switch(text)
	{
		case "Open":
			sendCommand("vim " + files, true);
			break;
		case "Cut":
			handleCut();
			break;
		case "Copy":
			handleCopy();
			break;
		case "Paste":
			handlePaste();
			break;
		case "Delete":
			send({rm: files});
			break;
		case "Create Shortcut":
			//TODO
			break;
		case "Rename":
			if(inSelectedFiles)
			{
				getSelectedFilesArray().forEach(function(selectedFile){
					var filename = prompt("Enter a new name for "+selectedFile+":");
					send({mv: [selectedFile, filename]});
				});
			}
			else
			{
				var filename = prompt("Enter a new name for "+file+":");
				send({mv: [file, filename]});
			}
			break;
		case "New Folder":
				var dirname = prompt("Enter the new directory's name:");
				send({mkdir: dirname});
			break;
		default:
			break;	
	}

}


// The primary wssh initialization function.
$(document).ready(function()
{
	// fill div#file-system and div#path-bar with some initial data:
	var new_fs = {
		cwd: '/home/user',
		ls: [
				{
					name: 'folder1',
					isdir: true
				},
				{
					name: 'folder2',
					isdir: true
				},
				{
					name: 'file1.txt',
					isdir: false
				},
				{
					name: 'This file has a long name.txt',
					isdir: false
				},
				{
					name: 'this_is_also_quite_long.txt',
					isdir: false
				}
			]
	};
	
	updateFileSystem(new_fs);


 
	// Initially set zIndex depths in order to use overlay with menu;
	// also, show and hide relavant items.
	$('div#overlay').css('zIndex', 0).hide();
	$('div#file-system').css('z-index', 10).show();
	$('div.icons').css('z-index', 10).show();
	$('div.popup-menu').css('z-index', 20).hide();
	


	// Assign popup menu action handlers to both .icons and the background of #file-system:
	$('div#file-system div.file, div#file-system div.folder').on('contextmenu', function(e) {

		//console.log($(this).text());
		file = $(this).text();
		popupOpen($('div#icon-menu'), e.pageX, e.pageY);
		return false;
	});

	$('div#file-system').on('contextmenu', function(e) {
		file = $(this).text();
		popupOpen($('div#space-menu'), e.pageX, e.pageY);
		return false;
	});
	
	$(document).on('click', 'div.menu-item', function() {
			menuController($(this).text());
			popupClose($('div.popup-menu'));
	});


	// Assign action handlers to each of the persistent icons:
	$('div#home-icon').on('click', function(e) {
		sendCommand('cd ~', false);
	});

	$('div#new-file-icon').on('click', function(e) {
		var filename = prompt("Enter the new file's name:");
		send({touch: fs.cwd + '/' + filename});
	});

	$('div#new-folder-icon').on('click', function(e) {
		var dirname = prompt("Enter the new directory's name:");
		send({mkdir: dirname});
	});

	$('div#cut-icon').on('click', handleCut);

	$('div#copy-icon').on('click', handleCopy);

	$('div#paste-icon').on('click', handlePaste);

	$('div#trash-icon').on('click', function(e) {
		send({rm: getSelectedFilesArray()});
	});

	$('div#logout-icon').on('click', function(e) {
		alert('logout');
	});


	// Make #shell, #home-icon, .path-link, .folder, and #trash-icon droppable
	// and assign drop-event handlers to each.

	$('div#shell').droppable({
		hoverClass: "drop-glow",
		drop: function(e, ui) { sendCommand(getSelectedFiles(false), true); }
	});

	$('div#home-icon').droppable({
		hoverClass: "drop-glow",
		drop: function(e, ui) {
			send({mv: [getSelectedFilesArray(), '~']});
		}
	});

	$('div#path-bar div.path-link').droppable({
		hoverClass: "drop-glow",
		drop: function(e, ui) {
			send({mv: [getSelectedFilesArray(), $(this).attr('id')]});
		}
	});

	$('div#file-system div.folder').droppable({
		hoverClass: "drop-glow",
		drop: function(e, ui) {
			send({mv: [getSelectedFilesArray(), fs.cwd + '/' + $(this).text()]});
		}
	});

	$('div#trash-icon').droppable({
		hoverClass: "drop-glow",
		drop: function() {
			send({rm: getSelectedFilesArray()});
		}
	});


	// Assign an action handler to the document so that meta+Enter can prompt an event:
	$(document).on('keydown', function(e) {

		// If enter is pressed when meta key is held, then...
		if(e.metaKey && e.which == 13)
		{
			var $selection = $('div#files div.ui-selected');
			sendCommand(getSelectedFiles(false), true);
		}
	});

    
	socket = new WebSocket('ws://' + location.host.replace(/:\d+$/, '') + ':8001');
	socket.onmessage = socketOnmessage;
	terminalInit();

	
		$('#file-system').tinyscrollbar();
		$('#path-bar').tinyscrollbar({ axis: 'x'});
	
	doConnect();
});
