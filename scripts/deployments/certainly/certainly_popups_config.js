const CERTAINLY_POPUPS = [
    {
        id: "chat_minimized",
        trigger: "chat_minimized",
        condition: true,
        delay: 5000,
        repeat_after: 5,
        desktop: true,
        mobile: true,
        messages: [{
            language: "en",
            texts: [
                "I am there if you have any questions!"
            ]
        }],
        start_from_module: "",
    },
    {
        id: "free-trial",
        trigger: "page_load",
        condition: (function(){
            if (window.location.href.includes("free-trial")){
                return true;
            }
        })(),
        delay: 5000,
        repeat_after: 2,
        desktop: true,
        mobile: true,
        messages: [{
            language: "en",
            texts: [
                "Please fill in your details on\nthis form in order to start your trial!",
            ]
        }],
        start_from_module: "722641",
    },
    {
        id: "book-a-demo",
        trigger: "page_load",
        condition: (function(){
            if (window.location.href.includes("demo")){
                return true;
            }
        })(),
        delay: 5000,
        repeat_after: 2,
        desktop: true,
        mobile: true,
        messages: [{
            language: "en",
            texts: [
                "Please fill out the form below and we\nwill contact you to arrange a meeting.",
            ]
        }],
        start_from_module: "722645",
    },
    {
        id: "customer_stories",
        trigger: "page_load",
        condition: (function(){
            if (window.location.href.includes("customers")){
                return true;
            }
        })(),
        delay: 5000,
        repeat_after: 5,
        desktop: true,
        mobile: true,
        messages: [{
            language: "en",
            texts: [
                "Do not hesitate to read our customer's stories\nand learn more about their journeys.",
            ]
        }],
        start_from_module: "",
    },
    {
        id: "careers",
        trigger: "page_load",
        condition: (function(){
            if (window.location.href.includes("careers")){
                return true;
            }
        })(),
        delay: 5000,
        repeat_after: 2,
        desktop: true,
        mobile: true,
        messages: [{
            language: "en",
            texts: [
                "Interested in growing as a profesional at Certainly?",
            ]
        }],
        start_from_module: "722648",
    },
    {
        id: "default",
        trigger: "page_load",
        condition: true,
        delay: 5000,
        repeat_after: 5,
        desktop: true,
        mobile: true,
        messages: [{
            language: "en",
            texts: [
                "Hi! 😊",
                "Curious to know how\nmuch revenue Certainly\ncan generate for you?"
            ]
        }],
        start_from_module: "",
    }
]