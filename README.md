# grunt-appengine [![Build Status](https://travis-ci.org/101loops/grunt-appengine.png?branch=master)](https://travis-ci.org/101loops/grunt-appengine)

> Grunt task for running and managing App Engine



## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-appengine --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-appengine');
```




## Appengine task
_Run this task with the `grunt appengine` command._



### Usage Example

```js
appengine: {
  options: {
    manageFlags: {
      oauth2: true
    },
    runFlags: {
      port: 8080
    }
  },
  
  frontend: {
  	options: {
    	folder: "frontend/"
		}
  },
  backend: {
    options: {
      backend: true,
      backendName: "crawler",

      folder: "backend/"
    }
  }
}
```

All options are optional.


**Running the dev server**

```shell
$ grunt appengine:frontend:run
```


**Update the frontend**

```shell
$ grunt appengine:frontend:update
```


**Update the backend**

```shell
$ grunt appengine:backend:update
```

## Release History

 * 2013-08-12   v0.0.1   initial publishing

---

Task submitted by [Stephan Behnke](http://stephanbehnke.com)

*This file was generated on Mon Aug 12 2013 18:21:05.*
