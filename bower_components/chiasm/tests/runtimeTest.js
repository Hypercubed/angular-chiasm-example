// This file contains tests for the top level Chiasm module.
//
// Draws from previous work found at
// https://github.com/curran/reactivis/blob/gh-pages/tests/reactivisTest.js
// https://github.com/curran/overseer/blob/master/tests/overseerTests.js
//
// Created by Curran Kelleher Feb 2015

// Use the "expect" assert style.
// See http://chaijs.com/guide/styles/
var expect = require("chai").expect,

    // Use JSDOM for DOM manipulation in Node.
    // https://github.com/tmpvar/jsdom#creating-a-browser-like-window-object
    document = require("jsdom").jsdom(),
    requireJS = require("./configureRequireJS.js"),
    Chiasm = requireJS("chiasm"),
    Model = requireJS("model");

// The simplest possible plugin just returns a model (using model.js).
function SimplestPlugin(){
  return Model();
}

// Defining "publicProperties" allows changes to be propagated from
// components (instances of the plugin) to the configuration.
function SimplePlugin(){
  return Model({
    publicProperties: ["message"],
    message: Model.None
  });
}

function PointPlugin(){
  return Model({
    publicProperties: ["x", "y"],
    x: 0,
    y: 0
  });
}

// This plugin is invalid because no default property values are provided.
// Default values must be explicit, because the runtime engine must know
// what values to use when the property is "unset" - when the property is
// removed from the component state configuration.
function InvalidPlugin(){
  return Model({
    publicProperties: ["message"]
  });
}

// Demonstrates having default values for public properties.
function SimplePluginWithDefaults(){
  return Model({
    publicProperties: ["x", "y"],
    x: 5,
    y: 10
  });
}

// This plugin demonstrates basic use of the DOM.
// Notice that the chiasm instance is passed into the plugin,
// and the chiasm has its own container DOM element, `chiasm.container`,
// that components can access.
function DOMPlugin(chiasm){
  var model = Model({
        publicProperties: ["message"],
        message: ""
      }),
      div = document.createElement("div");
  
  chiasm.container.appendChild(div);

  model.when("message", function(message){
    div.innerHTML = message;
  });

  model.destroy = function(){
    chiasm.container.removeChild(div);
  };
  
  return model;
}

