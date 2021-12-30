var gorgiasChatInterval = window.setInterval(function() {
  if (window.GorgiasChat && GorgiasChat.hasOwnProperty("on")) {
      window.clearInterval(gorgiasChatInterval); // this line breaks out of the loop - make sure it's not deleted.
      // the list of supported events is detailed below
      GorgiasChat.on('typing:start', function(data) {
        console.log("Rendering is typing on Certainly to Certainly:");
        
          // your code should go here
      });

      GorgiasChat.on('message:received', function(data) {
        console.log("Sending message to Certainly:", data.content.text);
        if(certainly && CERTAINLY_GORGIAS){
          
          certainly.goTo(
            {
              module: CERTAINLY_GORGIAS.agent_reply,
              webchatKey: "",
              cvars: { 
                agent_reply: data.content.text
              }
            }
          )
        }
          // your code should go here
      });
  }
}, 100);

var previous_metadata;

if (CERTAINLY_GORGIAS){
  certainly.getCertainlyTransfer({
    actionName: "*",
    callback: function(data){
      console.log("Moved to module:", data)
      
      switch(data.cvars.gorgias) {
        // Starts a conversation inside Gorgias Chat
        // The transcript of the chat between Certainly and the visitor is passed as a first message
        case "start_chat":
          // code block
          console.log("Starting a chat on Gorgias")
          if(GorgiasChat){
            GorgiasChat.open()
            var opening_message = data.cvars.chatHistory ? data.cvars.chatHistory : "The transcript between Certainly and this visitor is not available";
            GorgiasChat.sendMessage(opening_message)
          }
          break;

        // Posts the last Certainly visitor message on Gorgias Chat
        case "send_message":
          console.log("Sending a message to Gorgias")
          if(GorgiasChat){
            GorgiasChat.open()
            var new_visitor_message = data.cvars.visitor_reply ? data.cvars.visitor_reply : "Error";
            GorgiasChat.sendMessage(data.cvars.visitor_reply)
          }
          break;
        default:
          // code block
      }

      // Resets the "gorgias" cvar
      certainly.sendCvars({
        custom_vars:{
          gorgias: ""
        }

      })
      

    }
  });
}

else {
  console.error("No Certainly <> Gorgias configuration was found. Live handover will not work")
}