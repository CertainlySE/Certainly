(function(){
    document.head.insertAdjacentHTML("beforeend", `<style id="custom-zendesk-style">
    #webWidget {
        width: calc(400px + 2 * 1rem)!important;
        max-height: calc(100vh - 32px);
        height: calc(600px + 2 * 1rem)!important;
        right: 25px!important;
        bottom: 129px!important;
    }
</style>`);


    var zendeskChatInterval = window.setInterval(function() {

        if (window.zE) {
            window.clearInterval(zendeskChatInterval);
            // Hides Zendesk by default
            zE('webWidget', 'hide');

            // Certainly takes over when the Zendesk chat is over
            zE('webWidget:on', 'chat:end', 
                function(){
                    console.log("Zendesk chat is over")
                    zE('webWidget', 'chat:end');

                    localStorage.removeItem("ZD-store");

                    zE('webWidget', 'hide');
                    localStorage.removeItem("ZD-store");
                    
                    certainly.resetChat(
                        {
                          webchatKey: "",
                        }
                      )

                    certainly.widgetStatus({
                        action: "show"
                    })
                }
            );

             // If there is an on going chat on Zendesk, opens it and hides Certainly
             if (zE('webWidget:get', 'chat:isChatting')){
                console.log("A conversation is ongoing on Zendesk")
                zE('webWidget', 'show');
                zE('webWidget', 'open');
                certainly.widgetStatus({
                    action: "hide"
                })                
            }
           
        }

    }, 200);


    certainly.getCertainlyTransfer({
        actionName: "*",
        callback: function(data) {
            if (data.cvars == "") {
                console.log("You need to enable your Certainly bot to expose custom variables")
            }
            if (data.cvars.zendesk && data.cvars.zendesk == "start_chat") {
                console.log("Starting a chat on Zendesk")
                if (window.zE) {
                    zE('webWidget', 'identify', {
                        name: data.cvars.visitor_name ? data.cvars.visitor_name : 'Anonymous Visitor',
                        email: data.cvars.visitor_email ? data.cvars.visitor_email :'visitor@email.com'
                    });

                    if (data.cvars.zendesk_department){
                        zE('webWidget', 'updateSettings', {
                            webWidget: {
                              chat: {
                                departments: {
                                  select: data.cvars.zendesk_department
                                }
                              }
                            }
                          });
                    }
                    var opening_message = data.cvars.chatHistory ? data.cvars.chatHistory : "The transcript between Certainly and this visitor is not available";
                    zE('webWidget', 'show');
                    zE('webWidget', 'open');
                    zE('webWidget', 'chat:addTags', ['chat_with_certainly', 'handed_over_by_certainly']);    
                    zE('webWidget', 'chat:send', opening_message);

                    // Hides the Certainly Widget
                    certainly.widgetStatus({
                        action: "hide"
                    })
                }

                // Resets the "zendesk" cvar
                certainly.sendCvars({
                    custom_vars: {
                        zendesk: ""
                    }
                })
            }
        }
    });
})();

