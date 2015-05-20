var path = require('path');
var Builder = require('systemjs-builder');

var builder = new Builder();

builder.loadConfig('./dist/system.config.js')
.then(function() {
	// additional config can also be set through `builder.config`
	builder.config({
		baseURL: 'file:' + path.resolve('./app/')
	});

	return builder.build('scripts/app + dummyVis + chiasm/plugins/*', 'dist/scripts/bundle.js', {
	//return builder.build('scripts/app - chiasm + model + lodash + d3 + inlet', 'dist/scripts/bundle.js', {
		minify: true,
		sourceMaps: true,
		meta: {
			chiasm: {
				deps: ['chiasm/plugins/*', 'd3','Inlet']
			}
		}
	});
})
.then(function() {
	console.log('Build complete');
})
.catch(function(err) {
	console.log('Build error');
	console.log(err);
});
