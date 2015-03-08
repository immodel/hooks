var assert = require('assert');
var sinon = require('sinon');
var model = require('immodel')
  .use(require('immodel-base'), {hooks: require('..')});

describe('hooks', function() {
  it('should work', function(done) {
    var spy = sinon.spy(function(model, next) { setTimeout(next); });

    var tmp = model.method('test', function(cb) {
      this.run('test', cb);
    })
    .hook('test', spy);

    var doc = new tmp();
    doc.test(function() {
      assert(spy.calledOnce);
      done();
    });
  });

  it('should work recursively', function(done) {
    var spy = sinon.spy(function(model, next) { setTimeout(next); });

    var User = model
      // Have one complex property that doesn't have
      // any hooks to ensure that that doesn't block
      // the run
      .attr('groups', model
        .attr('id', 'string')
        .attr('name', 'string'))
      .attr('name', model
        .attr('givenName', 'string')
        .attr('familyName', 'string')
        .hook('save', spy));

    var user = new User({name: {givenName: 'test', familyName: 'user'}});
    user.runRecursively('save', function() {
      assert(spy.calledOnce);
      assert(spy.calledWith(user.get('name')));
      done();
    });
  });
});