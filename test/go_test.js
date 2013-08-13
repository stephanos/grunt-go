var ctx = require('./context.js');

exports.copy = {

  testRun: function (test) {
    var task = ctx.newTask(['myapp', 'run']);

    var result = task.execute(true);
    test.equals(result.cmd, 'go run');

    test.done();
  },

  testRunWithCustomRoot: function (test) {
    var task = ctx.newTask(['myapp', 'run'], {
      root: "myroot"
    });

    var result = task.execute(true);
    test.notEqual(result.opts['cwd'].indexOf('/myroot'), -1);

    test.done();
  },

  testCleanWithCustomBin: function (test) {
    var task = ctx.newTask(['myapp', 'clean'], {
      bin: "sdk"
    });

    var result = task.execute(true);
    test.equals(result.cmd, 'sdk/go clean');

    test.done();
  },

  testRunWithCustomGoPath: function (test) {
    var task = ctx.newTask(['myapp', 'run'], {
      myapp: {
        GOPATH: "mypath"
      }
    });

    var result = task.execute(true);
    test.equal(result.opts['env']['GOPATH'].indexOf(':'), -1);
    test.notEqual(result.opts['env']['GOPATH'].indexOf('/mypath'), -1);

    test.done();
  },

  testRunWithCustomGoArch: function (test) {
    var task = ctx.newTask(['myapp', 'run'], {
      env: {
        GOARCH: "amd64"
      }
    });

    var result = task.execute(true);
    test.equal(result.opts['env']['GOARCH'], 'amd64');

    test.done();
  }

};