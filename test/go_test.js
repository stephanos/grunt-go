var ctx = require('./context.js');

exports.copy = {

  testClean: function (test) {
    var task = ctx.newTask(['myapp', 'clean'], {
      clean_flags: ['-i', '-r']
    });

    var result = task.execute(true);
    test.equals(result.cmd, 'go clean -i -r .');

    test.done();
  },

  testFix: function (test) {
    var task = ctx.newTask(['myapp', 'fix'], {
      pckgs: ['mypckg']
    });

    var result = task.execute(true);
    test.equals(result.cmd, 'go fix mypckg');

    test.done();
  },

  testFmt: function (test) {
    var task = ctx.newTask(['myapp', 'fmt'], {
      fmt_pckgs: ['mypckg'],
      fmt_flags: ['-n']
    });

    var result = task.execute(true);
    test.equals(result.cmd, 'go fmt -n mypckg');

    test.done();
  },

  testDoc: function (test) {
    var task = ctx.newTask(['myapp', 'doc'], {
      doc_flags: ['-n']
    });

    var result = task.execute(true);
    test.equals(result.cmd, 'go doc -n .');

    test.done();
  },

  testList: function (test) {
    var task = ctx.newTask(['myapp', 'list'], {
      list_flags: ['-json'],
      list_pckgs: ['mypckg']
    });

    var result = task.execute(true);
    test.equals(result.cmd, 'go list -json mypckg');

    test.done();
  },

  testGet: function (test) {
    var task = ctx.newTask(['myapp', 'get'], {
      get_flags: ['-u'],
      get_pckgs: ['mypckg'],
      build_flags: ['-race']
    });

    var result = task.execute(true);
    test.equals(result.cmd, 'go get -u -race mypckg');

    test.done();
  },

  testVet: function (test) {
    var task = ctx.newTask(['myapp', 'vet'], {
      vet_flags: ['-n']
    });

    var result = task.execute(true);
    test.equals(result.cmd, 'go vet -n .');

    test.done();
  },

  testInstall: function (test) {
    var task = ctx.newTask(['myapp', 'install'], {
      build_flags: ['-race'],
      install_flags: ['-nonsense']
    });

    var result = task.execute(true);
    test.equals(result.cmd, 'go install -race .');

    test.done();
  }

};