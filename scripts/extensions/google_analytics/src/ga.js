/**
 * Google Analytics Extension for the Certainly Widget
 */

// The certainly_ga object holds some global variables
var certainly_ga = {
  tracker: "",
  last_sent_event: ""
};

//Small utility function to listen for when an object is defined
(function () { window.whenDefined = function (a, b, c) { a[b] ? c() : Object.defineProperty(a, b, { configurable: !0, enumerable: !0, writeable: !0, get: function () { return this["_" + b] }, set: function (a) { this["_" + b] = a, c() } }) } }).call(this);


function postEvent(ga_event){
  if (ga_event != certainly_ga.last_sent_event) {
    // The event is different from the last one
    certainly_ga.last_sent_event = ga_event;

    var event = ga_event;
    
    if ( /.*\{.*\}.*/.test(event) ){
      event = JSON.parse(ga_event);
    }
    /* event will have either of the following values
    event = "certainly_chat_started" (type is "string")
    event = {
            eventCategory: "certainly",
            eventLabel: "chat_started",
            eventValue: "chat_started"
          }

    }
    (type is "object")
    
    This has implications over how the variable event needs to be posted to GA
    */
    if (typeof(ga)!="undefined") { // Sending an event via ga.js
      var trackers = ga.getAll();
      certainly_ga.tracker = trackers[0];
      
      if ( event.typeof(event) == "string" ){
        certainly_ga.tracker.send("event", {
          eventCategory: "certainly",
          eventAction: event
        });
      }
      else if ( typeof(event) == "object" ){
        if (!event.eventAction){
          console.log("The label for this event is not defined", event)
          return
        }
        else {
          certainly_ga.tracker.send("event", event);
        }
        
      }          
    }
    else if ( typeof(gtag)!="undefined" ) { // Sending an event via gtag.js
      if ( typeof(event) == "string" ){
        gtag("event", event, {});
      }
      else if ( typeof(event) == "object" ){
        if (!event.eventAction){
          console.log("The label for this event is not defined", event)
          return
        }
        else {
          gtag('event', event.eventAction ? event.eventAction : event.eventLabel,
            {
              'event_category': event.eventCategory ? event.eventCategory : "certainly",
              'event_action': event.eventAction
            }
          );
        }
        
      }
      
    }
    
    else {
      console.log("Certainly could not send an event to Google Analytics. No tracker was found", ga_event)
    }
  }
}

// Whenever Certainly moves to a new module, and cvar ga_event is defined, attempts to post that variable to Google Analytics
// If the ga_event matches the last event sent, nothing is posted to Google Analytics
whenDefined(window, 'certainly',
  function () {
    certainly.getCertainlyTransfer({
      actionName: "*",
      callback: (data) => {
        console.log(data)
        if (data.cvars == "") {
          console.log("You need to enable your Certainly bot to share custom variables with the website")
          return;
        }
        if (data.cvars.ga_event) { 
          // An event is defined as a cvar
          postEvent(data.cvars.ga_event)
      }
    }
  })
});
