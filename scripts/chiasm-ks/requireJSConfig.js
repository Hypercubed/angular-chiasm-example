// This is the RequireJS configuration that sets up module paths.
//
// This file is documented here:
// http://requirejs.org/docs/api.html#config
//
// Curran Kelleher March 2015
(function(){

  var bowerPath = "bower_components/";

  // Use a fixed version of Chiasm, which provides the visualization runtime.
  //var chiasmPath = "//curran.github.io/cdn/chiasm-v0.1.6/src/";

  // Here's how to can use a local development version
  // if this Gist is cloned into a sibling directory to the chiasm repo.
  var chiasmPath = bowerPath + "chiasm/src/";

  var plugins = chiasmPath + "plugins/";

  requirejs.config({

    // Set up paths for Bower dependencies.
    // Uses github.com/curran/cdn
    paths: {

      // Set up the Chiasm path.
      // https://github.com/curran/chiasm
      chiasm: chiasmPath + "chiasm",

      // Configure paths for Chiasm pluginss.
      layout: plugins + "layout",
      computeLayout: plugins + "computeLayout",
      configEditor: plugins + "configEditor",
      csvLoader: plugins + "csvLoader",
      links: plugins + "links",
      reactivis: plugins + "reactivis",
      barChart: plugins + "barChart",
      lineChart: plugins + "lineChart",
      scatterPlot: plugins + "scatterPlot",

      // Visualization library.
      // http://d3js.org/
      d3: bowerPath + "d3/d3",

      // Reactive model library.
      // https://github.com/curran/model
      model: bowerPath + "model/dist/model",

      // Functional programming utilities.
      // http://benmccormick.org/2014/11/12/underscore-vs-lodash/
      lodash: bowerPath + "lodash/lodash",

      // Asynchronous control flow.
      // https://github.com/caolan/async
      async: bowerPath + "async/lib/async",

      // Syntax-highlighted text editor for code.
      // http://codemirror.net/
      codemirror: bowerPath + "codemirror",

      // Provides interactive color picker and slider for CodeMirror.
      // https://github.com/enjalot/Inlet.git
      inlet: bowerPath + "inlet/inlet"
    }
  });
})();
