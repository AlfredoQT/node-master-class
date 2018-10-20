/**
 * Entry point of application
 * @author: Alfredo Quintero Tlacuilo
 * 
 */
const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

// Handlers
let handlers = {};

handlers.notFound = (data, callback) => {
    callback(404);
};

handlers.hello = (data, callback) => {
    callback(404, { message: 'Hello there!' });
}

// Define the router
const router = {
    hello: handlers.hello,
};

const unifiedServer = (req, res) => {
    // Obtain the properties
    const { headers, method } = req;

    // Parse the url using query string to return the query as an object
    const parsedUrl = url.parse(req.url, true);

    // Retrieve the pathname without / at the start or end
    const trimedPath = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

    // Construct the buffer from the request body
    let buffer = '';
    const decoder = new StringDecoder('utf-8');

    req.on('data', (data) => {
        // Decode 
        buffer += decoder.write(data); 
    });
    req.on('end', () => {
        buffer += decoder.end(); // End the builder

        // Construct the data send to the handler
        const data = {
            trimedPath,
            payload: buffer,
            query: parsedUrl.query,
            headers,
            method,
        }

        // Select the handler
        const handler = router[trimedPath] ? router[trimedPath] : handlers.notFound;

        handler(data, (statusCode = 200, payload = {}) => {
            // Stringify the payload to sent back
            const payloadString = JSON.stringify(payload);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
        })
    });
};

// Create an http server
const httpServer = http.createServer(unifiedServer);

// Listen
httpServer.listen(config.httpPort, () => {
    console.log(`Server listening on port: ${config.httpPort}`);
})

const httpsOptions = {
    key: fs.readFileSync('./https/key.perm'),
    cert: fs.readFileSync('./https/cert.perm'),
};

// Create the https server
const httpsServer = https.createServer(httpsOptions, unifiedServer);

httpsServer.listen(config.httpsPort, () => {
    console.log(`Server listening on port: ${config.httpsPort}`);
})
