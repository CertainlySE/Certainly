var certainlyChat = function() {
    var url = new URL(window.location.href);
    if (url.searchParams.get('disableBot')) {
        return
    } else {

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
        var script = document.createElement('script');
        script.type = "text/javascript";
        script.id = "ze-snippet"
        script.addEventListener("load", function(event) {
            zE('webWidget', 'hide');
        });
        script.src = "https://static.zdassets.com/ekr/snippet.js?key=aa854c4c-9a30-4a5b-b5fa-07d976ac4364";
        document.getElementsByTagName('head')[0].appendChild(script);
   

        script = document.createElement('script');
        script.type = "text/javascript";
        script.addEventListener("load", function(event) {
            launchChat();
        });
        script.src = "https://app.certainly.io/sdk/webchat.js";
        document.getElementsByTagName('head')[0].appendChild(script);
    }

    function launchChat() {
        // ######## Google Analytics ########### //
        if ("ga" in window) {
            var tracker = ga.getAll()[0];
        }

        // ######## End of Google Analytics ########### //


        var currentPage = "";
        var urlParams = new URLSearchParams(window.location.search);

        // ######## Start of triggers settings ########

        // Settings for certainly triggers, both chat->page and page->chat
        var certainlyTriggers = {
            triggeredOnProductHover: {
                status: false,
                destination: "501191",
                sources: ["home", "product", "/cart"],
                delay: 2000,
                timer: null
            },
            triggeredOnHeaderHover: {
                status: false,
                destination: ""
            },
            triggerAddToCart: {
                sourceModule: "501174"
            },
            triggeredOnAddedToCart: {
                status: false,
                destination: "501193"
            },
            triggeredOnRelatedProducts: {
                status: false,
                destination: "501192"
            },
            triggeredOnProductInterest: {
                sourceModule: "501189"
            },
            triggeredOnShowCart: {
                sourceModule: "501194"
            },
            triggeredOnRecommendation: {
                sourceModule: "495806",
                fallback: "495807"
            },
            triggeredOnInactivity: {
                status: false,
                destination: "501185",
                inactivityTime: 300000, // Specified in milliseconds
                timer: null
            },
            triggeredOnSizeRecommendation: {
                sourceModule: "501169",
                fallback: "495807"
            },
            triggeredOnSizeSelected: {
                destination: "501170",
                status: false
            },
            triggeredOnSizeOutOfStock: {
                destination: "501175"
            },
            triggeredOnSizeUnavailable: {
                destination: "501171"
            },
            triggeredOnSizeLength: {
                destination: "524500",
                status: false
            },
            triggeredOnLengthselection: {
                sourceModule: "524536",
            },
            triggerHandover: {
                sourceModule: "501444",
                zendeskHumanDepartment: "Bot_Operator",
                fallback: "500427"
            }

        };
        // ######## End of triggers settings ########

        // ######## Start of Certainly chatbot configuration object ########
        var certainlyConfig = {
            id: "47d61385-6328-449b-9452-40b17c1c7fd2",
            ref: "501176",
            webchatKey: "conversationalCommerce",
            mode: "clear_past_conversations",
            bottom: 25,
            right: 25,
            zIndex: 19,
            buttonLogoOpen: "https://s3.eu-central-1.amazonaws.com/botxo-assets-production/media/bot-images/e5a2a2d1-021.png",
          buttonLogoClose: "https://s3.eu-central-1.amazonaws.com/botxo-assets-production/media/bot-images/e5a2a2d1-021.png",          
            //clearWebchatState: true,
            //debuggerMode: 1,
            gaEnabled: true,
            chatStarted: false,
            cvars: {
                itemsInCart: document.getElementsByClassName("mini-cart-items-number")[0].innerText,
                currentPage: "",
                currentProductName: "",
                startOnRecommendation: urlParams.get('certainly_landing_on_recommendation') ? "true" : "false",
                locale: document.getElementById("countryselector").dataset.dataCountry ? document.getElementById("countryselector").dataset.dataCountry : "gb"
            }
        }
        // ######## End of Certainly chatbot configuration object ########



        // ######## Start of inactivity tracking ########

        var time; // Needs to be a global variable otherwise activity in the chat will not be able to reset it
        var inactivityTime = function() {
            window.onload = resetTimer;
            // DOM Events
            document.onmousemove = resetTimer;
            document.onkeypress = resetTimer;

            function triggerChatbotOnInactiveVisitor() {
                if (certainlyTriggers.triggeredOnInactivity.status == false) {
                    certainlyTriggers.triggeredOnInactivity.status = true;
                    certainly.goTo({
                        module: certainlyTriggers.triggeredOnInactivity.destination,
                        webchatKey: certainlyConfig.webchatKey
                    })
                    
                    if (certainlyConfig.gaEnabled) {
                        tracker.send("event", { eventCategory: 'Certainly', eventAction: 'Inactivity Prompt', eventLabel: 'Inactivity Prompt'});
                    }
                }
            }


            function resetTimer() {
                clearTimeout(time);
                time = setTimeout(triggerChatbotOnInactiveVisitor, certainlyTriggers.triggeredOnInactivity.inactivityTime)
            }

        };


        // Executes tracking function
        inactivityTime();

        // ########  End of inactivity tracking ######## 

        // ######## On product hover, triggers BotXO ######## 
        /*var productCards = document.getElementsByClassName("product-tile")
        for(i=0; i<productCards.length;i++){ //Adds a mouse over listener to each product card on the homepage
            addProductHoverListener(productCards[i], "a.product-link", "a.product-link")
        }
        */
        function addProductHoverListener(element, productTitleQuerySelector, productUrlQuerySelector) {
            element.addEventListener("mouseover", function() { // On hover start
                var productCard = this;
                certainlyTriggers.triggeredOnProductHover.timer = setTimeout(function() {
                    if (!certainlyTriggers.triggeredOnProductHover.status) {
                        certainlyTriggers.triggeredOnProductHover.status = true;
                        certainlyConfig.cvars.hoveredProduct = productCard.querySelector(productTitleQuerySelector).title
                        certainlyConfig.cvars.hoveredProductUrl = productCard.querySelector(productUrlQuerySelector).href
                        certainly.goTo({
                            module: certainlyTriggers.triggeredOnProductHover.destination,
                            webchatKey: certainlyConfig.webchatKey,
                            cvars: {
                                hoveredProduct: certainlyConfig.cvars.hoveredProduct,
                                hoveredProductUrl: certainlyConfig.cvars.hoveredProductUrl
                            }
                        })
                    }
                }, certainlyTriggers.triggeredOnProductHover.delay)
            });

            element.addEventListener("mouseout", function() { //On hover end 
                clearTimeout(certainlyTriggers.triggeredOnProductHover.timer);
            })

        }
        // ######## End of on product hover, triggers BotXO ######## 


        // ######## BotXO Landed at module triggers ########
        certainly.getCertainlyTransfer({
                actionName: "*",
                webchatKey: certainlyConfig.webchatKey,
                callback: function (data){ recordChatStart(data)} // The data object contains information such as the latest visitor message and custom variables
            });

        function recordChatStart(data){
            if(!certainlyConfig.chatStarted && !data.message.bot_module.name.includes("Start")){
                if (certainlyConfig.gaEnabled) {
                tracker.send("event", { eventCategory: 'Certainly', eventAction: 'Chat Started', eventLabel: 'Chat Started'});
            }
                certainlyConfig.chatStarted = true;
            }
        }

        // When visitor asks the bot to see more of a product, goes to the product page

        certainly.getCertainlyTransfer({
                actionName: ["555068","555069","555067"],
                webchatKey: certainlyConfig.webchatKey,
                callback: function (data){ navigateTo2107(data)} // The data object contains information such as the latest visitor message and custom variables
            });

        function navigateTo2107(data){
            console.log(data)
            if (data.cvars.landingPage){
                setTimeout(function(){
                    var destinationUrl = window.location.origin + "/"+certainlyConfig.cvars.locale +"/" + data.cvars.landingPage;
                    window.location = destinationUrl;
                }, 1500);
            }
        }

        certainly.landedAt({ // Listens more when Certainly triggers scroll to related products
            module: certainlyTriggers.triggeredOnProductInterest.sourceModule,
            webchatKey: certainlyConfig.webchatKey,
        }, navigateToProduct)

        function navigateToProduct() {
            if (certainlyConfig.gaEnabled) {
                tracker.send("event", { eventCategory: 'Certainly', eventAction: 'Moved to Product', eventLabel: 'Moved to Product'});
            }
            window.location = certainlyConfig.cvars.hoveredProductUrl;
        }

        certainly.landedAt({ // Listens more when Certainly triggers scroll to related products
            module: certainlyTriggers.triggeredOnShowCart.sourceModule,
            webchatKey: certainlyConfig.webchatKey,
        }, NavigateToCart)

        function NavigateToCart() {
            if (certainlyConfig.gaEnabled) {
                tracker.send("event", { eventCategory: 'Certainly', eventAction: 'Moved to Cart', eventLabel: 'Moved to Cart'});
            }
            window.location = "/dk/checkout";

        }

        certainly.landedAt({ // Listens more when Certainly triggers scroll to related products
            module: "523953",
            webchatKey: certainlyConfig.webchatKey,
        }, navigateToTos)

        function navigateToTos() {
            if (certainlyConfig.gaEnabled) {
                tracker.send('event', 'Moved to ToS', {
                    'event_category': 'BotXO',
                    'event_label': 'Moved to ToS'
                });
            }
            window.location = "https://www.tigerofsweden.com/dk/terms-and-conditions/terms.html"
        }

        certainly.getCertainlyTransfer({
            actionName: certainlyTriggers.triggerHandover.sourceModule,
            webchatKey: certainlyConfig.webchatKey,
            callback: function(data) {
                handoverToZendesk(data)
            }
        });

        function handoverToZendesk(data) {
            certainly.widgetStatus({
                action: "hide", // Required 
                webchatKey: certainlyConfig.webchatKey, // Required if specified in initCertainlyChat()
            });

            zE(function() {
                $zopim(function() {
                    if (typeof data.cvars.visitorName === 'undefined' && typeof data.cvars.visitorEmail === 'undefined') {
                        // The BotXO Widget has not collected the above cvars
                        $zopim.livechat.setName('Anonymous visitor');
                        $zopim.livechat.setEmail('anonymous@visitor.com');
                    } else {
                        $zopim.livechat.setName(data.cvars.visitorName);
                        $zopim.livechat.setEmail(data.cvars.visitorEmail);
                    }
                    $zopim.livechat.departments.setVisitorDepartment(certainlyTriggers.triggerHandover.zendeskHumanDepartment);
                    $zopim.livechat.say(data.cvars.chatHistory);
                    $zopim.livechat.say("An agent will join shortly...");
                });
                // The Zendesk chat has started, but the Zendesk Widget is still hidden, so this displays it
                zE.activate();
            });
        }

        certainly.getCertainlyTransfer({ // Listens for when Certainly has recommended a size
            actionName: certainlyTriggers.triggerAddToCart.sourceModule,
            webchatKey: certainlyConfig.webchatKey,
            callback: function(data) {
                addToCart(data)
            }
        });

        function addToCart(data) {
            if (certainlyConfig.gaEnabled) {
                tracker.send("event", { eventCategory: 'Certainly', eventAction: 'Added to Cart', eventLabel: 'Added to Cart'});
            }
            addToCartButton = document.getElementById("add-to-cart");
            addToCartButton.click();

            certainly.goTo({
                module: certainlyTriggers.triggeredOnAddedToCart.destination,
                webchatKey: certainlyConfig.webchatKey
            })

            setTimeout(function() {
                certainly.goTo({
                    module: certainlyTriggers.triggeredOnRelatedProducts.destination,
                    webchatKey: certainlyConfig.webchatKey
                })
                scrollToRelatedProducts();
            }, 3000);

            function scrollToRelatedProducts() {
                certainlyTriggers.triggeredOnRelatedProducts.status = true;

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

        }

        certainly.getCertainlyTransfer({ // Listens for when Certainly has recommended a size
            actionName: "500342",
            webchatKey: certainlyConfig.webchatKey,
            callback: function(data) {
                goToCheckout(data)
            }
        });

        function goToCheckout(data) {
            if (certainlyConfig.gaEnabled) {
                tracker.send("event", { eventCategory: 'Certainly', eventAction: 'Moved to Checkout', eventLabel: 'Moved to Checkout'});
            }
            window.location = "https://www.tigerofsweden.com/dk/checkout/"
        }


        certainly.getCertainlyTransfer({ // Listens for when Certainly has recommended a size
            actionName: certainlyTriggers.triggeredOnSizeRecommendation.sourceModule,
            webchatKey: certainlyConfig.webchatKey,
            callback: function(data) {
                selectSize(data)
            }
        });


        function selectSize(data) {
            var sizeFound = false;
            var sizeOptions = document.getElementsByClassName("sp-opt");
            for (i = 0; i < sizeOptions.length; i++) {
                if (sizeOptions[i].hasAttribute("data-variationvalue")) {
                    if (sizeOptions[i].innerText.includes("Notify") && sizeOptions[i].dataset.variationvalue == data.cvars.recommended_size) {
                        setTimeout(function() {
                            certainly.goTo({
                                module: certainlyTriggers.triggeredOnSizeOutOfStock.destination,
                                webchatKey: certainlyConfig.webchatKey,
                                cvars: {
                                    "current_variant_id": document.querySelectorAll("#pid")[0].value
                                }
                            })
                        }, 500);
                        sizeFound = true;
                        if (certainlyConfig.gaEnabled) {
                            tracker.send("event", { eventCategory: 'Certainly', eventAction: 'Size Out of Stock', eventLabel: 'Size Out of Stock'});
                        }
                    } else if (sizeOptions[i].dataset.variationvalue == data.cvars.recommended_size) {

                        document.getElementsByClassName("attribute-type-size")[0].click()
                        document.querySelector(".sp-opt[data-variationvalue='" + data.cvars.recommended_size + "']").click()

                        if (certainlyConfig.cvars.productLengthAvailable == "true" && !certainlyConfig.cvars.preferred_length) {
                            //The product requires length specification, but it has not been yet collected


                            setTimeout(function() {
                                // Retrieves the available lengths for the chosen size
                                var lengthOptions = document.querySelectorAll(".attribute-type-length.attribute  .sp-opt")
                                var availableLengths = ""

                                var lengthShort = "";
                                var lengthRegular = "";
                                var lengthLong = "";

                                for (i = 0; i < lengthOptions.length; i++) {
                                    availableLengths = availableLengths + lengthOptions[i].dataset.variationvalue

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
                                    module: "524500",
                                    webchatKey: certainlyConfig.webchatKey,
                                    cvars: {
                                        "current_variant_id": document.querySelectorAll("#pid")[0].value,
                                        "availableLengths": availableLengths,
                                        "lengthShort": lengthShort,
                                        "lengthRegular": lengthRegular,
                                        "lengthLong": lengthLong,
                                    }
                                })
                            }, 500);

                        } else if (data.cvars.preferred_fit == "slim") {
                            setTimeout(function() {
                                certainly.goTo({
                                    module: "521773",
                                    webchatKey: certainlyConfig.webchatKey,
                                    cvars: {
                                        "current_variant_id": document.querySelectorAll("#pid")[0].value
                                    }
                                })
                            }, 500);
                        } else if (data.cvars.preferred_fit == "relaxed") {
                            setTimeout(function() {
                                certainly.goTo({
                                    module: "521772",
                                    webchatKey: certainlyConfig.webchatKey,
                                    cvars: {
                                        "current_variant_id": document.querySelectorAll("#pid")[0].value
                                    }
                                })
                            }, 500);
                        } else {
                            setTimeout(function() {
                                certainly.goTo({
                                    module: "501173",
                                    webchatKey: certainlyConfig.webchatKey,
                                    cvars: {
                                        "current_variant_id": document.querySelectorAll("#pid")[0].value
                                    }
                                })
                            }, 500);
                        }

                        document.getElementById("sp-size").dispatchEvent(new Event('changed'))

                        sizeFound = true;
                        if (certainlyConfig.gaEnabled) {
                            tracker.send("event", { eventCategory: 'Certainly', eventAction: 'Size Selected', eventLabel: 'Size Selected'});
                        }

                    }
                }
            }

            if (!sizeFound) {
                certainly.goTo({
                    module: certainlyTriggers.triggeredOnSizeUnavailable.destination,
                    webchatKey: certainlyConfig.webchatKey
                })

                if (certainlyConfig.gaEnabled) {
                    tracker.send("event", { eventCategory: 'Certainly', eventAction: 'Size Unavailable', eventLabel: 'Size Unavailable'});
                }
            }
        }

        certainly.getCertainlyTransfer({ // Listens for when Certainly should select a length for a specific size
            actionName: certainlyTriggers.triggeredOnLengthselection.sourceModule,
            webchatKey: certainlyConfig.webchatKey,
            callback: function(data) {
                selectLength(data)
            }
        });


        function selectLength(data) {
            var lengthOptions = document.querySelectorAll(".attribute-type-length.attribute  .sp-opt")
            var availableLengths = ""
            for (i = 0; i < lengthOptions.length; i++) {
                availableLengths = availableLengths + lengthOptions[i].dataset.variationvalue
            }

            document.getElementsByClassName("attribute-type-length")[0].click();

            var desiredOption = document.querySelector(".sp-opt[data-variationvalue='" + data.cvars.preferred_length + "']");

            if (desiredOption == null) { //Attempts to switch from short/regular/medium to 30/32/34
                var lengthDictionary = {
                    "SHT": "30\"",
                    "REG": "32\"",
                    "LON": "34\""
                }
                desiredOption = document.querySelector(".sp-opt[data-variationvalue='" + lengthDictionary[data.cvars.preferred_length] + "']");
            }

            if (desiredOption == null) {
                certainly.goTo({
                    module: "524671",
                    webchatKey: certainlyConfig.webchatKey
                })
            } else if (desiredOption.innerHTML.indexOf("Notify") != -1) {
                certainly.goTo({
                    module: "524537",
                    webchatKey: certainlyConfig.webchatKey
                })
            } else if (desiredOption != null) {
                desiredOption.click()
                certainly.goTo({
                    module: "524538",
                    webchatKey: certainlyConfig.webchatKey
                })
            }
        }


        // ######## End of BotXO Landed at module triggers ########

        // ####### Page related settings ##### //

        if (window.location.pathname.length < 5) {
            certainlyConfig.cvars.currentPage = "home"
        } else if (window.location.href.includes("checkout")) {
            certainlyConfig.cvars.currentPage = "checkout"
        }


        String.prototype.capitalize = function() {
            return this.replace(/(^|\s)([a-z])/g, function(m, p1, p2) {
                return p1 + p2.toUpperCase();
            });
        };

        var url = new URL(window.location.href);

        if (document.getElementById("pid") != null) {
            certainlyConfig.cvars.currentProductId = document.getElementById("pid").value;
            certainlyConfig.cvars.currentProductName = document.getElementsByClassName("product-name")[0].innerText;
            certainlyConfig.cvars.currentPage = "product";

            certainlyConfig.cvars.availableSizes = ""
            var sizeOptions = document.getElementsByClassName("sp-opt");
            for (i = 0; i < sizeOptions.length; i++) {
                var sizeOption = sizeOptions[i].dataset.variationvalue;
                if (certainlyConfig.cvars.availableSizes == "" && sizeOption != null) {
                    certainlyConfig.cvars.availableSizes = sizeOption
                } else if (sizeOption != null) {
                    certainlyConfig.cvars.availableSizes = certainlyConfig.cvars.availableSizes + "," + sizeOption
                }
            }

            if (document.getElementsByClassName("attribute-type-length attribute")[0] != null) {
                certainlyConfig.cvars.productLengthAvailable = "true"

            }
        }
        url.searchParams.forEach(function(value, key) {
            if (key.includes("dwvar")) { //current active page is a product page
                certainlyConfig.cvars.currentProductVariation = value;
            }
        });

        if (currentPage == "product") { // If on  a product page
            certainly.landedAt({ // Listens more when Certainly triggers scroll to related products
                module: certainlyTriggers.triggeredOnRelatedProducts.destination,
                webchatKey: certainlyConfig.webchatKey,
            }, scrollToRelatedProducts)
        }


        if(!localStorage.getItem("CertainlyCollection2107")){
            console.log("No cookie 2107")
            certainlyConfig.cvars.showCollection2107 = "true";
            localStorage.setItem("CertainlyCollection2107", "true")
            localStorage.setItem("statusWebchat-" + certainlyConfig.webchatKey, "open");
        }

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {} else {
            initCertainlyWidget(certainlyConfig, initCertainlyCallback);
        }

        function initCertainlyCallback() {
            $('div[class*="webchat-messages-cssmodule-container"]').innerHTML = ""
            /*r customStyle = document.createElement('style');
            customStyle.type = 'text/css';
            cumStyle.innerHTML = '.pdp-main .pdp-content, .storeavailability-pdpre .pdp-content, .the-wishlist .pdp-content { padding-top: 40px; margin-right: 400px; } .sticky-menu-content { margin-top: 58px; margin-right: 425px; }';
            document.getElementsByTagName('head')[0].appendChild(customStyle);*/

            // Keeps track of how many pages have been browsed and tiggers the bot on the third one
            var previousSessions = JSON.parse(window.localStorage.getItem("certainlySessions"));
            if (previousSessions == null){
                previousSessions = 0;
                window.localStorage.setItem("certainlySessions", JSON.stringify(previousSessions));
            }
            else {
                previousSessions = previousSessions + 1;
                window.localStorage.setItem("certainlySessions", JSON.stringify(previousSessions));
            }

            if (
                (window.localStorage.getItem("statusWebchat-" + certainlyConfig.webchatKey) != null
                && 
                window.location.pathname.length > 5 
                ) 
                ||
                previousSessions == 3
				||
				previousSessions == 24
                ) {
                certainly.widgetStatus({
                    action: "open", // Required
                    webchatKey: certainlyConfig.webchatKey, // Required if specified in initCertainlyChat()
                })
            }
            else {
                certainly.widgetStatus({
                    action: "close", // Required
                    webchatKey: certainlyConfig.webchatKey, // Required if specified in initCertainlyChat()
                })
            }
        }

    }
}

certainlyChat();