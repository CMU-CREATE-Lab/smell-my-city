var OverviewPage = {

  text: null, //the text for the page's template
  didInitialLoad: false,


  loadTemplate: function() {
    this.text = App.text.overview;
    var overviewTpl = Handlebars.compile($("#overview-tpl").html());
    $('#overview').html(overviewTpl(this.text));
    $('#overview').trigger('create');
  },


  setListeners: function() {
    // add back (x) button functionality
    $(".back-x").click(function() {App.navigateToPastPage()});
    $("a[target='_blank']").on("click touchend", function(e) {
      var el = $(this);
      var link = el.attr("href");
      window.location = link;
    });
  },


  onCreate: function() {
    if (!OverviewPage.didInitialLoad) {
      OverviewPage.didInitialLoad = true;
      this.loadTemplate();
      this.setListeners();
      this.displayVersionNumber();
    }

    // Update current city name and corresponding info
    App.refreshCity();
  },


  initialize: function () {
    console.log("OverviewPage.initialize (deprecated; start using onCreate instead)");
    OverviewPage.onCreate();
  },


  // helper functions


  displayVersionNumber: function() {
    $("#version-number").text("version: " + Constants.APP_VERSION);
  },

}
