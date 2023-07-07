// 5 tài khoản đầu là liên quan đến bạn bè của nhau,
// 5 tài khoản tiếp liên quan đến đánh giá của nhau,
// 3 tài khoản còn lại liên quan đến chặn thằng tài khoản đầu
// 2 tài khoản còn lại viết đánh giá, post độc lập, không được comment. 2 tài khoản này liên quan đến nhiệm vụ report
const realAccounts = [
    {
        "_id": "63bbff18fc13ae6493000999",
        "name": "Admin",
        "phoneNumber": "0999999999",
        "password": "Admin123",
        "avatar": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688639806/datn/images/account/admin_tm1gbk.png",
            "publicId": null,
        },
        "coverImage": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688640843/datn/images/account/cute-medical-customer-service-call-center-cartoon_663547-40_tlfg7a.jpg",
            "publicId": null,
        },
        "gender": "Bí mật",
        "isBlocked": false,
        "active": true,
        "description": "Admin có quyền quản trị hệ thống Cosmetica",
        "city": "Hà Nội",
        "country": "Việt Nam",
        "blockedAccounts": [],
        "friends": [],
        "friendRequestReceived": [],
        "friendRequestSent": [],
        "skin": {
            "obstacle": {
                "isSensitive": false,
                "hasAcne": false
            },
            "type": "Da thường"
        },
        "point": 0,
        "level": 1,
        "isBrand": false
    },
    // User 1
    {
        "_id": "63bbff18fc13ae6493001001",
        "name": "Đào Minh Tiến",
        "phoneNumber": "0868327784",
        "password": "daominhtien",
        "avatar": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688639442/datn/images/account/avt1_rxe6ii.png",
            "publicId": null
        },
        "coverImage": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688640843/datn/images/account/cute-medical-customer-service-call-center-cartoon_663547-40_tlfg7a.jpg",
            "publicId": null
        },
        "gender": "Nam",
        "isBlocked": false,
        "active": true,
        "description": "Xin chào, tôi là Đào Minh Tiến. Tôi đam mê du lịch và khám phá văn hóa của các quốc gia khác nhau. Tôi thích nấu ăn và tìm hiểu những món ăn truyền thống. Ngoài ra, tôi cũng là một người yêu thích thể thao, đặc biệt là bóng đá. Tôi thích chơi game và đọc sách trong thời gian rảnh. Tôi rất mong được kết bạn và chia sẻ những sở thích và trải nghiệm của mình với mọi người.",
        "city": "Hà Nội",
        "country": "Việt Nam",
        "blockedAccounts": [
            {
                account: "63bbff18fc13ae6493001013",
            }
        ],
        "friends": [
            {
                friend: "63bbff18fc13ae6493001002"
            },
            {
                friend: "63bbff18fc13ae6493001003"
            },
            {
                friend: "63bbff18fc13ae6493001004"
            },
            {
                friend: "63bbff18fc13ae6493001005"
            }
        ],
        "friendRequestReceived": [
            {
                fromUser: "63bbff18fc13ae6493001006"
            }
        ],
        "friendRequestSent": [
            {
                toUser: "63bbff18fc13ae6493001007"
            }
        ],
        "skin": {
            "obstacle": {
                "isSensitive": false,
                "hasAcne": false
            },
            "type": "Da thường"
        },
        "point": 0,
        "level": 1,
        "isBrand": false
    },
    // User 2
    {
        "_id": "63bbff18fc13ae6493001002",
        "name": "Nguyễn Thị Hằng",
        "password": "Hang123",
        "phoneNumber": "0934567890",
        "avatar": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688639442/datn/images/account/avt2_wgbsff.png",
            "publicId": null
        },
        "coverImage": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688640837/datn/images/account/cute-dinosaur-singing-with-microphone-vector-illustration_663547-55_l1krp8.avif",
            "publicId": null
        },
        "gender": "Nữ",
        "isBlocked": false,
        "active": true,
        "description": "Xin chào! Tôi là Nguyễn Thị Hằng. Tôi đam mê nghệ thuật và thích vẽ tranh cảnh thiên nhiên. Tôi cũng yêu âm nhạc và thường tự tay sáng tác những bài hát nhẹ nhàng. Ngoài ra, tôi là một người yêu thích thể thao, đặc biệt là bơi lội. Tôi thích tham gia các hoạt động tình nguyện và giúp đỡ những người khó khăn. Rất vui được kết bạn và chia sẻ những niềm vui và sở thích của tôi với mọi người!",
        "city": "Hồ Chí Minh",
        "country": "Việt Nam",
        "blockedAccounts": [],
        "friends": [
            {
                friend: "63bbff18fc13ae6493001001"
            },
            {
                friend: "63bbff18fc13ae6493001003"
            }
        ],
        "friendRequestReceived": [],
        "friendRequestSent": [],
        "skin": {
            "obstacle": {
                "isSensitive": false,
                "hasAcne": true
            },
            "type": "Da nhạy cảm"
        },
        "point": 0,
        "level": 1,
        "isBrand": false
    },
    // User 3
    {
        "_id": "63bbff18fc13ae6493001003",
        "name": "Phạm Thị Lan",
        "password": "Lan123",
        "phoneNumber": "0987654321",
        "avatar": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688639442/datn/images/account/avt3_ixs8zj.png",
            "publicId": null
        },
        "coverImage": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688640837/datn/images/account/cute-dinosaur-playing-skateboard-vector-illustration_663547-54_qf3smq.avif",
            "publicId": null
        },
        "gender": "Nữ",
        "isBlocked": false,
        "active": true,
        "description": "Xin chào! Tôi là Phạm Thị Lan. Tôi yêu thích âm nhạc và thường tự hát và viết nhạc. Tôi cũng là một người yêu thích nghệ thuật và thích vẽ tranh và điêu khắc. Ngoài ra, tôi cũng thích du lịch và khám phá những địa điểm mới. Rất vui được kết bạn và chia sẻ niềm vui và đam mê của tôi với mọi người!",
        "city": "Hà Nội",
        "country": "Việt Nam",
        "blockedAccounts": [],
        "friends": [
            {
                friend: "63bbff18fc13ae6493001001"
            },
            {
                friend: "63bbff18fc13ae6493001002"
            }
        ],
        "friendRequestReceived": [],
        "friendRequestSent": [],
        "skin": {
            "obstacle": {
                "isSensitive": true,
                "hasAcne": false
            },
            "type": "Da nhạy cảm"
        },
        "point": 0,
        "level": 1,
        "isBrand": false
    },
    // User 4
    {
        "_id": "63bbff18fc13ae6493001004",
        "name": "Trần Văn Nam",
        "password": "Nam123",
        "phoneNumber": "0912345678",
        "avatar": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688639442/datn/images/account/avt4_sjyksb.png",
            "publicId": null
        },
        "coverImage": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688640837/datn/images/account/cute-banana-vector-illustration_663547-51_ml2kat.avif",
            "publicId": null
        },
        "gender": "Nam",
        "isBlocked": false,
        "active": true,
        "description": "Xin chào! Tôi là Trần Văn Nam. Tôi yêu thích thể thao và thường tập luyện thể dục hàng ngày. Tôi cũng là một người yêu thích đọc sách và học hỏi. Tôi thích đi du lịch và khám phá những địa điểm mới. Rất vui được kết bạn và chia sẻ niềm vui và sở thích của mình với mọi người!",
        "city": "Đà Nẵng",
        "country": "Việt Nam",
        "blockedAccounts": [],
        "friends": [
            {
                friend: "63bbff18fc13ae6493001001"
            }
        ],
        "friendRequestReceived": [],
        "friendRequestSent": [],
        "skin": {
            "obstacle": {
                "isSensitive": false,
                "hasAcne": true
            },
            "type": "Da mụn"
        },
        "point": 0,
        "level": 1,
        "isBrand": false
    },
    // User 5
    {
        "_id": "63bbff18fc13ae6493001005",
        "name": "Nguyễn Thanh Hằng",
        "password": "User456",
        "phoneNumber": "0976543210",
        "avatar": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688639442/datn/images/account/avt5_omikmv.png",
            "publicId": null
        },
        "coverImage": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688640837/datn/images/account/cute-cat-listening-music-with-headphones_663547-42_a5tl2j.avif",
            "publicId": null
        },
        "gender": "Nữ",
        "isBlocked": false,
        "active": true,
        "description": "Xin chào! Tôi là Nguyễn Thanh Hằng, một người yêu thiên nhiên và thích khám phá những địa điểm mới. Tôi thích nghệ thuật và thường xuyên tham gia các hoạt động sáng tạo như vẽ tranh và chụp ảnh. Tôi cũng là một tín đồ của âm nhạc và thích nghe các thể loại nhạc đa dạng. Ngoài ra, tôi còn có đam mê viết blog về cuộc sống và du lịch. Hãy kết bạn với tôi để chúng ta có thể chia sẻ những điều thú vị và có những trò chuyện bổ ích!",
        "city": "Hồ Chí Minh",
        "country": "Việt Nam",
        "blockedAccounts": [],
        "friends": [
            {
                friend: "63bbff18fc13ae6493001001"
            }
        ],
        "friendRequestReceived": [],
        "friendRequestSent": [],
        "skin": {
            "obstacle": {
                "isSensitive": true,
                "hasAcne": false
            },
            "type": "Da nhạy cảm"
        },
        "point": 0,
        "level": 1,
        "isBrand": false
    },
    // User 6
    {
        "_id": "63bbff18fc13ae6493001006",
        "name": "Trần Văn Long",
        "password": "Long789",
        "phoneNumber": "0909876543",
        "avatar": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688639442/datn/images/account/avt6_oeytou.png",
            "publicId": null
        },
        "coverImage": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688640837/datn/images/account/cute-crocodile-floating-with-pineapple-pool-floatie-animal-summer-icon-concept-isolated_663547-128_pqfjyj.avif",
            "publicId": null
        },
        "gender": "Nam",
        "isBlocked": false,
        "active": true,
        "description": "Xin chào! Tôi là Trần Văn Long. Tôi là một người yêu thích sách và thích khám phá kiến thức mới. Tôi thích đọc sách về khoa học và công nghệ, và thường thảo luận với bạn bè về những khám phá mới nhất trong lĩnh vực này. Ngoài ra, tôi cũng yêu thích âm nhạc và chơi nhạc cụ, đặc biệt là guitar. Rất mong được kết bạn và chia sẻ sở thích của mình với mọi người!",
        "city": "Hà Nội",
        "country": "Việt Nam",
        "blockedAccounts": [],
        "friends": [],
        "friendRequestReceived": [],
        "friendRequestSent": [
            {
                toUser: "63bbff18fc13ae6493001001",
            }
        ],
        "skin": {
            "obstacle": {
                "isSensitive": false,
                "hasAcne": false
            },
            "type": "Da thường"
        },
        "point": 0,
        "level": 1,
        "isBrand": false
    },
    // User 7
    {
        "_id": "63bbff18fc13ae6493001007",
        "name": "Nguyễn Thị Hà",
        "password": "Ha456",
        "phoneNumber": "0943216789",
        "avatar": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688639442/datn/images/account/avt7_aatq6n.png",
            "publicId": null
        },
        "coverImage": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688640836/datn/images/account/cute-dog-floating-with-watermelon-pool-floatie-animal-summer-icon-concept-isolated_663547-129_emmcmf.avif",
            "publicId": null
        },
        "gender": "Nữ",
        "isBlocked": false,
        "active": true,
        "description": "Xin chào! Tôi là Nguyễn Thị Hà. Tôi là một người yêu thích sách và thích thảo luận về văn hóa và nghệ thuật. Tôi cũng thích viết blog và chia sẻ quan điểm của mình với mọi người. Ngoài ra, tôi yêu thích âm nhạc và thích nghe các bài hát trẻ trung và lãng mạn. Rất mong được kết bạn và có cơ hội chia sẻ niềm vui và sở thích của tôi với mọi người!",
        "city": "Hồ Chí Minh",
        "country": "Việt Nam",
        "blockedAccounts": [],
        "friends": [],
        "friendRequestReceived": [
            {
                fromUser: "63bbff18fc13ae6493001001"
            }
        ],
        "friendRequestSent": [],
        "skin": {
            "obstacle": {
                "isSensitive": false,
                "hasAcne": false
            },
            "type": "Da thường"
        },
        "point": 0,
        "level": 1,
        "isBrand": false
    },
    // User 8
    {
        "_id": "63bbff18fc13ae6493001008",
        "name": "Nguyễn Văn Hải",
        "password": "Hai789",
        "phoneNumber": "0965432109",
        "avatar": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688639442/datn/images/account/avt8_xffqn3.png",
            "publicId": null
        },
        "coverImage": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688640836/datn/images/account/cute-floating-swimming-pizza-summer-icon-concept-isolated_663547-132_y8o0r3.avif",
            "publicId": null
        },
        "gender": "Nam",
        "isBlocked": false,
        "active": true,
        "description": "Xin chào! Tôi là Nguyễn Văn Hải. Tôi là một người yêu thích âm nhạc và thường chơi guitar trong thời gian rảnh rỗi. Tôi cũng thích viết lời nhạc và sáng tác các bài hát riêng. Ngoài ra, tôi còn là một người yêu thích đi du lịch và khám phá những vùng đất mới. Rất mong được kết bạn và chia sẻ niềm vui và sở thích của mình với mọi người!",
        "city": "Hà Nội",
        "country": "Việt Nam",
        "blockedAccounts": [],
        "friends": [],
        "friendRequestReceived": [],
        "friendRequestSent": [],
        "skin": {
            "obstacle": {
                "isSensitive": false,
                "hasAcne": false
            },
            "type": "Da thường"
        },
        "point": 0,
        "level": 1,
        "isBrand": false
    },
    // User 9
    {
        "_id": "63bbff18fc13ae6493001009",
        "name": "Nguyễn Văn Long",
        "password": "Long123",
        "phoneNumber": "0923456789",
        "avatar": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688639442/datn/images/account/avt9_uynj4j.png",
            "publicId": null
        },
        "coverImage": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688640836/datn/images/account/cute-penguin-floating-with-pineapple-pool-floatie-animal-summer-icon-concept-isolated_663547-135_bytkht.avif",
            "publicId": null
        },
        "gender": "Nam",
        "isBlocked": false,
        "active": true,
        "description": "Xin chào! Tôi là Nguyễn Văn Long. Tôi là một người yêu thích âm nhạc và chơi nhạc cụ. Tôi thường chơi guitar và thích hát các bài hát trẻ trung và lãng mạn. Ngoài ra, tôi cũng đam mê viết và thích sáng tác những giai điệu và lời bài hát của riêng mình. Rất mong được kết bạn với những người có cùng đam mê âm nhạc và có cơ hội trao đổi và chia sẻ những tác phẩm âm nhạc của tôi!",
        "city": "Hà Nội",
        "country": "Việt Nam",
        "blockedAccounts": [],
        "friends": [],
        "friendRequestReceived": [],
        "friendRequestSent": [],
        "skin": {
            "obstacle": {
                "isSensitive": false,
                "hasAcne": false
            },
            "type": "Da thường"
        },
        "point": 0,
        "level": 1,
        "isBrand": false
    },
    // User 10
    {
        "_id": "63bbff18fc13ae6493001010",
        "name": "Trần Thị Linh",
        "password": "Linh789",
        "phoneNumber": "0998765432",
        "avatar": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688639443/datn/images/account/avt10_uybing.png",
            "publicId": null
        },
        "coverImage": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688640836/datn/images/account/cute-platypus-floating-with-swimming-pizza-animal-summer-icon-concept-isolated_663547-136_hsmpb6.avif",
            "publicId": null
        },
        "gender": "Nữ",
        "isBlocked": false,
        "active": true,
        "description": "Xin chào! Tôi là Trần Thị Linh. Tôi là một người yêu thích sách và thích thảo luận về văn hóa và nghệ thuật. Tôi thích viết blog và chia sẻ quan điểm của mình với mọi người. Ngoài ra, tôi yêu thích âm nhạc và thích nghe các bài hát trẻ trung và lãng mạn. Rất mong được kết bạn và có cơ hội chia sẻ niềm vui và sở thích của tôi với mọi người!",
        "city": "Hà Nội",
        "country": "Việt Nam",
        "blockedAccounts": [],
        "friends": [],
        "friendRequestReceived": [],
        "friendRequestSent": [],
        "skin": {
            "obstacle": {
                "isSensitive": false,
                "hasAcne": false
            },
            "type": "Da thường"
        },
        "point": 0,
        "level": 1,
        "isBrand": false
    },
    // User 11
    {
        "_id": "63bbff18fc13ae6493001011",
        "name": "Nguyễn Thị Lan Anh",
        "password": "LanAnh123",
        "phoneNumber": "0954321098",
        "avatar": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688639443/datn/images/account/avt11_waewby.png",
            "publicId": null
        },
        "coverImage": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688640836/datn/images/account/cute-bear-floating-with-watermelon-pool-floatie-animal-summer-icon-concept-isolated_663547-122_gxzzs5.avif",
            "publicId": null
        },
        "gender": "Nữ",
        "isBlocked": false,
        "active": true,
        "description": "Xin chào! Tôi là Nguyễn Thị Lan Anh. Tôi là một người yêu thích nghệ thuật và thường tham gia các hoạt động sáng tạo như vẽ tranh và chụp ảnh. Tôi cũng đam mê viết và thường viết về cuộc sống và những trải nghiệm của mình. Ngoài ra, tôi yêu thích âm nhạc và thích nghe các thể loại nhạc đa dạng. Rất mong được kết bạn và chia sẻ niềm vui và sở thích của mình với mọi người!",
        "city": "Đà Nẵng",
        "country": "Việt Nam",
        "blockedAccounts": [],
        "friends": [],
        "friendRequestReceived": [],
        "friendRequestSent": [],
        "skin": {
            "obstacle": {
                "isSensitive": false,
                "hasAcne": false
            },
            "type": "Da thường"
        },
        "point": 0,
        "level": 1,
        "isBrand": false
    },
    // User 12
    {
        "_id": "63bbff18fc13ae6493001012",
        "name": "Trần Văn Quang",
        "password": "Quang123",
        "phoneNumber": "0932109876",
        "avatar": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688639443/datn/images/account/avt12_rsjkuh.png",
            "publicId": null
        },
        "coverImage": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688640836/datn/images/account/cute-cat-floating-with-pizza-pool-floatie-animal-summer-icon-concept-isolated_663547-126_vgofrr.avif",
            "publicId": null
        },
        "gender": "Nam",
        "isBlocked": false,
        "active": true,
        "description": "Xin chào! Tôi là Trần Văn Quang. Tôi yêu thích nghệ thuật và thường xuyên tham gia các hoạt động vẽ tranh và sáng tác. Tôi cũng là một người đam mê âm nhạc và thích nghe các thể loại nhạc đa dạng. Ngoài ra, tôi cũng thích đọc sách và thích khám phá những điều mới mẻ. Rất vui được kết bạn và chia sẻ niềm vui và sở thích của tôi với mọi người!",
        "city": "Hà Nội",
        "country": "Việt Nam",
        "blockedAccounts": [],
        "friends": [],
        "friendRequestReceived": [],
        "friendRequestSent": [],
        "skin": {
            "obstacle": {
                "isSensitive": false,
                "hasAcne": false
            },
            "type": "Da thường"
        },
        "point": 0,
        "level": 1,
        "isBrand": false
    },
    // User 13
    {
        "_id": "63bbff18fc13ae6493001013",
        "name": "Trần Thị Mỹ Linh",
        "password": "Linh123",
        "phoneNumber": "0901567823",
        "avatar": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688639443/datn/images/account/avt13_jdzgqk.png",
            "publicId": null
        },
        "coverImage": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688640836/datn/images/account/cute-floating-swimming-watermelon-summer-icon-concept-isolated_663547-133_rc9i6n.avif",
            "publicId": null
        },
        "gender": "Nữ",
        "isBlocked": false,
        "active": true,
        "description": "Xin chào! Tôi là Trần Thị Mỹ Linh. Tôi đam mê nghệ thuật và thích thể hiện sự sáng tạo qua việc vẽ tranh và chụp ảnh. Tôi cũng yêu thích âm nhạc và thường tìm hiểu về các thể loại nhạc khác nhau. Ngoài ra, tôi cũng thích du lịch và khám phá những địa điểm mới. Rất vui được kết bạn và chia sẻ niềm vui và sở thích của tôi với mọi người!",
        "city": "Đà Nẵng",
        "country": "Việt Nam",
        "blockedAccounts": [],
        "friends": [],
        "friendRequestReceived": [],
        "friendRequestSent": [],
        "skin": {
            "obstacle": {
                "isSensitive": false,
                "hasAcne": false
            },
            "type": "Da thường"
        },
        "point": 0,
        "level": 1,
        "isBrand": false
    },
    // User 14
    {
        "_id": "63bbff18fc13ae6493001014",
        "name": "Trần Thị Ngọc",
        "password": "Ngoc123",
        "phoneNumber": "0956398742",
        "avatar": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688639443/datn/images/account/avt14_ojowop.png",
            "publicId": null
        },
        "coverImage": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688640835/datn/images/account/cute-panda-driving-racing-car-cartoon-vector-icon-illustration_663547-57_vl8wy1.avif",
            "publicId": null
        },
        "gender": "Nữ",
        "isBlocked": false,
        "active": true,
        "description": "Xin chào! Tôi là Trần Thị Ngọc. Tôi là một người yêu thích âm nhạc và thích hát và chơi nhạc cụ. Tôi thích nghệ thuật và thường tham gia các hoạt động vẽ tranh và sáng tác. Tôi cũng là một người yêu thiên nhiên và thích đi du lịch và khám phá những địa điểm mới. Rất mong được kết bạn và chia sẻ niềm vui và sở thích của tôi với mọi người!",
        "city": "Đà Nẵng",
        "country": "Việt Nam",
        "blockedAccounts": [
            {
                account: "63bbff18fc13ae6493001001",
            }
        ],
        "friends": [],
        "friendRequestReceived": [],
        "friendRequestSent": [],
        "skin": {
            "obstacle": {
                "isSensitive": false,
                "hasAcne": false
            },
            "type": "Da thường"
        },
        "point": 0,
        "level": 1,
        "isBrand": false
    },
    // User 15
    {
        "_id": "63bbff18fc13ae6493001015",
        "name": "Nguyễn Thị Thuỳ",
        "password": "Thuỳ123",
        "phoneNumber": "0923784561",
        "avatar": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688639443/datn/images/account/avt15_ehbhri.png",
            "publicId": null
        },
        "coverImage": {
            "filename": null,
            "url": "https://res.cloudinary.com/dnway4ykc/image/upload/v1688640835/datn/images/account/cute-turtle-floating-with-watermelon-pool-floatie-animal-summer-icon-concept-isolated_663547-138_iwkrem.avif",
            "publicId": null
        },
        "gender": "Nữ",
        "isBlocked": false,
        "active": true,
        "description": "Xin chào! Tôi là Nguyễn Thị Thuỳ. Tôi đam mê nghệ thuật và thích vẽ tranh và chụp ảnh. Tôi cũng là một người yêu thích du lịch và khám phá các điểm đến mới. Ngoài ra, tôi thích đọc sách và viết blog về cuộc sống và những trải nghiệm của mình. Rất mong được kết bạn và chia sẻ niềm vui và sở thích của mình với mọi người!",
        "city": "Hồ Chí Minh",
        "country": "Việt Nam",
        "blockedAccounts": [],
        "friends": [],
        "friendRequestReceived": [],
        "friendRequestSent": [],
        "skin": {
            "obstacle": {
                "isSensitive": false,
                "hasAcne": false
            },
            "type": "Da thường"
        },
        "point": 0,
        "level": 1,
        "isBrand": false
    }
];

module.exports = realAccounts;
