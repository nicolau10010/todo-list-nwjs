myApp.nativeUI = {};
myApp.nativeUI.init = function () {
	// Instance nw.gui
	myApp.gui = require('nw.gui');
	// Globals
	myApp.mainWindow = myApp.gui.Window.get();
	myApp.name = myApp.gui.App.manifest.name;
	// -- Call the other functions here --
	myApp.nativeUI.createWindowMenu();

	myApp.nativeUI.delayClosing();

	myApp.mainWindow.show();
};

myApp.nativeUI.delayClosing = function () {
	myApp.mainWindow.on('close', function () {
		// Store window size and position
		if ( localStorage ){
			localStorage.window_x = myApp.mainWindow.x;
			localStorage.window_y = myApp.mainWindow.y;
			localStorage.window_w = myApp.mainWindow.width;
			localStorage.window_h = myApp.mainWindow.height;
		}
		// Hide window
		myApp.mainWindow.hide();
		// Close other opened windows
		myApp.gui.App.closeAllWindows();
		// Compact Db
		myApp.db.compact({}, function () {
			// Actually close the Application
			myApp.mainWindow.close(true);
		});
	});
};
myApp.nativeUI.createWindowMenu = function () {
	// Create window menu
	var windowMenu = new myApp.gui.Menu({ type: 'menubar' });
	if (process.platform === 'darwin'){
		// Create default Mac OS menus
		windowMenu.createMacBuiltin(myApp.name, {
			hideWindow: true
		});
	} else {
		// Create default file menu for Windows and Linux
		var fileMenu = new myApp.gui.MenuItem({
			label: "File"
		});
		var fileSubmenu = new myApp.gui.Menu();
		fileSubmenu.append(new myApp.gui.MenuItem({
			label: 'Exit',
			key: "x",
			modifiers: "ctrl",
			click: function () {
				myApp.gui.App.closeAllWindows();
			}
		}));
		fileMenu.submenu = fileSubmenu;
		windowMenu.append(fileMenu);
		// Create default edit menu for Windows and Linux
		var editMenu = new myApp.gui.MenuItem({
			label: "Edit"
		});
		var editSubmenu = myApp.nativeUI.createEditMenu();
		editMenu.submenu = editSubmenu;
		windowMenu.append(editMenu);
	}

	// Create options menu
	var optionsMenu = new myApp.gui.MenuItem({
		label: "Options"
	});
	// Options submenu
	var options = new myApp.gui.Menu();
	options.append(new myApp.gui.MenuItem({
		label: 'Options',
		key: "o",
		modifiers: "ctrl-alt",
		click: myApp.nativeUI.openOptionsWindow 
	}));
	options.append(new myApp.gui.MenuItem({
		label: 'Hide completed',
		type: 'checkbox',
		key: "h",
		modifiers: "ctrl-alt",
		checked: (localStorage.hideCompleted === 'true'),
		click: function () {
			localStorage.hideCompleted = this.checked;
			myApp.todos.load();
		}
	}));
	optionsMenu.submenu = options;
	windowMenu.append(optionsMenu);
	// Assign the menu to the window
	myApp.mainWindow.menu = windowMenu;
};

myApp.nativeUI.createEditMenu = function (){
	var editMenu = new myApp.gui.Menu();
	editMenu.append(new myApp.gui.MenuItem({
		label: 'Cut',
		click: function() {
			document.execCommand("cut");
		}
	}));
	editMenu.append(new myApp.gui.MenuItem({
			label: 'Copy',
			click: function() {
			document.execCommand("copy");
		}
	}));
	editMenu.append(new myApp.gui.MenuItem({
			label: 'Paste',
			click: function() {
			document.execCommand("paste");
		}
	}));
	editMenu.append(new myApp.gui.MenuItem({
			label: 'Select All',
			click: function() {
			document.execCommand("selectAll");
		}
	}));
	return editMenu;
};

myApp.nativeUI.openOptionsWindow = function () {
	if (myApp.optionsWindow)
		return false;
	myApp.optionsWindow = myApp.gui.Window.open('options.html', {
		position: 'center',
		width: 400,
		height: 220,
		resizable: false,
		focus: true,
		toolbar: false
	});
	myApp.mainWindow.on('focus', function () {
		myApp.optionsWindow.focus();
	});
	myApp.optionsWindow.on('closed', function () {
		myApp.optionsWindow = null;
		myApp.mainWindow.removeAllListeners('focus');
	});
};

myApp.nativeUI.listenForStorageEvents = function () {
	// Fired only when the event comes from a different window
	window.addEventListener('storage', function (e) {
		switch(e.key) {
			case 'notesColor':
				console.log('entro');
				myApp.todos.changeBackgroundColor(e.newValue);
			break;
			case 'couchDbUrl':
				myApp.mainWindow
				.menu.items[2]
				.submenu.items[3]
				.enabled = Boolean(e.newValue);
			break;
		}
	});
};