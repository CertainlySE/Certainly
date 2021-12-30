// Hides the Gorgias Widget
document.head.insertAdjacentHTML("beforeend", `<style id="custom-gorgias-style">#gorgias-chat-container{ display:none;}</style>`)

var 
function showGorgiasChat() {
    // Overrides the default Gorgias Widget styling and shows it
    document.querySelector("#chat-window").contentDocument.body.insertAdjacentHTML("beforeend", `
 <style id="custom-gorgias-style">
   .widget-md {
     width:400px;
     height:600px;
     top:0;
     right:0;
     left:unset;
   }
   .widget-xs {
       border-radius: 10px!important;
   }
   .chat-title {
     display:none!important;
   }
   </style>`);

    document.querySelector("#custom-gorgias-style").innerHTML = `
 #chat-window {
   margin: 0px 40px 55px 0px;
   height: 600px!important;
   width: 400px!important;
   left: unset!important;
   bottom: 90px!important;
 }
 #chat-button {
    bottom: 58px!important;
    right: 36px!important;
 }`;
}


var gorgiasChatInterval = window.setInterval(function() {

    if (window.GorgiasChat && GorgiasChat.hasOwnProperty("on") && document.getElementById("gorgias-chat-container")) {

        window.clearInterval(gorgiasChatInterval);

        var lastSeenGorgias = localStorage.getItem("gorgias.chat-last-pending-message");
        var gorgiasMaxChatLifetime = 3600; // In seconds

        if (lastSeenGorgias) {
            if ((new Date() - Date.parse(lastSeenGorgias)) / 1000 < gorgiasMaxChatLifetime) {

                showGorgiasChat();

                certainly.widgetStatus({
                    action: "hide"
                })

            }
        }
    }

}, 200);


certainly.getCertainlyTransfer({
    actionName: "*",
    callback: function(data) {
        if (data.cvars == "") {
            console.log("You need to enable your Certainly bot to expose custom variables")
        }
        if (data.cvars.gorgias && data.cvars.gorgias == "start_chat") {
            console.log("Starting a chat on Gorgias")
            if (GorgiasChat) {
                GorgiasChat.captureUserEmail(data.cvars.customer_email);
                GorgiasChat.open()
                var opening_message = data.cvars.chatHistory ? data.cvars.chatHistory : "The transcript between Certainly and this visitor is not available";
                GorgiasChat.sendMessage(opening_message)

                showGorgiasChat();
                // Hides the Certainly Widget
                certainly.widgetStatus({
                    action: "hide"
                })
            }

            // Resets the "gorgias" cvar
            certainly.sendCvars({
                custom_vars: {
                    gorgias: ""
                }
            })
        }
    }
});
