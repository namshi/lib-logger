# Lib-logger

Library that simplifies the way we log. It eases migration from native console.log to other log libraries. Current release wrapped winston logger but more loggers can be supported later.


## Features

- **JSON focused:** every log will be formatted to JSON format. 
- **Transporters:** you can configure multiple transports.
- **Log level:** decide log level to display the app. 
- **Standalone usage:** you can include and use it directly.
- **Expressjs compatible:** you can integrate it with expressjs as a middleware.

## Usage

Install it through: `npm i lib-logger`

    const log = require('lib-logger');
    
    log.debug("This is a debug message!");
    log.info("This is an info message");

# Migration From console.log to lib-logger
To ease migrating from console.log to lib-logger, the library supports receiving a number of arguments (should be limited) that are not wrapped in a json object. The library will parse and format it as follows:
- If an argument is a primitive or an Array, convert it to a string and append it to the log message separated with a ', '
- If the argument is an Error, we append the error message to the log message with a prefix ' Error: ' and add stack and statusCode to the context json object. 
- If the argument is a JSON object, we append all its properties to the context object.

example: log.error('Shipment Number', 1234, "could not be created", new Error('Error while bla bla'), { name: 'Test Name', locale: 'en', country: 'ae'});
Output:  
    message: 'Shipment Number, 1234, could not be created, Error: Error while bla bla' it's
    context object: {
        stack: "Error while bla bla @FileName ..... stacktrace',
        statusCode: 500, // default value if no code provided in the error object
        name: 'Test Name',
        locale: 'en',
        country: 'ae',
    }
