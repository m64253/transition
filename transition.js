/*jshint smarttabs: true white:true */
/*globals module, setTimeout, clearTimeout */
(function (root) {
	"use strict";
	
	
	var win = root.window,
		doc = win.document,
		setTimeout = win.setTimeout,
		
		isInDoc = function (el) {
			if (!el.parentNode) {
				return false;
			}
			if (el.parentNode !== doc) {
				return isInDoc(el.parentNode);
			}
			return true;
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
			
			var isAttachedToDOM = isInDoc(el),
				done = function () {
					
					var property;
					if (options.reset) {
						for (property in css) {
							if (css.hasOwnProperty(property)) {
								el.style[property] = null;
							}
						}
					}
					
					if (options.callback) {
						options.callback();
					}
				},
				onTransitionEnd = function (e) {
					if (e.target === el) {
						el.removeEventListener(transition.eventName, onTransitionEnd, false);
						
						if (!css.hasOwnProperty(transition.transformPropertyName)) {
							el.style[transition.transformPropertyName] = null;
						}
						
						el.style[transition.propertyName] = null;
						el.style[transition.durationName] = null;
						el.style[transition.delayName] = null;
						el.style[transition.easingName] = null;
						
						done();
					}
				},
				property,
				properties = [];
			
			
			if (transition.supported && isAttachedToDOM) {
				for (property in css) {
					if (css.hasOwnProperty(property)) {
						properties.push(property.replace(/([A-Z])/g, '-$1').toLowerCase());
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
		var css = {};
		
		if (transition.transformPropertyName) {
			css[transition.transformPropertyName] = 'translate3d(' + value.join(', ') + ')';
		} else {
			css.left = value[0];
			css.top = value[1];
		}
		
		return transition(el, css, options);
	};
	
	
	transition.supported = false;
	transition.propertyName = null;
	transition.durationName = null;
	transition.eventName = null;
	transition.transformPropertyName = null;
	
	
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