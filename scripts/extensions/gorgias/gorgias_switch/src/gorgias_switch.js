// Hides the Gorgias Widget
document.head.insertAdjacentHTML("beforeend", `
    <style id="custom-gorgias-style">
        #gorgias-chat-container {
            display:none;
        }
        </style>
`)

GorgiasChat.init().then(function(GorgiasChat) {
    // Use GorgiasChat API now that the chat is fully initialized.
    var gorgias_style_injected = false;

    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }
    
            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });
    
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }



    function injectGorgiasChatStyle(){
        // Overrides the default Gorgias Widget styling
        if(!gorgias_style_injected) {
            document.querySelector("#chat-window").contentDocument.body.insertAdjacentHTML("beforeend", `
                <style id="custom-gorgias-style">
                .widget-xs, .widget-md, .widget-lg {
                    border-radius: 10px!important;
                }
                .chat-title {
                    display:none!important;
                }
                @media(min-height:549px) and (min-width:361px)
                {
                    .widget-md, .widget-lg {
                        width:400px;
                        height:600px;
                        top:0;
                        right:0;
                        left:unset;
                    }
                }   
                
                </style>`
            );
            gorgias_style_injected = true;
        }
    }

    function showGorgiasChat() {
        document.querySelector("#custom-gorgias-style").innerHTML = `

        @media(min-height:800px) and (min-width:1200px)
        {
            #chat-window {
            margin: 0px 40px 55px 0px;
            height: 600px!important;
            width: 400px!important;
            left: unset!important;
            bottom: 90px!important;
            }

            #chat-button {
                bottom: 58px!important;
                right: 36px!important;
            }
            .widget-md, .widget-lg {
                width:400px;
                height:600px;
                top:0;
                right:0;
                left:unset;
                border-radius: 10px!important;
            }
        }

        

       

        `;
        }
    

    waitForElm('#chat-window').then((elm) => {
        console.log("ready")
        var lastSeenGorgias = localStorage.getItem("gorgias.chat-last-pending-message");
        var gorgiasMaxChatLifetime = 3600; // In seconds

        if (lastSeenGorgias) {
            console.log("showing Gorgias")
            if ((new Date() - Date.parse(lastSeenGorgias)) / 1000 < gorgiasMaxChatLifetime) {

                showGorgiasChat();

                GorgiasChat.on('widget:opened', function(data)  {
                    // your code should go here
                    injectGorgiasChatStyle();
                })
                
                waitForElm('#botxo-chat-1').then((elm) => {
                    console.log(certainly)
                    certainly.widgetStatus({
                        webchatKey: 1,
                        action: "hide"
                    })
                });

            }
            else {
                localStorage.removeItem("gorgias.chat-access-token")
                console.log("Not showing Gorgias")
            }
        }

    });

    certainly.getCertainlyTransfer({
        webchatKey: 1,
        actionName: "*",
        callback: function(data) {
            if (data.cvars == "") {
                console.log("You need to enable your Certainly bot to expose custom variables")
            }
            if (data.cvars.gorgias && data.cvars.gorgias == "start_chat") {
                console.log("Starting a chat on Gorgias")
                if (GorgiasChat) {
                    GorgiasChat.captureUserEmail(data.cvars.customer_email);
                    GorgiasChat.open()
                    var opening_message = data.cvars.chatHistory ? data.cvars.chatHistory : "The transcript between Certainly and this visitor is not available";
                    GorgiasChat.sendMessage(opening_message)

                    showGorgiasChat();
                    injectGorgiasChatStyle();

            
                    console.log("Hiding Certainly")
                    // Hides the Certainly Widget
                    certainly.widgetStatus({
                        webchatKey: 1,
                        action: "hide"
                    },
                    function(){
                        certainly.sendCvars({
                            webchatKey: 1,
                            custom_vars: {
                                gorgias: ""
                            }
                        })

                    })

                    // Hides Certainly chat manually
                    document.getElementById("botxo-iframeContainer-1").style.display = "none";
                    document.getElementById("botxo-button-1").style.display = "none";
                }
                
            }
        }
    });
});
