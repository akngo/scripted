/*global require freya goog*/
var something = require('./lib/foo');
var other = require('./lib/bar');

goog.provide('moz.View');
freya.Mozmod = goog.require('freya.Mozmod');

moz.View = function() {};

moz.View.prototype.haz = function() {};

moz.View.prototype.poop = function() {
	moz.View.prototype.haz();
};

freya.Mozmod.

something();