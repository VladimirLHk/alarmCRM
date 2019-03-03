var fs = require('fs');
var https = require('https');
var static = require('node-static');
var options = {
    key: fs.readFileSync('server-key.pem'),
    cert: fs.readFileSync('server-cert.pem')
};
var file = new static.Server('./../');

https.createServer(options, function(req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    file.serve(req, res);
}).listen(8080);

console.log('Server running on port 8080');