var dixa_settings = {
	dixa_metadata: "",
	current_dixa_agent_id: "",
	current_dixa_user_id: "",
	previous_visitor_message: "",
}

_dixa("api.showWidget", "{\"show_widget\":false, \"show_contact_form\":false}");
/*
Hides permanently the Dixa Widget
*/
var styleString = `#dixa-iframe-wrapper {
	display: none!important;
	}`;
	
const style = document.createElement('style');
style.textContent = styleString;
document.head.append(style);
/*
*/

function synchDixa(){
	dixa_settings.dixa_metadata = JSON.parse(localStorage.getItem("dixa-widget"))
	console.log("meta", dixa_settings.dixa_metadata)
	if(dixa_settings.dixa_metadata != null){
		if (dixa_settings.dixa_metadata.conversation.currentConversation){
			dixa_settings.current_dixa_user_id = dixa_settings.dixa_metadata.user.currentUser.id; 
			if (dixa_settings.dixa_metadata.conversation.assignedAgent){				
				dixa_settings.current_dixa_agent_id = dixa_settings.dixa_metadata.conversation.assignedAgent.agent_id 
			}
			 
		} 
	}
}

synchDixa();

/*
Listens for when a conversation is started on Dixa via Dixa's API
*/
_dixa(
	"api.subscribe",
	"onConversationStarted",
	function(){
		console.log("Conversation started");
		
	}
);
/*
*/


/*
Listens for when an agent is assigned to the current chat via Dixa's API
Posts it to Certainly
*/
_dixa(
	"api.subscribe",
	"onAgentAssigned",
	function(payload){
		console.log("Agent joined: ", payload)
		dixa_settings.current_dixa_agent_id = payload.agent.id;
		if (dixa_events && dixa_events.agent_joined_message){
			certainly.sendMessage(
				{
					sender: "bot", // Required
					message: dixa_events.agent_joined_message, // Required
					webchatKey: "1", // Only required if specified in initCertainlyWidget()
				}
			)
		}
	}
);
/*
*/

/*
Listens for when an agent leaves the current chat via Dixa's API
Posts it to Certainly
*/
_dixa(
	"api.subscribe",
	"onAgentUnassigned",
	function(payload){
		console.log("Agent left: ", payload)
		if (dixa_events && dixa_events.agent_left_message){
			certainly.sendMessage(
				{
					sender: "bot", // Required
					message: dixa_events.agent_left_message, // Required
					webchatKey: "1", // Only required if specified in initCertainlyWidget()
				}
			)
		}
	}
);
/*
*/

/*
Listens for when the conversation is ended via Dixa's API
Posts it to Certainly
*/
_dixa(
	"api.subscribe",
	"onConversationEnded",
	function(){
		console.log("Conversation ended");
		if (dixa_events && dixa_events.agent_left_message){
			certainly.sendMessage(
				{
					sender: "bot", // Required
					message: dixa_events.agent_left_message, // Required
					webchatKey: "1", // Only required if specified in initCertainlyWidget()
				}
			),
			function(){
				certainly.goTo(
					{
						module: dixa_events.bot_takeover, // Required
						webchatKey: "1" // Only required if specified in initCertainlyWidget()
					});				
			}
		}
	}
);
/*
*/


/*
Listens for new messages in the conversation on Dixa via Dixa's API
When a new human agent message is exposed by Dixa, posts it to Certainly
*/

var dixaChatInterval = window.setInterval(function() {
	synchDixa();
	if (dixa_settings.dixa_metadata.conversation.currentConversation != null) {
		window.clearInterval(dixaChatInterval);
		if(dixa_settings.dixa_metadata.conversation.closing){
		}
		trackDixaChat();
	}
}, 200);

function trackDixaChat(){
	_dixa(
		"api.subscribe",
		"onMessageAdded",
		function(payload){						
			console.log("Message added: ", payload)
			if (payload.author.id != dixa_settings.current_dixa_user_id && payload.author.name != "dixa-bot"){
				console.log("Sending human agent message to Certainly")
				// First, simulates a "Bot is typing" event
				var messageWaitingTime = 125 * payload.message.text.length; // In ms
				certainly.sendMessage(
					{
					sender: "bot", // Required
					message: {
						type: "wait",
						wait: messageWaitingTime,
					},
					webchatKey: "1"
					}, function(){
							console.log("callback");
						}
				)
				// After the "Bot is typing" time has elapsed, post the agent message to Certainly
				setTimeout(function() {
					console.log("Posting message to Certainly");

					certainly.dataCertainlyTransfer({ 
						data: { 
							type: "message_bot", 
							message: `${payload.message.text}`
						},
						webchatKey: "1",
						openWebchat: true // Whether the chat should stay open after the message is sent 
					})
				}, messageWaitingTime);
			}
	})
}


/*
*/

certainly.getCertainlyTransfer({
	actionName: "*",
	callback: function(data) {
		console.log(data)
			if (data.cvars == "") {
					console.log("You need to enable your Certainly bot to expose custom variables")
			}
			if (data.cvars.dixa && data.cvars.dixa == "start_chat") {
					console.log("Starting a chat on Dixa")
					if (window._dixa) {
						var visitor_name = data.cvars.visitor_name ? data.cvars.visitor_name : 'Anonymous Visitor';
						var visitor_email = data.cvars.visitor_email ? data.cvars.visitor_email :'visitor@email.com';
						
						window._dixa('api.setView', 'conversation');
						_dixa("api.setUser", visitor_name, visitor_email);

						var opening_message = data.cvars.chatHistory ? data.cvars.chatHistory : "The transcript between Certainly and this visitor is not available";
						
						_dixa("api.showWidget", "{\"show_widget\":true, \"show_contact_form\":false}");
						//window._dixa('api.setMessage', "New visitor from Certainly");

						setTimeout(function() {
							window._dixa('api.setMessage', opening_message);
						}, 750);

						// Resets the "zendesk" cvar
						certainly.sendCvars({
							custom_vars: {
									dixa: ""
							}
						})
					}
				}

				if (data.cvars.dixa && data.cvars.dixa == "send_message") {
					if (data.cvars.visitor_message != dixa_settings.previous_visitor_message){
						window._dixa('api.setMessage', data.cvars.visitor_message);
						dixa_settings.previous_visitor_message = data.cvars.visitor_message
					}
				}
		}
});