describe("chiasm", function () {

  it("create a component via setConfig(config)", function(done) {

    // Create a new Chiasm instance by invoking the constructor function.
    var chiasm = Chiasm();

    // Assign the plugin this way so the runtime does not
    // try to load it dynamically using RequireJS.
    chiasm.plugins.simplestPlugin = SimplestPlugin;
    
    // Set the Chiasm configuration.
    chiasm.setConfig({
      foo: {
        plugin: "simplestPlugin"
      }
    });

    // Get the component created by the plugin.
    chiasm.getComponent("foo").then(function(foo){

      // Make sure the component exists.
      expect(foo).to.exist();

      done();
    });
  });

  it("the promise returned by setConfig(config) should resolve", function(done) {
    var chiasm = Chiasm();

    chiasm.plugins.simplestPlugin = SimplestPlugin;
    
    // setConfig returns a promise that is resolved after the
    // configuration has been fully loaded.
    var promise = chiasm.setConfig({
      foo: {
        plugin: "simplestPlugin"
      }
    });
    
    promise.then(function(){
      chiasm.getComponent("foo").then(function(foo){
        expect(foo).to.exist();
        done();
      });
    });
  });

  it("setConfig(config) should report an error from RequireJS if a plugin doesn't load", function(done) {
    var chiasm = Chiasm();

    chiasm.plugins.simplestPlugin = SimplestPlugin;
    
    // setConfig returns a promise that handles errors.
    var promise = chiasm.setConfig({
      foo: {
        plugin: "nonexistentPlugin"
      }
    });
    
    promise.then(function(){}, function(err){
      expect(err.message).to.equal("Tried loading \"nonexistentPlugin\" at ./nonexistentPlugin.js then tried node's require(\"nonexistentPlugin\") and it failed with error: Error: Cannot find module 'nonexistentPlugin'");
      done();
    });
  });

  it("create a component via chiasm.config = config", function(done) {
    var chiasm = Chiasm();

    chiasm.plugins.simplestPlugin = SimplestPlugin;
    
    chiasm.config = {
      foo: {
        plugin: "simplestPlugin"
      }
    };

    chiasm.getComponent("foo").then(function(foo){
      expect(foo).to.exist();
      done();
    });
  });

  it("report error when attempting to set a property without a default value", function(done) {
    var chiasm = Chiasm();
    chiasm.plugins.simplestPlugin = SimplestPlugin;
    
    chiasm.setConfig({
      foo: {
        plugin: "simplestPlugin",
        state: {
          message: "Hello"
        }
      }
    }).catch(function(err){
      expect(err.message).to.equal("Default value for public property 'message' " +
                                   "not specified for component with alias 'foo'.");
      done();
    });
  });

  it("create a component, set state with a single property", function(done) {
    var chiasm = Chiasm();
    chiasm.plugins.simplePlugin = SimplePlugin;
    
    chiasm.config = {
      foo: {
        plugin: "simplePlugin",
        state: {
          message: "Hello"
        }
      }
    };

    chiasm.getComponent("foo").then(function(foo){
      expect(foo).to.exist();
      foo.when("message", function(message){
        expect(message).to.equal("Hello");
        done();
      });
    });
  });

  it("create a component, set state with two properties", function(done) {
    var chiasm = Chiasm();
    chiasm.plugins.pointPlugin = PointPlugin;
    
    chiasm.config = {
      foo: {
        plugin: "pointPlugin",
        state: {
          x: 5,
          y: 10
        }
      }
    };

    chiasm.getComponent("foo").then(function(foo){
      expect(foo).to.exist();
      foo.when(["x", "y"], function(x, y){
        expect(x).to.equal(5);
        expect(y).to.equal(10);
        done();
      });
    });
  });

  it("propagate changes from config to components", function(done) {
    var chiasm = Chiasm();
    chiasm.plugins.pointPlugin = PointPlugin;
    
    chiasm.config = {
      foo: {
        plugin: "pointPlugin",
        state: {
          x: 5
        }
      }
    };

    chiasm.getComponent("foo").then(function(foo){
      foo.when(["x"], function(x){
        expect(x).to.equal(5);
        chiasm.config = {
          foo: {
            plugin: "pointPlugin",
            state: {
              x: 5,
              y: 10
            }
          }
        };
        foo.when(["y"], function(y){
          expect(y).to.equal(10);
          done();
        });
      });
    });
  });

  it("propagate changes from components to config (using 'publicProperties')", function(done) {
    var chiasm = Chiasm();
    chiasm.plugins.simplePlugin = SimplePlugin;
    
    chiasm.config = {
      foo: {
        plugin: "simplePlugin",
        state: {
          message: "Hello"
        }
      }
    };

    chiasm.getComponent("foo").then(function(foo){
      chiasm.when("config", function(config) {
        if(foo.message === "Hello"){
          foo.message = "World";
        } else {
          expect(config.foo.state.message).to.equal("World");
          done();
        }
      });
    });
  });

  it("append a component DOM node to the Chiasm container", function(done) {
    var container = document.createElement("div");
    var chiasm = Chiasm(container);

    chiasm.plugins.domPlugin = DOMPlugin;
    
    chiasm.config = {
      foo: {
        plugin: "domPlugin",
        state: {
          message: "Hello"
        }
      }
    };

    chiasm.getComponent("foo").then(function(foo){
      expect(container).to.exist();
      expect(container.children.length).to.equal(1);

      foo.when("message", function(message){
        expect(message).to.equal("Hello");
        expect(container.children[0].innerHTML).to.equal("Hello");
        done();
      });
    });
  });

  it("clean up DOM node when component destroyed", function(done) {
    var chiasm = Chiasm(document.createElement("container"));
    chiasm.plugins.domPlugin = DOMPlugin;
    
    chiasm.config = {
      foo: {
        plugin: "domPlugin",
        state: {
          message: "Hello"
        }
      }
    };

    chiasm.when("config", function(config){
      if("foo" in config){
        chiasm.getComponent("foo").then(function(foo){
          expect(chiasm.container).to.exist();
          expect(chiasm.container.children.length).to.equal(1);

          // Removing "foo" from the config should cause its
          // destroy() method to be invoked.
          chiasm.config = {};
        });
      } else {

        // Use setTimeout here to queue the test to run AFTER
        // the config update has been processed. This is necessary because
        // config update processing is done on an async queue.
        setTimeout(function(){

          // Test that foo.destroy() removed foo's container.
          expect(chiasm.container.children.length).to.equal(0);

          // Test that the component has been removed internally.
          expect(chiasm.componentExists("foo")).to.equal(false);

          done();
        },0);
      }
    });
  });

  it("do not propagate from component to config after component destroyed", function(done) {
    var chiasm = Chiasm();
    chiasm.plugins.simplePlugin = SimplePlugin;
    
    chiasm.config = {
      foo: {
        plugin: "simplePlugin",
        state: {
          message: "Hello"
        }
      }
    };

    chiasm.getComponent("foo").then(function(foo){
      chiasm.when("config", function(config){
        if("foo" in config){
          expect(config.foo.state.message).to.equal("Hello");
          chiasm.config = {};
        } else {
          foo.message = "World";
          setTimeout(done, 0);
        }
      });
    });
  });

  it("propagate from component to config when config state is undefined", function(done) {
    // This tests that the "state" property is automatically created in the config
    // before it is populated with the updated state property
    // when propagating changes from components to the config.
    var chiasm = Chiasm();
    chiasm.plugins.simplePlugin = SimplePlugin;
    
    chiasm.config = {
      foo: {
        plugin: "simplePlugin"
      }
    };

    chiasm.getComponent("foo").then(function(foo){
      foo.message = "Hello";

      setTimeout(function(){
        expect(chiasm.config.foo.state.message).to.equal("Hello");
        done();
      }, 0);
    });
  });

  it("should not propagate from component to config for defaults", function(done) {
    var chiasm = Chiasm();

    chiasm.plugins.simplePluginWithDefaults = SimplePluginWithDefaults;
    
    chiasm.config = {
      foo: {
        plugin: "simplePluginWithDefaults"
      }
    };

    var invocations = 0;
    chiasm.when("config", function(config){
      invocations++;
      expect(invocations).to.equal(1);
      setTimeout(done, 10);
    });
  });

  it("should unset a property, restoring default value", function(done) {
    var chiasm = Chiasm();
    chiasm.plugins.simplePluginWithDefaults = SimplePluginWithDefaults;
    
    chiasm.config = {
      foo: {
        plugin: "simplePluginWithDefaults",
        state: {
          x: 50
        }
      }
    };

    chiasm.getComponent("foo").then(function(foo){
      expect(foo).to.exist();
      foo.when("x", function(x){
        if(x === 50){
          chiasm.config = {
            foo: {
              plugin: "simplePluginWithDefaults",
              state: { }
            }
          };
        } else {
          expect(x).to.equal(5);
          done();
        }
      });
    });
  });

  it("should unset a property, setting None if default is None", function(done) {
    var chiasm = Chiasm();
    chiasm.plugins.simplePlugin = SimplePlugin;
    
    chiasm.setConfig({
      foo: {
        plugin: "simplePlugin",
        state: {
          message: "Hello"
        }
      }
    }).then(function (){
      chiasm.getComponent("foo").then(function(foo){
        expect(foo).to.exist();
        expect(foo.message).to.equal("Hello");
        chiasm.setConfig({
          foo: {
            plugin: "simplePlugin",
            state: { }
          }
        }).then(function(){
          expect(foo.message).to.equal(Model.None);
          done();
        });
      });
    });
  });

  it("should throw an error when no public property default is provided", function(done) {
    var chiasm = Chiasm();
    chiasm.plugins.invalidPlugin = InvalidPlugin;

    chiasm.setConfig({
      foo: {
        plugin: "invalidPlugin",
        state: { }
      }
    }).catch(function(err){
      expect(err.message).to.equal("Default value for public property 'message' not specified for component with alias 'foo'.");
      done();
    });
  });

  it("should change a plugin", function(done) {
    var chiasm = Chiasm();
    chiasm.plugins.pluginA = function(){
      return Model({
        pluginName: "A"
      });
    };

    chiasm.plugins.pluginB = function(){
      return Model({
        pluginName: "B"
      });
    };
    
    chiasm.config = {
      foo: {
        plugin: "pluginA"
      }
    };

    chiasm.getComponent("foo").then(function(foo){
      expect(foo.pluginName).to.equal("A");
      chiasm.setConfig({
        foo: {
          plugin: "pluginB"
        }
      }).then(function(){
        chiasm.getComponent("foo").then(function(foo){
          expect(foo.pluginName).to.equal("B");
          done();
        });
      });
    });
  });

  it("should change a plugin and transfer properties", function(done) {
    var chiasm = Chiasm();

    var config1 = {
      chart: {
        plugin: "barChart",
        state: { markColumn: "browser", sizeColumn: "popularity" }
      }
    };

    var config2 = {
      chart: {
        plugin: "pieChart",
        state: { markColumn: "browser", sizeColumn: "popularity" }
      }
    };

    chiasm.plugins.barChart = function(){
      return Model({
        pluginName: "barChart",
        publicProperties: ["markColumn", "sizeColumn"],
        markColumn: Model.None,
        sizeColumn: Model.None
      });
    };

    chiasm.plugins.pieChart = function(){
      return Model({
        pluginName: "pieChart",
        publicProperties: ["markColumn", "sizeColumn"],
        markColumn: Model.None,
        sizeColumn: Model.None
      });
    };

    chiasm.config = config1;
    
    chiasm.getComponent("chart").then(function(chart1){

      expect(chart1.pluginName).to.equal("barChart");
      expect(chart1.markColumn).to.equal("browser");
      expect(chart1.sizeColumn).to.equal("popularity");

      chiasm.setConfig(config2).then(function(){
        chiasm.getComponent("chart").then(function(chart2){
          expect(chart2.pluginName).to.equal("pieChart");
          expect(chart2.markColumn).to.equal("browser");
          expect(chart2.sizeColumn).to.equal("popularity");
          done();
        });
      });
    });
  });

  it("should report an error when timeout exceeded in getComponent", function(done) {
    var chiasm = Chiasm();

    // Set the timeout to 100ms so this test passes quickly.
    chiasm.timeout = 100;
    
    chiasm.getComponent("chart").catch(function(err){
      expect(err).to.exist();
      expect(err.message).to.equal("Component with alias 'chart' does not exist after timeout of 0.1 seconds exceeded.");
      done();
    });
  });
});
