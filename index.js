var ware = require('ware');

module.exports = function() {
  this.hooks = {pre: {}, post: {}};

  this.pre = function(evt, fn) {
    return this.use(function() {
      this.hooks.pre[evt] = this.hooks.pre[evt] || [];
      this.hooks.pre[evt].push(fn);
    });
  };

  this.post = function(evt, fn) {
    return this.use(function() {
      this.hooks.post[evt] = this.hooks.post[evt] || [];
      this.hooks.post[evt].push(fn);
    });
  };

  this.prototype.run = function(evtType, evt, cb) {
    createPipeline(this.model.hooks[evtType][evt]).run(this, cb);
  };

  this.prototype.runRecursively = function(evtType, evt, cb) {
    var self = this;
    this.eachAttrAsync(function(name, type, next) {
      // Sorry, no hooks on leaf attributes for now.
      // Maybe soon.
      if(! type.complex)
        return next();

      self.get(runRecursively(self.get(name), evt, next);
    }, cb);
  };

  function createPipeline(fns) {
    var mw = ware();
    (fns || []).forEach(function(fn) {
      mw.use(fn);
    });
    return mw;
  }
};