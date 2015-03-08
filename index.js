var ware = require('ware');

module.exports = function() {
  this.hooks = {};

  this.hook = function(name, fn) {
    name = '$' + name;
    return this.use(function() {
      this.hooks[name] = this.hooks[name] || [];
      this.hooks[name].push(fn);
    });
  };

  this.prototype.run = function(name, cb) {
    name = '$' + name;
    createPipeline(this.model.hooks[name]).run(this, cb);
  };

  this.prototype.runRecursively = function(name, cb) {
    var self = this;
    this.eachAttrAsync(function(attr, type, next) {
      // Sorry, no hooks on leaf attributes for now.
      // Maybe soon.
      if(! type.complex)
        return next();

      self.get(attr).runRecursively(name, next);
    }, function(err) {
      if(err) return cb(err);
      self.run(name, cb);
    });
  };

  function createPipeline(fns) {
    var mw = ware();
    (fns || []).forEach(function(fn) {
      mw.use(fn);
    });
    return mw;
  }
};