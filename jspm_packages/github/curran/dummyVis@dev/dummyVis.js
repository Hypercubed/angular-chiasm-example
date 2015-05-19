/* */ 
"format es6";
// This module implements a dummy visualization that is intended
// to show how to create a simple Chiasm plugin using D3.
//
// Draws from previous work found at
// https://github.com/curran/phd/blob/gh-pages/prototype/src/dummyVis.js
// https://github.com/curran/model-contrib/blob/gh-pages/modules/dummyVis.js
//
// Created by Curran Kelleher May 2015

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = DummyVis;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _d3 = require('d3');

var _d32 = _interopRequireDefault(_d3);

var _model = require('model');

var _model2 = _interopRequireDefault(_model);

function DummyVis(chiasm) {

  var model = (0, _model2['default'])({
    publicProperties: [

    // The background color, a CSS color string.
    'color',

    // The string that gets displayed in the center of the box.
    'text',

    // The width in pixels of lines for the X.
    'lineWidth',

    // The relative size of this component, used by the layout plugin.
    'size'],

    color: 'white',
    text: '',
    lineWidth: 8,
    size: 1
  });

  // Append an SVG to the chiasm container.
  // Use CSS `position: absolute;` so setting `left` and `top` CSS
  // properties later will position the SVG relative to containing div.

  // TODO refactor the Chiasm layout plugin such that it creates a DIV for each
  // component and sets that as model.container.
  var svg = _d32['default'].select(chiasm.container).append('svg').style('position', 'absolute');

  // Add a background rectangle to the SVG.
  // The location of the rect will be fixed at (0, 0)
  // with respect to the containing SVG.
  var rect = svg.append('rect').attr('x', 0).attr('y', 0);

  // Add a text element to the SVG,
  // which will render the `text` model property.
  var text = svg.append('text').attr('font-size', '7em').attr('text-anchor', 'middle').attr('alignment-baseline', 'middle');

  // Make the X lines draggable. This shows how to add
  // interaction to visualization modules.
  var lineDrag = (function () {
    var x1, x2;
    return _d32['default'].behavior.drag().on('dragstart', function (d) {
      x1 = _d32['default'].event.sourceEvent.pageX;
    }).on('drag', function (d) {
      var x2 = _d32['default'].event.sourceEvent.pageX,
          newLineWidth = model.lineWidth + x2 - x1;
      newLineWidth = newLineWidth < 1 ? 1 : newLineWidth;

      // dragging updates the `lineWidth` model property,
      // which is visible to other visualizations in the chiasm.
      model.lineWidth = newLineWidth;
      x1 = x2;
    });
  })();

  // Update the color and text based on the model.
  model.when('color', function (color) {
    rect.attr('fill', color);
  });

  // Update the text based on the model.
  model.when('text', text.text, text);

  // When the size of the visualization is set
  // by the chiasm layout engine,
  // TODO refactor Chiasm layout plugin to use containerWidth and containerHeight
  // rather than box, so width and height changes can be handled independently.
  model.when('box', function (box) {

    // Set the CSS `left` and `top` properties to move the
    // SVG to `(box.x, box.y)` relative to its container.
    svg.style('left', box.x + 'px').style('top', box.y + 'px');

    // Set the size of the SVG and background rect.
    svg.attr('width', box.width).attr('height', box.height);
    rect.attr('width', box.width).attr('height', box.height);

    // Update the text label to be centered.
    text.attr('x', box.width / 2).attr('y', box.height / 2);
  });

  // Update the X lines whenever either
  // the `box` or `lineWidth` model properties change.
  model.when(['box', 'lineWidth'], function (box, lineWidth) {
    var w = box.width,
        h = box.height,
        lines = svg.selectAll('line').data([{ x1: 0, y1: 0, x2: w, y2: h }, { x1: 0, y1: h, x2: w, y2: 0 }]);
    lines.enter().append('line');
    lines.attr('x1', function (d) {
      return d.x1;
    }).attr('y1', function (d) {
      return d.y1;
    }).attr('x2', function (d) {
      return d.x2;
    }).attr('y2', function (d) {
      return d.y2;
    }).style('stroke-width', lineWidth).style('stroke-opacity', 0.2).style('stroke', 'black').call(lineDrag);
  });

  // Clean up the DOM elements when the component is destroyed.
  model.destroy = function () {
    chiasm.container.removeChild(svg.node());
  };

  return model;
}

;
module.exports = exports['default'];
