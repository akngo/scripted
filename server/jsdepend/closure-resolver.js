/*******************************************************************************
 * @license
 * Copyright (c) 2012 VMware, Inc. All Rights Reserved.
 * THIS FILE IS PROVIDED UNDER THE TERMS OF THE ECLIPSE PUBLIC LICENSE
 * ("AGREEMENT"). ANY USE, REPRODUCTION OR DISTRIBUTION OF THIS FILE
 * CONSTITUTES RECIPIENTS ACCEPTANCE OF THE AGREEMENT.
 * You can obtain a current copy of the Eclipse Public License from
 * http://www.opensource.org/licenses/eclipse-1.0.php
 *
 * Contributors:
 *     Anh-Kiet Ngo
 ******************************************************************************/

/*global resolve require define esprima console module process*/
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}
define(function(require, exports, module) {

////////////////////////////////////////
// closure-resolver
/////////////////////////////////////////

var goog = require('./closure-deps-loader');
var depsFile;


// TODO: Check to see if this is the proper way to retrieve configuration
// information. It seems very complicated for such a simple task, but I couldn't
// find anywhere that had a simple way of doing it. Maybe I didn't look hard
// enough :(.
var filesystem = require('../utils/filesystem').withBaseDir(null);
require('./dot-scripted').configure(filesystem).getConfiguration('').then(function(conf) {
	var deref = require('./utils').deref,
		pathJoin = require('../jsdepend/utils').pathJoin,
		file = deref(conf, ['closure', 'deps']);

	if (file) {
		depsFile = pathJoin(deref(conf, ['fsroot']), file);
		console.log('new path join: ', depsFile);
		goog.setDepsFile(depsFile);
	}
});

function configure(conf) {
	function resolver(context, dep, callback) {
		goog.getFile(dep.name, function(file) {
			if (file) {
				dep.path = file;
			} else {
				dep.error = {};
				dep.errorAsString = dep.name + " was not found in " + context;
			}
			callback(dep);
		});
	}

	//A 'resolver support' module provides a resolver for a particular kind of dependency.
	return {
		kind: 'closure',
		resolver: resolver
	};

} //end: function configure

exports.configure = configure;

});

