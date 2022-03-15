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
        condition: true,
        delay: 5000,
        repeat_after: 5,
        desktop: true,
        mobile: true,
        messages: [{
            language: "en",
            texts: [
                "The 14-day free trial grants you full access to all of the features. No credit card is needed.",
                "Fill in your details on this page in order to start your trial!"
            ]
        }],
        start_from_module: "722641",
    },
    {
        id: "book-a-demo",
        trigger: "page_load",
        condition: true,
        delay: 5000,
        repeat_after: 5,
        desktop: true,
        mobile: true,
        messages: [{
            language: "en",
            texts: [
                "One of our team members will give you a tour of the platform 🚀",
                "Please fill out the form below, and we will contact you to arrange a meeting"
            ]
        }],
        start_from_module: "722645",
    },
    {
        id: "customer_storied",
        trigger: "page_load",
        condition: true,
        delay: 5000,
        repeat_after: 5,
        desktop: true,
        mobile: true,
        messages: [{
            language: "en",
            texts: [
                "I hope you find our customer stories interesting 😍"
            ]
        }],
        start_from_module: "",
    },
    {
        id: "careers",
        trigger: "page_load",
        condition: true,
        delay: 5000,
        repeat_after: 5,
        desktop: true,
        mobile: true,
        messages: [{
            language: "en",
            texts: [
                "I hope you find our job oppenings interesting 😍",
                "Remember that if you can't find your dream job among the ones listed here, you can always send us an unsolicited application at hello@certainly.io"
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
                "Curious to know how much revenue Certainly can generate for you?"
            ]
        }],
        start_from_module: "",
    }
]