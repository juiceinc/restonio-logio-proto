
  // Sort Options View
  // -----------------

  // The view that lets the user toggle between different sort options.
  dashboard.Views.SortOptionsView = Backbone.View.extend({
    el: '#sort-options',

    events: {
      'click a': 'doSort'
    },

    initialize: function() {
    },

    doSort: function(event) {
      var $target = $(event.target);

      this.$('.dropdown-toggle').dropdown('toggle');
      this.$el.find('ul > li.active').removeClass('active');
      $target.parent('li').addClass('active');

      var sort = $target.data('sort');
      dashboard.eventBus.trigger('sort:dashboard', sort);

      return false;
    }

  });
