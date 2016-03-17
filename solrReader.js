/*
 * Send data from solr as a web service
 */

var app    = require('./lib/js/app.js').app;
var http   = require("http");
var _      = require("underscore");
var argv   = require('yargs')
  .demand(['port'])
  .argv;

app.configure();

http.createServer(app).listen(argv.port, function() {
	console.log("solrReader server listening on port " + argv.port);
});

app.get('/getUrl', function(req, res){

	// get all url of a specific website at a given date

	var coll  = req.query.coll;
	var site  = req.query.site;
	var time  = req.query.time;
	var range = req.query.range; 

	if (coll == null || site == null || time == null || range == null)
		res.status(500).send({ error: 'Attention ! il manque un parametre !' });


    var options = {
        hostname: "localhost",
        port: "8800",
        method: 'GET',
        path: "/solr/" + coll + "/select?q=*:*&fq=site:" + site + "&timePicker=true&time=" + time + "&timeRange=" + range
    };

    console.log("/solr/" + coll + "/select?q=*:*&fq=site:" + site + "&timePicker=true&time=" + time + "&timeRange=" + range);

    var resp = "";

    var httpReq = http.request(options, function(httpRes) {
        httpRes.setEncoding('utf8');

        httpRes.on('data', function(results) {
            resp = resp + results;
        });

        httpRes.on('end', function(err) {
        	var docs = JSON.parse(resp).response.docs;
        	var urls = [];
        	for (var i = 0; i < docs.length; i++) {
        		var url = _.rest(docs[i].url.replace("http://","").split('/'));
        		url[0] = site;

        		/*
        		 * Process time <> wit target
        		 */

        		var d1 = new Date(time);
				var d2 = new Date(docs[i].date);
				var diff = d1.getTime() - d2.getTime();

				urls.push({'url':url,'diff':diff});
        		
        	}
        	
            res.send(urls);
        });
    });

    httpReq.end();	
});