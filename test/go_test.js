var ctx = require('./context.js');

exports.copy = {

  testClean: function (test) {
    var task = ctx.newTask(['clean', 'myapp'], {
      clean_flags: ['-i', '-r']
    });

    var result = task.execute(true);
    test.equals(result.cmd, 'go clean -i -r .');

    test.done();
  },

  testFix: function (test) {
    var task = ctx.newTask(['fix', 'myapp'], {
      pckgs: ['mypckg']
    });

    var result = task.execute(true);
    test.equals(result.cmd, 'go fix mypckg');

    test.done();
  },

  testFmt: function (test) {
    var task = ctx.newTask(['fmt', 'myapp'], {
      fmt_pckgs: ['mypckg']
    });

    var result = task.execute(true);
    test.equals(result.cmd, 'gofmt -w mypckg');

    test.done();
  },

  testDoc: function (test) {
    var task = ctx.newTask(['doc', 'myapp'], {
      doc_flags: ['-n']
    });

    var result = task.execute(true);
    test.equals(result.cmd, 'go doc -n .');

    test.done();
  },

  testList: function (test) {
    var task = ctx.newTask(['list', 'myapp'], {
      list_flags: ['-json'],
      list_pckgs: ['mypckg']
    });

    var result = task.execute(true);
    test.equals(result.cmd, 'go list -json mypckg');

    test.done();
  },

  testGet: function (test) {
    var task = ctx.newTask(['get', 'myapp'], {
      get_flags: ['-u'],
      get_pckgs: ['mypckg'],
      build_flags: ['-race']
    });

    var result = task.execute(true);
    test.equals(result.cmd, 'go get -u -race mypckg');

    test.done();
  },

  testVet: function (test) {
    var task = ctx.newTask(['vet', 'myapp'], {
      vet_flags: ['-n']
    });

    var result = task.execute(true);
    test.equals(result.cmd, 'go vet -n .');

    test.done();
  },

  testInstall: function (test) {
    var task = ctx.newTask(['install', 'myapp'], {
      build_flags: ['-race'],
      install_flags: ['-nonsense']
    });

    var result = task.execute(true);
    test.equals(result.cmd, 'go install -race .');

    test.done();
  }

};