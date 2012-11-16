
  // Widget View
  // -----------

  // The view to render a widget.
  dashboard.Views.WidgetView = Backbone.View.extend({
    templateName: '#widget-template',

    className: 'widget',

    // `hidden` and `shown` are bootstrap-collapse plugin events.
    events: {
      'hidden .widget-content'  : 'triggerRelayout',
      'shown .widget-content'   : 'triggerRelayout'
    },

    states: {
      'expand': { to_icon: 'icon-chevron-up', to_text: 'collapse'},
      'collapse': {to_icon: 'icon-chevron-down', to_text: 'expand'}
    },

    initialize: function() {
      if(this.options.templateName) {
        this.templateName = this.options.templateName;
      }
      this.template = _.template($(this.templateName).html());
    },

    render: function() {
      var data = this.model.toJSON();
      data.index = this.model.collection ? this.model.collection.indexOf(this.model) + 1 : 0;

      this.$el.html( this.template(data) );

      this.$el.attr('data-created', +this.model.get('created'));
      this.$el.addClass(this.model.get('width') || 'width1');
      this.$('.widget-content-inner').addClass(this.model.get('height') || 'height1');

      return this;
    },

    // Trigger a relayout event so the dashboard can lay itself out correctly.
    // Also sync the text of the link ('expand' | 'collapse') to the action performed.
    triggerRelayout: function() {
      var idPrefix = this.model.get('idPrefix'),
          $a = this.$('a[href="#' + idPrefix + '"]'),
          text = $a.find('span').text(),
          h = this.$('.collapse').height();

      // trim the text.
      text = text.replace(/^\s+|\s+$/g, '');

      // There is an external "Expand All/Collapse All" button.
      // Make sure the link text stays in sync with it.
      if (h === 0 && text === 'expand') {
        text = 'collapse';
      }
      else if (h > 0 && text === 'collapse') {
        text = 'expand';
      }

      var state = this.states[text];
      if (state) {
        $a.find('span').text(' ' + state.to_text);
        $a.find('i').removeClass().addClass(state.to_icon);
      }

      dashboard.eventBus.trigger('relayout:dashboard');
    }

  });
