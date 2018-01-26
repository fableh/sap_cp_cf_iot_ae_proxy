const express = require('express')
const morgan = require('morgan')
const app = express()
var NodeAE = require('sap-iot-ae-node-wrapper')
var cfenv = require('cfenv')

var appEnv = cfenv.getAppEnv()

var nodeAE = new NodeAE({
    clientId: appEnv.getService('my-usp-sap-proxy').credentials.clientId,
    clientSecret: appEnv.getService('my-usp-sap-proxy').credentials.clientSecret,
    tenant: appEnv.getService('my-usp-sap-proxy').credentials.tenant,
    landscape: appEnv.getService('my-usp-sap-proxy').credentials.landscape,
    host: appEnv.getService('my-usp-sap-proxy').credentials.host

}) 

nodeAE.setBaseURI('appiot-mds') 
const basicAuth = require('basic-auth');
const auth = function (req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.sendStatus(401);
    };

    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    };

    if (user.name === '<username>' && user.pass === '<password>') {
        return next();
    } else {
        return unauthorized(res);
    };
};

app.use(morgan('tiny'));
const port = process.env.PORT || 8080;

app.get('/sac/*', auth, function (req, res) {    
    const url = req.originalUrl.replace('/app.svc', '').replace('/sac', '').replace('$inlinecount=allpages', '').replace('&$top=1000', '').replace('&$select=id', '').replace('&$format=json', '');
    //const url = req.originalUrl.replace('/app.svc', '').replace('/sac', '')
    const response = nodeAE.openGetStream('https://analytics-thing-sap.cfapps.eu10.hana.ondemand.com' + '/' + url);

    console.log(nodeAE.getBaseURI)
    console.log(url)
    response.then(
        function success(stream) {
        	stream.pipe(res)
        },
        function error(err) {
            logger.error(err)
        }
    )
});

app.listen(port, function () {
    console.log('Example app listening on port '  + port + '!')
})


const propertySet = 'iotae.sycor.syc.sap.blogs.notebooks:CPU';

app.get('/app.svc/*', auth, function (req, res) {
    const url = req.originalUrl.slice(9, req.originalUrl.length).replace('$inlinecount=allpages&', '');
    console.log(url);

    const response = nodeAE.openGetStream('https://analytics-thing-sap.cfapps.eu10.hana.ondemand.com/' + propertySet + '/' + url);
    response.then(
        function success(stream) {
            stream.pipe(res)
        },
        function error(err) {
            logger.error(err)
        }
    )
})
