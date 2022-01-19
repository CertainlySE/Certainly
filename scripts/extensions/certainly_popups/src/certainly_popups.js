//Small utility function to listen for when an object is defined
(function(){window.whenDefined=function(a,b,c){a[b]?c():Object.defineProperty(a,b,{configurable:!0,enumerable:!0,writeable:!0,get:function(){return this["_"+b]},set:function(a){this["_"+b]=a,c()}})}}).call(this);

whenDefined(window, 'certainly', 
// Certainly Popups
function() {
var certainly_popups = {  // Global variables used later on
	to_render: "",
	time: "",
	current_url: window.location.href,
	current_device_type: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? "mobile": "desktop"
}

// Debug utility function
certainly.trace = function (message){
	if (typeof certainly_settings !== "undefined" ){
		if(certainly_settings.debuggerMode && certainly_settings.debuggerMode == '1'){
			console.trace(message+"\n")
		}
	}
}

// Method that maximizes the Certainly Widget
certainly.open = function(callback){
	certainly.widgetStatus(
		{
			action: "open",
			webchatKey: certainly_settings.webchatKey
		}, callback
	)
}

// Method that  minimizes the Certainly Widget
certainly.minimize = function(callback){
	certainly.widgetStatus(
		{
			action: "close",
			webchatKey: certainly_settings.webchatKey
		},
		()=> {if(callback){callback();}}
	)
}


// Method that inits popups
certainly.initPopups = function(popup){
	popup.trigger = popup.trigger ? popup.trigger : "page_load";
	popup.delay = popup.delay < 1000 ? 1000 : popup.delay;
	popup.repeat_after = popup.repeat_after ? popup.repeat_after : 0;
	var messages = popup.messages.find( message => ( message.language == 			certainly_settings.language ||
	!	certainly_settings.language ||
	certainly_settings.language == ""));

	if (messages.length == 0){
		certainly.trace("No message texts variations available for the current language")
		return;
	}
	
	if (popup.trigger == "page_load"){ // Immediately renders the popups
		// Passes the active popup as a cvar to the bot, so it can be used in the conversation logic
		certainly_settings.cvars.current_popup = popup.id;
		// If the starting module is overridden in the popup setings, applies the change
		if (popup.start_from_module && popup.start_from_module != ""){
			certainly_settings.ref = popup.start_from_module;
		}
		last_shown_popup = parseInt(JSON.parse(window.localStorage.getItem(`certainly_popup_${popup.id}`)));
		if(!last_shown_popup){
			last_shown_popup = 0;
		}
		if(last_shown_popup){
			if (last_shown_popup > popup.repeat_after || popup.repeat_after == 0){
				localStorage.setItem(`certainly_popup_${popup.id}`, JSON.stringify(
					(1)
				));
				setTimeout(() => {certainly.renderPopups(messages.texts)}, popup.delay);
			}
			else if( last_shown_popup <= popup.repeat_after ){
				certainly.trace("A popup was found but not shown due to the repeat_after setting");
				localStorage.setItem(`certainly_popup_${popup.id}`, JSON.stringify(
					(last_shown_popup + 1)
				));
			}
			else {
				localStorage.setItem(`certainly_popup_${popup.id}`, JSON.stringify(
					(last_shown_popup + 1)
				));
			}
			
		}
		else {
			setTimeout(() => {certainly.renderPopups(messages.texts)}, popup.delay);
			localStorage.setItem(`certainly_popup_${popup.id}`, JSON.stringify(
				(1)
			));
		}
	}
	else if (popup.trigger == "chat_minimized"){ // Attaches an event listner for when the Certainly Widget is minimized
		certainly.trace("This popup will be rendered when Certainly is minimized")
		var certainly_popups_on_chat_minimized = 0;
		certainly.onWidgetOpen = function(){ // Wraps the onClose method, so that the first time the bot is minimized programmatically, the popup on minimize is not shown
			certainly.onWidgetClose = function(){ // Renders the popup on Widget close
				if (certainly_popups_on_chat_minimized == 0 ||
					popup.repeat_after == 0){
					setTimeout(() => {certainly.renderPopups(messages.texts)}, popup.delay);
								
				}
				certainly_popups_on_chat_minimized = certainly_popups_on_chat_minimized + 1;

				// Resets the shown counter
				if(certainly_popups_on_chat_minimized == repeat_after){ 
					certainly_popups_on_chat_minimized = 0;
				}
								
			}
		}		
	}
	else if (popup.trigger == "inactivity"){

	}
	else { // If the trigger is not recognized, immediately renders the popup
		setTimeout(() => {certainly.renderPopups(messages.texts)}, popup.delay);
	}
}

// Method that renders popup texts, after the popups have been initialized
certainly.renderPopups = function(messages){
	if (!document.querySelector(`div[id^='botxo-chat-']`)){
		certainly.trace("Certainly Widget not found. Cannot render popups")
		return;
	}
	if (!document.querySelector("#certainly-popups")){
		document.querySelector(`div[id^='botxo-chat-']`).
		insertAdjacentHTML('afterbegin', `<div id="certainly-popups-container">
				<ul id="certainly-popups">
					<div id="certainly-popups-close" style="display:none;">X</div>
				</ul>
			</div>`);
		document.querySelector("#certainly-popups-close").addEventListener("click", function() {
			certainly.destroyPopups()
		}); 
	}
	certainly.trace("Rendering popups", messages);
	for (let i = 0; i < messages.length; i++) {
		var message_html = `<li class="certainly-message">
				<div class="certainly-bubble" title="Chatbot wrote: ${messages[i]}">${messages[i]}</div>
			</li>`;
		document.querySelector("#certainly-popups").insertAdjacentHTML('beforeend', message_html);
		// Attaches a click event listener to the latest rendered message bubble
		var existing_messages = document.querySelectorAll(".certainly-message");
		existing_messages.forEach(function(message){
			setTimeout(function() {
				message.style.transform = "scale(1)";
				message.addEventListener("click", function() {
					certainly.destroyPopups(certainly.open())
				});
				document.querySelector("#certainly-popups-close").style.display = "block";
			}, i*1100)
		});

		// Listener for when the Certainly Widget is opened
		certainly.onWidgetOpen = function(){
			certainly.destroyPopups();
		}	
	}
}

// Method that destroys the rendered popups
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
certainly.checkPopups = function(callback){
	if (typeof CERTAINLY_POPUPS === 'undefined'){
		certainly.trace("No popup configuration found. Please define your popup rules via the CERTAINLY_POPUPS const");
		return;
	}
	if (CERTAINLY_POPUPS && CERTAINLY_POPUPS.length > 0){

		// Checks if any popup rules share the same id. It is forbidden
		var valueArr = CERTAINLY_POPUPS.map(function(item){ return item.id });
		var duplicateExists = valueArr.some(function(item, idx){ 
				return valueArr.indexOf(item) != idx 
		});
		if (duplicateExists){
			certainly.trace("Found popup rules with the same id property. Please ensure each popup rule has a unique value as an id")
			if(callback){
				callback();
			}
			return;
		}

		certainly_popups.to_render = CERTAINLY_POPUPS.filter( popup => ( popup.condition && 
			popup[certainly_popups.current_device_type]));
		// Checks if a popup is setup for both the current page and the current device


		/*certainly_popups.to_render.forEach(function(popup){
			if (popup && popup.messages && popup.messages.length > 0) {
				certainly.initPopups(certainly_popups.to_render[0])
			}
			popup.messages.forEach(variation => {
				if (variation.language == certainly_settings.cvars.language || !certainly_settings.cvars.language || certainly_settings.cvars.language == ""){						
					}
			});
		});*/
		//
		if (certainly_popups.to_render.length > 0) {
			console.log("Rendering popups", certainly_popups.to_render)
			certainly.initPopups(certainly_popups.to_render[0])
		}
					
		if (certainly_popups.to_render.length == 0){
			certainly.trace("No popups to show");
		}
	}

	else {
		certainly.trace("No popups found in the configuration object certainly_settings")
	}

	if(callback){
		callback();
	}
}

// Inits the Certainly Widget and passes the necessary callback functions
certainly.checkPopups(
	function(){
		if (typeof certainly_settings === "undefined" ){
			certainly.trace(`Certainly could not be launched.\nYou need to define your web widget settings under variable "certainly_settings"`)
			return;
		}
		initCertainlyWidget(
			certainly_settings,
			function(){
				certainly.minimize();
			}
		)
	}
);
})