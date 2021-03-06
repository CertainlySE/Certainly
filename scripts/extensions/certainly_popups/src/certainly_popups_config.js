const CERTAINLY_POPUPS = [
  {
    id: "visitor_inactive",
    trigger: "visitor_inactive",
    condition: true,
    delay: 20000,
    repeat_after: 0,
    desktop: true,
    mobile: true,
    messages: [{
      language: "en",
      texts: [
        "Do you need help with anything?"
      ]
    }],
    start_from_module: "",
  },
  {
    id: "chat_minimized",
    trigger: "chat_minimized",
    condition: true,
    delay: 5000,
    repeat_after: 1,
    desktop: true,
    mobile: true,
    messages: [{
      language: "en",
      texts: [
        "I am there if you\nhave any questions!"
      ]
    }],
    start_from_module: "",
  },
  {
    id: "default", // String, unique name of the popup. Multiple popups with the same id are not allowed
    trigger: "page_load", // String or function. If string, accepted values are: "page_load", "visitor_inactivity", "chat_minimized". If function, it must return a boolean value: true or false
    condition: true, // Boolean or function. If function, it must return a boolean value: true or false.
    delay: 5000, // Time in ms after which the first popup text is rendered
    repeat_after: 1, // Number of times after which this popup will show up again
    desktop: true, // Whether this popup is enabled on desktop devices
    mobile: true, // Whether this popup is enabled on mobile devices
    messages: [{
      language: "en", // Language of the texts, will be checked against the current website locale
      texts: [
        "Hi! 😊",
        "How can I help you?"
      ]
    }],
    start_from_module: "", // Optional, overrides the default chat start module ID. Only works when trigger = "page_load" 
  }
]