/*globals module, setTimeout, clearTimeout */
(function (root) {
	"use strict";
	
	
	var win = root.window,
		doc = win.document,
		setTimeout = win.setTimeout,
		
		
		/** 
		 * @param {String} property
		 * @returns {string}
		 */
		normalizeCSSPropertyName = function (property) {
			return property.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^(ms|webkit|mos|o)\-/, '-$1-');
		},
		
		
		/**
		 * Poor mans cross browser transition function
		 *
		 * @param {HTMLElement} el
		 * @param {Object} css
		 * @params {Object} [options]
		 * @return {HTMLElement}
		 */	
		transition = root.transition = function (el, css, options) {
			options = options || {};
			
			var isVisible = el.offsetWidth > 0 || el.offsetParent !== null,
				done = function () {
					var property;
					
					if (options.reset || options.clear) {
						for (property in css) {
							if (css.hasOwnProperty(property)) {
								el.style[property] = "";
							}
						}
					}
					
					if (options.after) {
						options.after();
					}
					if (options.callback) {
						options.callback();
					}
				},
				onTransitionEnd = function (e) {
					if (e.target === el) {
						el.removeEventListener(transition.eventName, onTransitionEnd, false);
						
						if (!css.hasOwnProperty(transition.transformPropertyName)) {
							el.style[transition.transformPropertyName] = "";
						}
						
						el.style[transition.propertyName] = "";
						el.style[transition.durationName] = "";
						el.style[transition.delayName] = "";
						el.style[transition.easingName] = "";
						
						done();
					}
				},
				property,
				properties = [],
				cssPropertyName,
				computedStyleValue;
			
			if (transition.supported && isVisible) {
				for (property in css) {
					if (css.hasOwnProperty(property)) {
						cssPropertyName = normalizeCSSPropertyName(property);
						properties.push(cssPropertyName);
					}
				}
				
				el.style[transition.propertyName] = properties.join(', ');
				el.style[transition.durationName] = (options.duration || 1000) + 'ms';
				el.style[transition.delayName] = (options.delay || 0) + 'ms';
				el.style[transition.easingName] = options.easing || 'linear';
				
				el.addEventListener(transition.eventName, onTransitionEnd, false);
				
			} else {
				setTimeout(done, 0);
			}
			
			if (options.before) {
				options.before();
			}
			
			for (property in css) {
				if (css.hasOwnProperty(property)) {
					el.style[property] = css[property];
				}
			}
			
			return el;
		};
	
	
	/**
	 * Do a transform translate3d transition
	 *
	 * @param {HTMLElement} el
	 * @param {Array} value
	 * @param {Object} [options]
	 */
	transition.translate3d = function (el, value, options) {
		var css = options && options.css || {};
		
		if (transition.transformPropertyName) {
			css[transition.transformPropertyName] = 'translate3d(' + value.join(', ') + ')';
		} else {
			css.left = value[0];
			css.top = value[1];
		}
		
		return transition(el, css, options);
	};
	
	
	/**
	 * Do a transform translate transition
	 *
	 * @param {HTMLElement} el
	 * @param {String} left
	 * @param {String} top
	 * @param {Object} [options]
	 */
	transition.translate = function (el, left, top, options) {
		var css = options && options.css || {};
		
		if (transition.transformPropertyName) {
			css[transition.transformPropertyName] = 'translate(' + left + ', ' + top + ')';
		} else {
			css.left = left;
			css.top = top;
		}
		
		return transition(el, css, options);
	};
	
	
	transition.supported = false;
	transition.vendor = '';
	transition.propertyName = null;
	transition.durationName = null;
	transition.eventName = null;
	transition.transformPropertyName = null;
	
	
	/**
	 * @param {String} property
	 * @returns {String}
	 */
	transition.prefix = function (property) {
		if (transition.vendor) {
			property = transition.vendor + property.substr(0, 1).toUpperCase() + property.substr(1, property.length);
		}
		return property;
	};
	
	
	// Test what is supported
	if (typeof module !== 'undefined' && module.exports) {
		module.transition = transition;
		
	} else {
		(function () {
			var testEl = doc.createElement('div'),
				stylePrefixes = {
					'webkit'	: 'webkitTransition',
					'Moz'		: 'MozTransition',
					'o'			: 'OTransition',
					'ms'		: 'msTransition',
					''			: 'transition'
				},
				events = {
					'webkit'	: 'webkitTransitionEnd',
					'Moz'		: 'transitionend',
					'o'			: 'OTransitionEnd',
					'ms'		: 'transitionend',
					''			: 'transitionend'
				},
				styleProperty,
				vendor;
			
			for (vendor in stylePrefixes) {
				if (stylePrefixes.hasOwnProperty(vendor)) {
					styleProperty = stylePrefixes[vendor];
					
					if (testEl.style[styleProperty] !== undefined) {
						transition.supported = true;
						transition.vendor = vendor;
						transition.propertyName = styleProperty + 'Property';
						transition.durationName = styleProperty + 'Duration';
						transition.easingName = styleProperty + 'TimingFunction';
						transition.delayName = styleProperty + 'Delay';
						transition.eventName = events[vendor];
						transition.transformPropertyName = vendor ? vendor + 'Transform' : 'transform';
						break;
					}
				}
			}
		}());
		
		
		root.transition = transition;
	}
}(this));
