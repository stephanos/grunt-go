var ctx = require('./context.js');

exports.copy = {

  testTest: function (test) {
    var task = ctx.newTask(['test', 'myapp']);

    var result = task.execute(true);
    test.notEqual(result, false);
    test.equals(result.cmd, 'go test .');

    test.done();
  },

  testTestWithBuildFlags: function (test) {
    var task = ctx.newTask(['test', 'myapp'], {
      build_flags: ['-race']
    });

    var result = task.execute(true);
    test.notEqual(result, false);
    test.equals(result.cmd, 'go test -race .');

    test.done();
  },
  
  testTestWithTestBuildFlags: function (test) {
    var task = ctx.newTask(['test', 'myapp'], {
      test_build_flags: ['-c', '-i'],
      build_flags: ['-race']
    });

    var result = task.execute(true);
    test.notEqual(result, false);
    test.equals(result.cmd, 'go test -c -i -race .');

    test.done();
  },

  testTestWithTestFlags: function (test) {
    var task = ctx.newTask(['test', 'myapp'], {
      test_flags: ['-parallel', '2'],
      build_flags: ['-race']
    });

    var result = task.execute(true);
    test.notEqual(result, false);
    test.equals(result.cmd, 'go test -race . -parallel 2');

    test.done();
  }

};