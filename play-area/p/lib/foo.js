/*jslint node:true */
function foo() {}

foo.prototype.bar = function () {
	return 'bar';
};

exports = foo;
 