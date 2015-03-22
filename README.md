recurve  [![Build Status](https://secure.travis-ci.org/sebastiencouture/recurve.png?branch=master)](https://travis-ci.org/sebastiencouture/recurve)
=======

Javascript front-end framework

Based on similar design to AngularJS with dependency injection for loading modules, services and to facilitate easy
unit testing. But the core framework does not make any assumptions about the View. Can be used with any view/templating
library, but designed with React in mind since it is great :)

*Don't use this framework!!!* there is no documentation and never will be, and I won't be maintaining this project. Many of the
services have been released as independent libraries such as [recurve-storage](http://github.com/sebastiencouture/recurve-storage),
[recurve-cookies](http://github.com/sebastiencouture/recurve-cookies).

Why won't this be finished? There are too many Javascript front-end frameworks already, and I don't have enough
spare time to finish and maintain this project. This project was mainly to explore some design ideas and concepts and to gain a better
understanding some of the uglier parts of various browsers.

## Overview

Everything is broken down into modules which are further broken down into services. The goal is to pick and choose modules
depending on the app.

### Core

Core of the framework that offers set of re-usable services that can be used with any view/templating library to build
apps.

* [di](src/core/di) - dependency injection framework for containers and modules
* [http](src/core/http) - http request handling, promise based
* [log](src/core/log) - logging framework with default target to console.log
* [async](src/core/async.js) - asynchronous helpers
* [cache](src/core/cache.js) - generic cost and count based cache
* [common](src/core/commnon.js) - support/helper methods used by all services
* [cookies](src/core/cookies.js) - cookies wrapper
* [document](src/core/document.js) - wrapper around window.document to facilitate easy mocking for unit tests
* [error-handler](src/core/error-handler.js) - error handler helpers
* [event-emitter](src/core/event-emitter.js) - event emitter bus
* [performance](src/core/performance.js) - wrapper around performance tracking
* [promise](src/core/promise.js) - A+ compliant promise implementation. The framework is based around the usage of promises.
* [router](src/core/router.js) - push state router
* [signal](src/core/signal.js) - signal event/messaging. Inspired by AS3 signals
* [storage](src/core/storage.js) - local/session storage wrapper
* [timeout](src/core/timeout.js) - promise based time outs
* [uncaught-error-handler](src/core/uncaught-error-handler.js) - handle uncaught errors
* [window](src/core/window.js) - wrapper around window to facilitate easy mocking for unit tests

### Mock

Mocked core services to simplify unit testing

* [mock](src/mock/mock.js) - bootstrap and helpers for Mocha/Jasmine unit testing
* [mock-async](src/mock/mock-async.js) - makes usage of async service to be synchronous through calls to flush()
* [mock-cookies](src/mock/mock-cookies.js) - stores cookies in memory instead of `document.cookie`
* [mock-error-handler-decorator](src/mock/mock-error-handler-decorator.js) - logs all uncaught errors to memory with helpers to query errors
* [mock-http-provider](src/mock/mock-http-provider.js) - mock http responses
* [mock-log](src/mock/mock-log.js) - logs all to memory with helpers to query the logs
* [mock-storage](src/mock/mock-storage.js) - stores to memory instead of `window.localStorage`/`window.sessionStorage`


### Flux

Implementation of [Flux](https://facebook.github.io/react/docs/flux-overview.html)

* [action](src/flux/action.js)
* [action-group](src/flux/action-group.js)
* [store](src/flux/store.js)

### Flux-React

Services for React using Flux architecture.

* [state-router](src/flux-react/state-router.js) - nested state based router that also handles data loading for states
* [state-store](src/flux-react/state-store.js) - data store of the current app state
* [state component](src/flux-react/components/state.js) - React component to render a router state

### Flux-Rest

REST implementation for use with the Flux architecture, builds on the `http` service.

* [rest](src/flux-rest/flux-rest.js)

## Running the Tests

```
grunt test
```

## Browser Support

IE9+

## License

The MIT License (MIT)

Copyright (c) 2015 Sebastien Couture

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.