var grunt = require('grunt');
var gruntGo = require('../tasks/grunt-go.js');

module.exports = {

  newTask: function (taskArgs, gruntOptions) {

    var _ = grunt.util._;
    var task = gruntGo(grunt);

    task.args = taskArgs || [];

    grunt.config = function (array) {
      var target, profile;
      if (array.length > 2) {
        target = array[1];
        profile = array[2];
      }

      if (profile) {
        return (gruntOptions || {})[profile];
      } else if (target) {
        return (gruntOptions || {})[target];
      } else {
        return _.omit(_.omit(gruntOptions, taskArgs[1]), taskArgs[2]);
      }
    };

    return task;
  }
};