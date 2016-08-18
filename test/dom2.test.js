import React from 'react';
import {findDOMNode, render} from 'react-dom';
import jsdom from 'jsdom';
import TestUtils from 'react-addons-test-utils';
import {expect} from 'chai';
import axeCore from 'axe-core';
// import a11yHelper from "./a11yHelper";

import App from '../app/components/App';

describe('DOM Rendering', function (done) {

  it('When click the Todo item，it should become done', function () {
    const app = TestUtils.renderIntoDocument(<App/>);
    const appDOM = findDOMNode(app);
    const todoItem = appDOM.querySelector('li:first-child span');
    let isDone = todoItem.classList.contains('todo-done');
    TestUtils.Simulate.click(todoItem);
    expect(todoItem.classList.contains('todo-done')).to.be.equal(!isDone);
    // make the item returns to previous state
    TestUtils.Simulate.click(todoItem);
  });

  it('Has no accessibility errors', function(done) {
    this.timeout(35000);

    let div = document.createElement('div');
    document.body.appendChild(div);

    const app = render(<App/>, div);
    let node = findDOMNode(app);

    var oldNode = global.Node;
    
    global.Node = node.ownerDocument.defaultView.Node;

    axeCore.a11yCheck(node, function(results) {
 //      global.Node = oldNode;

      console.log('before expect');
    
      expect(results.violations.length).to.equal(0);

      console.log('after expect');
      
      // document.body.removeChild(div);

      done();
    });

  });
});

