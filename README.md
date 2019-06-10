# Lib-logger

Enforces all your logs to be displayed as JSON following stackdriver specification so you can filter by it's values.


## Usage

Install it through: `npm i lib-logger`

    const log = require('lib-logger');

    log.debug("Application started!",{httpServer:address});
    log.info(`Shipment ${shipmentID} delivered!`,{shipmentID, amount, items});

Export the environment vars `APP_NAME` and `APP_VERSION` in order to see the error reporting on stackdriver.
