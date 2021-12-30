/**
 * Google Analytics Extension for the Certainly Widget
 */

// The certainly_ga object holds some global variables
var certainly_ga = {
  tracker: "",
  last_sent_event: ""
}

// The first Google Analytics tracker found is assigned to a global variable
ga(function() {
  var trackers = ga.getAll();
  certainly_ga.tracker = trackers[0];
});

// Whenever Certainly moves to a new module, and cvar ga_event is defined, attempts to post that variable to Google Analytics
// If the ga_event matches the last event sent, nothing is posted to Google Analytics
certainly.getCertainlyTransfer({
  actionName: "*",
  callback: (data) => {
    if (data.cvars == ""){
      console.log("You need to enable your Certainly bot to share custom variables with the website")
      return;
    }
    if (data.cvars.ga_event){
      var ga_event = data.cvars.ga_event;
      if( ga_event != certainly_ga.last_sent_event ){
        certainly_ga.last_sent_event = ga_event;
        if (certainly_ga.tracker){
          certainly_ga.tracker.send("event", JSON.parse(ga_event));
        }
        else {
          console.log("Certainly could not send an event to Google Analytics. No tracker was found")
        }
      }
    }
  }
});
