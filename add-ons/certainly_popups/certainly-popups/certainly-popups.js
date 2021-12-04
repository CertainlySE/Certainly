const CURRENT_URL = window.location.href;
const CURRENT_DEVICE_TYPE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? "mobile": "desktop";
let popups;

// Inits the Certainly Widget and passes the necessary callback functions
initCertainlyWidget(
	certainly_config,
	function(){
		certainly.minimize();
		certainly.checkPopups();
	}
);


// Debug utility function
certainly.trace = function (message){
	if(certainly_config.debug){
		console.trace(message+"\n")

	}
}

// Method that mazimized the Certainly Widget
certainly.open = function(){
	certainly.widgetStatus(
		{
			action: "open",
			webchatKey: certainly_config.webchatKey
		}
	)
}

// Method that set minimizes Certainly Widget
certainly.minimize = function(){
	certainly.widgetStatus(
		{
			action: "close",
			webchatKey: certainly_config.webchatKey
		}
	)
}

// Method that inits popups
certainly.initPopups = function(messages, trigger = "page_load", delay = 1000){
	delay = delay < 1000 ? 1000 : delay;
	console.log(messages,trigger,delay)
	if (trigger == "page_load"){
		setTimeout(() => {certainly.renderPopups(messages)}, delay);
	}
	else {
		setTimeout(() => {certainly.renderPopups(messages)}, delay);
	}
}

// Method that renders popup texts, after the popups have been initialized
certainly.renderPopups = function(messages){
	if (!document.querySelector(`#botxo-chat-${certainly_config.webchatKey}`)){
		certainly.trace("Certainly Widget not found. Cannot render popups")
		return;
	}
	if (!document.querySelector("#certainly-popups")){
		document.querySelector(`#botxo-chat-${certainly_config.webchatKey}`).
		insertAdjacentHTML('afterbegin', `<div id="certainly-popups-container">
				<ul id="certainly-popups">
					<div id="certainly-popups-close">X</div>
				</ul>
			</div>`);
		document.querySelector("#certainly-popups-close").addEventListener("click", function() {
			certainly.destroyPopups()
		}); 
}
	for (let i = 0; i < messages.length; i++) {
		setTimeout(function() { 
			certainly.trace("Rendering popups");
			var message_html = `<li class="certainly-message">
					<div class="certainly-bubble" title="Chatbot wrote: ${messages[i]}">${messages[i]}</div>
				</li>`;
			document.querySelector("#certainly-popups").insertAdjacentHTML('beforeend', message_html);
			// Attaches a click event listener to the latest rendered message bubble
			var existing_messages = document.querySelectorAll(".certainly-message");
			existing_messages[existing_messages.length-1].addEventListener("click", function() {
					certainly.destroyPopups(certainly.open())
				}); 
			
		}, i * 1550);
		
	}
}

// Method that destroys the redenred popups
certainly.destroyPopups = function(callback){
	if (!document.querySelector("#certainly-popups-container")){
		certainly.trace("Certainly Popup container not found")
		return;
	}
	document.querySelector("#certainly-popups-container").remove()
	if (callback && callback instanceof Function){
		callback();
	}
}

// Checks if popups are configured for this webpage & device type & locale
certainly.checkPopups = function(){
	if (CERTAINLY_POPUPS && CERTAINLY_POPUPS.length > 0){
		popups = CERTAINLY_POPUPS.filter( popup => popup.condition);
		// Checks if a popup is setup for both the current page and the current device
		if (popups.length != 0){
			certainly.trace("Popup available for this webpage")
			popups = popups.filter( popup => popup[CURRENT_DEVICE_TYPE]);
			
			if (popups.length == 0){
				certainly.trace("Popup not available for this device")
			}
		}
		// Checks if the popup should be shown, according to the repeat_after property
		if (popups.length > 0){
			var popup = popups[0];
			last_shown_popup = JSON.parse(window.localStorage.getItem(`certainly_popup_${popup.id}`));
			if(last_shown_popup){
				if(last_shown_popup && parseInt(last_shown_popup) < popup.repeat_after ){
					certainly.trace("A popup was found but not shown due to the repeat_after setting");
					console.log("up", last_shown_popup)
					console.log((parseInt(last_shown_popup) + 1))
					localStorage.setItem(`certainly_popup_${popup.id}`, JSON.stringify(
						(parseInt(last_shown_popup) + 1)
					));
					// Empties the list of popups that are valid for this webpage & device, because the only valid popup was recently shown
					popups = []
				}
			}
		}

		if (popups.length == 0){
			certainly.trace("No popups to show");
			return;
		}

		popup = popups[0];
		if(popup && popup.messages && popup.messages.length > 0) {
			popup.messages.forEach(variation => {
				if(variation.language == CURRENT_LANGUAGE){
					certainly.initPopups(variation.texts, popup.trigger, popup.delay)
					localStorage.setItem(`certainly_popup_${popup.id}`, JSON.stringify(1));
				}
				else {
					certainly.trace("Language variation unavailable for this popup")
				}
			});
		}
	}

	else {
		certainly.trace("No popups found in the configuration object certainly_config")
	}
}