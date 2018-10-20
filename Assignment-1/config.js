/**
 * Configuration file
 * @author: Alfredo Quintero Tlacuilo
 * 
 */

const staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'staging',
};

const production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production',
};

const environments = {
    staging,
    production,
};

const chosenEnv = (typeof process.env.NODE_ENV) === 'string'
    ? environments[process.env.NODE_ENV.toLowerCase()] : environments.staging;

module.exports = chosenEnv;
