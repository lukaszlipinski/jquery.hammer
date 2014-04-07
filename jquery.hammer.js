/* jQuery plugin for Hammer.JS - v1.0.6 - 2014-03-28
 * http://eightmedia.github.com/hammer.js
 *
 * Copyright (c) 2014 Jorik Tangelder <j.tangelder@gmail.com>;
 * Licensed under the MIT license
 *
 */

/*
 * Hammer.js jQuery plugin
 *
 * @author Łukasz Lipiński (uzza17@gmail.com)
 * @version 0.2-alpha
 * @license Released under the MIT license
 * @see https://github.com/lukaszlipinski/jquery.hammer
 */
(function(window, undefined) {
	'use strict';

	function setupPlugin(Hammer, $) {
		// provide polyfill for Date.now()
		// browser support: http://kangax.github.io/es5-compat-table/#Date.now
		if (!Date.now) {
			Date.now = function now() {
				return new Date().getTime();
			};
		}

		/**
		 * Bind dom events (this overwrites addEventListener)
		 *
		 * @param {HTMLElement}   element
		 * @param {String}        eventTypes
		 * @param {Function}      handler
		 */
		Hammer.event.bindDom = function(element, eventTypes, handler) {
			$(element).on(eventTypes, function($ev) {
				var data = $ev.originalEvent || $ev;

				var props = ['pageX','pageY','clientX','clientY','target','preventDefault','stopPropagation'];

				Hammer.utils.each(props, function(prop) {
					if (data[prop] === null) {
						data[prop] = $ev[prop];
					}
				});

				// for IE
				if (data.which === undefined) {
					data.which = data.button;
				}

				handler.call(this, data);
			});
		};

		/**
		 * The methods on/off are called by the instance, but with the jquery plugin
		 * we use the jquery event methods instead.
		 *
		 * @this {Hammer.Instance}
		 * @return {jQuery}
		 */
		Hammer.utils.each(['on', 'off'], function(method) {
			Hammer.Instance.prototype[method] = function(types, handler) {
				return $(this.element)[method](types, handler);
			};
		});

		/**
		 * trigger events
		 * this is called by the gestures to trigger an event like 'tap'
		 * @this    {Hammer.Instance}
		 * @param   {String}    gesture
		 * @param   {Object}    eventData
		 * @return  {jQuery}
		 */
		Hammer.Instance.prototype.trigger = function(gesture, eventData) {
			var el = $(this.element);

			if (el.has(eventData.target).length) {
				el = $(eventData.target);
			}

			return el.trigger({
				type : gesture,
				gesture : eventData
			});
		};

		/**
		 * jQuery plugin
		 *
		 * Create instance of Hammer and watch for gestures,
		 * and when called again you can change the options
		 *
		 * @param {Object}    [options={}]
		 * @return {jQuery}
		 */
		var event_names = ['hold', 'tap', 'doubletap', 'transformstart', 'transform', 'transformend', 'dragstart', 'drag', 'dragend', 'swipe', 'release'],
			event_name, i, l = event_names.length;

		for (i = 0; i < l; i++) {
			event_name = event_names[i];

			(function(event_name) {
				$.event.special[event_name] = {
					add : function(e) {
						var $currentTarget = $(this),
							$targets = e.selector ? $currentTarget.find(e.selector) : $currentTarget;

						$targets.each(function(index, el) {
							var hammer = new Hammer(el),
								$el = $(el);

							$el.data("hammer", hammer);

							hammer['on'+ event_name] = (function($el) {
								return function(event) {
									$el.trigger($.Event(event_name, event));
								};
							}($el));
						});
					},

					teardown: function(namespaces) {
						var $el = $(this);

						$el.data('hammer').destroy();
						$el.removeData('hammer');
					}
				};
			}(event_name));
		}
	}

	// AMD
	if (typeof define === 'function' && define.amd) {
		define(['hammerjs', 'jquery'], setupPlugin);
	}
	else {
		setupPlugin(window.Hammer, window.jQuery || window.Zepto);
	}
})(window);