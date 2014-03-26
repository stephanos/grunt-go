# grunt-go [![Build Status](https://travis-ci.org/101loops/grunt-go.png?branch=master)](https://travis-ci.org/101loops/grunt-go)

> Grunt plugin for working with Go



## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-go --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-go');
```




## Go task
_Run this task with the `grunt go` command._



### Usage Example

Note: All examples are written in Coffeescript.


#### Configuration

###### Basic

```coffee
go:
  myapp:
    output: "app"
    run_files: ["main.go"]
```

###### With custom (file) root

```coffee
go:
  myapp:
  	root: "myapp"
    output: "app"
    run_files: ["main.go"]
```

###### With custom build flags

```coffee
go:
  myapp:
    output: "app"
    run_files: ["main.go"]
    build_flags: ["-tags", "debug"]
```

###### With custom 'GOROOT'

```coffee
go:
  options:
    GOPATH: ["../myproject"]

  myapp:
    output: "app"
    run_files: ["main.go"]
```

###### E2E testing with App Engine

```coffee
go:
  e2eTest:
    cmd: "goapp"
    bin: "<%= appengine_sdk %>"
    build_flags: ["-tags", "e2e appengine"]

  myapp:
    output: "app"
    run_files: ["main.go"]
```


#### Execution

The expected syntax is `grunt go:<command>:<target>(:<profile>)`.
The command maps to the respective Go command.
Profile is an optional specification

###### Build app

```shell
grunt go:build:myapp
```

###### Run app

```shell
grunt go:run:myapp
```

###### Test app

```shell
grunt go:test:myapp
```

###### Test app with specific profile

```shell
grunt go:test:myapp:e2eTest
```

###### Format source code

```shell
grunt go:fmt:myapp
```

## Release History

 * 2013-08-12   v0.0.1   initial publishing
 * 2013-08-30   v0.0.2   allow custom GOOS/GOARCH
 * 2013-11-15   v0.0.3   allow custom go command
 * 2014-03-25   v0.0.4   minor fixes

---

Task submitted by [Stephan Behnke](http://stephanbehnke.com)

*This file was generated on Wed Mar 26 2014 16:53:53.*
