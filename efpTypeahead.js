/* =============================================================
 * bootstrap-typeahead.js v2.3.1
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */
! function($) {"use strict";// jshint ;_;

	/* TYPEAHEAD PUBLIC CLASS DEFINITION
	 * ================================= */

	var Typeahead = function(element, options) {
		this.$element = $(element)
		this.options = $.extend({}, $.fn.efpTypeahead.defaults, options)
		this.matcher = this.options.matcher || this.matcher
		this.sorter = this.options.sorter || this.sorter
		this.highlighter = this.options.highlighter || this.highlighter
		this.updater = this.options.updater || this.updater
		this.source = this.options.source
		this.$menu = $(this.options.menu)
		this.shown = false
		this.listen()
	}

	Typeahead.prototype = {

		constructor : Typeahead,
		select : function() {
			var selected_element = this.$menu.find('.active');

			var item = {
				id : selected_element.attr('data-value'),
				text : selected_element.attr('text-value'),
				category : selected_element.attr('category-value')
			}
			this.$element.val(this.updater(item)).change()
			return this.hide()
		},
		updater : function(item) {
			return item.text || item
		},
		show : function() {
			var pos = $.extend({}, this.$element.position(), {
				height : this.$element[0].offsetHeight
			})

			this.$menu.insertAfter(this.$element).css({
				top : pos.top + pos.height,
				left : pos.left
			}).show()

			this.shown = true
			return this
		},
		hide : function() {
			this.$menu.hide()
			this.shown = false
			return this
		},
		lookup : function(event) {
			var items

			this.query = this.$element.val()

			if (!this.query || this.query.length < this.options.minLength) {
				return this.shown ? this.hide() : this
			}

			items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

			return items ? this.process(items) : this
		},
		process : function(items) {
			var that = this
			var categorys = []

			items = $.grep(items, function(item) {
				return that.matcher(item)
			})
			for (var i = 0; i < items.length; i++) {
				var item = items[i]
				item.category && !~$.inArray(item.category, categorys) && categorys.push(item.category);
			};
			categorys = categorys.sort();

			var category;
			var result = [];
			while ( category = categorys.shift()) {
				var sortItems = []
				for (var i = 0; i < items.length; i++) {
					var item = items[i]
					item.category == category && sortItems.push(item);
				}
				sortItems = this.sorter(sortItems);
				result = result.concat(sortItems);
			}

			if (!result.length) {
				return this.shown ? this.hide() : this
			}

			return this.render(result.slice(0, this.options.items)).show()
		},
		matcher : function(item) {
			return item.text ? ~item.text.toLowerCase().indexOf(this.query.toLowerCase()) : ~item.toLowerCase().indexOf(this.query.toLowerCase());
		},
		sorter : function(items) {
			var beginswith = [], caseSensitive = [], caseInsensitive = [], item, categorys = []
			while ( item = items.shift()) {
				if (item.text ? !item.text.toLowerCase().indexOf(this.query.toLowerCase()) : !item.toLowerCase().indexOf(this.query.toLowerCase()))
					beginswith.push(item)
				else if (item.text ? ~item.text.indexOf(this.query) : item.indexOf(this.query) )
					caseSensitive.push(item)
				else
					caseInsensitive.push(item)
			}

			return beginswith.concat(caseSensitive, caseInsensitive)
		},
		highlighter : function(item) {
			var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
			if (item.text) {
				return item.text.replace(new RegExp('(' + query + ')', 'ig'), function($1, match) {
					return '<strong>' + match + '</strong>'
				})
			} else {
				return item.replace(new RegExp('(' + query + ')', 'ig'), function($1, match) {
					return '<strong>' + match + '</strong>'
				})
			}

		},
		render : function(items) {
			var that = this
			var previous_category;
			items = $(items).map(function(i, item) {
				i = $(that.options.item).attr('data-value', item.id || item).attr('text-value', item.text || item).attr("category-value", item.category)
				i.find('a').html(that.highlighter(item.text || item)).css("display", "inline");
				if (item.category) {
					if (!previous_category) {
						i.find('span').html(item.category).css("float", 'right').css('color', '#999999').css('margin', '0 10px 0 0');
					} else if (item.category != previous_category) {
						var hr = $("<hr/>").css('margin', '10px 0');
						i = i.before(hr);
						i.find('span').html(item.category).css("float", 'right').css('color', '#999999').css('margin', '0 10px 0 0');

					}
					previous_category = item.category;

				}

				return i.get()
			})

			items.first().addClass('active')
			this.$menu.html(items)
			return this
		},
		next : function(event) {
			var active = this.$menu.find('.active').removeClass('active'), next = active.next()

			if (!next.length) {
				next = $(this.$menu.find('li')[0])
			}

			next.addClass('active')
		},
		prev : function(event) {
			var active = this.$menu.find('.active').removeClass('active'), prev = active.prev()

			if (!prev.length) {
				prev = this.$menu.find('li').last()
			}

			prev.addClass('active')
		},
		listen : function() {
			this.$element.on('focus', $.proxy(this.focus, this)).on('blur', $.proxy(this.blur, this)).on('keypress', $.proxy(this.keypress, this)).on('keyup', $.proxy(this.keyup, this))

			if (this.eventSupported('keydown')) {
				this.$element.on('keydown', $.proxy(this.keydown, this))
			}

			this.$menu.on('click', $.proxy(this.click, this)).on('mouseenter', 'li', $.proxy(this.mouseenter, this)).on('mouseleave', 'li', $.proxy(this.mouseleave, this))
		},
		eventSupported : function(eventName) {
			var isSupported = eventName in this.$element
			if (!isSupported) {
				this.$element.setAttribute(eventName, 'return;')
				isSupported = typeof this.$element[eventName] === 'function'
			}
			return isSupported
		},
		move : function(e) {
			if (!this.shown)
				return

			switch(e.keyCode) {
				case 9:
				// tab
				case 13:
				// enter
				case 27:
					// escape
					e.preventDefault()
					break

				case 38:
					// up arrow
					e.preventDefault()
					this.prev()
					break

				case 40:
					// down arrow
					e.preventDefault()
					this.next()
					break
			}

			e.stopPropagation()
		},
		keydown : function(e) {
			this.suppressKeyPressRepeat = ~$.inArray(e.keyCode, [40, 38, 9, 13, 27])
			this.move(e)
		},
		keypress : function(e) {
			if (this.suppressKeyPressRepeat)
				return this.move(e)
		},
		keyup : function(e) {
			switch(e.keyCode) {
				case 40:
				// down arrow
				case 38:
				// up arrow
				case 16:
				// shift
				case 17:
				// ctrl
				case 18:
					// alt
					break

				case 9:
				// tab
				case 13:
					// enter
					if (!this.shown)
						return this.select()
					break

				case 27:
					// escape
					if (!this.shown)
						return this.hide()
					break

				default:
					this.lookup()
			}

			e.stopPropagation()
			e.preventDefault()
		},
		focus : function(e) {
			this.focused = true
		},
		blur : function(e) {
			this.focused = false
			if (!this.mousedover && this.shown)
				this.hide()
		},
		click : function(e) {
			e.stopPropagation()
			e.preventDefault()
			this.select()
			this.$element.focus()
		},
		mouseenter : function(e) {
			this.mousedover = true
			this.$menu.find('.active').removeClass('active')
			$(e.currentTarget).addClass('active')
		},
		mouseleave : function(e) {
			this.mousedover = false
			if (!this.focused && this.shown)
				this.hide()
		}
	}

	/* TYPEAHEAD PLUGIN DEFINITION
	 * =========================== */

	var old = $.fn.efpTypeahead

	$.fn.efpTypeahead = function(option) {
		return this.each(function() {
			var $this = $(this), data = $this.data('typeahead'), options = typeof option == 'object' && option
			if (!data)
				$this.data('typeahead', ( data = new Typeahead(this, options)))
			if ( typeof option == 'string')
				data[option]()
		})
	}

	$.fn.efpTypeahead.defaults = {
		source : [],
		items : 8,
		menu : '<ul class="typeahead dropdown-menu"></ul>',
		item : '<li class="efp-typeahead-li"><a href="#"></a><span></span></li>',
		minLength : 1
	}
	//	menu : '<ul class="typeahead dropdown-menu"></ul>',
	//	item : '<li><a href="#"></a>&nbsp;<span></span></li>',
	$.fn.efpTypeahead.Constructor = Typeahead

	/* TYPEAHEAD NO CONFLICT
	 * =================== */

	$.fn.efpTypeahead.noConflict = function() {
		$.fn.efpTypeahead = old
		return this
	}
	/* TYPEAHEAD DATA-API
	 * ================== */

	// $(document).on('focus.typeahead.data-api', '[data-provide="typeahead"]', function(e) {
		// var $this = $(this)
		// if ($this.data('typeahead'))
			// return $this.typeahead($this.data())
	// })
}(window.jQuery);
