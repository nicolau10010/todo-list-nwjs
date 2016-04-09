var myApp = {};
myApp.init = function () {
	// Instance the DB
	myApp.db = new PouchDB('todos');
	// Init the todo App
	myApp.todos.init();
	myApp.nativeUI.init()
	myApp.mainDiv = 'todoList';
};
$(window).load(myApp.init);