# Lib-logger

Library that simplifies the way we log.


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