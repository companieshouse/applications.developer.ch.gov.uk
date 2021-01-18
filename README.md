# API Filing Service - applications.developer.web

This is a Web Service that provides a means for registering and managing applications on the developer hub.
It is written using the [NodeJS](https://nodejs.org/en/) framework, and is intended to act as the user interface
through which developers can submit requests to the [developer hub api](https://github.com/companieshouse/applications.api.identity.ch.gov.uk).

## Dependencies

You'll need the following software installed before-hand:

  - [NodeJS](https://nodejs.org/en/)
  - [VirtualBox](https://www.virtualbox.org/)
  - [Redis](https://redis.io/topics/quickstart)

## Downloading and installing

There are two ways to download, install and run this Web Service:
- via Vagrant, or
- locally, on your host machine

 ### Vagrant installation

 To run the app as part of the standard Companies House Vagrant set-up, follow [these set-up instructions](https://github.com/companieshouse/vagrant-chs-development-v2) on how to run Vagrant on your machine

 Once Vagrant is up and running you can either start the service on its own:

 ```
 ubic start chs.dev-hub.applications-developer-service
 ```

 Or you start it up as part of the chs dev-hub group (you will need to do this in order to be able to use the api functionality properly):

 ```
 ubic start chs.dev-hub
 ```
You should also make sure that the account service, cdn and path router are running in chs core:

- `ubic start chs.core.account`
- `ubic start chs.core.cdn`
- `ubic start chs.core.path-router`

Or you may prefer to simply start up all of chs.core:

```
ubic start chs.core
```
Once the necessary applications have started up, the service should be accessible in you browser at: [http://dev.chs-dev.internal:4904](http://dev.chs-dev.internal:4904).

### Local installation

To run this Web Service outside of Vagrant, you'll still need to carry out the above Vagrant installation first to get the API service working in order for this app to work.

Having successfully installed Vagrant above, clone the Web Service [project](https://github.com/companieshouse/applications.developer.web.ch.gov.uk) into your project root, and run the following commands:
```
cd applications.developer.web.ch.gov.uk
npm install && npm install mocha -g
```
#### Config set-up

- The Web Service natively uses environment variables for configuration.
- The signature config file for local (non-Vagrant) installs is located at `config/.env.example` and should be copied over to `config/.env`.
- You will need to tweak some values in `.env` to suit your local set up e.g. port number, hostname, SSL settings, etc...

#### Redis set-up

- Install and configure the Redis server on Mac OS X via Homebrew: `brew install redis`
- Start Redis with: `brew services start redis`. This will run Redis with a default port of `6379` on `127.0.0.1`
- Test if Redis is running by typing the command: `redis-cli ping`.  If it replies with `PONG`, then it's good to go!
- Stop Redis using brew: `brew services stop redis`

#### SSL set-up (optional)

- If you wish to work with ssl-enabled endpoints locally, ensure you turn the `NODE_SSL_ENABLED` property to `ON` in the config and also provide paths to your private key and certificate.
- In a typical production environment, this might never be required as the Node app usually sits behind a load balancer.

#### Running the app

Firstly, build client assets by running:
```
npm run build
```
If you're making changes to client Javascript and SCSS files, you can watch for changes with:
```
gulp watch
```
Then, to start the application, run:
```
npm start
```
or, to watch for changes with auto restart in your dev environment, run:
```
npm run watch
```
...and navigate to http://localhost:3000/ (or whatever hostname/port number combination you've changed the config values to)

For SSL connections, navigate to https://localhost:3443

## Testing & coverage

To run the tests, type the following command:
```
npm test
```
For these tests, we use [Mocha](http://mochajs.org/) with [Sinon](http://sinonjs.org/) and [Chai](http://chaijs.com/).

To view a summary of unit test coverage, run:
```
npm run coverage
```
To view the full coverage report, run:
```
npm run coverage:report
```
This will also generate an HTML file you can use to check coverage in a browser. This can be found here:
```
coverage/lcov-report/server/index.html
```
If you're using a Mac, you can open (double-click) the above file via Finder and that should fire up your default browser with the coverage report.

Test coverage thresholds are defined in the `nyc` stanza of `package.json` and are currently all set to 50 i.e. 50% coverage. Feel free to edit these as per project requirements.

## Linting

ESLint is our preferred module for implementing and enforcing coding standards and, as per GovUk guidelines, extends the industry standard  [StandardJS](https://standardjs.com/). All JavaScript files follow its conventions, and it runs on CI as well to ensure that new pull requests are in line with them.

Additionally, we have implemented a GIT pre-commit hook to ensure that with each local commit, you do not have any failing tests or linting violations. You'll see this every time you perform a GIT commit.

You can check for any linting violations by running:
```
npm run lint
```

To auto-fix any issues, run:
```
npm run lint:fix
```
This command will try and fix as many issues as it can but, in any case, make sure you re-run `npm run lint` to fix any issues that the auto-fixer did not.

## Design notes

 ### 1. Application architecture

- We have opted for the Model-View-Controller design pattern that provides a clear separation of concerns. This ensures that the task of scaling to a very large codebase with a small or large team(s) remains simple , transparent and causes no source bloat.
- There's  a router where all route (or controller) dispatch is handled and requests are fed to the pertinent routes.
- This approach could be further improved by introduction a concept of "atomic" actions/handlers where all route logic will be neatly tucked away in separate modules without crowding out the primary route file. It also means that different developers can work on the similarly grouped tasks in the same route  with little or no versioning conflicts!
- A similar approach to this is route helpers which contain routines and methods that you'd rather have obscured from the primary route file. Route helpers can be found in the `utils` sub-folder within the routes folder.

### 2. Logging

We use the Winston module (in association with Morgan) for generating and managing our logs. When running the app locally outside of Vagrant, you can `tail` the log file at `server/logs/app.log`.

When running in Vagrant, this is available at `~/ubic/log/applications.developer.web.ch.gov.uk.stdout.log` and, similarly, you can `tail` it for real-time logging reports.

We are also in the process of plugging in Structured Logging which is the department's preference for handling centralised logging.

### 3. Session handling

We use the department-wide [Session Handler](https://github.com/companieshouse/node-session-handler) for managing session data.

### To-do

- [] Integrate Structured Logging
- [] Repurpose for Typescript
