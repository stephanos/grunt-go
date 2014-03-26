'use strict';

var path = require('path');
var spawn = require('child_process').spawn;

module.exports = function (grunt) {

  var _ = grunt.util._;

  var defaultOpts = {
    pckgs: ['./...'],
    fmt_pckgs: ['.'],
    run_files: ['main.go'],
    build_pckgs: ['.'],

    get_flags: ['-u'],
    fmt_flags: ['-l', '-w'],

    stdout: function (data) {
      grunt.log.writeln(data);
    },
    stderr: function (data) {
      grunt.log.error(data);
    }
  };

  function spawned(done, cmd, args, opts) {
    function spawnFunc() {
      //opts.stdio = [process.stdin, 'ignore', 'ignore'];
      var proc = spawn(cmd, args || [], opts);
      proc.stdout.on('data', function (data) {
        opts.stdout(data);
      });
      proc.stderr.on('data', function (data) {
        opts.stderr(data);
      });
      proc.on('exit', function (status) {
        done(status === 0);
      });
    }

    return spawnFunc;
  }

  // expecting 'go:<command>:<target>(:<profile>)'
  function validateArgs(args) {
    if (args.length === 0) {
      grunt.log.error('Unable to run task: no target specified');
      return false;
    } else if (args.length === 1) {
      grunt.log.error('Unable to run task: no action specified (e.g. build)');
      return false;
    } else if (args.length > 3) {
      grunt.log.error('Unable to run task: too many arguments (up to 4 allowed)');
      return false;
    }

    return true;
  }

  function validateOpts(opts) {
    for (var key in opts) {
      if (key.indexOf('_flags') !== -1 || key.indexOf('pckgs') !== -1 || key.indexOf('_files') !== -1  || key === 'GOPATH') {
        var value = opts[key];
        if (!(value instanceof Array)) {
          grunt.log.error('Unable to run task: option \'' + key + '\' must be an array');
          return false;
        }
      }
    }

    return true;
  }

  function createPath(opts) {
    var res = [];
    var root = opts['root'] || '.';
    var paths = opts['GOPATH'] || [];

    if (paths) {
      for (var i in paths) {
        res.push(path.resolve(path.join(root, paths[i])));
      }
    }

    return res;
  }

  /*
   * Get OS specific multiline variable separator
   * Win - ;
   * Other - :
   */
  function getOSMultilineVarSeparator() {
    return (process.platform === 'win32') ? ';' : ':';
  }

  // ==== INTERFACE

  var exports = {
    execute: function (dryRun) {
      var self = this;
      var name = self.name || 'go';


      // ==== read task parameters

      var taskArgs = this.args || [];
      grunt.log.debug('Task args: ' + taskArgs);
      if (validateArgs(taskArgs) === false) {
        return false;
      }
      var action = taskArgs[0];
      var target = taskArgs[1];
      var profile = taskArgs[2] || '';

      if (!target || !grunt.config([name, target])) {
        grunt.log.error('Unable to run task: target \'' + target + '\' not found');
        return false;
      }

      var gruntTaskTargetProfileOpts = grunt.config([name, target, profile]) || {};
      var gruntTaskProfileOpts = grunt.config([name, 'options', profile]) || {};
      var gruntTaskTargetOpts = grunt.config([name, target]) || {};
      var gruntTaskOpts = grunt.config([name, 'options']) || {};
      var taskOpts = _.defaults(
        gruntTaskTargetProfileOpts,
        gruntTaskProfileOpts,
        gruntTaskTargetOpts,
        gruntTaskOpts,
        defaultOpts
      );
      grunt.log.debug('Task opts: ' + JSON.stringify(taskOpts));
      if (validateOpts(taskOpts) === false) {
        return false;
      }

      var output = taskOpts['output'] || target;
      var cmdArgs = [action];


      // ==== assemble command path

      var cmd = taskOpts['cmd'] || 'go';
      if (action === 'fmt') {
        cmd = 'gofmt';
        cmdArgs = [];
      }

      var goBin = taskOpts['bin'];
      if (goBin) {
        cmd = goBin + '/' + cmd;

        if (cmd.substr(0, 1) === '~') {
          cmd = process.env.HOME + cmd.substr(1);
        }

        Object.keys(process.env).forEach(function (key) {
          var val = process.env[key];
          cmd = cmd.replace(new RegExp('\\$' + key, 'g'), val);
        });

        cmd = path.resolve(cmd);
      }


      // ==== assemble command arguments

      var cmdFlags = taskOpts[action + '_flags'] || [];
      var cmdBuildFlags = taskOpts['build_flags'] || [];
      var cmdPckgs = taskOpts[action + '_pckgs'] || taskOpts[action + '_files'] || taskOpts['pckgs'] || [];

      if (action === 'test') {
        cmdArgs = cmdArgs.concat(taskOpts['test_build_flags'] || []);
        cmdArgs = cmdArgs.concat(cmdBuildFlags);
        cmdArgs = cmdArgs.concat(cmdPckgs);
        cmdArgs = cmdArgs.concat(cmdFlags);
      } else if (action === 'build') {
        if (!cmdFlags || _.indexOf(cmdFlags, '-o') === -1) {
          cmdArgs.push('-o', output);
        }
        cmdArgs = cmdArgs.concat(cmdFlags);
        cmdArgs = cmdArgs.concat(cmdPckgs);
      } else if (action === 'run') {
        cmdArgs = cmdArgs.concat(cmdBuildFlags);
        cmdArgs = cmdArgs.concat(cmdPckgs);
        cmdArgs = cmdArgs.concat(cmdFlags);
      } else if (action === 'get') {
        cmdArgs = cmdArgs.concat(cmdFlags);
        cmdArgs = cmdArgs.concat(cmdBuildFlags);
        cmdArgs = cmdArgs.concat(cmdPckgs);
      } else if (action === 'install') {
        cmdArgs = cmdArgs.concat(cmdBuildFlags);
        cmdArgs = cmdArgs.concat(cmdPckgs);
      } else {
        cmdArgs = cmdArgs.concat(cmdFlags);
        cmdArgs = cmdArgs.concat(cmdPckgs);
      }


      // ==== assemble command options

      var cmdOpts = {};

      // cwd
      cmdOpts['cwd'] = path.resolve(taskOpts[action + '_root'] || taskOpts['root'] || '.');

      // env
      cmdOpts['env'] = process.env || {};
      var envTaskOpts = taskOpts['env'] || {};
      for (var envName in envTaskOpts) {
        cmdOpts['env'][envName] = envTaskOpts[envName];
      }

      // stdout / stderr
      var stdout = taskOpts[action + '_stdout'] || taskOpts['stdout'];
      if (stdout && _.isFunction(stdout)) {
        cmdOpts.stdout = stdout;
      }
      var stderr = taskOpts[action + '_stderr'] || taskOpts['stderr'];
      if (stderr && _.isFunction(stderr)) {
        cmdOpts.stderr = stderr;
      }

      // GOPATH / GOOS / GOARCH
      cmdOpts['env'].GOPATH =
        createPath(gruntTaskOpts)
          .concat(createPath(gruntTaskTargetOpts))
          .concat(createPath(gruntTaskTargetProfileOpts)).join(getOSMultilineVarSeparator());

      var goos = gruntTaskOpts["GOOS"];
      if (goos) {
        cmdOpts['env'].GOOS = goos;
      }

      var goarch = gruntTaskOpts["GOARCH"];
      if (goarch) {
        cmdOpts['env'].GOARCH = goarch;
      }

      grunt.log.debug('CMD opts: ' + JSON.stringify(cmdOpts));


      // ==== execute and return

      var fullCmd = cmd + ' ' + cmdArgs.join(' ');
      grunt.log.writeln('executing: ' + fullCmd);

      if (dryRun !== true) {
        var done = this.async();
        spawned(done, cmd, cmdArgs, cmdOpts)();
      } else {
        grunt.log.write('(dry run: script not executed)');
      }

      return {
        cmd: fullCmd,
        opts: cmdOpts
      };
    }
  };


  // ==== TASK

  grunt.registerTask('go', 'Working with Go', exports.execute);


  return exports;
};
