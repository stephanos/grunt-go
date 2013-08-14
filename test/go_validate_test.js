var ctx = require('./context.js');

exports.copy = {

  testMissingCommand: function (test) {
    var task = ctx.newTask([]);

    var result = task.execute(true);
    test.equals(result, false);

    test.done();
  },

  testMissingTarget: function (test) {
    var task = ctx.newTask(['myapp']);

    var result = task.execute(true);
    test.equals(result, false);

    test.done();
  },

  testTooManyArgs: function (test) {
    var task = ctx.newTask(['run', 'myapp', 'run', 'nonsense']);

    var result = task.execute(true);
    test.equals(result, false);

    test.done();
  },

  testInvalidOpts: function (test) {
    var task = ctx.newTask(['run', 'myapp'], {
      build_flags: "string"
    });

    var result = task.execute(true);
    test.equals(result, false);

    test.done();
  }

};