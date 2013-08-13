'use strict';

var path = require('path');

module.exports = function (grunt) {

  var _ = grunt.util._;

  var defaultOpts = {
    build_pckgs: '.',
    test_pckgs: '.'
  };

  function spawned(done, cmd, args, opts) {
    function spawnFunc() {
      var spawn = require('child_process').spawn;
      opts.stdio = 'inherit';
      spawn(cmd, args || [], opts).on('exit', function (status) {
        done(status === 0);
      });
    }

    return spawnFunc;
  }

  // expecting 'go:<app>:<command>'
  function validateArgs(args) {
    if (args.length === 0) {
      grunt.log.error('Unable to run task: no target specified');
      return false;
    } else if (args.length === 1) {
      grunt.log.error('Unable to run task: no action specified (e.g. build)');
      return false;
    } else if (args.length > 2) {
      grunt.log.error('Unable to run task: too many arguments (up to 3 allowed)');
      return false;
    }

    return true;
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
      var target = taskArgs[0];
      var action = taskArgs[1];

      var gruntTaskTargetOpts = grunt.config([name, target, 'options']) || {};
      var gruntTaskOpts = grunt.config([name, 'options']) || {};
      var taskOpts = _.defaults(
        gruntTaskTargetOpts,
        gruntTaskOpts,
        defaultOpts
      );
      grunt.log.debug('Task opts: ' + JSON.stringify(taskOpts));
      var output = taskOpts['output'] || target;


      // ==== assemble command path

      var cmd = 'go';
      var goBin = taskOpts['bin'];
      if (goBin) {
        cmd = goBin + '/' + cmd;

        if (cmd.substr(0, 1) === '~') {
          cmd = process.env.HOME + cmd.substr(1);
        }

        cmd = path.resolve(cmd);
      }


      // ==== assemble command arguments

      var cmdArgs = [action];
      var cmdFlags = taskOpts[action + '_flags'];
      var cmdPckgs = taskOpts[action + '_pckgs'];

      if (action === 'test') {
        var testBuildFlags = taskOpts['test_build_flags'];
        if (testBuildFlags) {
          cmdArgs.push(testBuildFlags);
        }
        var buildFlags = taskOpts['build_flags'];
        if (buildFlags) {
          cmdArgs.push(buildFlags);
        }
        if (cmdPckgs) {
          cmdArgs.push(cmdPckgs);
        }
        if (cmdFlags) {
          cmdArgs.push(cmdFlags);
        }
      } else {
        if (action === 'build') {
          if (!cmdFlags || cmdFlags.indexOf('-o ') === -1) {
            cmdArgs.push('-o ' + output);
          }
        }
        if (cmdFlags) {
          cmdArgs.push(cmdFlags);
        }
        if (cmdPckgs) {
          cmdArgs.push(cmdPckgs);
        }
      }


      // ==== assemble command options

      var cmdOpts = {};
      cmdOpts['env'] = process.env || {};
      cmdOpts['cwd'] = path.resolve(taskOpts['root'] || '.');

      var envTaskOpts = taskOpts['env'] || {};
      for (var envName in envTaskOpts) {
        cmdOpts['env'][envName] = envTaskOpts[envName];
      }

      var task_GOPATH = gruntTaskOpts['GOPATH'];
      var target_GOPATH = gruntTaskTargetOpts['GOPATH'];

      if (task_GOPATH || target_GOPATH) {
        var GOPATH = [];
        var GOPATHs = (task_GOPATH || '').split(':').concat((target_GOPATH || '').split(':'));
        for (var i in GOPATHs) {
          var p = GOPATHs[i];
          if (p !== '') {
            GOPATH.push(path.resolve(p));
          }
        }
        cmdOpts['env'].GOPATH = GOPATH.join(':');
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

      grunt.log.writeln();
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
