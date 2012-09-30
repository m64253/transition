/*jshint smarttabs: true*/
(function (root) {
	"use strict";
	
	var win = root.window,
		doc = win.document,
		setTimeout = win.setTimeout,
		
		
		/**
		 * Poor mans cross browser function
		 * 
		 * @static
		 * @class transition
		 * @param {HTMLElement} el
		 * @param {Object} css
		 * @params {Object} [options]
		 * @return {HTMLElement}
		 */
		transition = root.transition = function (el, css, options) {
			
			options = options || {};
			
			var onTransitionEnd = function (e) {
					if (e.target === el) {
						el.removeEventListener(transition.eventName, onTransitionEnd, false);
						
						el.style[transition.propertyName] = null;
						el.style[transition.durationName] = null;
						el.style[transition.delayName] = null;
						el.style[transition.timingName] = null;
						
						if (options.callback) {
							options.callback();
						}
					}
				},
				property,
				i,
				len,
				properties = [];
			
			for(property in css) {
				if (css.hasOwnProperty(property)) {
					properties.push(property);
				}
			}
			
			if (transition.supported) {
				el.style[transition.propertyName] = properties.join(', ');
				el.style[transition.durationName] = (options.duration || 1000) + 'ms';
				el.style[transition.delayName] = (options.delay || 0) + 'ms';
				el.style[transition.timingName] = options.timing || 'linear';
				
				el.addEventListener(transition.eventName, onTransitionEnd, false);
				
			} else if (options.callback) {
				setTimeout(options.callback, 0);
			}
			
			for(i = 0, len = properties.length; i < len; i += 1) {
				property = properties[i];
				el.style[property] = css[property];
			}
			
			return el;
		};
		
	transition.supported = false;
	transition.propertyName = null;
	transition.durationName = null;
	transition.eventName = null;
	
	(function () {
		var testEl = doc.createElement('div'),
			stylePrefixes = {
				'webkit'	: 'webkitTransition',
				'moz'		: 'MozTransition',
				'o'			: 'OTransition',
				'ms'		: 'msTransition',
				''			: 'transition'
			},
			events = {
				'webkit'	: 'webkitTransitionEnd',
				'moz'		: 'transitionend',
				'o'			: 'OTransitionEnd',
				'ms'		: 'msTransitionEnd',
				''			: 'transitionend'
			},
			styleProperty,
			vendor;
		
		for (vendor in stylePrefixes) {
			if (stylePrefixes.hasOwnProperty(vendor)) {
				styleProperty = stylePrefixes[vendor];
				
				if (testEl.style[styleProperty] !== undefined) {
					transition.supported = true;
					
					transition.propertyName = styleProperty + 'Property';
					transition.durationName = styleProperty + 'Duration';
					transition.timingName = styleProperty + 'TimingFunction';
					transition.delayName = styleProperty + 'Delay';
					
					transition.eventName = events[vendor];
					
					break;
				}
			}
		}
	}());
}(this));