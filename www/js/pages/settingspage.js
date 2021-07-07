var SettingsPage = {

  text: null, //the text for the page's template
  didInitialLoad: false,


  loadTemplate: function() {
    this.text = App.text.settings;
    console.log("SettingsPage.initialize");
    this.settingsTpl = Handlebars.compile($("#settings-tpl").html());
    $('#settings').html(this.settingsTpl(this.text));
    $('#settings').trigger('create');
  },


  setListeners: function() {
    // avoid seeing the collapsed tabs on the first page transition
    this.expandTabs();

    // click listeners
    // ticking (checkbox) listeners
    $("#bayarea_notifications").click(function(){SettingsPage.onToggleNotifications(Constants.BAYAREA_TOPIC,"bayarea_notifications")});
    $("#louisville_notifications").click(function(){SettingsPage.onToggleNotifications(Constants.LOUISVILLE_TOPIC,"louisville_notifications")});
    $("#pittsburgh_notifications").click(function(){SettingsPage.onToggleNotifications(Constants.PITTSBURGH_TOPIC,"pittsburgh_notifications")});
    $("#portland_notifications").click(function(){SettingsPage.onToggleNotifications(Constants.PORTLAND_TOPIC,"portland_notifications")});    

    $("#reminder_notifications").click(function(){SettingsPage.onToggleNotifications(Constants.REMINDER_TOPIC,"reminder_notifications")});
    $("#aqi_notifications").click(function(){SettingsPage.onToggleNotifications(Constants.AQI_TOPIC,"aqi_notifications")});
    $("#report_notifications").click(function(){SettingsPage.onToggleNotifications(Constants.REPORT_TOPIC,"report_notifications")});
    $("#predict_notifications").click(function(){SettingsPage.onToggleNotifications(Constants.PREDICT_TOPIC,"predict_notifications")});    

    // change (text) listeners
    $("#textfield_email").change(SettingsPage.onEmailChange);
    $("#textfield_name").change(SettingsPage.onNameChange);
    $("#textfield_phone").change(SettingsPage.onPhoneChange);
    $("#textfield_address").change(SettingsPage.onAddressChange);
    // focus (textbox) listeners
    $("#textfield_email").focus(function() {SettingsPage.onFocusTextbox(this)});
    $("#textfield_name").focus(function() {SettingsPage.onFocusTextbox(this)});
    $("#textfield_phone").focus(function() {SettingsPage.onFocusTextbox(this)});
    $("#textfield_address").focus(function() {SettingsPage.onFocusTextbox(this)});

    $(".back-x").click(function() {App.navigateToPastPage()});
    //$(".langSelect").change(SettingsPage.langSelect);
  },


  onCreate: function() {
    if (!SettingsPage.didInitialLoad) {
      SettingsPage.didInitialLoad = true;
      this.loadTemplate();
      this.setListeners();
      this.refreshNotifications();
      this.populateFormSettings();
      this.expandTabs();
      // if blank values, highlight in red
      this.highlightMissingRecommended();
    }

    // Update current city name and corresponding info
    App.refreshCity();
  },


  initialize: function() {
    console.log("SettingsPage.initialize (deprecated; start using onCreate instead)");
    SettingsPage.onCreate();
  },


  // helper functions


  refreshNotifications: function() {

    $("#bayarea_notifications").prop("checked", LocalStorage.get("bayarea_notifications")).checkboxradio("refresh");
    $("#louisville_notifications").prop("checked", LocalStorage.get("louisville_notifications")).checkboxradio("refresh");
    $("#pittsburgh_notifications").prop("checked", LocalStorage.get("pittsburgh_notifications")).checkboxradio("refresh");
    $("#portland_notifications").prop("checked", LocalStorage.get("portland_notifications")).checkboxradio("refresh");

    $("#reminder_notifications").prop("checked", LocalStorage.get("reminder_notifications")).checkboxradio("refresh");
    $("#aqi_notifications").prop("checked", LocalStorage.get("aqi_notifications")).checkboxradio("refresh");
    $("#report_notifications").prop("checked", LocalStorage.get("report_notifications")).checkboxradio("refresh");
    $("#predict_notifications").prop("checked", LocalStorage.get("predict_notifications")).checkboxradio("refresh");
  },


  populateFormSettings: function() {
    $("#textfield_email").prop("value", LocalStorage.get("email"));
    $("#textfield_name").prop("value", LocalStorage.get("name"));
    $("#textfield_phone").prop("value", LocalStorage.get("phone"));
    $("#textfield_address").prop("value", LocalStorage.get("address"));

    $("#bayarea_notifications").prop("checked", LocalStorage.get("bayarea_notifications"))
    $("#louisville_notifications").prop("checked", LocalStorage.get("louisville_notifications"))
    $("#pittsburgh_notifications").prop("checked", LocalStorage.get("pittsburgh_notifications"))
    $("#portland_notifications").prop("checked", LocalStorage.get("portland_notifications"))

    $("#reminder_notifications").prop("checked", LocalStorage.get("reminder_notifications"))
    $("#aqi_notifications").prop("checked", LocalStorage.get("aqi_notifications"))
    $("#report_notifications").prop("checked", LocalStorage.get("report_notifications"))
    $("#predict_notifications").prop("checked", LocalStorage.get("predict_notifications"))
  },


  expandTabs: function() {
    $("#notificationsCollapsible").collapsible({collapsed: false});
    $("#reportsCollapsible").collapsible({collapsed: false});
    $("#locNotificationsCollapsible").collapsible({collapsed: false});
  },


  validateEmail: function(email) {
    // TODO double-check if this is a valid regex?
    var regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\ ".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
  },


  highlightMissingRecommended: function() {
    // name
    if (LocalStorage.get("name") == "") {
      $("#textfield_name").parent().addClass("missing-recommended");
    } else {
      $("#textfield_name").parent().removeClass("missing-recommended");
    }
    // email
    if (LocalStorage.get("email") == "") {
      $("#textfield_email").parent().addClass("missing-recommended");
    } else {
      $("#textfield_email").parent().removeClass("missing-recommended");
    }
  },


  // callbacks
  //REMEMBER TO TURN ON FIREBASE SUBSCRIPTION ONCE TOPICS ARE MADE
  onToggleNotifications: function(topicName, storageID) {

    if (LocalStorage.get(storageID)) {
      LocalStorage.set(storageID, false);
      Firebase.unsubscribe(topicName);
      Analytics.logOnUnsubscribeEvent(topicName);
    } else {
      console.log("Subbed to: " + topicName);
      LocalStorage.set(storageID, true);
      Firebase.subscribe(topicName);
      Analytics.logOnSubscribeEvent(topicName);
    }
  },

  onEmailChange: function(event) {
    if (SettingsPage.validateEmail(this.value) || this.value == "") {
      LocalStorage.set("email", this.value);
    } else {
      this.value = LocalStorage.get("email");
      alert("Enter a valid email address.", null, "Invalid Email Entry", "Ok");
    }
    SettingsPage.highlightMissingRecommended();
  },


  onNameChange: function(event) {
    LocalStorage.set("name", this.value);
    SettingsPage.highlightMissingRecommended();
  },


  onPhoneChange: function(event) {
    LocalStorage.set("phone", this.value);
  },


  onAddressChange: function(event) {
    LocalStorage.set("address", this.value);
  },


  onFocusTextbox: function(element) {
    App.htmlElementToScrollAfterKeyboard = element;
    //App.htmlElementToBlurAfterKeyboardCloses = element;
    element.scrollIntoView();
  },

  // Get store city based on slection
  langSelect: function() {
    var langVal = $(".langSelect :selected")[0].value;
    // get the value of the selected value from the list
    // reset language to the new thing selected
    var newLang = getText(langVal);
    App.text = newLang;
    LocalStorage.set("langauge", langVal);
    // nav back to home once lang has been reset
    App.navigateToPage(Constants.HOME_PAGE);
    // set first time startup to false so startup page doesnt keep showing up
    LocalStorage.set("firsttime_startup", false);
  },

}
