
  // Add Widget View
  // -------------------

  // The view that lets the user add a new widget to the list
  dashboard.Views.AddWidgetView = Backbone.View.extend({
    el: '.add-widget',

    events: {
      'click': 'addWidget'
    },

    addWidget: function() {

      if (this.collection) {
        var w = new dashboard.Models.Widget();

        this.collection.add(w);
      }

      return false;
    }
  });
