(function($) {

$.formUnload = {
	defaults: {
		inputsSelector: 'input, textarea, select',
		message: 'Your changes may be lost if you continue. Are you sure you wish to leave this page?',
		// a selector of inputs to be excluded from the unload checks.
		exclude: null
	}
};

/**
 * Call $('form').formUnload('stored') to indicate if form data has been saved without triggering the form `submit` event.
 * Call $('form').formUnload('addInputs', $('input.new')) if there are any elements that need to be added to the unload checks.
 * @return {jQuery}
 */
$.fn.formUnload = function( option ) {
	var args = arguments;
	return this.each(function () {
		var $this = $(this),
			data = $this.data('formUnload'),
			options = typeof option == 'object' && option
		if (!data) $this.data('formUnload', (data = new FormUnload(this, options)))
		if (typeof option == 'string') data[option].call(data, args[1])
	});
}

var FormUnload = function( form, options ) {
	this.$form = $(form);
	this.options = $.extend({}, options, $.formUnload.defaults);
	this.$inputs = this.$form.find(this.options.inputsSelector);
	this.stored();
	var self = this;
	this.$form.bind('submit', function() {
		self.stored();
	});
	$(window).bind('beforeunload', function() {
		var changed = self.$inputs.is(function() {
				if( $(this).data('formUnloadValue') != $(this).val() ) {
					return true
				}
			});
		if( changed > 0 ) {
			return self.options.message;
		}
	});
};
FormUnload.prototype = {
	stored: function() {
		this.$inputs.each(this.storeValue);
	},
	storeValue: function() {
		$(this).data('formUnloadValue', $(this).val());
	},
	addInputs: function( $els ) {
		var inputs = $els.find(this.options.inputsSelector)
		if( !inputs.length ) {
			inputs = $els.filter(this.options.inputsSelector)
		}
		if( this.options.exclude )
			inputs = inputs.filter(this.options.exclude)
		inputs.each(this.storeValue)
		this.$inputs = this.$inputs.add(inputs)
	}
};

}(jQuery));