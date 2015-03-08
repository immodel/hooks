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
  
  this.run = function(type, evt, cb) {
    createPipeline(this.hooks[type][evt]).run(cb);
  };
  
  function createPipeline(fns) {
    var mw = ware();
    (fns || []).forEach(function(fn) {
      mw.use(fn);
    });
    return mw;
  }
};