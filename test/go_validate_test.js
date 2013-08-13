var ctx = require('./context.js');

exports.copy = {

  testMissingTarget: function (test) {
    var task = ctx.newTask([]);

    var result = task.execute(true);
    test.equals(result, false);

    test.done();
  },

  testMissingCommand: function (test) {
    var task = ctx.newTask(['myapp']);

    var result = task.execute(true);
    test.equals(result, false);

    test.done();
  },
  
  testTooManyArgs: function (test) {
    var task = ctx.newTask(['myapp', 'run', 'nonsense']);

    var result = task.execute(true);
    test.equals(result, false);

    test.done();
  }

};