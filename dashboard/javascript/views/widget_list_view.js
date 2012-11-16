
  // Widget List View
  // ----------------

  // The view that renders the list of widgets.
  dashboard.Views.WidgetListView = Backbone.View.extend({
    el: '#widget-list',

    columnWidths: {},

    rightGutterWidth: 10,

    leftGutterWidth: 10,

    numColumns: 12,

    // Initialize `this.el` with the isotope plugin.
    // Also listen for `reset` and `add` events if passed a collection.
    //
    // `this.newItems` is used to keep track of new dom "widget" elements that should
    // be added to the dom and hence passed onto isotope.
    initialize: function() {
      this.newItems = [];
      this.sortBy = dashboard.defaultSort;
      this.gutterWidth = this.rightGutterWidth + this.leftGutterWidth;

      this.initializeLayout();

      if (this.collection) {
        this.collection.on('reset', this.addAll, this);
        this.collection.on('add', this.addOne, this);

        dashboard.eventBus.on('relayout:dashboard', this.reLayout, this);
        dashboard.eventBus.on('change:screenSize', this.changeMasonryColumnWidth, this);
        dashboard.eventBus.on('sort:dashboard', this.sort, this);
      }
    },

    // Initialize `this.el` with the isotope plugin.
    initializeLayout: function() {
      var options = {
        itemSelector: '.widget',
        sortBy: this.sortBy,
        layoutMode: 'masonry',
        masonry: {
          columnWidth: this._calculateColumnWidth(this.$el.width())
        },
        animationOptions: {
          duration: 200
        }
      };

      options.getSortData = {
        width: function($elem) {
          return $elem.width();
        }
        // created: function($elem) {
        //   return -1 * $elem.data('created');
        // }
      };

      this.$el.isotope(options);
    },

    // Add all the items in the collection to `this.$el`.
    // When all the items are being added at once, we don't want
    // `addOne` to put them in the dom - so we pass `false` to its invocation.
    // We want to gather all the new items and insert them at once into isotope.
    addAll: function() {
      this.$el.empty();
      this.newItems = [];

      this.collection.each(function(widget, index, list) {
        this.addOne(widget, index, list, false);
      }, this);

      this.$el.isotope('insert', $(this.newItems));
      this.$el.append($(this.newItems));
      this.newItems = [];
    },

    // Add a single widget to `this.$el`.
    // If insert is `true`, pass the widget dom element to isotope,
    // so it can be sorted and filtered and laid out in its right position.
    // If not, then just keep track of it in `this.newItems`.
    addOne: function(widget, index, list, insert) {
      var view = new dashboard.Views.WidgetView({ model: widget });
      view.render();

      if (insert !== false) {
        // We want to prepend this item to the container.
        // this.$el.isotope('insert', view.$el);
        this.$el.prepend(view.$el).isotope('reloadItems').isotope().isotope('option', { sortBy: this.sortBy });
      }
      else {
        this.newItems.push(view.el);
      }
    },

    // Render this view.
    render: function() {
      if (this.collection) {
        this.addAll();
      }
      return this;
    },

    reLayout: function() {
      this.$el.isotope('reLayout');
    },

    changeMasonryColumnWidth: function(size) {
      var width = this.columnWidths[size];
      if (!width) {
        width = this._calculateColumnWidth(this.$el.width());
        this.columnWidths[size] = width;
      }
      this.$el.isotope('option', {masonry: {columnWidth: width} });
    },

    // Sort the widgets in the dashboard.
    sort: function(sortBy) {
      if (_.isNull(sortBy) || _.isUndefined(sortBy)) {
        sortBy = dashboard.defaultSort;
      }
      if (this.sortBy !== sortBy) {
        this.sortBy = sortBy;
        this.$el.isotope({ sortBy: sortBy });
      }
    },

    // The formula for calculating the width (`w`) of one column is:
    //  `totalWidth = (numColumns * w) + (numColumns * gutterWidth)`
    /// so `w = (totalWidth - (numColumns * gutterWidth) ) / numColumns`
    //
    // Isotope needs the width of a column to include its margin/padding, so:
    // `w = ( (totalWidth - (numColumns * gutterWidth) ) / numColumns ) + gutterWidth`
    _calculateColumnWidth: function(size) {
      return Math.floor(( size - (this.numColumns * this.gutterWidth) ) / this.numColumns) + this.gutterWidth;
    }
  });
