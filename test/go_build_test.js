var ctx = require('./context.js');

exports.copy = {

  test: function (test) {
    var task = ctx.newTask(['myapp', 'build']);

    var result = task.execute(true);
    test.equals(result, false);

    test.done();
  }

};