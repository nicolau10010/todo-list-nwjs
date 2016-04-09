myApp.todos = {};
myApp.todos.init = function () {
	// Load main application view
	myApp.loadTemplate('app', null, '#mainView');
	// Change todos bg color
	myApp.todos.changeBackgroundColor(localStorage.notesColor || '#F8F8FF');
	// Listen for events
	myApp.todos.listenForEvents();
	// Load data from DB
	myApp.todos.load();
};

myApp.todos.listenForEvents = function () {
	// Add new todo
	$('.add-button').click(function (e) {
		e.preventDefault();
		myApp.todos.addNew();
	});
};
myApp.todos.load = function () {
	$('#' + myApp.mainDiv).html("");
	myApp.db.allDocs({include_docs: true}, function(err, resp) {
		resp.rows.forEach(function (item) {
			myApp.todos.render(item.doc);
		});
	});
};

myApp.todos.changeBackgroundColor = function (color) {
	var $customStyle = $('<style/>', { html: '#todoListContainer , #todoList li {background:'+ color +';}', id: 'customStyle' });
	if ( $('#customStyle').length > 0 ){
		$('#customStyle').replaceWith($customStyle);
	} else {
		$customStyle.appendTo('head');
	}
};

myApp.todos.addNew = function () {
	var todo = {
		_id: new Date().toISOString(),
		content: '',
		checked: false
	};
	myApp.db.put(todo, function callback(err, result) {
		if (err) 
			return console.warn(err);
		todo._rev = result.rev;
		myApp.todos.render(todo, true);
	});
};

myApp.todos.render = function (todo, focus) {
	var todoTemplate = myApp.loadTemplate('todo', todo),
		$todo = $(todoTemplate).prependTo('#todoList').hide().slideDown(300),
		$content = $todo.find('.todo-content'),
		$check = $todo.find('.todo-check');
	myApp.resizeTextarea($content);
	// Focus on the created todo
	if (focus) 
		$content.focus();
	// On check/uncheck item
	$check.on('change', function () {
		todo.checked = $(this).is(':checked');
		myApp.todos.update(todo);
		// Disable on check
		if (todo.checked){
			if (localStorage.hideCompleted === 'true')
				myApp.removeFromGUI($todo);
			else
				$content.attr('disabled', true);
		} else {
			$content.removeAttr('disabled');
		}
	});

	var timer;
	$content.on('input', function () {
		myApp.resizeTextarea($content);
		if (typeof timer !== 'undefined') 
			clearTimeout(timer);
		timer = setTimeout(function() {
			todo.content = $content.val();
			myApp.todos.update(todo);
		}, 1000);
	});

	// On delete item
	$todo.find('.delete-button').on('click', function (e) {
		e.preventDefault();
		myApp.removeFromGUI($todo);
		myApp.db.remove(todo);
	});
};

myApp.todos.update = function (todo) {
	myApp.db.put(todo, function callback(err, result) {
		if (err) 
			return console.warn(err);
		todo._rev = result.rev;
	});
};