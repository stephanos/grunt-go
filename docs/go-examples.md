# Usage Example

Note: All examples are written in Coffeescript.


## Configuration

#### Basic

```coffee
go:
  myapp:
    output: "app"
    run_files: ["main.go"]
```

#### With custom (file) root

```coffee
go:
  myapp:
  	root: "myapp"
    output: "app"
    run_files: ["main.go"]
```

#### With custom build flags

```coffee
go:
  myapp:
    output: "app"
    run_files: ["main.go"]
    build_flags: ["-tags", "debug"]
```

#### With custom 'GOROOT'

```coffee
go:
  options:
    GOPATH: ["../myproject"]

  myapp:
    output: "app"
    run_files: ["main.go"]
```

#### E2E testing with App Engine

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


## Execution

The expected syntax is `grunt go:<command>:<target>(:<profile>)`.
The command maps to the respective Go command.
Profile is an optional specification

#### Build app

```shell
grunt go:build:myapp
```

#### Run app

```shell
grunt go:run:myapp
```

#### Test app

```shell
grunt go:test:myapp
```

#### Test app with specific profile

```shell
grunt go:test:myapp:e2eTest
```

#### Format source code

```shell
grunt go:fmt:myapp
```