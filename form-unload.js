(function($) {

$.formUnload = {
	defaults: {
		inputsSelector: 'input, textarea, select',
		message: 'Your changes may be lost if you continue. Are you sure you wish to leave this page?',
		// a selector of inputs to be excluded from the unload checks.
		exclude: null
	}
}

/**
 * Call $('form').formUnload('stored') to indicate if form data has been saved without triggering the form `submit` event.
 * Call $('form').formUnload('addInputs', $('input.new')) if there are any elements that need to be added to the unload checks.
 * @return {jQuery}
 */
$.fn.formUnload = function( option ) {
	var args = arguments
	return this.each(function () {
		var $this = $(this),
			data = $this.data('formUnload'),
			options = typeof option == 'object' && option
		if (!data) $this.data('formUnload', (data = new FormUnload(this, options)))
		if (typeof option == 'string') data[option].call(data, args[1])
	})
}

var FormUnload = function( form, options ) {
	this.$form = $(form)
	this.options = $.extend({}, $.formUnload.defaults, options)
	this.refresh()
	this.stored()
	var self = this
	this.$form.bind('submit', function() {
		self.stored()
	})
	$(window).bind('beforeunload', function() {
		if( self.isChanged() )
			return self.options.message
	})
}
FormUnload.prototype = {
	stored: function() {
		this.$inputs.each(this.storeValue)
	},
	storeValue: function() {
		$(this).data('formUnloadValue', $(this).val())
	},
	refresh: function($els) {
		this.$inputs = $([])
		this._addInputs(this.$form.find(this.options.inputsSelector))
	},
	addInputs: function($els) {
		var $inputs = $els.find(this.options.inputsSelector)
		if(!$inputs.length)
			$inputs = $els.filter(this.options.inputsSelector)
		this._addInputs($inputs)
	},
	_addInputs: function($inputs) {
		if(this.options.exclude)
			$inputs = $inputs.not(this.$form.find(this.options.exclude))
		$inputs.each(this.storeValue)
		this.$inputs = this.$inputs.add($inputs)
	},
	isChanged: function() {
		var changed = this.$inputs.is(function() {
				if( $(this).data('formUnloadValue') != $(this).val() )
					return true
			})
		return changed > 0;
	},
	confirmUnload: function() {
		var rv = !this.isChanged();
		if( !rv ) {
			rv = confirm(this.options.message);
		}
		return rv;
	}
}

}(jQuery))