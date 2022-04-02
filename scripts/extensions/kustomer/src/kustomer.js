/* Utility function */
function waitForElm(selector) {
  return new Promise(resolve => {
      if (document.querySelector(selector)) {
          return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver(mutations => {
          if (document.querySelector(selector)) {
              resolve(document.querySelector(selector));
              observer.disconnect();
          }
      });

      observer.observe(document.body, {
          childList: true,
          subtree: true
      });
  });
}

waitForElm('#kustomer-ui-sdk-iframe').then((elm) => {

  
  // Hides the Kustomer Widget
  certainly.hideKustomer = function(){
  document.head.insertAdjacentHTML("beforeend", `
  <style id="custom-kustomer-style">
     #kustomer-ui-sdk-iframe {
          display:none!important;
      }
      </style>
  `)}

  certainly.hideKustomer();

  certainly.showKustomer = function(){
    document.querySelector("#custom-kustomer-style").remove();
  }
  
});


certainly.getCertainlyTransfer({
  webchatKey: 1,
  actionName: "*",
  callback: function(data) {
      if (data.cvars == "") {
          console.log("You need to enable your Certainly bot to expose custom variables")
      }
      if (data.cvars.kustomer && data.cvars.kustomer == "start_chat") {
          console.log("Starting a chat on Kustomer", data.cvars)
          if (Kustomer) {
              /*GorgiasChat.captureUserEmail(data.cvars.customer_email);
              GorgiasChat.open()*/

              Kustomer.describeCustomer({
                attributes: {
                  emails: [data.cvars.customer_email]
                }
              });
              
              certainly.chat_history = data.cvars.chatHistory;

              Kustomer.addListener('onConversationCreate', (res) => {
                Kustomer.describeConversation({
                  conversationId: res.conversationId,
                  customAttributes: {
                    certainlyHistoryTxt: certainly.chat_history ? certainly.chat_history : "The transcript between Certainly and this visitor is not available"
                  }
                });
              });

              Kustomer.open(
                function(){
                  Kustomer.createConversation({  
                    message: "One agent will join as soon as possible"
                  })
                }
              );
              certainly.showKustomer();

              
              console.log("Hiding Certainly")
              // Hides the Certainly Widget
              certainly.widgetStatus({
                  webchatKey: 1,
                  action: "hide"
              })

              certainly.sendCvars({
                webchatKey: 1,
                custom_vars: {
                    kustomer: ""
                }
              })

              // Hides Certainly chat manually
              document.getElementById("botxo-iframeContainer-1").style.display = "none";
              document.getElementById("botxo-button-1").style.display = "none";
          }
          
      }
  }
});

/*certainly.getCertainlyTransfer({
  actionName: "bot_module_id_for_kustomer_widget_switch",
  webchatKey: "certainly",
  callback: (data) => goToChat(data) // The data object contains information such as the latest visitor message and custom variables
});
  
function goToChat (data) { // fill and go to contact form
    certainly.widgetStatus({action: "hide", webchatKey: "certainly"});

    Kustomer.start({
        brandId: 'your_kustomer_brand_id'
      }, function () {
          const onCloseHandler = function() {
              certainly.widgetStatus({action: "show", webchatKey: "certainly"});
              certainly.widgetStatus({action: "close", webchatKey: "certainly"});

              certainly.goTo({
                  module: "bot_module_id_for_certainly_widget_switch", // Required
                  webchatKey: "certainly", // Only required if specified in initCertainlyWidget()
                },
                // callback //Function (optional)
              );

          };
          Kustomer.addListener('onClose', onCloseHandler);
        }
    );
    Kustomer.open();
    setTimeout(() => {
        Kustomer.createConversation({
          message: data.cvars.chatHistory
        })
    }, 1000);
};*/