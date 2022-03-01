var certainly_settings = {}; // Global variable

(function() {
    
    var url = new URL(window.location.href);
    // Killer switch for the chat
    if (url.searchParams.get('disableBot')) {
        return
    } else {
    // Loads the chat
    
    //Small utility function to listen for when an object is defined
(function(){window.whenDefined=function(a,b,c){a[b]?c():Object.defineProperty(a,b,{configurable:!0,enumerable:!0,writeable:!0,get:function(){return this["_"+b]},set:function(a){this["_"+b]=a,c()}})}}).call(this);


var script = document.createElement('script');
script.type = "text/javascript";
script.id = "ze-snippet"
script.addEventListener("load", function(event) {
    document.head.insertAdjacentHTML("beforeend", `<style id="hide-zendesk">
    #launcher {
        display:none!important;
    }
</style>`);

window.zESettings = { // Pre-select a department
    webWidget: {
        chat: {
            departments: {
                select: 'Bot_Operator'
            }
        },
        helpCenter: {
            suppress: true
        }
    }
};

});
script.src = "https://static.zdassets.com/ekr/snippet.js?key=aa854c4c-9a30-4a5b-b5fa-07d976ac4364";
document.getElementsByTagName('head')[0].appendChild(script);



var script = document.createElement('script');
script.type = "text/javascript";
script.id = "certainly-popups-config"
script.addEventListener("load", function(event) {
    

  loadSDK();
});
script.src = "https://certainlysolengscripts.blob.core.windows.net/deployments/tiger_of_sweden/certainly_popups_config.js";
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



function launchChat(){ 

    var script = document.createElement('script');
    script.type = "text/javascript";
    script.id = "certainly-ga"
    script.addEventListener("load", function(event) {
        console.log("Loaded GA");
    });
    script.src = "https://scripts.certainly.io/extensions/google_analytics/ga.js";
    document.getElementsByTagName('head')[0].appendChild(script);

        
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
            //debuggerMode: 1,
            //debug: true
        }
        console.log(certainly_settings)
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

            // Checks if the current product is under women or men
            if (document.querySelector(".breadcrumb-list").innerText.includes("WOMEN")){
                certainly_settings.cvars.current_product_gender = "female";
            }
            else {
                certainly_settings.cvars.current_product_gender = "male"
            }
            // Checks if the current product page shows related products
            if (document.querySelector(".recommendations.swiper-carousel.loaded")){
                certainly_settings.cvars.current_product_recommendations = "true"
            }

            // Checks the available sizes for the current product
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
                certainly_settings.cvars.product_length = "true"

            }
        }
        url.searchParams.forEach(function(value, key) {
            if (key.includes("dwvar")) { //current active page is a product page
                certainly_settings.cvars.current_product_variation = value;
            }
        });

      
whenDefined(window, 'certainly_ready',
    function(){        
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
        //console.log(data)
        previous_data = data;

        if (data.cvars.web_action == "select_size" && previous_web_action != "select_size" && typeof(data.cvars.recommended_size) != null){
            certainly.sendCvars({
                custom_vars: {
                    web_action: ""
                }
            })
            
         previous_web_action = data.cvars.web_action;
          selectSize(data.cvars)
        }
        else if (data.cvars.web_action == "add_to_cart" && previous_web_action != "add_to_cart"){
            addToCart();
            previous_web_action = data.cvars.web_action;
        }
        else if (data.cvars.web_action == "show_related_products" && previous_web_action != "show_related_products"){
            scrollToRelatedProducts();
            previous_web_action = data.cvars.web_action;
        }
        else if (data.cvars.web_action == "open_url" && previous_web_action != "open_url" && typeof(data.cvars.url) != null){
            var destination_url = data.cvars.url;
            if (destination_url.includes(window.location.host)) {
                window.location.href = destination_url;
            }
            else { //URL path is relative
                locale = CQuotient.locale.slice(-2).toLowerCase();
                window.location.href = `${window.location.origin}/${locale}/${destination_url}`
            }
        }
      
    
  }

  function addToCart(data) {
    addToCartButton = document.getElementById("add-to-cart");
    addToCartButton.click();

    certainly.goTo({
        module: "656050",
        webchatKey: "1"
    })
        if (certainly_settings.cvars.current_product_recommendations == "true"){
        certainly.goTo({
            module: "656049",
            webchatKey: "1"
        })
        scrollToRelatedProducts();
    }
}


    function scrollToRelatedProducts() {
        var relatedProductsElement = document.getElementsByClassName("js-wear-it-with")[0];

        if (relatedProductsElement == null) { // Fallback in case no complementary products exist
            relatedProductsElement = document.getElementsByClassName("recommendations-headline")[0];
        }
        relatedProductsElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
        });
    }



  function selectSize(cvars){
    console.log("trying to select ", cvars.recommended_size)
    var sizeFound = false;
  
    var sizeOptions = document.getElementsByClassName("sp-opt");
  
    for (i = 0; i < sizeOptions.length; i++) {
        if (sizeOptions[i].hasAttribute("data-variationvalue")) {
            if (sizeOptions[i].innerText.includes("Notify") && sizeOptions[i].dataset.variationvalue == cvars.recommended_size) {
                setTimeout(function() {
                    certainly.goTo({
                        module: "656041",
                        
                        cvars: {
                            "current_variant_id": document.querySelectorAll("#pid")[0].value
                        }
                    })
                }, 500);
                sizeFound = true;
            } else if (sizeOptions[i].dataset.variationvalue == cvars.recommended_size) {
  
                document.getElementsByClassName("attribute-type-size")[0].click()
                document.querySelector(".sp-opt[data-variationvalue='" + cvars.recommended_size + "']").click();

                setTimeout(function() {
                    certainly.goTo({
                        module: "656037",
                        webchatKey: "1",
                        cvars: {
                            "current_variant_id": document.querySelectorAll("#pid")[0].value
                        }
                    })
                }, 500);

                document.getElementById("sp-size").dispatchEvent(new Event('changed'))
  
                sizeFound = true;

                return;
            }
  
                if (certainly_settings.cvars.product_length == "true" && !certainly_settings.cvars.preferred_length) {
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
  
                } 
  
                
            }
        }
  
        if (!sizeFound) {
            certainly.goTo({
                module: "656038"
            })
  
        }
    }

    

    
    document.head.insertAdjacentHTML("beforeend", `<style id="custom-certainly-popups-style">
    #certainly-popups {
    right: 85px!important;
    bottom: 75px!important;
    }
    </style>`);

    }
}})();


