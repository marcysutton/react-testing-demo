import React from 'react';
import {findDOMNode, render} from 'react-dom';
import {mount} from 'enzyme';
import {inspect} from 'util';
import axeCore from 'axe-core';

var a11yHelper = {};

a11yHelper.testReactComponent = function(app, cb) {
	let div = document.createElement('div');
	document.body.appendChild(div);
	this.wrapper = render(app, div);

	let node = findDOMNode(div);
	let config = {runOnly: {type: 'rule', values: ['label']}};
	
	this.a11yCheck(node, config, cb);

	document.body.removeChild(div);
}

a11yHelper.testEnzymeComponent = function (app, cb) {
	let div = document.createElement('div');
	document.body.appendChild(div);
	
	let wrapper = mount(app, { attachTo: div });
	let node = findDOMNode(wrapper.component);

	this.a11yCheck(div, node, {}, cb);
	wrapper.detach();
}

a11yHelper.a11yCheck = function(node, config, cb) {
	var oldNode = global.Node;
	global.Node = node.ownerDocument.defaultView.Node;

	axeCore.a11yCheck(node, config, function(results) {
		global.Node = oldNode;

		a11yHelper.report(results);
		
		// return to the test expectation
		cb(results);
	});
}
a11yHelper.report = function(results) {
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
}
module.exports = a11yHelper;
