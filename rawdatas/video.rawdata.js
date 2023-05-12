const videos = [
    {
        "described": "Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.",
        "video": {
            "filename": "",
            "url": "https://youtube.com/watch?v=IOe0tNoUGv8&si=EnSIkaIECMiOmarE",
            "publicId": ""
        },
        "isAdsCampaign": true,
        "likes": 0,
        "likedAccounts": []
    },
    {
        "described": "In hac habitasse platea dictumst.",
        "video": {
            "filename": "",
            "url": "https://youtube.com/watch?v=CnZxamAbSnw&si=EnSIkaIECMiOmarE",
            "publicId": ""
        },
        "isAdsCampaign": false,
        "likes": 0,
        "likedAccounts": []
    },
    {
        "described": "Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim.",
        "video": {
            "filename": "",
            "url": "https://youtube.com/watch?v=WfGn1yTL8TI&si=EnSIkaIECMiOmarE",
            "publicId": ""
        },
        "isAdsCampaign": false,
        "likes": 2,
        "likedAccounts": ["63a6854c92f5e81f48ae4e51", "63a6854c92f5e81f48ae4e53"],
    },
    {
        "described": "Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque. Duis bibendum.",
        "video": {
            "filename": "",
            "url": "https://youtube.com/watch?v=IuO64sifh9o&si=EnSIkaIECMiOmarE",
            "publicId": ""
        },
        "isAdsCampaign": true,
        "likes": 0,
        "likedAccounts": []
    },
    {
        "described": "Nunc rhoncus dui vel sem. Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus.",
        "video": {
            "filename": "",
            "url": "https://youtube.com/watch?v=FOx-KT3KRSo&si=EnSIkaIECMiOmarE",
            "publicId": ""
        },
        "isAdsCampaign": false,
        "likes": 3,
        "likedAccounts": ["63a6854c92f5e81f48ae4e51", "63a6854c92f5e81f48ae4e53", "63a6854c92f5e81f48ae4e55"],
    },
    {
        "described": "Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue. Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius.",
        "video": {
            "filename": "",
            "url": "https://youtube.com/watch?v=Zs36XaOhy9k&si=EnSIkaIECMiOmarE",
            "publicId": ""
        },
        "isAdsCampaign": true,
        "likes": 3,
        "likedAccounts": ["63a6854c92f5e81f48ae4e52", "63a6854c92f5e81f48ae4e53", "63a6854c92f5e81f48ae4e55"]
    },
    {
        "described": "Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem.",
        "video": {
            "filename": "",
            "url": "https://youtube.com/watch?v=ZF90iFVyobQ&si=EnSIkaIECMiOmarE",
            "publicId": ""
        },
        "isAdsCampaign": false,
        "likes": 1,
        "likedAccounts": ["63a6854c92f5e81f48ae4e54"]
    },
    {
        "described": "Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue.",
        "video": {
            "filename": "",
            "url": "https://youtube.com/watch?v=hedR-SNM35w&si=EnSIkaIECMiOmarE",
            "publicId": ""
        },
        "isAdsCampaign": false,
        "likes": 0,
        "likedAccounts": []
    },
    {
        "described": "Cras in purus eu magna vulputate luctus.",
        "video": {
            "filename": "",
            "url": "https://youtube.com/watch?v=SlGnZDI9HVg&si=EnSIkaIECMiOmarE",
            "publicId": ""
        },
        "isAdsCampaign": false,
        "likes": 0,
        "likedAccounts": []
    },
    {
        "described": "Nunc rhoncus dui vel sem. Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus. Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien.",
        "video": {
            "filename": "",
            "url": "https://youtube.com/watch?v=1JE24VcCZpM&si=EnSIkaIECMiOmarE",
            "publicId": ""
        },
        "isAdsCampaign": false,
        "likes": 0,
        "likedAccounts": []
    },
    {
        "described": "In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.",
        "video": {
            "filename": "",
            "url": "https://youtube.com/watch?v=Ru-9UnZiXtM&si=EnSIkaIECMiOmarE",
            "publicId": ""
        },
        "isAdsCampaign": false,
        "likes": 0,
        "likedAccounts": []
    },
    {
        "described": "Pellentesque ultrices mattis odio. Donec vitae nisi. Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum.",
        "video": {
            "filename": "",
            "url": "https://youtube.com/watch?v=fZMNWAmX2Zs&si=EnSIkaIECMiOmarE",
            "publicId": ""
        },
        "isAdsCampaign": true,
        "likes": 0,
        "likedAccounts": []
    },
    {
        "described": "Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.",
        "video": {
            "filename": "",
            "url": "https://youtube.com/watch?v=snAUPImBRu0&si=EnSIkaIECMiOmarE",
            "publicId": ""
        },
        "isAdsCampaign": false,
        "likes": 0,
        "likedAccounts": []
    },
    {
        "described": "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque. Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh.",
        "video": {
            "filename": "",
            "url": "https://youtube.com/watch?v=nmVtOLM3yqo&si=EnSIkaIECMiOmarE",
            "publicId": ""
        },
        "isAdsCampaign": true,
        "likes": 0,
        "likedAccounts": []
    },
    {
        "described": "In sagittis dui vel nisl. Duis ac nibh.",
        "video": {
            "filename": "",
            "url": "https://youtube.com/watch?v=UXqxTZ67Jio&si=EnSIkaIECMiOmarE",
            "publicId": ""
        },
        "isAdsCampaign": true,
        "likes": 0,
        "likedAccounts": []
    },
    {
        "described": "Fusce consequat.",
        "video": {
            "filename": "",
            "url": "https://youtube.com/watch?v=sQlQpKpQOpc&si=EnSIkaIECMiOmarE",
            "publicId": ""
        },
        "isAdsCampaign": false,
        "likes": 0,
        "likedAccounts": []
    },
    {
        "described": "Aliquam sit amet diam in magna bibendum imperdiet.",
        "video": {
            "filename": "",
            "url": "https://youtube.com/watch?v=OM1dqEsXGH8&si=EnSIkaIECMiOmarE",
            "publicId": ""
        },
        "isAdsCampaign": true,
        "likes": 0,
        "likedAccounts": []
    },
    {
        "described": "Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros.",
        "video": {
            "filename": "",
            "url": "https://youtube.com/watch?v=LxNzRN8EMcw&si=EnSIkaIECMiOmarE",
            "publicId": ""
        },
        "isAdsCampaign": true,
        "likes": 0,
        "likedAccounts": []
    },
    {
        "described": "Sed sagittis.",
        "video": {
            "filename": "",
            "url": "https://youtube.com/watch?v=ct0eKdsMEqM&si=EnSIkaIECMiOmarE",
            "publicId": ""
        },
        "isAdsCampaign": false,
        "likes": 0,
        "likedAccounts": []
    },
    {
        "described": "Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh. In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet. Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc.",
        "video": {
            "filename": "",
            "url": "https://youtube.com/watch?v=wZ4Yz_1FdVk&si=EnSIkaIECMiOmarE",
            "publicId": ""
        },
        "isAdsCampaign": true,
        "likes": 0,
        "likedAccounts": []
    }
]
module.exports = videos;