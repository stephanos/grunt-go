'use strict';

module.exports = function (grunt) {

  var _ = grunt.util._;

  // ==== INTERFACE

  var exports = {
    execute: function (dryRun) {
      // TODO

      return false;
    }
  };


  // ==== TASK

  grunt.registerTask('go', 'Working with Go', exports.execute);


  return exports;
};
