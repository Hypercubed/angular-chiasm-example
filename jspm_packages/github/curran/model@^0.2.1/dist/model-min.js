/* */ 
!function(){function t(t){var n=!1;return function(){n||(n=!0,setTimeout(function(){n=!1,t()},0))}}function n(t){return!t.some(function(t){return"undefined"==typeof t||null===t})}function e(t){if(!(this instanceof e))return new e(t);var n=this;n.$$values={},n.$$listeners={},n.$$trackedProperties={},this.set(t)}function i(t,n,e){n in t.$$trackedProperties||(t.$$trackedProperties[n]=!0,t.$$values[n]=t[n],Object.defineProperty(t,n,{get:function(){return this.$$values[n]},set:function(i){var o=t.$$values[n];this.$$values[n]=i,r(this,n).forEach(function(t){t.call(e,i,o)})}}))}function r(t,n){return t.$$listeners[n]||(t.$$listeners[n]=[])}e.prototype.set=function(t){for(var n in t)this[n]=t[n]},e.prototype.off=function(t,n){this.$$listeners[t]=this.$$listeners[t].filter(function(t){return t!==n})},e.prototype.cancel=function(t){for(var n in this.$$listeners)this.off(n,t)},e.prototype.on=function(t,n,e){e=e||this,r(this,t).push(n),i(this,t,e)},e.prototype.when=function(e,i,r){r=r||this;var o=this;e=e instanceof Array?e:[e];var s=t(function(){var t=e.map(function(t){return o.$$values[t]});n(t)&&i.apply(r,t)});return s(),e.forEach(function(t){o.on(t,s)}),s},e.None="__NONE__","function"==typeof define&&define.amd?define([],function(){return e}):"object"==typeof exports?module.exports=e:this.Model=e}();