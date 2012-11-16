
window.app = {
  Models: {},
  Collections: {},
  Views: {},
  Routers: {},
  init: function() {
    new app.Views.TableView();
  }
};

$(document).ready(function(){
  app.init();
});
