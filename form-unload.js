(function($) {

$.formUnload = {
	defaults: {
		inputsSelector: 'input, textarea, select',
		message: 'Your changes may be lost if you continue. Are you sure you wish to leave this page?',
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
	$(window).bind('beforeunload', function() {
		var changed = self.$inputs.is(function() {
				return $(this).data('formUnloadValue') != $(this).val();
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
	addInputs: function( $inputs ) {
		console.log($inputs)
		var self = this;
		var add = function() {
			self.storeValue.call(this);
			if( !self.$inputs.has(this).length ) {
				console.log(this);
				self.$inputs = self.$inputs.add(this);
			}
		}
		$inputs.filter(this.options.inputsSelector).each(add)
		$inputs.find(this.options.inputsSelector).each(add)
	}
};

}(jQuery));