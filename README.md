<div style="text-align: center; margin-top: 25px;">
    <img alt="Seneca logo" src="https://senecajs.org/images/logo-seneca.svg" width="400" height="200" />
    <img alt="Seneca logo" src="https://d33wubrfki0l68.cloudfront.net/e937e774cbbe23635999615ad5d7732decad182a/26072/logo-small.ede75a6b.svg" width="200" height="200" />
    <p>
        A <a href="https://nodejs.org/">Node.js</a> <a href="https://typescriptlang.org/">Typescript</a> NPM-package to easily setup a <a href="https://nestjs.com/">NestJS</a> microservice that can communicate with other <a href="https://senecajs.org/">Seneca</a> able microservices.
    </p>
</div>

## Description

[nestjs-seneca-adapter](https://www.npmjs.com/package/nestjs-seneca-adapter)
is a NPM-package that hosts utilities for an easy and quick setup for a
[Nest](https://nestjs.com/) microservice application that uses [Seneca](https://senecajs.org/) as transport strategy.<br/>
Among it utilities are:
* Versioning
* Response bodies
* External & 3rd party config files
* SenecaClient to easily talk to other Seneca microservices
* Pipelines for validation
* global pipe support for request scoped dependency injection services

## Getting started

To setup a Nest microservice application that uses Seneca you will first need to [setup a Nest project](https://docs.nestjs.com/first-steps).

```bash
# To install the NestJS command line interface globally
$ npm i -g @nestjs/cli

# Create a new Nest project
$ nest new project-name
```

Now you can install this package.

```bash
# Install the package
$ npm install nestjs-seneca-adapter
```

Afterwards you can create the Nest-Seneca application by importing the package at the top which will add a new method to the NestFactory.

```typescript
import 'nestjs-seneca-adapter';
// ... other imports

async function bootstrap()
{
    // notice the new method 'createSenecaMicroservice' added to the NestFactory
    const app: SenecaApplication = await NestFactory.createSenecaMicroservice(AppModule, {
        seneca: {
            listener: {
                host: 'localhost', // host is required
                port: 10101 // port is required
            },
            clients: [] // optional array for Seneca clients the application will connect to
        }
        // ...other app-settings
    });
    
    // after initialization you can still connect to Seneca clients via the connectSenecaClient() method
    app.connectSenecaClient(...clients);

    // to catch thrown errors and returns an appropriate response (logs ServerExceptions)
    app.useGlobalFilters(new DefaultExceptionFilter());
    
    // to enable versioning
    app.enableVersioning();
    
    await app.listen();
}
bootstrap();
```

## Utilities

To see practical examples of utilities being used, checkout the `example` folder on our [github](https://github.com/ZYANIDE/nestjs-seneca-adapter).

### SenecaClient

Using the `SenecaClient` service you can communicate with other Seneca able microservices.

**NOTE**: It is already globally imported into the dependency injection ecosystem.<br />
**NOTE**: You can only communicate with other Seneca able microservice if they have been connected!

```typescript
import {SenecaClient} from 'nestjs-seneca-adapter';

// make sure this class is imported in the dependency injection ecosystem
class SomeClass
{
    // mention SenecaClient in the constructor
    constructor(senecaClient: SenecaClient)
    {
        // communicate with other microservices using message patterns
        const response: Promise<any> = senecaClient.act(messagePattern, data);
    }
}
```

### AppSettings

The `AppSettings` service creates a snapshot of the given settings of the application on initialization.<br />
You can fetch these settings later in the application using this service.

**NOTE**: It is already globally imported into the dependency injection ecosystem.<br />
**NOTE**: Some methods in the snippet below is psuedo code meant to make the functionality of this service more comprehensible

```typescript
import {AppSettings} from 'nestjs-seneca-adapter';

const settings = {};
const app = await NestFactory.createSenecaMicroservice(AppModule, settings);

// current app app-settings unchanged from initial app-settings
let settingsSnapshot = app.get(AppSettings).snapshot();
console.log(settingsSnapshot === app.currentSettings()); // true

app.changeSettings(); // change current app app-settings

// after change the snapshot is no longer equal to current app-settings
settingsSnapshot = app.get(AppSettings).snapshot();
console.log(settingsSnapshot === app.currentSettings()); // false
```

### DefaultExceptionFilter

Nest provides a backup error catcher in the form of [exception filters](https://docs.nestjs.com/exception-filters).<br />
This default exception filter catches every uncaught error and logs them using the given logger.<br />
It than sends a response to the requester of the request that caused the error using the `respond()` utility.

```typescript
import {DefaultExceptionFilter} from 'nestjs-seneca-adapter';

const app = await NestFactory.createSenecaMicroservice(AppModule, settings);

// add the filter to the application
app.useGlobalFilters(new DefaultExceptionFilter());
```

### ExtractPayloadPipe

Incoming data will represent itself as the payload in the controller action. This will normally include the `clientId`, `role` and `action`.<br />
Using this pipe, only the `payload` property will be given as payload.

### ValidateGenericRequestPipe

Incoming data needs to be validated. With this pipe the request will only validate and test for a `GenericRequest`.<br />
The reason you need to use this pipe instead of just the `ValidationPipe` is because to validate nested properties, you need to manually mention them.<br />
Since the payloads of the requests are dynamic, they need to be validated separately.

**NOTE**: Make sure this pipe is used before `ExtractPayload` so the to-be-validated properties are still available.

### ValidationPipe

Using the `ValidationPipe`, the type given to the payload at the controller action will be used to validate the payload.<br />
This does exactly the same as the `ValidationPipe` from `@nestjs/common`, but this one has a different error message to keep it consistent with other messages within the package.

### respond()

This utility is used to give consistent response bodies. It can automatically use the input to create a response body.<br />
If an error is given it will return an error response. Depending on the error kind it will give different error responses<br />
If the given error was not a `ClientException` it will assume it is a `ServerException` and it censors all the vulnerable data.<br />
If you want the uncensored data, you will need to set the `VERBOSE` environment flag.<br />

| Property | Description | Type                           | SuccessResponse                 | ClientErrorResponse             | ServerErrorResponse                               |
|----------|-------------|--------------------------------|---------------------------------|---------------------------------|---------------------------------------------------|
| appVersion | Displays the version of the current application, fetched from the package.json | AppVersion = string | process.env.npm_package_version | process.env.npm_package_version | process.env.npm_package_version                   |
| statusCode | HTTP based codes to indicate the status of the response | StatusCode = number | default: 200                    | default: 400 | default: 500 or **CENSORED**: 500                 |
| success | Indicates if the request was successful | Success = boolean or 'partial' | default: true                            | false | false                                             |
| result | The response body | T extends object | default: undefined                       | - | -                                                 |
| error | The name of the error | string | -                               | Error.name | Error.name or **CENSORED**: '500: Internal error' |
| message | The error message | string | -                               | Error.message | Error.message or **CENSORED**: undefined          |
| stacktrace | The stacktrace of the error | string | -                               | - | Error.stack or **CENSORED**: undefined            |
| errorCode | An arbitrary error code to identify the specific error quickly | string | -                               | - | default: '0x00'                                   |

```typescript
import {Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import {respond} from 'nestjs-seneca-adapter';

@Controller()
class Controller
{
    @MessagePattern('messagePattern')
    action(): Response<string>
    {
        return respond('Hello world!');
    }
}
```

### configuration()

This utility helps by managing the settings of the application over multiple environments.<br />
It automatically uses the `NODE_ENV` environment variable to choose the right settings.<br />
You can also give a path to a json file containing the settings.

```typescript
import {configuration} from 'nestjs-seneca-adapter';

let settings = configuration({
    global: {}, // app-settings used for every environment but gets overwritten on environment specific app-settings
    local: {}, // contains app-settings used on NODE_ENV='local'
    development: {}, // contains app-settings used on NODE_ENV='development'
    test: {}, // contains app-settings used on NODE_ENV='test'
    production: {} // contains app-settings used on NODE_ENV='production'
});

// gets all the app-settings from a json via a given path
settings = configuration('path/to/json');

// get setting for different environments from different json files
settings = configuration({
    global: 'path/to/global/app-settings',
    local: 'path/to/local/app-settings',
    development: 'path/to/development/app-settings',
    test: 'path/to/test/app-settings',
    production: 'path/to/production/app-settings',
})

// give the returning value of configuration() as app-settings for the application
const app = await NestFactory.createSenecaMicroservice(AppModule, settings);
```

### globalPipe()

This utility allows for an easier time setting up [global pipelines](https://docs.nestjs.com/pipes#global-scoped-pipes) with support for request scoped dependency injection.<br />
It uses the `APP_PIPE` provider to do so.

```typescript
import {Module} from '@nestjs/common';
import {ExtractPayloadPipe, ValidateGenericRequestPipe, ValidationPipe, globalPipe} from 'nestjs-seneca-adapter';

@Module({
  providers: [
    ValidationPipe, // pipe added to providers
    globalPipe(
      new ValidateGenericRequestPipe(), // you can give real values
      new ExtractPayloadPipe(),
      ValidationPipe // give a Type if the pipe is already added as a provider like this one
    ),

    // ... other providers
  ]
})
export class AppModule
{}

const app: SenecaApplication = await NestFactory.createSenecaMicroservice(AppModule, settings);
```

### Versioning

This seneca adapter for nestjs support [versioning](https://docs.nestjs.com/techniques/versioning).<br/>
Just like regular nestjs, you are able to assign a version to apis using the `@Version()` decorator.

```typescript
// main.ts
import {VersionValue} from 'nestjs-seneca-adapter';

const app = await NestFactory.createSenecaMicroservice(AppModule, settings);

// don't forget to enable versioning (it has optional options)
app.enableVersioning({
  showApiVersion: boolean, // whether it should add the 'apiVersion' prop to the response body
  defaultVersion: VersionValue, // default version to be used if @Version() wasn't used on an api
});
```

```typescript
// controller.ts
import {Version, Controller} from '@nestjs/common';
import {MessagePattern} from '@nestjs/microservices';
import {respond} from 'nestjs-seneca-adapter';

@Controller()
class Controller
{
    // this api will not be assigned to version 1
    @Version('1')
    @MessagePattern('messagePattern')
    action(): Response<string>
    {
        return respond('Hello world!');
    }
}
```

To specify a desired version in the request add the `version` prop
```json
{
    "cmd": "messagePattern",
    "role": "DEFAULT_ROLE",
    "version": 1
}
```