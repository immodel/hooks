var assert = require('assert');
var sinon = require('sinon');
var model = require('immodel')
  .use(require('..'));
  
describe('hooks', function() {
  it('should work', function(done) {
    function stub(model, next) {
      setTimeout(next);
    }
    var preSpy = sinon.spy(stub);
    var postSpy = sinon.spy(stub);
    
    var tmp = model.use(function() {
      this.prototype.test = function(cb) {
        var self = this;
        this.run('pre', 'test', function() {
          setTimeout(function() {
            self.run('post', 'test', cb);
          });
        });
      };
    });
    
    tmp = tmp
      .pre('test', preSpy)
      .post('test', postSpy);

    var doc = new tmp();
    doc.test(function() {
      assert(preSpy.calledOnce);
      assert(postSpy.calledOnce);
      done();
    });
    
  });
});