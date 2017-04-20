const env = process.env.NODE_ENV || "development";
const config = require("./config/config.json")[env];
const elasticsearch = require('elasticsearch');

// configure
const conf = {
    "protocol" : config['protocol'],
    "auth"     : config['auth'],
    "host"     : config['host'],
    "port"     : config['port']
}

// connect to Elastic sever
const client = new elasticsearch.Client ({  
    hosts: [conf]
});

// checking for connection
client.cluster.health({},function(err,resp,status) {
    if (err) {
        console.log(err.message);
    } else {
        console.log(" Connected to Elasticsearch");
    }
}); 

module.exports = client;
