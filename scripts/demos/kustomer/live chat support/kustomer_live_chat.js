certainly.getCertainlyTransfer({
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
};