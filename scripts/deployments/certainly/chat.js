
var ad_preferences = localStorage.getItem("certainly-preferences") ? JSON.parse(localStorage.getItem("certainly-preferences")).ad_storage : "rejected"; // This is checking if the customer accepted marketing cookies. We hardcode the value to granted for test purposes, but for the live website we need to change it to "JSON.parse(localStorage.getItem("certainly-preferences")).ad_storage"

window.certainly_settings = {
	id: "93c195ef-d163-4511-8494-9834408e0e0f",
	mode: "clear_past_conversations", //this mode allows us everytime we refresh the page for the bot to start from zero. When we delete this the bot will continue from where it left off. 
	inputType: "bottom",
	cvars: {
		ad_preferences: ad_preferences,
		language: "en"
	},
}

/*var chat_started = false;

	certainly.getCertainlyTransfer({
	actionName: "*",
	callback: function (data) {
		if (!chat_started) {
			chat_started = true;
			geocode();
		}
	}
});

function geocode() {
	fetch('https://ipapi.co/json/', function (data) {
		var user_data = JSON.stringify(data, null, 2);
		return user_data;
	}).then(function (response) {
		return response.json();
	}).then(function (data) {
		certainly.sendCvars({
			custom_vars: {
				visitor_ip: data.ip,
				visitor_country: data.country_name
			},
			openChat: false
		})
	}).catch(function () {
		console.log("IP Address unvailable");
	});
}
*/

window.addEventListener('certainly_popups_ready',
    function (e) {   
        certainly.getCertainlyTransfer({
            actionName: "*",
            callback: function (data){
                conversationUpdated(data)
            } // The data object contains information such as the latest visitor message and custom variables
        });
    })


var previous_web_action = "";
var previous_data = "";

function conversationUpdated(data){
    console.log(data)
    previous_data = data;
    if (data.cvars.web_action == "open_url" && previous_web_action != "open_url" && typeof(data.cvars.url) != null){
        var destination_url = data.cvars.url;
        if (destination_url.includes("certainly.io")) {
            window.location.href = destination_url;
        }
        else { //In case the URL specified in the cvar is a relative path
            window.location.href = `${window.location.origin}/${destination_url}`
        }
    }
}