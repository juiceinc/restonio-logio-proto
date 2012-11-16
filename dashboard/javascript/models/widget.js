
  // Widget Model
  // ------------

  // Represents one widget on the dashboard.
  dashboard.Models.Widget = Backbone.Model.extend({

    // Default attributes for a widget.
    defaults: function() {
      return {

        // The width of the widget.
        width: 'width1',

        // The height of the widget.
        height: 'height1',

        index: 0,

        // The content of the widget.
        content: Faker.Lorem.paragraphs(Math.floor(Math.random()*2)),

        // A prefix to use in the view to make dom element `id` attributes unique.
        idPrefix: dashboard.guid()
      };
    },

    initialize: function() {
      this.set({
        width: dashboard.Models.Widget.getRandom('widths'),
        height: dashboard.Models.Widget.getRandom('heights'),
        image: dashboard.Models.Widget.getRandom('images'),
        created: new Date()
      });
    }
  },
  {
    widths: ['width3', 'width6', 'width9'],

    heights: ['height1', 'height2'],

    images: ['area.png', 'barcolumn.png', 'line.png', 'map.png', 'pie.png'],

    getRandom: function(property) {
      var v = dashboard.Models.Widget[property];
      return v[ Math.floor( Math.random() * v.length) ];
    }
  });
