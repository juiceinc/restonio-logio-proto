
  // Menu View
  // ----------

  // The view for the menu.
  app.Views.MenuView = Backbone.View.extend({
    id: 'measure-menu',

    templateName: '#menu-template',

    events: {
      'mouseenter': 'cancelHide',
      // 'click button.options': 'toggleMoreOptions'
      'click .frequently-used button.options': 'showOptions',
      'click .less-frequently-used button.options': 'showOptions'
    },

    // A reference to the header DOM element that is mousedover.
    $headerTarget: null,

    initialize: function() {
      if (this.options.templateName) this.templateName = this.options.templateName;
      this.template = _.template( $(this.templateName).html() );

      this.hideDelay = 1000;
      this.hideIds = [];
    },

    render: function() {
      this.$el.html( this.template() );
      this.hideLessFrequentlyUsedOptions();

      return this;
    },

    // Cancel the hiding of the menu.
    cancelHide: function(event) {
      while(this.hideIds.length > 0) {
        var id = this.hideIds.shift();
        clearTimeout(id);
      }
    },

    // Show the menu.
    // Before doing that though, cancel the hiding of the menu and
    // adjust its position so that it is centered above `this.$headerTarget`.
    show: function(event) {
      if (_.isNull(this.width) || _.isUndefined(this.width)) {
        this.width = this.$el.width();
      }

      this.cancelHide();
      this.hidePopovers();

      this.$headerTarget = $(event.target);
      this.adjustPosition();

      this.$el.fadeIn();

      return false;
    },

    // Hide the menu after a delay of `this.hideDelay` seconds and
    // store the timeout id in `this.hideIds` so they can be used
    // to cancel the hiding.
    // Once the menu is hidden:
    // - hide the less frequently used options.
    // - clear `this.hideIds` and `this.$headerTarget`.
    // - hide any popovers.
    hide: function(event) {
      var self = this;

      var id = setTimeout(function() {
        self.$('button.options.less-options').click();
        self.$el.fadeOut('fast', function(){
          self.hideIds = [];
            self.$headerTarget = null;
            self.hidePopovers();
        });
      }, this.hideDelay);

      this.hideIds.push(id);
      return false;
    },

    // Toggle the display of the less frequently used menu options.
    // Also adjust the menu position so it still remains center aligned on top
    // of `this.$headerTarget`.
    //
    // NOT USED ANYMORE
    toggleMoreOptions: function(event) {
      var $target = $(event.target).closest('button');

      $target.toggleClass('more-options less-options');
      var $i = $target.find('i').removeClass();

      if ($target.hasClass('more-options')) {
        $i.addClass('icon-chevron-right');
        this.width = this.width - this.$('.less-used').width();
      }
      else {
        $i.addClass('icon-chevron-left');
        this.width = this.width + this.$('.less-used').width();
      }

      this.adjustPosition();
      this.$('.less-used').toggle();

      return false;
    },

    // Show the frequently used or less frequently used options
    // depending on the button that's clicked.
    showOptions: function(event) {
      var $target = $(event.target).closest('button'),
          $parent = $target.parent();

      if ($parent.hasClass('frequently-used')) {
        this.hideFrequentlyUsedOptions();
        this.showLessFrequentlyUsedOptions();
        this.hidePopovers();
      }
      else {
        this.hideLessFrequentlyUsedOptions();
        this.showFrequentlyUsedOptions();
      }

      this.width = this.$el.width();
      this.adjustPosition();
    },

    showLessFrequentlyUsedOptions: function(event) {
      this.$('.less-frequently-used').show();
      return false;
    },

    hideLessFrequentlyUsedOptions: function() {
      this.$('.less-frequently-used').hide();
    },

    showFrequentlyUsedOptions: function(event) {
      this.$('.frequently-used').show();
      return false;
    },

    hideFrequentlyUsedOptions: function() {
      this.$('.frequently-used').hide();
    },

    hidePopovers: function() {
      this.$('[data-title]').popover('hide');
    },

    // Adjust the position of the menu so it is centered above
    // the header that was moused over.
    adjustPosition: function(event) {
      if (!this.$headerTarget) {
        return false;
      }

      var $target = this.$headerTarget,
          twidth = $target.outerWidth(),
          w = this.width,
          parentWidth = this.$el.parent().width(),
          left = $target[0].offsetLeft,
          pos = left + (twidth/2) - (w/2),
          diff = (pos + w) - parentWidth;

      // If the menu is extending beyond the width of the parent,
      // move it back.
      if (diff > 0) {
        pos = pos - diff;
      }

      pos = pos < 0 ? '0px' : pos + 'px';
      this.$el.css('left', pos);
    }
  });
