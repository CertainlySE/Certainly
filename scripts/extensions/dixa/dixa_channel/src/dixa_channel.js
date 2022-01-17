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


/*
If there is an ongoing conversation on Dixa from a previous handover, resumes that one
*/
var dixaHasConversation;
if (JSON.parse(localStorage.getItem("dixa-widget"))){
	dixaHasConversation = JSON.parse(localStorage.getItem("dixa-widget")).conversation;
	if (dixaHasConversation.currentConversation && !dixaHasConversation.currentConversation.is_closed){
		console.log("Resuming conversation on Dixa");
		// Makes the bot start in hand over mode, waiting for human agents messages
		certainlySettings.ref = certainlySettings.modules.agentMessage;
		// Resets the last message sent by the human agent, so it is not printed twice
		certainlySettings.cvars.agent_message = "";
		// Assigns the user ID to the current metadata, so messages from the visitor are not posted back to Certainly
		certainlySettings.metapayload.userId = JSON.parse(localStorage.getItem("dixa-widget")).user.currentUser.id

	}
}
	
/*
*/


/*
Listens for when a conversation is started on Dixa via Dixa's API
*/
_dixa(
	"api.subscribe",
	"onConversationStarted",
	function(){
		console.log("Conversation started")
	}
);
/*
*/


/*
Listens for new messages in the conversation on Dixa via Dixa's API
When a new human agent message is exposed by Dixa, posts it to Certainly
*/
_dixa(
	"api.subscribe",
	"onMessageAdded",
	function(payload){
		console.log("Message added: ", payload)
		if (payload.author.id != certainlySettings.metapayload.userId && payload.author.name != "dixa-bot"){
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
				webchatKey: certainlySettings.webchatKey, // Required if specified in initCertainlyWidget()
			  }, function(){console.log("callback");}
			)
			// After the "Bot is typing" time has elapsed, post the agent message to Certainly
			setTimeout(function() {
				console.log("Posting message to Certainly");
				certainly.goTo({
					module: certainlySettings.modules.agentMessage,
					webchatKey: certainlySettings.webchatKey,
					cvars: {	
						agent_message: payload.message.text
					}
				})	
			}, messageWaitingTime);
		}
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
		certainly.goTo({
			module: certainlySettings.modules.agentJoined, // "Agent joined" module
			webchatKey: certainlySettings.webchatKey,
			cvars: {
				agentName: payload.agent.name
			}
		})
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
		certainly.goTo({
			module: certainlySettings.modules.agentLeft, // "Agent left" module
			webchatKey: certainlySettings.webchatKey,
			cvars: {
				agentName: payload.agent.name
			}
		})
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
	"onConversationEnded",
	function(){
		console.log("Conversation ended");
		certainly.goTo({
			module: certainlySettings.modules.conversationEnded, // Bot takeover module
			webchatKey: certainlySettings.webchatKey
		})
	}
);
/*
*/



/*
The function below:
(1) Inits the Certainly Widget
(2) Registers a callback for handing over the conversation to Dixa
When the conversation needs to be handed over, visitor metapayload is passed to Dixa, together with a transcript of the chat with Certainly
(3) Registers a callback for passing new visitor messages, sent through the Certainly Widget, to Dixa
*/		

function initCertainlyDixaChat(){
	initCertainlyWidget(
		
		// (1) Passes the Cetainly Chatbot config object to the init function
		certainlySettings, 

		// This is the callback function after Certainly has been initiated
		function() {			
			/*
			(2) Function that is executed when Certainly needs to pass the conversation to Dixa
			*/
			certainly.toDixa = function(certainlyMetapayload) {
				console.log("Triggering handover. Payload: ", certainlyMetapayload);
				//Updates the global object with the visitor metapayload so it can be used by other functions
				certainlySettings.metapayload.visitorName = certainlyMetapayload.visitorName;
				certainlySettings.metapayload.visitorEmail = certainlyMetapayload.visitorEmail;
				certainlySettings.metapayload.userId = certainlyMetapayload.userId;
				certainlySettings.metapayload.transcript = certainlyMetapayload.chatHistory;
				window._dixa('api.setView', 'conversation');
				window._dixa("api.setUser", certainlySettings.metapayload.visitorName, certainlySettings.metapayload.visitorEmail);
				// Sending a first message will trigger Dixa to create a new conversation
				window._dixa('api.setMessage', "New visitor from Certainly");
				// Injects the chat history from Certainly so that the agent can have some context
				setTimeout(function() {
					window._dixa('api.setMessage', certainlyMetapayload.chatHistory);
					
				}, 750);
				
			};
			/*
			*/
			
			
			/*
			Snippet below listens for when the function above should be executed
			*/
			certainly.getCertainlyTransfer({
				actionName: certainlySettings.waitingForAgent,
				webchatKey: certainlySettings.webchatKey,
				callback: (payload) => certainly.toDixa(payload.cvars) // The payload object contains information such as the latest visitor message and custom variables
			});
			/*
			*/
			
			/*
			(3) Snippet below listens for when new visitor messages on Certainly need to be posted to Dixa
			*/certainly.getCertainlyTransfer({
				actionName: certainlySettings.modules.visitorMessage,
				webchatKey: certainlySettings.webchatKey,
				callback: function(payload) {
					console.log("Sending visitor message to Dixa", payload)
					if (payload.cvars.visitor_message != null) {
						_dixa('api.setMessage', payload.cvars.visitor_message);
					}
				}
			});
			/*
			*/

		}
	)
}
/*
*/