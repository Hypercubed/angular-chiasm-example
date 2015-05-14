(function(){

  require.config({
    shim: {
      angular: {
        exports: 'angular'
      },
      'angular-route': ['angular'],
    },
    paths: {
      inlet: '../bower_components/Inlet/inlet',
      angular: '../bower_components/angular/angular',
      'angular-animate': '../bower_components/angular-animate/angular-animate',
      'angular-cookies': '../bower_components/angular-cookies/angular-cookies',
      'angular-mocks': '../bower_components/angular-mocks/angular-mocks',
      'angular-resource': '../bower_components/angular-resource/angular-resource',
      'angular-route': '../bower_components/angular-route/angular-route',
      'angular-sanitize': '../bower_components/angular-sanitize/angular-sanitize',
      'angular-touch': '../bower_components/angular-touch/angular-touch',
      async: '../bower_components/async/lib/async',
      bootstrap: '../bower_components/bootstrap/dist/js/bootstrap',
      chiasm: '../bower_components/chiasm/src/chiasm',
      codemirror: '../bower_components/codemirror/',
      d3: '../bower_components/d3/d3',
      model: '../bower_components/model/dist/model',
      layout: '../bower_components/chiasm/src/plugins/layout',
      computeLayout: '../bower_components/chiasm/src/plugins/computeLayout',
      configEditor: '../bower_components/chiasm/src/plugins/configEditor',
      csvLoader: '../bower_components/chiasm/src/plugins/csvLoader',
      links: '../bower_components/chiasm/src/plugins/links',
      reactivis: '../bower_components/chiasm/src/plugins/reactivis',
      barChart: '../bower_components/chiasm/src/plugins/barChart',
      lineChart: '../bower_components/chiasm/src/plugins/lineChart',
      scatterPlot: '../bower_components/chiasm/src/plugins/scatterPlot',
      jquery: '../bower_components/jquery/dist/jquery',
      lodash: '../bower_components/lodash/lodash',
      requirejs: '../bower_components/requirejs/require'
    },
    packages: [

    ]
  });

})();
