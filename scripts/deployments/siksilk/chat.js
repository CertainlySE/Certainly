var certainlyChat = function() {
    var url = new URL(window.location.href);
    if (url.searchParams.get('disableBot')) {
        return;
    } else {
        var script = document.createElement('script');
        script.setAttribute("type", "text/javascript")
        script.src = "https://app.certainly.io/sdk/webchat.js";
        script.addEventListener("load", function(event) {
            launchChat();
        });

        document.getElementsByTagName('head')[0].appendChild(script);


        var launchChat = function() {
            // ######## Google Analytics ########### //
            if ("ga" in window) {
                var tracker = ga.getAll()[0];
            }

            var currentPage = ShopifyAnalytics.meta.page.pageType != null ? ShopifyAnalytics.meta.page.pageType : window.location.pathname;
            var urlParams = new URLSearchParams(window.location.search);
            // Settings for certainly triggers, both chat->page and page->chat
            var certainlyTriggers = {
                triggeredOnProductHover: {
                    status: false,
                    destination: "495728",
                    sources: ["home", "product", "/cart"],
                    delay: 2000,
                    timer: null
                },
                triggeredOnHeaderHover: {
                    status: false,
                    destination: ""
                },
                triggerAddToCart: {
                    sourceModule: "499701"
                },
                triggeredOnAddedToCart: {
                    status: false,
                    destination: "495735"
                },
                triggeredOnRelatedProducts: {
                    status: false,
                    destination: "495736"
                },
                triggeredOnProductInterest: {
                    sourceModule: "495752"
                },
                triggeredOnShowCart: {
                    sourceModule: "495764"
                },
                triggeredOnRecommendation: {
                    sourceModule: "495806",
                    fallback: "495807"
                },
                triggeredOnInactivity: {
                    status: false,
                    destination: "495766",
                    inactivityTime: 300000, // Specified in milliseconds
                    timer: null
                },
                triggeredOnSizeRecommendation: {
                    sourceModule: "500616",
                    fallback: "495807"
                },
                triggeredOnSizeSelected: {
                    destination: "500615"
                },
                triggeredOnSizeOutOfStock: {
                    destination: "499789"
                },
                triggeredOnSizeUnavailable: {
                    destination: "500619"
                }

            };

            var certainlyConfig = {
                id: "c13229a0-87af-437a-a527-568f00888720",
                ref: "677955",
                webchatKey: "conversationalCommerce",
                mode: "clear_past_conversations",
                buttonLogoOpen: "https://s3.eu-central-1.amazonaws.com/botxo-assets-production/media/bot-images/a3e040da-f22.png",
                buttonLogoClose: "https://s3.eu-central-1.amazonaws.com/botxo-assets-production/media/bot-images/a3e040da-f22.png",
                inputType: "bottom",
                //buttonWidth: 128,
                gaEnabled: true,
                chatStarted: false,
                cvars: {
                    itemsInCart: wmfCartContents.items.length,
                    currentPage: currentPage,
                    //currentCurrency: ShopifyAnalytics.meta.currency,
                    currentProductName: "",
                    currentProductUrl: "",
                    hoveredProductUrl: "",
                    startOnRecommendation: urlParams.get('certainly_landing_on_recommendation') ? "true" : "false"
                }
            }

            var certainlyCollections = [{
                name: "girls-hoodies",
                path: "girls-hoodies",
                segment: ["girls", "girl", "little girl", "baby girl", "little daughter", "daughter"],
                category: ["hoodie", "hoodies"]
            }]


        // ######## Certainly Landed at module triggers ########
        certainly.getCertainlyTransfer({
                actionName: "*",
                callback: function(data) { recordChatStart(data) } // The data object contains information such as the latest visitor message and custom variables
            });

        function recordChatStart(data){
            if(!certainlyConfig.chatStarted && !data.message.bot_module.name.includes("Start")){
                if (certainlyConfig.gaEnabled) {
                tracker.send("event", { eventCategory: 'Certainly', eventAction: 'Chat Started', eventLabel: 'Chat Started'});
            }
                certainlyConfig.chatStarted = true;
            }
        }

            function addProductHoverListener(element, productTitleQuerySelector, productUrlQuerySelector) {
                element.addEventListener("mouseover", function() { // On hover start
                    var productCard = this;
                    certainlyTriggers.triggeredOnProductHover.timer = setTimeout(function() {
                        if (!certainlyTriggers.triggeredOnProductHover.status) {
                            certainlyTriggers.triggeredOnProductHover.status = true;
                            certainlyConfig.cvars.hoveredProduct = productCard.querySelector(productTitleQuerySelector).innerText.replace("SikSilk ", "");
                            certainlyConfig.cvars.hoveredProductUrl = productCard.querySelector(productUrlQuerySelector).href
                            certainly.goTo({
                                module: certainlyTriggers.triggeredOnProductHover.destination,
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

            certainly.landedAt({
                module: certainlyTriggers.triggeredOnProductInterest.sourceModule,
            }, navigateToProduct)

            function navigateToProduct() {
                if (certainlyConfig.gaEnabled) {
                    tracker.send("event", { eventCategory: 'Certainly', eventAction: 'Moved to Product', eventLabel: 'Moved to Product'});

                }
                window.location = certainlyConfig.cvars.hoveredProductUrl;
            }

            certainly.landedAt({
                module: certainlyTriggers.triggeredOnShowCart.sourceModule,
            }, NavigateToCart)

            function NavigateToCart() {
                if (certainlyConfig.gaEnabled) {
                    tracker.send("event", { eventCategory: 'Certainly', eventAction: 'Moved to Cart', eventLabel: 'Moved to Cart'});

                }
                window.location = "/checkout";

            }

            certainly.getCertainlyTransfer({ // Listens for when Certainly triggers redirection to a recommended collection
                actionName: certainlyTriggers.triggeredOnRecommendation.sourceModule,
                callback: function(data) {
                    NavigateToRecommendation(data)
                }
            });

            function NavigateToRecommendation(data) {
                if (data.cvars.detected_customer_segment && data.cvars.detected_product_category) {
                    var recommendationSuccess = false;
                    certainlyCollections.forEach(function(collection) {
                        if (collection.segment.includes(data.cvars.detected_customer_segment) && collection.category.includes(data.cvars.detected_product_category)) {
                            if (certainlyConfig.gaEnabled) {
                                tracker.send("event", { eventCategory: 'Certainly', eventAction: 'Product Recommended', eventLabel: 'Product Recommended'});

                            }
                            recommendationSuccess = true;
                            window.location = "/collections/" + collection.path + "?certainly_landing_on_recommendation=true"; //Parameter controls the bot to remember it made a recommendation when loading the new page
                        }
                    })
                    if (!recommendationSuccess) {
                        certainly.goTo({
                            module: certainlyTriggers.triggeredOnRecommendation.fallback,
                            webchatKey: certainlyConfig.webchatKey
                        })
                    }
                }
            }
            certainly.getCertainlyTransfer({ // Listens for when Certainly has recommended a size
                actionName: certainlyTriggers.triggerAddToCart.sourceModule,
                callback: function(data) {
                    addToCart(data)
                }
            });

            function addToCart(data) {
                if (certainlyConfig.gaEnabled) {
                tracker.send("event", { eventCategory: 'Certainly', eventAction: 'Added to Cart', eventLabel: 'Added to Cart'});

                }
                addToCartButton = document.getElementById("submitStockButton")
                addToCartButton.click();

                certainly.goTo({
                    module: certainlyTriggers.triggeredOnRelatedProducts.destination
                })

                setTimeout(function() {

                    scrollToRelatedProducts();
                }, 4000);

                function scrollToRelatedProducts() {
                    certainlyTriggers.triggeredOnRelatedProducts.status = true;
                    var relatedProductsElement = document.getElementsByClassName("uq-upsell")[0];
                    relatedProductsElement.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                        inline: "nearest"
                    });
                }
            }

            certainly.getCertainlyTransfer({ // Listens for when Certainly has recommended a size
                actionName: "500342",
                callback: function(data) {
                    goToCheckout(data)
                }
            });

            function goToCheckout(data) {
                if (certainlyConfig.gaEnabled) {
                    tracker.send("event", { eventCategory: 'Certainly', eventAction: 'Moved to Checkout', eventLabel: 'Moved to Checkout'});

                }
                window.location = "https://siksilkusa.com/checkout"
            }


            certainly.getCertainlyTransfer({ // Listens for when Certainly has recommended a size
                actionName: certainlyTriggers.triggeredOnSizeRecommendation.sourceModule,
                callback: function(data) {
                    selectSize(data)
                }
            });

            function selectSize(data) {
                var sizeFound = false;
                var sizeSelector = document.querySelector('.single-option-selector[data-toggle-product="size"]');
                for (var opt, j = 0; opt = sizeSelector.options[j]; j++) {
                    if (opt.value == data.cvars.recommended_size && opt.dataset.instock == "true") {
                        sizeSelector.selectedIndex = j;
                        sizeSelector.dispatchEvent(new Event('change')); // Needed to trigger the layout change
                        if (data.cvars.preferred_fit == "slim") {
                            setTimeout(function() {
                                certainly.goTo({
                                    module: "527455",
                                    cvars: {
                                        "current_variant_id": opt.dataset.variantid
                                    }
                                })
                            }, 500);
                        } else if (data.cvars.preferred_fit == "relaxed") {
                            setTimeout(function() {
                                certainly.goTo({
                                    module: "495842",
                                    cvars: {
                                        "current_variant_id": opt.dataset.variantid
                                    }
                                })
                            }, 500);
                        } else {
                            setTimeout(function() {
                                certainly.goTo({
                                    module: "495809",
                                    cvars: {
                                        "current_variant_id": opt.dataset.variantid
                                    }
                                })
                            }, 500);
                        }
                        sizeFound = true;
                        if (certainlyConfig.gaEnabled) {
                            tracker.send("event", { eventCategory: 'Certainly', eventAction: 'Size Selected', eventLabel: 'Size Selected'});

                        }
                        break;
                    } else if (opt.value == data.cvars.recommended_size && opt.dataset.instock == "false") {
                        certainly.goTo({
                            module: certainlyTriggers.triggeredOnSizeOutOfStock.destination,
                            cvars: {
                                "current_variant_id": opt.dataset.variantid
                            }
                        })
                        sizeFound = true;
                        if (certainlyConfig.gaEnabled) {
                            tracker.send("event", { eventCategory: 'Certainly', eventAction: 'Size Out of Stock', eventLabel: 'Size Out of Stock'});

                        }
                        break;
                    }
                }
                if (!sizeFound) {
                    certainly.goTo({
                        module: certainlyTriggers.triggeredOnSizeUnavailable.destination,
                    })

                    if (certainlyConfig.gaEnabled) {
                        tracker.send("event", { eventCategory: 'Certainly', eventAction: 'Size Unavailable', eventLabel: 'Size Unavailable'});

                    }
                }
            }


            if (currentPage == "product") { // If on  a product page
                var jsonObjects = document.querySelectorAll('script[type="application/ld+json"]');
                jsonObjects.forEach(function(object) { // Passes product metadata to Certainly
                    var json = JSON.parse(object.innerHTML)
                    if (json["@type"] == "Product") {
                        certainlyConfig.cvars.currentProductName = json.name.replace("SikSilk ", "");
                        certainlyConfig.cvars.currentProductId = ShopifyAnalytics.meta.product.id;
                        certainlyConfig.cvars.currentProductSku = json.sku;
                        certainlyConfig.cvars.currentProductUrl = json.url;
                    }
                })
                var availableSizes = ""
                var sizeSelector = document.querySelector('.single-option-selector[data-toggle-product="size"]');
                for (var opt, j = 0; opt = sizeSelector.options[j]; j++) {
                    if (availableSizes == "") {
                        availableSizes = opt.value;
                    } else {
                        availableSizes = availableSizes + "," + opt.value;
                    }
                }
                certainlyConfig.cvars.availableSizes = availableSizes

            } else if (currentPage == "home") {
                certainlyConfig.mode = "clear_past_conversations"
                window.localStorage.removeItem('randid');
                var productCards = document.getElementsByClassName("nosto-list-item")
                for (i = 0; i < productCards.length; i++) { //Adds a mouse over listener to each product card on the homepage
                    addProductHoverListener(productCards[i], ".product_title", "a");
                }
            } else if (currentPage == "/cart") {
                var productCards = document.getElementsByClassName("nosto-list-item")
                for (i = 0; i < productCards.length; i++) { //Adds a mouse over listener to each product card on the homepage

                    addProductHoverListener(productCards[i], ".nosto-product-name", "a")
                }
            }

            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {

            } else /*if ((/man|men|woman|women|cart|checkout|check|/.test(window.location.href)) || ShopifyAnalytics.meta.page.pageType == "home")*/ {

                initCertainlyWidget(certainlyConfig, initCertainlyCallback);

            }

            function initCertainlyCallback() {

                /*var sheet = window.document.styleSheets[0];
                sheet.insertRule("#ProductSection-product-template {margin-right: 400px;}", sheet.cssRules.length);
                sheet.insertRule("div#shopify-section-cart-template {margin-right: 400px;}", sheet.cssRules.length);
                sheet.insertRule("div#shopify-section-collection-template { margin-right: 400px; }", sheet.cssRules.length);*/

                if (true /*window.localStorage.getItem("statusWebchat-" + certainlyConfig.webchatKey) != null*/ ) {
                    certainly.widgetStatus({
                        action: "close", // Required
                    })
                }
                }
            }

        }
    }

certainlyChat();