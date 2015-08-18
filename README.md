
**Check-build** - Verify that your NodeJS project follow team conventions, is well written, up to date and *secure*.


> “Each time I start a new project/mvp/poc/module I don't want to create/edit a new grunt/gulp file or whatever hype dev use these days.
> I want an already packed CLI with good defaults (mine) that I can drop into my continuous build/integration process.
> Let's build that once and for all.”
>
> – 10/19/2014

<p align="center">
<a target="_blank" href="http://fr.slideshare.net/FGRibreau/continous-integration-of-js-projects-checkbuild-philosophy"><img style="width:100%" src="https://cloud.githubusercontent.com/assets/138050/6199101/a16874ae-b42e-11e4-94fd-bd739d3ba4f4.jpg"></a>
</p>

# Usage

[![Deps](https://david-dm.org/FGRibreau/check-build.png)](https://david-dm.org/FGRibreau/check-build)
[![Version](http://badge.fury.io/js/check-build.png)](https://david-dm.org/FGRibreau/check-build)

```shell
npm install check-build -g
cd /path/to/your/project
check-build
# [...] (sub-module output)
echo $?
# 0 if everything went right, 1 otherwise.
```

# What's inside

### Code error and potential problem detection

- [JSHint](https://github.com/jshint/jshint) Static analysis tool for JavaScript (using [JSHint stylish](https://github.com/sindresorhus/jshint-stylish)). If `.jshintrc` is not present in project root, check-build will use this [.jshintrc](./defaults/.jshintrc).
- [ESLint](http://eslint.org/) The pluggable linting utility for JavaScript and JSX, check-build will use a [.eslintrc](./defaults/.eslintrc) file for ESLint configuration.
- [JSXHint](https://github.com/STRML/JSXHint) **JSXHint is DEPRECATED in favor of ESLint** Static analysis tool for JavaScript and JSX. If `.jshintrc` is not present in project root, check-build will use this [.jshintrc](./defaults/.jshintrc).

### Code style checking

- [JSCS](https://github.com/jscs-dev/node-jscs) Check the code style of your code. If `.jscsrc` is not present in project root, check-build will use this [.jscsrc](./defaults/.jscsrc).

### Code quality
- [Plato](https://github.com/es-analysis/plato) Detect structural complexity in your code, per files.

### D.R.Y

- [JSInspect](https://www.npmjs.org/package/jsinspect) Detect structural similarities in your code.
- [buddy.js](https://github.com/danielstjules/buddy.js) Detect magic number in your code.

### Freshness

- [David](https://github.com/alanshaw/david) Check that your project dependencies are up to date.

### Security

- [Nsp](https://github.com/nodesecurity/nsp) Check your project dependencies for security issues.

<p align="center">
<img src="./docs/mindblown2.gif"/>
</p>

# Philosophy

- Leverage simplicity over performance. `check-build` will be run automatically by a build bot. I #%£€)° don't care about performance, I want code quality and ease of use.
- Don't reinvent the wheel, leverage each module own configuration file. E.g. `.jshintrc`.
- Even if the underneath module is not capable of handling multiple files, abstract it.
- Use `multimatch` everywhere.
- `.checkbuild` is there to configure each module (in case they don't use dot files for configuration), checkbuild will forward these parameters to each module implementation.

# Checkbuild configuration

Put a `.checkbuild` file ([example](./defaults/.checkbuild)) in your project root directory.

```javascript
{
  "checkbuild": {
    "enable": ["jshint", "eslint", "jscs", "jsinspect", "plato", "nsp", "david", "plato"],
    // don't exit immediately if one of the tools reports an error (default true)
    "continueOnError": true,
    // don't exit(1) even if we had some failures (default false)
    "allowFailures": false
  },

  "david": {
    "warn": {
      "E404": true
    },
    "ignore": ["socket.io"] // don't check socket.io package with david
    // ... and so on.
  },

  "jshint": {
    "args": ["src/**/*.js"]
    // instead of putting a .jshintrc inside each of your project with check-build
    // you can specify an URL.
    // That URL will be downloaded each time check-build is run
    // and its content will be saved inside check-build command current directory.
    // for instance the above .checkbuild jshint configuration:
    // "url":"https://raw.githubusercontent.com/FGRibreau/javascript/master/.jshintrc_base"
    // will download the jshintrc_base (the common jshint convention for your organization) inside your project.
    // This .jshintrc_base should be ignored from git and NOT commited.
    // Then, create and commit a .jshintrc that contains at least:
    // {
    //  "extends": "./.jshintrc_base",
    //  ...
    // }
    // inside this .jshintrc file you will be able to put project-specific jshint configuration.
  },

 "eslint": {
    "args": ["src/**/*.js", "src/**/*.jsx"],
    // instead of putting a .eslintrc inside each of your project with check-build
    // you can specify an URL.
    // That URL will be downloaded each time check-build is run
    // and its content will be saved inside check-build command current directory.
    // for instance the above .checkbuild jshint configuration:
    // "url":"https://raw.githubusercontent.com/FGRibreau/javascript/master/.eslintrc_base"
    // will download the eslintrc_base (the common eslint convention for your organization) inside your project.
    // This .eslintrc_base should be ignored from git and NOT commited.
    // Then, create and commit a .eslintrc that contains at least:
    // {
    //  "extends": ["./.eslintrc_base"],
    //  ...
    // }
    // inside this .eslintrc file you will be able to put project-specific ESLint configuration.
    // ... and so on.
  },

  "jscs": {
    "args": ["lib/**.js"]
    // ... and so on.
    // instead of putting a .jscrc inside each of your project with check-build
    // you can specify an URL.
    // That URL will be downloaded each time check-build is run
    // and its content will be saved inside check-build command current directory
    // "url":"https://raw.githubusercontent.com/FGRibreau/javascript/master/.jscsrc"
  },

  "jsinspect": {
    "args": ["*.js"],
    "diff": true
    // ... and so on.
  },

  "buddyjs": {
    "args": ["*.js"],
    "ignore": [0, 1, 200]
    // ... and so on.
  },

  "plato": {
    "args": ["*.js"],
    // define your project minimum average maintainability level
    "maintainability": 75.00
  },

  "nsp": {},

  "david": {
    "dev": false,
    // whether to check devDependencies or not (default false)
    "stable": true,
    // whether to check dependencies or not (default true)
    "ignore": []
    // put ignored dependencies here (both devDependencies and dependencies)
  }
}

```

<p align="center">
<img style="width:100%" src="./docs/building-house.gif"/>
</p>

# Final goal

A (NodeJS) project can be automatically analyzed in many dimension like code-consistency, d-r-y-ness and security. Check-build's final goal is to take the human out of the loop.
