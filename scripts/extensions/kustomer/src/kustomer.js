var kustomer_settings = {
	metadata: "",
	agent_id: "",
	user_id: "",
	previous_visitor_message: "",
	previous_agent_message: "",
	previous_event: ""
}

KustomerCore.init({
  brandId: kustomer_brand_id,
}, function (chatSettings) {
  KustomerCore.getConversations({}, function (res, error) {
    console.log('Fetched conversations!', res.conversations);
  });
});



KustomerCore.addListener('onAgentTypingActivity', (response, error) => {
  console.log(response);
  // Send an is typing event to Certainly
});

KustomerCore.addListener('onMessageReceived', (response, error) => {
  console.log(response);
   // Post agent reply to Certainly
});

KustomerCore.addListener('onConversationEnded', (response, error) => {
  console.log(response);
   // Moves bot to takeover module
  
		if (certainly_settings.dixa_events && certainly_settings.dixa_events.agent_left_message && dixa_settings.previous_event != "chat_ended"){
			dixa_settings.previous_event = "chat_ended";
			certainly.sendMessage(
				{
					sender: "bot",
					message: [
						{
							type: "card",
							cards: [
								{
									title: "",
									text: certainly_settings.dixa_events.agent_left_message,
									is_shareable: false,
									image_source_url: "",
									image_destination_url: "",
									buttons: []
								}
							]
						}
					]
				}
			);
			certainly.goTo(
			{
				module: certainly_settings.dixa_events.takeover_module,
				webchatKey: 1
			});					
			
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

              if (typeof(data.cvars.visitor_email) != 'undefined'){
                KustomeCorer.describeCustomer({
                  attributes: {
                    emails: [data.cvars.customer_email]
                  }
                });
              }

              certainly.chat_history = data.cvars.chatHistory;
              // Describes a conversation when a conversation is created
              KustomerCore.addListener('onConversationCreate', (res) => {
                KustomerCore.describeConversation({
                  conversationId: res.conversationId,
                  customAttributes: {
                    certainlyHistoryTxt: certainly.chat_history ? certainly.chat_history : "The transcript between Certainly and this visitor is not available"
                  }
                });
              });

              // Create a new conversation on Kustomer
              kustomerCore.createConversation(
                {
                  title: `Chat between Certainly and ${data.cvars.visitor_name}`,
                  brand: kustomer_brand_id
                },
                (response, error) => {
                  console.log('Session was created!');
                })

            


              certainly.sendCvars({
                webchatKey: 1,
                custom_vars: {
                    kustomer: ""
                }
              })
          }
          
      }
      if (data.cvars.kustomer && data.cvars.kustomer == "send_message") {
        console.log("Posting chat message on Kustomer")
        if (data.cvars.visitor_message != kustomer_settings.previous_visitor_message){
          window._dixa('api.setMessage', data.cvars.visitor_message);
          kustomer_settings.previous_visitor_message = data.cvars.visitor_message
        }
      }
  }
});
