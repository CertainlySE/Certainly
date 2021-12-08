const CERTAINLY_POPUPS =  [
  {
    id: "default", // String, unique name of the popup
    trigger: "page_load", // String or function. If string, accepted values are: "page_load", "inactivity", "chat_minimized". If function, it must return a boolean value: true or false
    condition: true, // Boolean or function. If function, it must return a boolean value: true or false.
    delay: 1000, // Time in ms after which the first popup text is rendered
    repeat_after: 0, // Number of times after which this popup will show up again
    desktop: true, // Whether this popup is enabled on desktop devices
    mobile: true, // Whether this popup is enabled on mobile devices
    messages: [
      {
        language: "en", // Language of the texts, will be checked against the current website locale
        texts: [
          "Hi! 😊",
          "How can I help you?"
          ]
      }
    ],
    start_from_module: "", // Optional, overrides the defau,lt chat start module ID 
  }
]