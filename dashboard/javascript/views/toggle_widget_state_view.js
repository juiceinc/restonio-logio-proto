
  // Toggle Widget State View
  // -------------------

  // The view that lets the user toggle the state of all widgets.
  // The two states that can be toggled betweeen are: Expand All and Collapse All
  dashboard.Views.ToggleWidgetStateView = Backbone.View.extend({
    el: '.toggle-widget',

    events: {
      'click': 'toggleWidgetState'
    },

    states: {
      'expand': {action: 'show', to_text: 'Collapse All', change_to: 'collapse'},
      'collapse': {action: 'hide', to_text: 'Expand All', change_to: 'expand'}
    },

    toggleWidgetState: function() {
      var action = this.$el.data('action'),
          state = this.states[action];

      if (state) {
        $('.collapse').collapse(state.action);
        this.$el.html(state.to_text);
        this.$el.data('action', state.change_to);
      }
      return false;
    }
  });
