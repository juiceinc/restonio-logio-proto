
  // Table View
  // ----------

  // The view for the table.
  app.Views.TableView = Backbone.View.extend({
    el: '#table-container',

    groupRowTemplateName: '#group-row-template',
    groupRowItemTemplateName: '#group-row-item-template',

    events: {
      'mouseenter thead th': 'showMenu',
      'mouseleave thead th': 'hideMenu',
      'mouseleave .menu-container': 'hideMenu',
      'click button.group': 'toggleGrouping'
    },

    // The currently active header.
    // This is the header that is currently moused over.
    $activeHeader: null,

    // When this view is created, add the menu to it.
    initialize: function() {
      this.menu = new app.Views.MenuView().render();
      this.menu.$el.hide();
      this.$('.menu-container').append(this.menu.$el);

      // Initialize popover on elements that have them.
      this.menu.$('[data-title]').popover();

      this.groupRowTemplate = _.template( $(this.groupRowTemplateName).html() );
      this.groupRowItemTemplate = _.template( $(this.groupRowItemTemplateName).html() );

      $('tbody').on('click', '.list-item a', this.updateSelection);
    },

    // Show the menu.
    // Also make sure the 'group' menu button is correctly activate/inactivated.
    showMenu: function(event) {
      this.$activeHeader = $(event.target).closest('th');

      if (this.isActiveHeaderGrouped()) {
        this.activateGroupButton();
      }
      else {
        this.inactivateGroupButton();
      }

      this.menu.show(event);
    },

    // Hide the menu.
    hideMenu: function(event) {
      this.menu.hide(event);
    },

    // When the 'group' menu is clicked, toggle the state
    // of the button and the currently active header.
    //
    // Also add the group row if this is the first header to be grouped
    // and remove this row if this is the last header to be un-grouped.
    toggleGrouping: function(event) {
      if (this.isActiveHeaderGrouped()) {
        this.removeHeaderGrouping(this.$activeHeader);
        this.inactivateGroupButton();
      }
      else {
        this.addHeaderGrouping(this.$activeHeader);
        this.activateGroupButton();
      }

      if (! this.areAnyColumnsGrouped()) {
        this.removeGroupRow();
      }
      else if (! this.$('.group-row').length) {
        this.addGroupRow();
      }
      return false;
    },

    // Is the currently active header grouped?
    isActiveHeaderGrouped: function() {
      return this.$activeHeader && this.$activeHeader.hasClass('grouped');
    },

    // Un-group `$header`.
    removeHeaderGrouping: function($header) {
      $header.removeClass('grouped');
      $header.find('.group-icon').remove();
    },

    // Group `$header`.
    addHeaderGrouping: function($header) {
      /*var $group = $("<div class='group-icon'><i class='icon-tasks'></i></div>"); // TODO: use a template

      $group.css({
        position: 'absolute',
        left: '0px',
        top: ($header.height() + 2)*-1 + 'px'
      });
      $group.appendTo($header); */

      $header.addClass('grouped');
    },

    activateGroupButton: function() {
      this.$('button.group').addClass('active');
    },

    inactivateGroupButton: function() {
      this.$('button.group').removeClass('active');
    },

    addGroupRow: function() {
      this.$('tbody').prepend(this.groupRowTemplate());

      //grab the cells for the row and add content to it.
      var colWidth = $('.table').width() / 6,
          rowCells = $('.success td'),
          that = this;

      _.each(rowCells, function(cell){
        var opts = that.createDummyContent() || [];
        $(cell).append(that.groupRowItemTemplate({options: opts}));

        //mark the first option as selected
        $('li', cell).first().addClass('active');
      });

      $('.dropdown-toggle span').css('max-width', colWidth - 30);
    },

    removeGroupRow: function() {
      this.$('tr.group-row').remove();
    },

    areAnyColumnsGrouped: function() {
      return this.$('th.grouped').length;
    },

    createDummyContent: function() {
      var opts = [];

      for(var count=0; count<3; count +=1){
        var label = Faker.Internet.userName();
        opts.push(label);
      }

      return opts;
    },

    updateSelection: function(){
      var sel = $(this).text(),
          parent = $(this).parent(),
          container = $(parent).closest('.dropdown');

      if($(parent).hasClass('active')) return;
      $('.list-item', container).removeClass('active');

      //update the text for the dropdown trigger
      $('.dropdown-toggle span', container).text(sel);
      $(parent).addClass('active');
    }
  });
