var dixa_settings = {
	metadata: "",
	agent_id: "",
	user_id: "",
	previous_visitor_message: "",
	previous_agent_message: "",
	previous_event: ""
}

console.log("Hello")

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
	dixa_settings.metadata = JSON.parse(localStorage.getItem("dixa-widget"))
	console.log("meta", dixa_settings.metadata)
	if(dixa_settings.metadata != null){
		if (dixa_settings.metadata.conversation.currentConversation){
			dixa_settings.user_id = dixa_settings.metadata.user.currentUser.id; 
			if (dixa_settings.metadata.conversation.assignedAgent){				
				dixa_settings.agent_id = dixa_settings.metadata.conversation.assignedAgent.agent_id 
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
		dixa_settings.agent_id = payload.agent.id;
		if (certainly_settings.dixa_events && certainly_settings.dixa_events.agent_joined_message && dixa_settings.previous_event != payload){
			dixa_settings.previous_event = payload;
			certainly.sendMessage(
				{
					sender: "bot",
					message: [
						{
							type: "card",
							cards: [
								{
									title: "",
									text: certainly_settings.dixa_events.agent_joined_message,
									is_shareable: false,
									image_source_url: "",
									image_destination_url: "",
									buttons: []
								}
							]
						}
					],
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
		if (certainly_settings.dixa_events && certainly_settings.dixa_events.agent_left_message && dixa_settings.previous_event != payload){
			dixa_settings.previous_event = payload;
			certainly.sendMessage(
				{
					sender: "bot", // Required
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
					],
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
	}
);
/*
*/


/*
Listens for new messages in the conversation on Dixa via Dixa's API
When a new human agent message is exposed by Dixa, posts it to Certainly
*/

var dixaChatInterval = window.setInterval(function() {
	if (dixa_settings.metadata != null && dixa_settings.metadata.conversation.currentConversation != null) {
		synchDixa();
		window.clearInterval(dixaChatInterval);
		if(dixa_settings.metadata.conversation.closing){
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
			if (dixa_settings.agent_id == "") {
				dixa_settings.metadata = JSON.parse(localStorage.getItem("dixa-widget"))
				dixa_settings.agent_id = dixa_settings.metadata.conversation.assignedAgent.agent_id
				if (dixa_settings.agent_id == null) {
					dixa_settings.agent_id = dixa_settings.metadata.conversation.assignedAgent.id
				}
			}
			
			if (payload.author.id == dixa_settings.agent_id && payload.author.name != "dixa-bot" && payload.message.text != dixa_settings.previous_agent_message){
				console.log("Sending human agent message to Certainly")
				dixa_settings.previous_agent_message = payload.message.text;
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
							},
							openChat: false
						})
					}
					trackDixaChat();
				}

				if (data.cvars.dixa && data.cvars.dixa == "send_message") {
					if (data.cvars.visitor_message != dixa_settings.previous_visitor_message){
						window._dixa('api.setMessage', data.cvars.visitor_message);
						dixa_settings.previous_visitor_message = data.cvars.visitor_message
					}
				}
		}
});