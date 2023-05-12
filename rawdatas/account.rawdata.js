// fix cứng _id phục vụ mục đích truy vấn các thứ liên quan đến count dễ dàng
const accounts = [
    {
        avatar: {
            filename: null,
            url: "http://dummyimage.com/100x100.png/dddddd/000000",
            publicId: null,
        },
        coverImage: {
            filename: null,
            url: "http://dummyimage.com/107x100.png/dddddd/000000",
            publicId: null,
        },
        name: "Chris Vater",
        gender: "Female",
        isBlocked: false,
        _id: "63bbff18fc13ae649300082a",
        password: "123456",
        phoneNumber: "0123456789",
        online: false,
        token: "01GPB5RXV5KTH6M31MAS7WS31B",
        uuid: "558b8e32-98d9-444c-8f61-ae705cff1386",
        active: false,
        description:
            "Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat.",
        link: "https://state.tx.us/est/quam/pharetra/magna/ac/consequat.aspx?sem=pellentesque&mauris=viverra&laoreet=pede&ut=ac&rhoncus=diam&aliquet=cras&pulvinar=pellentesque&sed=volutpat&nisl=dui&nunc=maecenas&rhoncus=tristique&dui=est&vel=et&sem=tempus&sed=semper&sagittis=est&nam=quam&congue=pharetra&risus=magna&semper=ac&porta=consequat&volutpat=metus&quam=sapien&pede=ut&lobortis=nunc&ligula=vestibulum&sit=ante&amet=ipsum&eleifend=primis&pede=in&libero=faucibus&quis=orci&orci=luctus&nullam=et&molestie=ultrices&nibh=posuere&in=cubilia&lectus=curae&pellentesque=mauris&at=viverra",
        city: "Gjoçaj",
        country: "Albania",
        blockedAccounts: [
            {
                _id: "63ddb35ac5cb8924b0e86ac1",
                account: "63bbff18fc13ae6493000833",
                createdAt: "2023-02-04T01:22:34.889Z",
            },
        ],
        friends: [
            {
                _id: "63ddb359c5cb8924b0e86a94",
                friend: "63bbff18fc13ae6493000831",
                createdAt: "2023-02-04T01:22:33.851Z",
            },
        ],
        friendRequestReceived: [
            {
                _id: "63ddb35bc5cb8924b0e86ae8",
                fromUser: "63bbff18fc13ae6493000832",
                createdAt: "2023-02-04T01:22:35.638Z",
            },
        ],
        friendRequestSent: [
            {
                _id: "63ddb35cc5cb8924b0e86b0a",
                toUser: "63bbff18fc13ae6493000830",
                createdAt: "2023-02-04T01:22:36.427Z",
            },
            {
                _id: "63ddb35cc5cb8924b0e86b18",
                toUser: "63bbff18fc13ae6493000833",
                createdAt: "2023-02-04T01:22:36.908Z",
            },
        ],
        __v: 0,
        createdAt: "2023-02-04T01:22:33.652Z",
        updatedAt: "2023-02-04T01:22:36.908Z",
    },
    {
        avatar: {
            filename: null,
            url: "http://dummyimage.com/100x100.png/cc0000/ffffff",
            publicId: null,
        },
        coverImage: {
            filename: null,
            url: "http://dummyimage.com/134x100.png/cc0000/ffffff",
            publicId: null,
        },
        name: "Gussi Waterhouse",
        gender: "Female",
        isBlocked: false,
        _id: "63bbff18fc13ae649300082b",
        password: "123456",
        phoneNumber: "0147852369",
        online: false,
        token: "01GPB5RXVHHZR3RAX9W3EWVFA3",
        uuid: "bccd2c17-2493-44ca-baff-dae0e34110dd",
        active: true,
        description:
            "Aliquam non mauris. Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem. Sed sagittis.",
        link: "http://tmall.com/imperdiet/sapien/urna/pretium.jpg?curabitur=eu&convallis=tincidunt&duis=in&consequat=leo&dui=maecenas&nec=pulvinar&nisi=lobortis&volutpat=est&eleifend=phasellus&donec=sit&ut=amet&dolor=erat&morbi=nulla&vel=tempus&lectus=vivamus&in=in&quam=felis&fringilla=eu&rhoncus=sapien&mauris=cursus&enim=vestibulum&leo=proin&rhoncus=eu&sed=mi&vestibulum=nulla&sit=ac&amet=enim&cursus=in&id=tempor&turpis=turpis&integer=nec&aliquet=euismod&massa=scelerisque&id=quam&lobortis=turpis&convallis=adipiscing&tortor=lorem&risus=vitae&dapibus=mattis",
        city: "Banī Suwayf",
        country: "Egypt",
        blockedAccounts: [
            {
                _id: "63ddb35ac5cb8924b0e86ac5",
                account: "63bbff18fc13ae649300082d",
                createdAt: "2023-02-04T01:22:34.955Z",
            },
        ],
        friends: [
            {
                _id: "63ddb35ac5cb8924b0e86aab",
                friend: "63bbff18fc13ae649300082f",
                createdAt: "2023-02-04T01:22:34.327Z",
            },
        ],
        friendRequestReceived: [
            {
                _id: "63ddb35bc5cb8924b0e86aee",
                fromUser: "63bbff18fc13ae649300082e",
                createdAt: "2023-02-04T01:22:35.776Z",
            },
        ],
        friendRequestSent: [
            {
                _id: "63ddb35cc5cb8924b0e86afe",
                toUser: "63bbff18fc13ae649300082e",
                createdAt: "2023-02-04T01:22:36.159Z",
            },
        ],
        __v: 0,
        createdAt: "2023-02-04T01:22:33.653Z",
        updatedAt: "2023-02-04T01:22:36.159Z",
    },
    {
        avatar: {
            filename: null,
            url: "http://dummyimage.com/100x100.png/ff4444/ffffff",
            publicId: null,
        },
        coverImage: {
            filename: null,
            url: "http://dummyimage.com/210x100.png/cc0000/ffffff",
            publicId: null,
        },
        name: "Logan Stannion",
        gender: "Male",
        isBlocked: false,
        _id: "63bbff18fc13ae649300082c",
        password: "ZIfop9F",
        phoneNumber: "3878649924",
        online: true,
        token: "01GPB5RXVW5KA7FG818GRMRE0Q",
        uuid: "a8f4a525-142b-4098-96e4-8790182bb322",
        active: true,
        description:
            "Curabitur gravida nisi at nibh. In hac habitasse platea dictumst.",
        link: "https://shutterfly.com/sed/sagittis.json?elementum=venenatis&pellentesque=lacinia&quisque=aenean&porta=sit&volutpat=amet&erat=justo&quisque=morbi&erat=ut&eros=odio&viverra=cras&eget=mi&congue=pede&eget=malesuada&semper=in&rutrum=imperdiet&nulla=et&nunc=commodo&purus=vulputate&phasellus=justo&in=in&felis=blandit&donec=ultrices&semper=enim&sapien=lorem&a=ipsum&libero=dolor&nam=sit&dui=amet&proin=consectetuer&leo=adipiscing&odio=elit&porttitor=proin&id=interdum&consequat=mauris&in=non&consequat=ligula&ut=pellentesque&nulla=ultrices&sed=phasellus&accumsan=id&felis=sapien&ut=in&at=sapien&dolor=iaculis&quis=congue&odio=vivamus&consequat=metus&varius=arcu&integer=adipiscing&ac=molestie&leo=hendrerit&pellentesque=at&ultrices=vulputate&mattis=vitae&odio=nisl&donec=aenean&vitae=lectus&nisi=pellentesque&nam=eget&ultrices=nunc&libero=donec&non=quis&mattis=orci&pulvinar=eget&nulla=orci&pede=vehicula&ullamcorper=condimentum&augue=curabitur&a=in&suscipit=libero&nulla=ut&elit=massa&ac=volutpat&nulla=convallis&sed=morbi&vel=odio&enim=odio&sit=elementum&amet=eu&nunc=interdum&viverra=eu&dapibus=tincidunt&nulla=in&suscipit=leo&ligula=maecenas&in=pulvinar",
        city: "Guapimirim",
        country: "Brazil",
        blockedAccounts: [],
        friends: [
            {
                _id: "63ddb359c5cb8924b0e86a9a",
                friend: "63bbff18fc13ae6493000832",
                createdAt: "2023-02-04T01:22:33.981Z",
            },
            {
                _id: "63ddb35ac5cb8924b0e86aa1",
                friend: "63bbff18fc13ae649300082d",
                createdAt: "2023-02-04T01:22:34.120Z",
            },
        ],
        friendRequestReceived: [],
        friendRequestSent: [],
        __v: 0,
        createdAt: "2023-02-04T01:22:33.653Z",
        updatedAt: "2023-02-04T01:22:34.119Z",
    },
    {
        avatar: {
            filename: null,
            url: "http://dummyimage.com/100x100.png/ff4444/ffffff",
            publicId: null,
        },
        coverImage: {
            filename: null,
            url: "http://dummyimage.com/152x100.png/cc0000/ffffff",
            publicId: null,
        },
        name: "Stillmann Patty",
        gender: "Male",
        isBlocked: true,
        _id: "63bbff18fc13ae649300082d",
        password: "sYlEmQqX4",
        phoneNumber: "4984166304",
        online: true,
        token: "01GPB5RXW7ZPRN9ZQW9ZBHM2JG",
        uuid: "b5b5a35a-a029-4a05-b95c-084d5553d416",
        active: true,
        description:
            "Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.",
        link: "https://ft.com/nulla/ac/enim/in/tempor.js?luctus=dui&cum=nec&sociis=nisi&natoque=volutpat&penatibus=eleifend&et=donec&magnis=ut&dis=dolor&parturient=morbi&montes=vel&nascetur=lectus&ridiculus=in&mus=quam&vivamus=fringilla&vestibulum=rhoncus&sagittis=mauris&sapien=enim&cum=leo&sociis=rhoncus&natoque=sed&penatibus=vestibulum&et=sit&magnis=amet&dis=cursus&parturient=id&montes=turpis&nascetur=integer&ridiculus=aliquet&mus=massa&etiam=id&vel=lobortis&augue=convallis",
        city: "Zoetermeer",
        country: "Netherlands",
        blockedAccounts: [
            {
                _id: "63ddb35bc5cb8924b0e86acb",
                account: "63bbff18fc13ae649300082f",
                createdAt: "2023-02-04T01:22:35.056Z",
            },
        ],
        friends: [
            {
                _id: "63ddb35ac5cb8924b0e86a9f",
                friend: "63bbff18fc13ae649300082c",
                createdAt: "2023-02-04T01:22:34.085Z",
            },
            {
                _id: "63ddb35ac5cb8924b0e86abb",
                friend: "63bbff18fc13ae6493000833",
                createdAt: "2023-02-04T01:22:34.677Z",
            },
        ],
        friendRequestReceived: [
            {
                _id: "63ddb35bc5cb8924b0e86af6",
                fromUser: "63bbff18fc13ae6493000831",
                createdAt: "2023-02-04T01:22:35.973Z",
            },
        ],
        friendRequestSent: [],
        __v: 0,
        createdAt: "2023-02-04T01:22:33.653Z",
        updatedAt: "2023-02-04T01:22:35.973Z",
    },
    {
        avatar: {
            filename: null,
            url: "http://dummyimage.com/100x100.png/dddddd/000000",
            publicId: null,
        },
        coverImage: {
            filename: null,
            url: "http://dummyimage.com/222x100.png/5fa2dd/ffffff",
            publicId: null,
        },
        name: "Rhodia Do Rosario",
        gender: "Female",
        isBlocked: false,
        _id: "63bbff18fc13ae649300082e",
        password: "gxyu1n",
        phoneNumber: "8267805850",
        online: true,
        token: "01GPB5RXWQAQ0A8E6QVTJVTJWV",
        uuid: "91a399fc-ad00-4620-b150-6ed45e470d67",
        active: false,
        description:
            "Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.",
        link: "http://time.com/posuere/cubilia/curae/donec/pharetra.xml?integer=eleifend&non=donec&velit=ut&donec=dolor&diam=morbi&neque=vel&vestibulum=lectus&eget=in&vulputate=quam&ut=fringilla&ultrices=rhoncus&vel=mauris&augue=enim&vestibulum=leo&ante=rhoncus&ipsum=sed&primis=vestibulum&in=sit&faucibus=amet&orci=cursus&luctus=id&et=turpis&ultrices=integer",
        city: "Xuelu",
        country: "China",
        blockedAccounts: [
            {
                _id: "63ddb35bc5cb8924b0e86acf",
                account: "63bbff18fc13ae649300082a",
                createdAt: "2023-02-04T01:22:35.127Z",
            },
        ],
        friends: [
            {
                _id: "63ddb35ac5cb8924b0e86aa4",
                friend: "63bbff18fc13ae6493000833",
                createdAt: "2023-02-04T01:22:34.182Z",
            },
        ],
        friendRequestReceived: [
            {
                _id: "63ddb35cc5cb8924b0e86afc",
                fromUser: "63bbff18fc13ae649300082b",
                createdAt: "2023-02-04T01:22:36.105Z",
            },
        ],
        friendRequestSent: [
            {
                _id: "63ddb35bc5cb8924b0e86af0",
                toUser: "63bbff18fc13ae649300082b",
                createdAt: "2023-02-04T01:22:35.812Z",
            },
        ],
        __v: 0,
        createdAt: "2023-02-04T01:22:33.653Z",
        updatedAt: "2023-02-04T01:22:36.105Z",
    },
    {
        avatar: {
            filename: null,
            url: "http://dummyimage.com/100x100.png/cc0000/ffffff",
            publicId: null,
        },
        coverImage: {
            filename: null,
            url: "http://dummyimage.com/158x100.png/dddddd/000000",
            publicId: null,
        },
        name: "Rollie Solway",
        gender: "Male",
        isBlocked: false,
        _id: "63bbff18fc13ae649300082f",
        password: "Ljd6KKC",
        phoneNumber: "1338549514",
        online: false,
        token: "01GPB5RXX23KGMA3074NPSJ65N",
        uuid: "983886e3-2dfd-4d38-8a12-72f200eac2b6",
        active: true,
        description:
            "Vestibulum sed magna at nunc commodo placerat. Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula.",
        link: "https://un.org/commodo/placerat/praesent/blandit/nam.jpg?in=sed&leo=tincidunt&maecenas=eu&pulvinar=felis&lobortis=fusce&est=posuere&phasellus=felis&sit=sed&amet=lacus&erat=morbi&nulla=sem&tempus=mauris&vivamus=laoreet&in=ut&felis=rhoncus&eu=aliquet&sapien=pulvinar&cursus=sed&vestibulum=nisl&proin=nunc&eu=rhoncus&mi=dui&nulla=vel&ac=sem&enim=sed&in=sagittis&tempor=nam&turpis=congue&nec=risus&euismod=semper&scelerisque=porta&quam=volutpat&turpis=quam&adipiscing=pede&lorem=lobortis&vitae=ligula&mattis=sit&nibh=amet&ligula=eleifend&nec=pede&sem=libero&duis=quis&aliquam=orci&convallis=nullam&nunc=molestie&proin=nibh&at=in&turpis=lectus&a=pellentesque&pede=at&posuere=nulla&nonummy=suspendisse&integer=potenti&non=cras&velit=in&donec=purus&diam=eu&neque=magna&vestibulum=vulputate&eget=luctus&vulputate=cum&ut=sociis&ultrices=natoque&vel=penatibus&augue=et&vestibulum=magnis&ante=dis&ipsum=parturient&primis=montes&in=nascetur&faucibus=ridiculus&orci=mus&luctus=vivamus&et=vestibulum&ultrices=sagittis&posuere=sapien&cubilia=cum&curae=sociis&donec=natoque&pharetra=penatibus&magna=et&vestibulum=magnis&aliquet=dis&ultrices=parturient&erat=montes&tortor=nascetur&sollicitudin=ridiculus&mi=mus&sit=etiam&amet=vel&lobortis=augue&sapien=vestibulum&sapien=rutrum&non=rutrum",
        city: "Resapombo",
        country: "Indonesia",
        blockedAccounts: [
            {
                _id: "63ddb35bc5cb8924b0e86ad3",
                account: "63bbff18fc13ae649300082e",
                createdAt: "2023-02-04T01:22:35.193Z",
            },
        ],
        friends: [
            {
                _id: "63ddb35ac5cb8924b0e86aa9",
                friend: "63bbff18fc13ae649300082b",
                createdAt: "2023-02-04T01:22:34.292Z",
            },
        ],
        friendRequestReceived: [
            {
                _id: "63ddb35cc5cb8924b0e86b02",
                fromUser: "63bbff18fc13ae6493000830",
                createdAt: "2023-02-04T01:22:36.259Z",
            },
        ],
        friendRequestSent: [
            {
                _id: "63ddb35cc5cb8924b0e86b12",
                toUser: "63bbff18fc13ae6493000832",
                createdAt: "2023-02-04T01:22:36.774Z",
            },
        ],
        __v: 0,
        createdAt: "2023-02-04T01:22:33.653Z",
        updatedAt: "2023-02-04T01:22:36.774Z",
    },
    {
        avatar: {
            filename: null,
            url: "http://dummyimage.com/100x100.png/5fa2dd/ffffff",
            publicId: null,
        },
        coverImage: {
            filename: null,
            url: "http://dummyimage.com/240x100.png/cc0000/ffffff",
            publicId: null,
        },
        name: "Ashly Delnevo",
        gender: "Female",
        isBlocked: false,
        _id: "63bbff18fc13ae6493000830",
        password: "cifBU5rnGzJ",
        phoneNumber: "5575194438",
        online: false,
        token: "01GPB5RXXDGY3E7HJDE38ZAKS6",
        uuid: "dcb359a2-d0ca-4f07-af7a-dbb038a5382d",
        active: false,
        description:
            "Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy. Maecenas tincidunt lacus at velit. Vivamus vel nulla eget eros elementum pellentesque.",
        link: "https://twitpic.com/id/lobortis/convallis/tortor/risus/dapibus.html?tellus=faucibus&nulla=accumsan&ut=odio&erat=curabitur&id=convallis&mauris=duis&vulputate=consequat&elementum=dui&nullam=nec&varius=nisi&nulla=volutpat&facilisi=eleifend&cras=donec&non=ut&velit=dolor&nec=morbi&nisi=vel&vulputate=lectus&nonummy=in&maecenas=quam&tincidunt=fringilla&lacus=rhoncus&at=mauris&velit=enim&vivamus=leo&vel=rhoncus&nulla=sed&eget=vestibulum&eros=sit&elementum=amet&pellentesque=cursus&quisque=id&porta=turpis&volutpat=integer&erat=aliquet&quisque=massa&erat=id",
        city: "Ipoh",
        country: "Malaysia",
        blockedAccounts: [],
        friends: [
            {
                _id: "63ddb35ac5cb8924b0e86aae",
                friend: "63bbff18fc13ae6493000831",
                createdAt: "2023-02-04T01:22:34.395Z",
            },
            {
                _id: "63ddb35ac5cb8924b0e86ab6",
                friend: "63bbff18fc13ae6493000832",
                createdAt: "2023-02-04T01:22:34.561Z",
            },
        ],
        friendRequestReceived: [
            {
                _id: "63ddb35cc5cb8924b0e86b08",
                fromUser: "63bbff18fc13ae649300082a",
                createdAt: "2023-02-04T01:22:36.393Z",
            },
        ],
        friendRequestSent: [
            {
                _id: "63ddb35cc5cb8924b0e86b04",
                toUser: "63bbff18fc13ae649300082f",
                createdAt: "2023-02-04T01:22:36.296Z",
            },
        ],
        __v: 0,
        createdAt: "2023-02-04T01:22:33.653Z",
        updatedAt: "2023-02-04T01:22:36.393Z",
    },
    {
        avatar: {
            filename: null,
            url: "http://dummyimage.com/100x100.png/ff4444/ffffff",
            publicId: null,
        },
        coverImage: {
            filename: null,
            url: "http://dummyimage.com/141x100.png/dddddd/000000",
            publicId: null,
        },
        name: "Saul Wibrow",
        gender: "Male",
        isBlocked: false,
        _id: "63bbff18fc13ae6493000831",
        password: "djMvmO",
        phoneNumber: "1014960340",
        online: true,
        token: "01GPB5RXXPZFDCZBD419J0N1XW",
        uuid: "e6bd273e-1760-4e50-bb78-818892cae03b",
        active: false,
        description:
            "In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh.",
        link: "https://sbwire.com/turpis/sed/ante/vivamus/tortor.jsp?viverra=non&pede=velit&ac=nec&diam=nisi&cras=vulputate&pellentesque=nonummy&volutpat=maecenas&dui=tincidunt&maecenas=lacus&tristique=at&est=velit&et=vivamus&tempus=vel&semper=nulla&est=eget&quam=eros&pharetra=elementum&magna=pellentesque&ac=quisque&consequat=porta&metus=volutpat&sapien=erat&ut=quisque&nunc=erat&vestibulum=eros&ante=viverra&ipsum=eget&primis=congue&in=eget&faucibus=semper&orci=rutrum&luctus=nulla&et=nunc&ultrices=purus&posuere=phasellus&cubilia=in&curae=felis&mauris=donec&viverra=semper&diam=sapien&vitae=a&quam=libero&suspendisse=nam&potenti=dui",
        city: "Limbuhan",
        country: "Philippines",
        blockedAccounts: [
            {
                _id: "63ddb35bc5cb8924b0e86ad9",
                account: "63bbff18fc13ae649300082c",
                createdAt: "2023-02-04T01:22:35.300Z",
            },
        ],
        friends: [
            {
                _id: "63ddb359c5cb8924b0e86a96",
                friend: "63bbff18fc13ae649300082a",
                createdAt: "2023-02-04T01:22:33.885Z",
            },
            {
                _id: "63ddb35ac5cb8924b0e86ab0",
                friend: "63bbff18fc13ae6493000830",
                createdAt: "2023-02-04T01:22:34.433Z",
            },
        ],
        friendRequestReceived: [],
        friendRequestSent: [
            {
                _id: "63ddb35cc5cb8924b0e86af8",
                toUser: "63bbff18fc13ae649300082d",
                createdAt: "2023-02-04T01:22:36.009Z",
            },
        ],
        __v: 0,
        createdAt: "2023-02-04T01:22:33.653Z",
        updatedAt: "2023-02-04T01:22:36.008Z",
    },
    {
        avatar: {
            filename: null,
            url: "http://dummyimage.com/100x100.png/ff4444/ffffff",
            publicId: null,
        },
        coverImage: {
            filename: null,
            url: "http://dummyimage.com/113x100.png/ff4444/ffffff",
            publicId: null,
        },
        name: "Eldin Paolicchi",
        gender: "Male",
        isBlocked: false,
        _id: "63bbff18fc13ae6493000832",
        password: "WmnTe4ug8bO",
        phoneNumber: "8394795000",
        online: true,
        token: "01GPB5RXXZ0CHX4YQPQ5A238GZ",
        uuid: "b0cee41a-ae6b-425a-85dd-113f44af7768",
        active: false,
        description: "Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.",
        link: "http://amazon.com/molestie/sed/justo/pellentesque.jsp?ipsum=lacinia&ac=erat&tellus=vestibulum&semper=sed&interdum=magna&mauris=at&ullamcorper=nunc&purus=commodo&sit=placerat&amet=praesent",
        city: "Sarvābād",
        country: "Iran",
        blockedAccounts: [
            {
                _id: "63ddb35bc5cb8924b0e86ade",
                account: "63bbff18fc13ae649300082d",
                createdAt: "2023-02-04T01:22:35.370Z",
            },
        ],
        friends: [
            {
                _id: "63ddb35ac5cb8924b0e86a9c",
                friend: "63bbff18fc13ae649300082c",
                createdAt: "2023-02-04T01:22:34.015Z",
            },
            {
                _id: "63ddb35ac5cb8924b0e86ab4",
                friend: "63bbff18fc13ae6493000830",
                createdAt: "2023-02-04T01:22:34.528Z",
            },
        ],
        friendRequestReceived: [
            {
                _id: "63ddb35cc5cb8924b0e86b10",
                fromUser: "63bbff18fc13ae649300082f",
                createdAt: "2023-02-04T01:22:36.718Z",
            },
        ],
        friendRequestSent: [
            {
                _id: "63ddb35bc5cb8924b0e86aea",
                toUser: "63bbff18fc13ae649300082a",
                createdAt: "2023-02-04T01:22:35.676Z",
            },
        ],
        __v: 0,
        createdAt: "2023-02-04T01:22:33.653Z",
        updatedAt: "2023-02-04T01:22:36.718Z",
    },
    {
        avatar: {
            filename: null,
            url: "http://dummyimage.com/100x100.png/dddddd/000000",
            publicId: null,
        },
        coverImage: {
            filename: null,
            url: "http://dummyimage.com/233x100.png/ff4444/ffffff",
            publicId: null,
        },
        name: "Cyrill Bathersby",
        gender: "Male",
        isBlocked: false,
        _id: "63bbff18fc13ae6493000833",
        password: "bo2qyfBzCY",
        phoneNumber: "2724318484",
        online: true,
        token: "01GPB5RXY61A0JPZ59YATF06K6",
        uuid: "fc86ebd3-b013-477c-be08-2e2af3e6614c",
        active: true,
        description:
            "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi.",
        link: "http://upenn.edu/molestie/nibh/in/lectus/pellentesque/at/nulla.png?tincidunt=erat&eu=id&felis=mauris&fusce=vulputate&posuere=elementum&felis=nullam&sed=varius&lacus=nulla&morbi=facilisi&sem=cras&mauris=non&laoreet=velit&ut=nec&rhoncus=nisi&aliquet=vulputate&pulvinar=nonummy&sed=maecenas&nisl=tincidunt&nunc=lacus&rhoncus=at&dui=velit&vel=vivamus&sem=vel&sed=nulla&sagittis=eget&nam=eros&congue=elementum&risus=pellentesque&semper=quisque&porta=porta&volutpat=volutpat&quam=erat&pede=quisque&lobortis=erat&ligula=eros&sit=viverra&amet=eget&eleifend=congue&pede=eget&libero=semper&quis=rutrum&orci=nulla&nullam=nunc&molestie=purus&nibh=phasellus&in=in&lectus=felis&pellentesque=donec&at=semper&nulla=sapien&suspendisse=a&potenti=libero&cras=nam&in=dui&purus=proin&eu=leo&magna=odio&vulputate=porttitor&luctus=id&cum=consequat&sociis=in&natoque=consequat&penatibus=ut&et=nulla&magnis=sed&dis=accumsan&parturient=felis&montes=ut&nascetur=at&ridiculus=dolor&mus=quis&vivamus=odio&vestibulum=consequat&sagittis=varius&sapien=integer&cum=ac&sociis=leo&natoque=pellentesque&penatibus=ultrices&et=mattis&magnis=odio&dis=donec&parturient=vitae&montes=nisi&nascetur=nam&ridiculus=ultrices&mus=libero&etiam=non",
        city: "Botucatu",
        country: "Brazil",
        blockedAccounts: [
            {
                _id: "63ddb35bc5cb8924b0e86ae3",
                account: "63bbff18fc13ae6493000831",
                createdAt: "2023-02-04T01:22:35.437Z",
            },
        ],
        friends: [
            {
                _id: "63ddb35ac5cb8924b0e86aa6",
                friend: "63bbff18fc13ae649300082e",
                createdAt: "2023-02-04T01:22:34.223Z",
            },
            {
                _id: "63ddb35ac5cb8924b0e86ab9",
                friend: "63bbff18fc13ae649300082d",
                createdAt: "2023-02-04T01:22:34.642Z",
            },
        ],
        friendRequestReceived: [
            {
                _id: "63ddb35cc5cb8924b0e86b16",
                fromUser: "63bbff18fc13ae649300082a",
                createdAt: "2023-02-04T01:22:36.874Z",
            },
        ],
        friendRequestSent: [],
        __v: 0,
        createdAt: "2023-02-04T01:22:33.653Z",
        updatedAt: "2023-02-04T01:22:36.873Z",
    },
];

module.exports = accounts;
