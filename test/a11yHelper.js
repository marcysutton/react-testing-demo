import {findDOMNode} from 'react-dom';
import {mount} from 'enzyme';
import {inspect} from 'util';
import axeCore from 'axe-core';

var a11yHelper = {};

// help the parser out by prematurely defining the detach function
a11yHelper.wrapper = {
	detach: function() {}
};

a11yHelper.init = function(attachToElement) {
	this.attachToElement = attachToElement;

	beforeEach(function() {
		attachToElement.appendChild(document.createElement('div'));
	});
	afterEach(function() {
		a11yHelper.wrapper.detach();
	});
}  

a11yHelper.testEnzymeComponent = function (app, cb) {
	this.wrapper = mount(app, { attachTo: this.attachToElement.firstChild });
	let node = findDOMNode(this.wrapper.component);

	var oldNode = global.Node;
	global.Node = node.ownerDocument.defaultView.Node;

	axeCore.a11yCheck(node, function(results) {
		global.Node = oldNode;

		// output some useful information
		let failureNotice = '';
		if (results.violations.length > 0) {
			failureNotice += 'Accessibility violations:\n';
			results.violations.forEach(function(violation) {
				failureNotice += violation.description + '\n';
				failureNotice += 'HTML Nodes: \n';
				violation.nodes.forEach(function(node) {
					failureNotice += node.html + '\n';
				});
			});
			console.log(failureNotice);
		}
		// return to the test expectation
		cb(results);
	});
}

module.exports = a11yHelper;
