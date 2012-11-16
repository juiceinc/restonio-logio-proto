
window.dashboard = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},

  // The application's event bus.
  eventBus: _.extend({}, Backbone.Events),

  // A GUID generator. Should be called as `dashboard.guid()`.
  guid: (function(){
    var prefix = 'demo';
    return function() {
      return _.uniqueId(prefix);
    };
  })(),

  defaultSort: 'original-order',

  init: function() {
    var n = 10,
        i,
        m = [];

    for (i = 1; i<=n; i++) {
      var o = new dashboard.Models.Widget();
      m.push(o);
    }
    var widgets = new dashboard.Collections.Widgets(m);
    new dashboard.Views.WidgetListView({ collection: widgets }).render();
    new dashboard.Views.AddWidgetView({ collection: widgets });
    new dashboard.Views.ToggleWidgetStateView();
    new dashboard.Views.ToggleScreenSizeView();
    new dashboard.Views.SortOptionsView();
  }
};

$(document).ready(function(){
  dashboard.init();
});
