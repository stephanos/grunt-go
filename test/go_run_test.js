var ctx = require('./context.js');

exports.copy = {

  testRun: function (test) {
    var task = ctx.newTask(['myapp', 'run']);

    var result = task.execute(true);
    test.notEqual(result, false);
    test.equals(result.cmd, 'go run .');

    test.done();
  },

  testRunWithCustomBin: function (test) {
    var task = ctx.newTask(['myapp', 'run'], {
      bin: "sdk"
    });

    var result = task.execute(true);
    test.notEqual(result, false);
    test.notEqual(result.cmd.indexOf('/sdk/go run'), -1);

    test.done();
  },

  testRunWithFile: function (test) {
    var task = ctx.newTask(['myapp', 'run'], {
      run_files: ["main.go"]
    });

    var result = task.execute(true);
    test.notEqual(result, false);
    test.equals(result.cmd, 'go run main.go');

    test.done();
  },

  testRunWithFlagAndFile: function (test) {
    var task = ctx.newTask(['myapp', 'run'], {
      build_flags: ["-race"],
      run_files: ["main.go"]
    });

    var result = task.execute(true);
    test.notEqual(result, false);
    test.equals(result.cmd, 'go run -race main.go');

    test.done();
  },

  testRunWithFlagAndFileAndArgs: function (test) {
    var task = ctx.newTask(['myapp', 'run'], {
      run_flags: ["-config", "dev.conf"],
      build_flags: ["-race"],
      run_files: ["main.go"]
    });

    var result = task.execute(true);
    test.notEqual(result, false);
    test.equals(result.cmd, 'go run -race main.go -config dev.conf');

    test.done();
  },

  testRunWithCustomRoot: function (test) {
    var task = ctx.newTask(['myapp', 'run'], {
      root: "myroot"
    });

    var result = task.execute(true);
    test.notEqual(result, false);
    test.notEqual(result.opts['cwd'].indexOf('/myroot'), -1);

    test.done();
  },

  testRunWithCustomGoPath: function (test) {
    var task = ctx.newTask(['myapp', 'run'], {
      myapp: {
        GOPATH: ["mypath"]
      }
    });

    var result = task.execute(true);
    test.notEqual(result, false);
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
    test.notEqual(result, false);
    test.equal(result.opts['env']['GOARCH'], 'amd64');

    test.done();
  }

};