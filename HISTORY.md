### v1.4.1 - 18/02/2015

- [Fix] JsInspect upgrade check-build interface.


### v1.4.0 - 18/02/2015

- [Feat] Check-build now supports an `ignore` option for david. It will be removed (the update will be transparent for our users) once David support this feature natively (see issue [https://github.com/alanshaw/david/issues/63](#63).

### v1.3.3 - 24/01/2015

- [Fix] [Update dependencies #18 by @ruimarinho](https://github.com/FGRibreau/check-build/pull/18)

### v1.3.2 - 24/01/2015

- [Fix] Fix david integration.

### v1.3.1 - 21/01/2015

- [Fix] Upgrade david, buddyjs, fixmyjs, nsp and jsinspect.

### v1.3.0 - 11/18/2014

- [Fix] [jscs integration #12 by @ruimarinho](https://github.com/FGRibreau/check-build/pull/12)  
- [New] [Add options configuration to david](https://github.com/FGRibreau/check-build/pull/11)  

### v1.2.0 - 11/15/2014

- [New] added [David](https://github.com/alanshaw/david), Check that your project dependencies are up to date. [#7](https://github.com/FGRibreau/check-build/issues/7)

### v1.1.0 - 11/15/2014

- [New] added `continueOnError` and `allowFailures` configuration options to `.checkbuild`

### v1.0.6 - 10/20/2014

- [Fix] upgraded buddy.js to `v0.7.0`

### v1.0.5 - 10/20/2014

- [Fix] use `process.cwd() instead of `process.env.PWD`

### v1.0.4 - 10/20/2014

- [Fix] jsinspect now exits when matches are found

### v1.0.3 - 10/20/2014

- [Fix] check-build should pass check-build :')

### v1.0.2 - 10/20/2014

- [Fix] default `.checkbuild`

### v1.0.1 - 10/19/2014

- [Fix] nsp now uses `package` instead of `shrinkwrap`

### v1.0.0 - 10/19/2014

- inital release
