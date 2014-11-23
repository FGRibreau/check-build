<p align="center">
<img style="width:100%" src="./docs/building-house.gif"/>
</p>

**Check-build** - Verify that your NodeJS project follow team conventions, is well written, up to date and *secure*.


> “Each time I start a new project/mvp/poc/module I don't want to create/edit a new grunt/gulp file or whatever hype dev use these days.
> I want an already packed CLI with good defaults (mine) that I can drop into my continuous build/integration process.
> Let's build that once and for all.”
>
> – 10/19/2014


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

*[To be implemented]*: [FixMyJS](https://github.com/jshint/fixmyjs) Automatically fix silly lint errors.

### Code style checking

- [JSCS](https://github.com/jscs-dev/node-jscs) Check the code style of your code. If `.jscsrc` is not present in project root, check-build will use this [.jscsrc](./defaults/.jscsrc).

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
- `.checkbuildrc` is there to configure each module (in case they don't use dot files for configuration), checkbuild will forward these parameters to each module implementation.

# Checkbuild configuration

Put a `.checkbuildrc` file ([example](./defaults/.checkbuildrc)) in your project root directory.

```javascript
{
  "checkbuild": {
    "enable": ["jshint", "jscs", "jsinspect", "nsp", "david"],
    // don't exit immediately if one of the tools reports an error (default true)
    "continueOnError": true,
    // don't exit(1) even if we had some failures (default false)
    "allowFailures": false
  },

  "david": {
    "warn": {
      "E404": true
    }
    // ... and so on.
  },

  "jshint": {
    "args": ["src/**/*.js"]
    // ... and so on.
  },

  "jscs": {
    "args": ["lib/**.js"]
    // ... and so on.
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

  "nsp": {}
}

```

# Final goal

A (NodeJS) project can be automatically analyzed in many dimension like code-consistency, d-r-y-ness and security. Check-build's final goal is to take the human out of the loop.
