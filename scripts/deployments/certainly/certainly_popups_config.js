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
        id: "platform",
        trigger: "page_load",
        condition: (function(){
            if (window.location.href.includes("/platform")){
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
                "Hey there!", 
                "Wonder how our Certainly Platform can benefit your organization?"
            ]
        }],
        start_from_module: "658538",
    },
    {
        id: "integrations",
        trigger: "page_load",
        condition: (function(){
            if (window.location.href.includes("integrations-channels")){
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
                "I am there if you have any questions!"
            ]
        }],
        start_from_module: "658538",
    },
    {
        id: "Conversational_commerce",
        trigger: "page_load",
        condition: (function(){
            if (window.location.href.includes("conversational-commerce")){
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
                "Hi!",
                "I can show you how much Conversational Commerce can increase your revenue."
            ]
        }],
        start_from_module: "658538",
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
        id: "ecommerce",
        trigger: "page_load",
        condition: (function(){
            if (window.location.href.includes("ecommerce")){
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
                "Hi! I am here to calculate how much your revenue can increase by using the Certainly Platform.",
            ]
        }],
        start_from_module: "658538",
    },
    {
        id: "customer_service",
        trigger: "page_load",
        condition: (function(){
            if (window.location.href.includes("customer-service")){
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
                "I am tailored to calculate how much our platform can save you in Customer Service costs.",
                "Take a look!"
            ]
        }],
        start_from_module: "658538",
    },
    {
        id: "pricing",
        trigger: "page_load",
        condition: (function(){
            if (window.location.href.includes("pricing")){
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
                "Still wondering if the Certainly Platform is the right tool for you?",
                "Get a tailored report from me to see how we can benefit your organization!"
            ]
        }],
        start_from_module: "658538",
    },
    {
        id: "customers",
        trigger: "page_load",
        condition: (function(){
            if (window.location.href.includes("customers")){
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
                "Make sure to read our customer stories and learn more about the results each company generated."
            ]
        }],
        start_from_module: "658538",
    },
    {
        id: "partners",
        trigger: "page_load",
        condition: (function(){
            if (window.location.href.includes("partners")){
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
                "Hi! 😊",
                "Curious to know how\nmuch revenue Certainly\ncan generate for you?"
            ]
        }],
        start_from_module: "658538",
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
                "Please fill out the form below and we\nwill contact you to arrange a meeting 😊",
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
                "Do not hesitate to read our customer stories\nand learn more about their journeys.",
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
                "Interested in growing as a professional at Certainly?",
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
