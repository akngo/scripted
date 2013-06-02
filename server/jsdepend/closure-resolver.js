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
//
//   Support for resolving commonjs references
/////////////////////////////////////////

var getDirectory = require('./utils').getDirectory;
var pathResolve = require('./utils').pathResolve;

function startsWith(str, pre) {
	return str.lastIndexOf(pre, 0) === 0;
}
function endsWith(str, suffix) {
	return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

GLOBAL.goog = {
	deps: {},

	addDependency: function(file, provides, requires) {
		provides.forEach(function(provide) {
			this.deps[provide] = file;
		}, this);
	},

	clear: function() {
		this.deps = {};
	},

	getFile: function(require) {
		return this.deps[require];
	}
};


function configure(conf) {

	//Note:
	//   conf = the 'global' configuration for the api, provides file system type operations

  /*
  {
    '0': '/Users/anhkiet/projects/scripted/play-area/p/code.js',
    '1': { kind: 'commonjs', name: './lib/foo' },
    '2': [Function]
  }
  */
	function resolver(context, dep, callback) {
		// Dependencies generated by Closure's DepsWriter
		var deps = '/Users/anhkiet/projects/scripted/play-area/p/deps.js';

		// GLOBAL.goog.clear();
		// This will run GLOBAL.goog.addDependency
		require(deps);

		var file = GLOBAL.goog.getFile(dep.name);
		if (file) {
			dep.path = file;
		} else {
			console.log(GLOBAL.goog.deps);
			dep.error = {};
			dep.errorAsString = dep.name + " was not found in " + context;
		}
		callback(dep);
	}

	//A 'resolver support' module provides a resolver for a particular kind of dependency.
	return {
		kind: 'closure',
		resolver: resolver
	};

} //end: function configure

exports.configure = configure;

/////////////////////////////////////////////////////////////////////////
}); //end amd define
