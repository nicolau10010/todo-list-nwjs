// Load Template
myApp.loadTemplate = function (view, data, target) {
	var swig = require('swig'),
	fileName = 'views/' + view + '.html';
	var template = swig.renderFile(fileName, data || {});
	if (target)
		return $(target).html(template);
	return template;
};
// Remove elements from the DOM after slideUp
myApp.removeFromGUI = function ($items) {
	$items.slideUp(200, function () {
		$(this).remove();
	});
};
// Autoresize textarea on add/delete content
myApp.resizeTextarea = function ($ta) {
$ta.height(20).height($ta.prop("scrollHeight"));
};