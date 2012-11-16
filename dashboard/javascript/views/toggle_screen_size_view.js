
  // Toggle Screen Size View
  // -------------------

  // The view that lets the user toggle between different screen sizes.
  dashboard.Views.ToggleScreenSizeView = Backbone.View.extend({
    el: '#screen-toggle',

    events: {
      'click a.toggle-size1': 'changeToSize1',
      'click a.toggle-size2': 'changeToSize2'
    },

    initialize: function() {
    },

    changeToSize1: function(event) {
      this._changeToSize(event, 'size1', 'size2');
      return false;
    },

    changeToSize2: function(event) {
      this._changeToSize(event, 'size2', 'size1');
      return false;
    },

    _changeToSize: function(event, addSize, removeSize) {
      var $target = $(event.target);

      this.$('.dropdown-toggle').dropdown('toggle');
      this.$el.find('ul > li.active').removeClass('active');
      $target.parent('li').addClass('active');

      $('.container').removeClass(removeSize).addClass(addSize);

      dashboard.eventBus.trigger('change:screenSize', addSize);
      dashboard.eventBus.trigger('relayout:dashboard');
    }
  });
