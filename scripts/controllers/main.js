'use strict';

//define(['angular','chiasm','d3'], function(angular, Chiasm) {

  //import {angular}

  import angular from 'angular';
  import Chiasm from 'chiasm';

  import 'codemirror/lib/codemirror.css!';
  import 'inlet/inlet.css!';

  var path = "scripts/chiasm-ks/";

  //import 'scripts/chiasm-ks/axes.css!';

  export default angular.module('main',[])
    .controller('MainCtrl', function ($http) {

      var chiasm = Chiasm(document.getElementById("container"));

      var main = this;

      main.configName = 'configDummyVis';

      main.data = [
        { name: 'configDummyVis', label: 'Dummy Vis' },
        { name: 'configBarChart', label: 'Bar Chart' },
        { name: 'configLineChart', label: 'Line Chart' },
        { name: 'configBarLineEditor', label: 'Bar Chart and Line Chart With Editor' },
        { name: 'configBarLineEditor2', label: 'Bar Chart and Line Chart With Editor 2' },
        { name: 'configBarLineEditor3', label: 'Bar Chart and Line Chart With Editor 3' },
        { name: 'configScatterPlot', label: 'Scatter Plot' },
        { name: 'configScatterPlot2', label: 'Scatter Plot 2' },
        { name: 'configScatterPlot3', label: 'Scatter Plot 3' },
        { name: 'configScatterPlot4', label: 'Scatter Plot 4' },
        { name: 'configScatterPlot5', label: 'Scatter Plot 5' },
        { name: 'configScatterPlot6', label: 'Scatter Plot 6' },
        { name: 'configScatterPlot7', label: 'Scatter Plot 7' },
        { name: 'configScatterPlot8', label: 'Scatter Plot 8' }
      ];

      main.getConfig = function getConfig(config) {
        $http.get(path+config+'.json').then(function(response) {
          //console.log(response.data);
          chiasm.config = response.data;
        });
      };

      main.getConfig(main.configName);

    });

//});
