var grunt = require('grunt');
var gruntGo = require('../tasks/grunt-go.js');

module.exports =  {

  newTask: function (taskArgs, gruntOptions) {

    var task = gruntGo(grunt);

    task.args = taskArgs || [];

    grunt.config = function (array) {
      var target;
      if (array.length === 3) target = array[1];

      if (target) {
        return (gruntOptions || {})[target];
      } else {
        var res = {};
        for (var key in gruntOptions) {
          if (key != taskArgs[0]) {
            res[key] = gruntOptions[key];
          }
        }
        return res;
      }
    };

    return task;
  }
};