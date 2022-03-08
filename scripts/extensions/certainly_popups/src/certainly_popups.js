//Small utility function to listen for when an object is defined
(function(){window.whenDefined=function(a,b,c){a[b]?c():Object.defineProperty(a,b,{configurable:!0,enumerable:!0,writeable:!0,get:function(){return this["_"+b]},set:function(a){this["_"+b]=a,c()}})}}).call(this);

var checkExist = setInterval(function() {
	if (certainly && certainly_settings && certainly_settings.cvars) {
		 clearInterval(checkExist);

	var certainly_popups = {  // Global variables used later on
		to_render: {},
		time: "",
		current_url: window.location.href,
		current_device_type: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? "mobile": "desktop"
	}


		
	// Debug utility function
	certainly.trace = function (message, object){
		if (typeof certainly_settings !== "undefined" ){
			if(certainly_settings.debuggerMode && certainly_settings.debuggerMode == '1'){
				console.trace(message+"\n", object)
			}
		}
	}

	// Method that maximizes the Certainly Widget
	certainly.open = function(callback){
		certainly.widgetStatus(
			{
				action: "open",
			}, callback
		)
	}

	// Method that  minimizes the Certainly Widget
	certainly.minimize = function(callback){
		certainly.widgetStatus(
			{
				action: "close",
			},
			()=> {if(callback){callback();}}
		)
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
				certainly.trace("Found popup rules with the same id property. Please ensure each popup rule has a unique id")
				if(callback){
					callback();
				}
				return;
			}

			certainly_popups.to_render.all = CERTAINLY_POPUPS.filter( popup => ( popup.condition && 
				popup[certainly_popups.current_device_type]));

			if (certainly_popups.to_render.all.length > 0) {
				console.log("Rendering popups", certainly_popups.to_render.all)
				//certainly.initPopup(certainly_popups.to_render.all[0])

				certainly_popups.to_render.page_load = certainly_popups.to_render.all.filter( popup => ( popup.trigger == "page_load"));
				certainly_popups.to_render.visitor_inactive = certainly_popups.to_render.all.filter( popup => ( popup.trigger == "visitor_inactive"));
				certainly_popups.to_render.chat_minimized = certainly_popups.to_render.all.filter( popup => ( popup.trigger == "chat_minimized"));
				
				if (certainly_popups.to_render.page_load.length > 0) {
					certainly.initPopup(certainly_popups.to_render.page_load[0])
				}

				if (certainly_popups.to_render.visitor_inactive.length > 0) {
					certainly.initPopup(certainly_popups.to_render.visitor_inactive[0])
				}

				if (certainly_popups.to_render.chat_minimized.length > 0) {
					certainly.initPopup(certainly_popups.to_render.chat_minimized[0])
				}


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

	// Method that inits popups
	certainly.initPopup = function(popup){
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

		// Checks if the popup should be shown based on the repeat_after parameters
		var last_popup_occurrence = parseInt(JSON.parse(window.localStorage.getItem(`certainly_popup_${popup.id}`)));
		if (!last_popup_occurrence){
			last_popup_occurrence = 0;
		}

		if(last_popup_occurrence){
			if (last_popup_occurrence > popup.repeat_after || popup.repeat_after == 0){
				localStorage.setItem(`certainly_popup_${popup.id}`, JSON.stringify(
					(1)
				));
			}
			else if( last_popup_occurrence <= popup.repeat_after ){
				certainly.trace("A popup was found but not shown due to the repeat_after setting", popup);
				localStorage.setItem(`certainly_popup_${popup.id}`, JSON.stringify(
					(last_popup_occurrence + 1)
				));
				return;
			}
			else {
				localStorage.setItem(`certainly_popup_${popup.id}`, JSON.stringify(
					(last_popup_occurrence + 1)
				));
			}
			
		}
		else {			
			localStorage.setItem(`certainly_popup_${popup.id}`, JSON.stringify(
				(1)
			));
		}

		
		if (popup.trigger == "page_load"){ // Immediately renders the popups

			// Passes the active popup as a cvar to the bot, so it can be used in the conversation logic
			certainly_settings.cvars.current_popup = popup.id;

			// If the starting module is overridden in the popup setings, applies the change
			if (popup.start_from_module && popup.start_from_module != ""){
				certainly_settings.ref = popup.start_from_module;
			}

			setTimeout(() => {certainly.renderPopups(messages.texts, popup.trigger)}, popup.delay);

		}
		else if (popup.trigger == "chat_minimized"){ // Attaches an event listner for when the Certainly Widget is minimized
			certainly.trace("This popup will be rendered when Certainly is minimized")
			window.certainly_popup_on_chat_minimized = false;
			certainly.onWidgetOpen = function(){ // Wraps the onClose method, so that the first time the bot is minimized programmatically, the popup on minimize is not shown
				certainly.onWidgetClose = function(){ // Renders the popup on Widget close
					if (certainly_popup_on_chat_minimized == false){
						certainly_popup_on_chat_minimized = true;
						setTimeout(() => {certainly.renderPopups(messages.texts, popup.trigger)}, popup.delay);
									
					}									
				}
			}		
		}
		else if (popup.trigger == "visitor_inactive"){
			certainly.trace("Init. Inactiviy trigger")
			function trackInactivity() {
				var t;
				window.certainly_inactivity_triggered = false;
				document.onload = document.onmousemove = document.onmousedown = document.ontouchstart = document.ontouchmove =	document.onclick = document.onkeydown = resetTimer;   
				document.addEventListener('scroll', resetTimer, true);
				document.addEventListener('certainly_conversation_updated', resetTimer, true);

				certainly.getCertainlyTransfer({
					actionName: "*",
					webchatKey: "1",
					callback: (data) => {
						//console.log("Conversation updated")
						document.dispatchEvent(new Event("certainly_conversation_updated"))
					}
				});
		
				function promptInactivity() {
					if (window.certainly_inactivity_triggered == false){
						//console.log("You were inactive")
						window.certainly_inactivity_triggered = true;
						setTimeout(() => {certainly.renderPopups(messages.texts, popup.trigger)}, popup.delay);
					}
					else {
						//console.log("Inactivity already triggered")
					}
				}
		
				function resetTimer() {
						//console.log("resetting timer")
						clearTimeout(t);
						if (window.certainly_inactivity_triggered == false){
							t = setTimeout(promptInactivity, popup.delay); 
						}
						
				}
		}
		trackInactivity();

		}
	}

// Method that renders popup texts, after the popups have been initialized
certainly.renderPopups = function(messages, trigger){
	var widget_status = localStorage.getItem("statusWebchat-1");
	if ( typeof(widget_status) != null && widget_status == "open" && trigger != "visitor_inactive"){
		certainly.trace("Certainly Widget is open, the following popups will not be rendered", messages)
		return;
	}
	if ( typeof(widget_status) != null && widget_status == "open" && trigger == "visitor_inactive"){
		certainly.trace("Certainly Widget is open, the following popup will be sent as a message", messages)
		messages.forEach(function(message){
			//console.log("sending message:", message)
			certainly.sendMessage(
				{
					sender: "bot",
					message: message,
					webchatKey: "1"
				}
			)
		})
		return;
	}
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
				<div class="certainly-bubble" title="Chatbot wrote: ${messages[i]}">${messages[i].replace(/\n/g,' <br>')}</div>
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
						window.certainly_ready = true;
						window.dispatchEvent(new Event('certainly_ready'));
					}
				)
			}
		);


}
}, 100); 