var ctx = require('./context.js');

exports.copy = {

  testTest: function (test) {
    var task = ctx.newTask(['myapp', 'test']);

    var result = task.execute(true);
    test.equals(result.cmd, 'go test .');

    test.done();
  },

  testTestWithBuildFlags: function (test) {
    var task = ctx.newTask(['myapp', 'test'], {
      build_flags: '-race'
    });

    var result = task.execute(true);
    test.equals(result.cmd, 'go test -race .');

    test.done();
  },
  
  testTestWithTestBuildFlags: function (test) {
    var task = ctx.newTask(['myapp', 'test'], {
      test_build_flags: '-c -i',
      build_flags: '-race'
    });

    var result = task.execute(true);
    test.equals(result.cmd, 'go test -c -i -race .');

    test.done();
  },

  testTestWithTestFlags: function (test) {
    var task = ctx.newTask(['myapp', 'test'], {
      test_flags: '-parallel 2',
      build_flags: '-race'
    });

    var result = task.execute(true);
    test.equals(result.cmd, 'go test -race . -parallel 2');

    test.done();
  }

};