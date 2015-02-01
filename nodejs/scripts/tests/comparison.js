var fs = require('fs');
var forEachResourceInDirectory = require('./forEachResourceInDirectory');
var Jsonix = require('../jsonix').Jsonix;

var comparison = function(test, context, resource) {
	var jsonFile = resource + '.json';

	console.log("Loading JSON from the file [" + jsonFile + "].");

	var jsonData = fs.readFileSync(jsonFile);

	var jsonText = jsonData.toString();

	console.log("Loading JSON from the text [" + jsonText + "].");

	var json = JSON.parse(jsonText);

	console.log("Loaded JSON from the file [" + jsonFile + "].");

	console.log(JSON.stringify(json, null, 4));

	var marshaller = context.createMarshaller();

	var marshalledXMLText = marshaller.marshalString(json);

	console.log("Marshalled JSON from the file [" + jsonFile + "] as XML:");
	console.log(marshalledXMLText);

	var xmlFile = resource + '.xml';

	var xmlData = fs.readFileSync(xmlFile);

	var xmlText = xmlData.toString();

	console.log("Loaded XML from the file [" + xmlFile + "]:");
	console.log(xmlText);

	test.equal(xmlText, marshalledXMLText, "Expected XML and XML marshalled from [" + jsonFile + "] differ.");

	var xml = Jsonix.DOM.parse(xmlText);

	var unmarshaller = context.createUnmarshaller();

	var unmarshalledJSON = unmarshaller.unmarshalDocument(xml);

	/* TODO
	test.ok(Jsonix.Util.Type.isEqual(json, unmarshalledJSON, function(text) {
		console.log(text);
	}), "Expected JSON and JSON unmarshalled from [" + xmlFile + "] differ.");
	*/
	test.done();

};
var comparisons = function(context, directory) {
	return forEachResourceInDirectory(comparison, [ context ], directory, ".xml");
};
module.exports = {
	comparison : comparison,
	comparisons : comparisons
}
