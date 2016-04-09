var myApp = {options:{}};
myApp.options.init = function () {
	var gui = require('nw.gui');
	myApp.optionsWindow = gui.Window.get();
	myApp.loadTemplate('options', {
		notesColor: localStorage.notesColor || '#F8F8FF',
		couchDbUrl: localStorage.couchDbUrl
	}, '#mainView');
	myApp.options.listenForEvents();
};
myApp.options.listenForEvents = function () {
	var softClose = false;
	myApp.optionsWindow.on('close', function () {
		if (!softClose && confirm("Save the data before closing?"))
			myApp.options.saveData();
		this.hide();
		this.close(true);
	});
	$('#save').click(function() {
		myApp.options.saveData();
		softClose = true;
		myApp.optionsWindow.close();
	});
	$('#dismiss').click(function() {
		softClose = true;
		myApp.optionsWindow.close();
	});
};
$(window).load(myApp.options.init);



myApp.options.saveData = function () {
	// Using window to avoid context issue when closing
	window.localStorage.notesColor = $('#notesColor').val();
	window.localStorage.couchDbUrl = $('#couchDbUrl').val();
};