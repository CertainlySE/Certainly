var certainly_settings = {
  id: "4b8b1d5a-57b8-41a2-8c59-0dc5fbce7921",
  buttonWidth: 120,
  buttonHeight: 120,
  mode: "clear_past_conversations",
  cvars: {
      language: "en"
  },
  inputType: "bottom",
  buttonLogoOpen: "https://cdn.shopify.com/s/files/1/0551/6060/2784/files/Feasty_ChatBot.png?v=1641564470",
  buttonLogoClose: "https://cdn.shopify.com/s/files/1/0551/6060/2784/files/Feasty_ChatBot.png?v=1641564470"
};


var CERTAINLY_POPUPS = [
  {
      id: "original-chocolate",
      messages: [{
          language: "en",
          texts: ["Wanna know more about the Original Chocolate bar?"]
      }],
      trigger: "page_load",
      condition: (function(){
        if( window.location.href.includes("fts") ){
          return true;
        }
        else {
          return false;
        }
      })(),
      delay: 30000,
      repeat_after: 0,
      desktop: true,
      mobile: true,
      start_from_module: "707748"
  },
  {
    id: "almond-chocolate",
    messages: [{
        language: "en",
        texts: ["Wanna know more about the Almond Chocolate bar?"]
    }],
    trigger: "page_load",
    condition: (function(){
      if( window.location.href.includes("products/almond-chocolate") ){
        return true;
      }
      else {
        return false;
      }
    })(),
    delay: 30000,
    repeat_after: 0,
    desktop: true,
    mobile: true,
    start_from_module: "707747"
  }
];

  // Add current product to cart
  certainly.landedAt(
    {
        module: "708142",
    },
        function(){
            document.querySelector(".button-primary").click();
        }
    );

    // Close Certainly Widget after conversation is over
    certainly.landedAt(
    {
        module: "711814",
    },
        function(){
            certainly.widgetStatus({action: "close"});
        }
    );