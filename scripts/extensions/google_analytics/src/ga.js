/**
 * Google Analytics Extension for the Certainly Widget
 */

// The certainly_ga object holds some global variables
var certainly_ga = {
  tracker: "",
  last_sent_event: ""
}



if (typeof (ga) == undefined) {
  ga(function () {
    var trackers = ga.getAll();
    certainly_ga.tracker = trackers[0];
  });
}

//Small utility function to listen for when an object is defined
(function () { window.whenDefined = function (a, b, c) { a[b] ? c() : Object.defineProperty(a, b, { configurable: !0, enumerable: !0, writeable: !0, get: function () { return this["_" + b] }, set: function (a) { this["_" + b] = a, c() } }) } }).call(this);



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
          var ga_event = data.cvars.ga_event;
          if (ga_event != certainly_ga.last_sent_event) {
            // The event is different from the last one
            certainly_ga.last_sent_event = ga_event;

            var event = JSON.parse(ga_event);

            if (gtag) { // Sending an event via gtag.js
              gtag('event', event.eventName ? event.eventName : event.eventLabel,
                {
                  'event_category': event.eventCategory,
                  'event_label': event.eventLabel
                }
              );
            }
            else if (certainly_ga.tracker) { // Sending an event via ga.js
              certainly_ga.tracker.send("event", event);
            }

            else {
              console.log("Certainly could not send an event to Google Analytics. No tracker was found", ga_event)
            }
          }
        }
      }
    })
  });
