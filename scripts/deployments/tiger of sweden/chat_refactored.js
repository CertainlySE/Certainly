var certainly_settings = {}; // Global variable

var script = document.createElement('script');
script.type = "text/javascript";
script.id = "certainly-popups-config"
script.addEventListener("load", function(event) {
  loadSDK();
});
script.src = "https://scripts.certainly.io/deployments/tiger_of_sweden/certainly_popups_config.js";
document.getElementsByTagName('head')[0].appendChild(script);

function loadSDK(){
  var script = document.createElement('script');
  script.type = "text/javascript";
  script.id = "certainly-web-sdk"
  script.addEventListener("load", function(event) {
    launchChat();
  });
  script.src = "https://app.certainly.io/sdk/webchat.js";
  document.getElementsByTagName('head')[0].appendChild(script);
}

function launchChat() {
    var url = new URL(window.location.href);
    // Killer switch for the chat
    if (!url.searchParams.get('disableBot')) {
        return
    } else {
    // Loads the chat

        window.zESettings = {
                helpCenter: {
                    suppress: true
                }
            }
        };

        
        var current_page = "";
        var urlParams = new URLSearchParams(window.location.search);

        // ######## Start of triggers settings ########

         // ######## Start of Certainly chatbot configuration object ########
        certainly_settings = {
            id: "f5ab1403-3b14-4b80-9267-11c96f90cfac",
            mode: "clear_past_conversations",
            bottom: 25,
            right: 25,
            zIndex: 19,
            buttonLogoOpen: "https://s3.eu-central-1.amazonaws.com/botxo-assets-production/media/bot-images/e5a2a2d1-021.png",
          buttonLogoClose: "https://s3.eu-central-1.amazonaws.com/botxo-assets-production/media/bot-images/e5a2a2d1-021.png",          
            //clearWebchatState: true,
            //debuggerMode: 1,
            chatStarted: false,
            cvars: {
                itemsInCart: document.getElementsByClassName("mini-cart-items-number")[0].innerText,
                current_page: "",
                current_product_name: "",
                product_recommended: urlParams.get('certainly_landing_on_recommendation') ? "true" : "false",
                locale: document.getElementById("countryselector").dataset.dataCountry ? document.getElementById("countryselector").dataset.dataCountry : "gb"
            },
            language: "en",
            debuggerMode: 1,
	        	debug: true,
        }
        // ######## End of Certainly chatbot configuration object ########




        // ####### Page related settings ##### //

        if (window.location.pathname.length < 5) {
            certainly_settings.cvars.current_page = "home"
        } else if (window.location.href.includes("checkout")) {
            certainly_settings.cvars.current_page = "checkout"
        }



        if (document.getElementById("pid") != null) { // The current page is a product page
            certainly_settings.cvars.current_product_id = document.getElementById("pid").value;
            certainly_settings.cvars.current_product_name = document.getElementsByClassName("product-name")[0].innerText;
            certainly_settings.cvars.current_page = "product";

            certainly_settings.cvars.available_sizes = ""
            var sizeOptions = document.getElementsByClassName("sp-opt");
            for (i = 0; i < sizeOptions.length; i++) {
                var sizeOption = sizeOptions[i].dataset.variationvalue;
                if (certainly_settings.cvars.available_sizes == "" && sizeOption != null) {
                    certainly_settings.cvars.available_sizes = sizeOption
                } else if (sizeOption != null) {
                    certainly_settings.cvars.available_sizes = certainly_settings.cvars.available_sizes + "," + sizeOption
                }
            }

            if (document.getElementsByClassName("attribute-type-length attribute")[0] != null) {
                certainly_settings.cvars.product_length_available = "true"

            }
        }
        url.searchParams.forEach(function(value, key) {
            if (key.includes("dwvar")) { //current active page is a product page
                certainly_settings.cvars.current_product_variation = value;
            }
        });


    certainly.getCertainlyTransfer({
      actionName: "*",
      callback: function (data){
        conversationUpdated(data)
      } // The data object contains information such as the latest visitor message and custom variables
   });

  function conversationUpdated(data){
    console.log(data)

    if (data.cvars.recommended_size != null){
      selectSize(data.cvars.recommended_size)
    }
  }

  function selectSize(recommended_size){
    console.log("trying to select ", recommended_size)
    var sizeFound = false;
  
    var sizeOptions = document.getElementsByClassName("sp-opt");
  
    for (i = 0; i < sizeOptions.length; i++) {
        if (sizeOptions[i].hasAttribute("data-variationvalue")) {
            if (sizeOptions[i].innerText.includes("Notify") && sizeOptions[i].dataset.variationvalue == recommended_size) {
                setTimeout(function() {
                    certainly.goTo({
                        module: "656041",
                        
                        cvars: {
                            "current_variant_id": document.querySelectorAll("#pid")[0].value
                        }
                    })
                }, 500);
                sizeFound = true;
            } else if (sizeOptions[i].dataset.variationvalue == recommended_size) {
  
                document.getElementsByClassName("attribute-type-size")[0].click()
                document.querySelector(".sp-opt[data-variationvalue='" + recommended_size + "']").click()
  
                if (certainly_settings.cvars.product_length_available == "true" && !certainly_settings.cvars.preferred_length) {
                    //The product requires length specification, but it has not been yet collected
  
  
                    setTimeout(function() {
                        // Retrieves the available lengths for the chosen size
                        var lengthOptions = document.querySelectorAll(".attribute-type-length.attribute  .sp-opt")
                        var available_lengths = ""
  
                        var lengthShort = "";
                        var lengthRegular = "";
                        var lengthLong = "";
  
                        for (i = 0; i < lengthOptions.length; i++) {
                            available_lengths = available_lengths + lengthOptions[i].dataset.variationvalue
  
                            if (lengthOptions[i].dataset.variationvalue == "SHT" && lengthOptions[i].innerHTML.indexOf("Notify") == -1) {
                                lengthShort = "available"
                            } else if (lengthOptions[i].dataset.variationvalue == "SHT") {
                                lengthShort = "unvailable"
                            }
                            if (lengthOptions[i].dataset.variationvalue == "REG" && lengthOptions[i].innerHTML.indexOf("Notify") == -1) {
                                lengthRegular = "available"
                            } else if (lengthOptions[i].dataset.variationvalue == "REG") {
                                lengthRegular = "unvailable"
                            }
                            if (lengthOptions[i].dataset.variationvalue == "LONG" && lengthOptions[i].innerHTML.indexOf("Notify") == -1) {
                                lengthLong = "available"
                            } else if (lengthOptions[i].dataset.variationvalue == "REG") {
                                lengthLong = "unvailable"
                            }
  
                        }
  
                        // Triggers the bot to pickup a length
                        certainly.goTo({
                            module: "656081",
                            cvars: {
                                "current_variant_id": document.querySelectorAll("#pid")[0].value,
                                "available_lengths": available_lengths,
                                "lengthShort": lengthShort,
                                "lengthRegular": lengthRegular,
                                "lengthLong": lengthLong,
                            }
                        })
                    }, 500);
  
                } else if (data.cvars.preferred_fit == "slim") {
                    setTimeout(function() {
                        certainly.goTo({
                            module: "656078",
                            
                            cvars: {
                                "current_variant_id": document.querySelectorAll("#pid")[0].value
                            }
                        })
                    }, 500);
                } else if (data.cvars.preferred_fit == "relaxed") {
                    setTimeout(function() {
                        certainly.goTo({
                            module: "656077",
                            
                            cvars: {
                                "current_variant_id": document.querySelectorAll("#pid")[0].value
                            }
                        })
                    }, 500);
                } else {
                    setTimeout(function() {
                        certainly.goTo({
                            module: "656039",
                            
                            cvars: {
                                "current_variant_id": document.querySelectorAll("#pid")[0].value
                            }
                        })
                    }, 500);
                }
  
                document.getElementById("sp-size").dispatchEvent(new Event('changed'))
  
                sizeFound = true;
  
              }
            }
        }
  
        if (!sizeFound) {
            certainly.goTo({
                module: "656038"
            })
  
        }
    }


}


document.head.insertAdjacentHTML("beforeend", `<style id="custom-certainly-popups-style">
#certainly-popups {
  right: 85px!important;
  bottom: 75px!important;
}
</style>`);
