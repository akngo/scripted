
GLOBAL.goog = {
  deps: {},

  addDependency: function(file, provides, requires) {
    provides.forEach(function(provide) {
      this.deps[provide] = file;
    }, this);
  }
};

var deps = require('./deps.js');
console.log(GLOBAL.goog.deps);
