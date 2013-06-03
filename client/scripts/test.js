
if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

var requirejs = require('requirejs');
requirejs.config({
    baseUrl: __dirname,
    nodeRequire: require
});

requirejs(["../components/doctrine/doctrine.js"], function(doctrine) {
	GLOBAL.doctrine = doctrine;

	requirejs(["plugins/esprima/esprimaJsContentAssist"], function(mEsprimaPlugin) {

		function MockIndexer(globalDeps, amdDeps) {
			function createSummary(buffer, name) {
				var esprimaContentAssistant = new mEsprimaPlugin.EsprimaJavaScriptContentAssistProvider();
				return esprimaContentAssistant.computeSummary(buffer, name);
			}

			var processedGlobalDeps = [];
			for (var name in globalDeps) {
				if (globalDeps.hasOwnProperty(name)) {
					processedGlobalDeps.push(createSummary(globalDeps[name], name));
				}
			}

			this.retrieveGlobalSummaries = function() {
				return processedGlobalDeps;
			};

			this.retrieveSummary = function(name) {
				return amdDeps ? createSummary(amdDeps[name], name) : null;
			};
		}

		function computeContentAssist(buffer, prefix, indexer) {
			var esprimaContentAssistant = new mEsprimaPlugin.EsprimaJavaScriptContentAssistProvider(indexer);
			if (!prefix) {
				prefix = "";
			}
			var offset = buffer.indexOf("/**/");
			if (offset < 0) {
				offset = buffer.length;
			}
			return esprimaContentAssistant.computeProposals(buffer, offset, {prefix : prefix, inferredOnly : true});
		}

		function testProposal(proposal, text, description) {
			assert.equal(proposal.proposal, text, "Invalid proposal text");
			if (description) {
				assert.equal(proposal.description, description, "Invalid proposal description");
			}
		}

		function stringifyExpected(expectedProposals) {
			var text = "";
			for (var i = 0; i < expectedProposals.length; i++)  {
				text += expectedProposals[i][0] + " : " + expectedProposals[i][1] + "\n";
			}
			return text;
		}

		function stringifyActual(actualProposals) {
			var text = "";
			for (var i = 0; i < actualProposals.length; i++) {
				text += actualProposals[i].proposal + " : " + actualProposals[i].description + "\n";
			}
			return text;
		}

		function testProposals(actualProposals, expectedProposals) {

			assert.equal(actualProposals.length, expectedProposals.length,
				"Wrong number of proposals.  Expected:\n" + stringifyExpected(expectedProposals) +"\nActual:\n" + stringifyActual(actualProposals));

			for (var i = 0; i < actualProposals.length; i++) {
				testProposal(actualProposals[i], expectedProposals[i][0], expectedProposals[i][1]);
			}
		}






		var result = computeContentAssist(
				"aa", "aa", new MockIndexer(
				{
					first: "var aaa = 9",
					second: "var aab = 9"
				}));

		console.log(result);


	});



});
