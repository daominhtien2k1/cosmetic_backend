// đuôi 001 ở cuối chỉ thứ tự bài viết, 3 số liền trước chỉ id người dùng
// chú ý upload lại đúng assets publicId -> hạn chế xóa bài
const realPosts = [
    {
        "_id": "64a8ca91abecf92e44001001",
        "account_id": "63bbff18fc13ae6493001001",
        "described" : "Em cần tìm sản phẩm chăm sóc da cho tình trạng da khô, mụn, ráo mặt của em, sản phẩm cần không bóng dính, không xuống tone, em làm việc trong môi trường không tiếp xúc với nắng ạ. Em xin cảm ơn.",
        "images": [
            {
                filename: "",
                url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1688783083/datn/images/post/12276416_4940828_laynf0.jpg",
                publicId: "datn/images/post/12276416_4940828_laynf0"
            }
        ],
        "likedAccounts": [],
        "commentList": [],
        "likes": 0,
        "comments": 0,
        "status": "Tuyệt vời",
        "canComment": true,
        "banned": false,
        "classification": "General"
    },
    {
        "_id": "64a8ca91abecf92e44001002",
        "account_id": "63bbff18fc13ae6493001001",
        "described" : "Cả nhà ơi, em cần tư vấn về những sản phẩm mỹ phẩm chất lượng trung bình và có giá từ 250.000 VNĐ đến 450.000 VNĐ. Có ai đã từng sử dụng những sản phẩm trong tầm giá này không? Em muốn tìm những sản phẩm đáng giá và có hiệu quả tốt, phù hợp với túi tiền. Xin mọi người chia sẻ thông tin và gợi ý!",
        "images": [],
        "likedAccounts": [],
        "commentList": [],
        "likes": 0,
        "comments": 0,
        "status": "Tuyệt vời",
        "canComment": true,
        "banned": false,
        "classification": "General"
    },
    {
        "_id": "64a8ca91abecf92e44001003",
        "account_id": "63bbff18fc13ae6493001001",
        "described" : "Xin chào cả nhà! Em đang tìm kiếm mỹ phẩm với chất lượng trung bình và giá từ 400.000 VNĐ đến 800.000 VNĐ. Có ai đã sử dụng các sản phẩm mỹ phẩm trong tầm giá này không? Em muốn tìm những sản phẩm đáng giá và có hiệu quả tốt, phù hợp với túi tiền. Mong mọi người chia sẻ kinh nghiệm và gợi ý!",
        "images": [],
        "likedAccounts": [],
        "commentList": [],
        "likes": 0,
        "comments": 0,
        "status": "Tuyệt vời",
        "canComment": true,
        "banned": false,
        "classification": "Question"
    },
    {
        "_id": "64a8ca91abecf92e44001004",
        "account_id": "63bbff18fc13ae6493001001",
        "described" : "Em đang tìm một sản phẩm chăm sóc da dành cho da khô và nhạy cảm. Em muốn tìm một sản phẩm dưỡng ẩm sâu, làm dịu và giúp phục hồi hàng rào bảo vệ tự nhiên của da. Em cần một sản phẩm không gây kích ứng và phù hợp với da nhạy cảm của em. Nếu ai đã từng sử dụng một sản phẩm phù hợp, em rất mong nhận được sự chia sẻ và tư vấn. Cảm ơn mọi người!",
        "images": [],
        "likedAccounts": [],
        "commentList": [],
        "likes": 0,
        "comments": 0,
        "status": "Tuyệt vời",
        "canComment": true,
        "banned": false,
        "classification": "Question"
    },
    {
        "_id": "64a8ca91abecf92e44001005",
        "account_id": "63bbff18fc13ae6493001001",
        "described" : "Em đang gặp vấn đề với da nhờn và mụn ẩn. Em đang tìm kiếm một sản phẩm chăm sóc da giảm tiết dầu và giúp làm dịu mụn ẩn. Em muốn tìm một sản phẩm không gây khô da nhưng vẫn có khả năng kiểm soát dầu và giảm viêm. Nếu ai đã từng sử dụng một sản phẩm hiệu quả cho vấn đề này, em rất mong được chia sẻ kinh nghiệm. Cảm ơn mọi người!",
        "images": [],
        "likedAccounts": [],
        "commentList": [],
        "likes": 0,
        "comments": 0,
        "status": "Tuyệt vời",
        "canComment": true,
        "banned": false,
        "classification": "General"
    },
    {
        "_id": "64a8ca91abecf92e44001006",
        "account_id": "63bbff18fc13ae6493001001",
        "described" : "Chào mọi người! Da mình bị mụn ẩn và mụn bọc, không chỉ trên mặt mà còn ở vùng lưng và ngực. Mình muốn tìm một sản phẩm mỹ phẩm có thể giúp giảm mụn và kiểm soát dầu nhờn. Bạn nào đã từng trải qua tình trạng tương tự và sử dụng sản phẩm hiệu quả, có thể tư vấn cho mình được không? Xin cảm ơn sự giúp đỡ của mọi người!",
        "images": [],
        "likedAccounts": [],
        "commentList": [],
        "likes": 0,
        "comments": 0,
        "status": "Tuyệt vời",
        "canComment": true,
        "banned": false,
        "classification": "Question"
    },
    {
        "_id": "64a8ca91abecf92e44001007",
        "account_id": "63bbff18fc13ae6493001001",
        "described" : "Tình hình là mình đang gặp vấn đề về mụn trên khuôn mặt. Có ai có kinh nghiệm với các sản phẩm mỹ phẩm dành cho da mụn không? Mong nhận được sự chia sẻ và tư vấn từ các bạn!",
        "images": [],
        "likedAccounts": [],
        "commentList": [],
        "likes": 0,
        "comments": 0,
        "status": "Tuyệt vời",
        "canComment": true,
        "banned": false,
        "classification": "Question"
    },
    {
        "_id": "64a8ca91abecf92e44001008",
        "account_id": "63bbff18fc13ae6493001001",
        "described" : "Chào bạn! Nếu bạn muốn tìm mỹ phẩm giúp làm mờ vết thâm hay nám, hãy tìm kiếm các sản phẩm chứa các thành phần như axit hyaluronic, vitamin C, và glycolic acid. Các thành phần này có thể giúp làm sáng da và làm mờ các vết thâm. Ngoài ra, hãy cân nhắc đến việc sử dụng kem chống nắng hàng ngày để bảo vệ da khỏi tác động của tia UV.",
        "images": [
            {
                filename: "",
                url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1688783081/datn/images/post/12395476_4973770_gtnhki.jpg",
                publicId: "datn/images/post/12395476_4973770_gtnhki"
            },
            {
                filename: "",
                url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1688783081/datn/images/post/12304152_4927793_n0l66a.jpg",
                publicId: "datn/images/post/12304152_4927793_n0l66a"
            }
        ],
        "likedAccounts": [],
        "commentList": [],
        "likes": 0,
        "comments": 0,
        "status": "Tuyệt vời",
        "canComment": true,
        "banned": false,
        "classification": "Share experience"
    },
    {
        "_id": "64a8ca91abecf92e44001009",
        "account_id": "63bbff18fc13ae6493001001",
        "described" : "Chào các bạn! Nếu bạn đang tìm kiếm mỹ phẩm cho làn da nhạy cảm, hãy tìm kiếm các sản phẩm không chứa hương liệu, không chứa chất tạo màu và không gây kích ứng. Một số thành phần tự nhiên như lô hội, camomile, và lúa mạch có thể làm dịu da và giảm tình trạng nhạy cảm. Hãy chia sẻ thêm thông tin về da nhạy cảm của bạn để tôi có thể cung cấp những gợi ý cụ thể hơn!",
        "images": [],
        "likedAccounts": [],
        "commentList": [],
        "likes": 0,
        "comments": 0,
        "status": "Tuyệt vời",
        "canComment": true,
        "banned": false,
        "classification": "Share experience"
    },
    {
        "_id": "64a8ca91abecf92e44001010",
        "account_id": "63bbff18fc13ae6493001001",
        "described" : "Dưới đây là 5 nguyên tắc cơ bản để trị hết mụn cho nam giới:\n" +
            "\n" +
            "Dọn sạch da hàng ngày: Một trong những nguyên tắc quan trọng nhất để trị mụn là dọn sạch da hàng ngày. Rửa mặt hai lần mỗi ngày bằng một sản phẩm làm sạch phù hợp, không gây kích ứng da. Hạn chế sử dụng xà phòng có chứa hóa chất cứng, vì nó có thể làm khô da và gây mất cân bằng. Luôn sử dụng nước ấm để rửa mặt và nhẹ nhàng massage da để làm sạch hiệu quả.\n" +
            "\n" +
            "Sử dụng sản phẩm chăm sóc da phù hợp: Lựa chọn các sản phẩm chăm sóc da dành riêng cho nam giới hoặc dành cho da mụn. Sản phẩm này thường chứa các thành phần giúp kiểm soát dầu nhờn, giảm vi khuẩn và làm dịu da. Hãy đảm bảo chọn các sản phẩm không gây tắc nghẽn lỗ chân lông và không chứa hóa chất gây kích ứng.\n" +
            "\n" +
            "Đều đặn sử dụng kem chống nắng: Một trong những nguyên tắc quan trọng trong việc trị mụn là sử dụng kem chống nắng hàng ngày. Ánh nắng mặt trời có thể làm kích thích tuyến dầu và gây tắc nghẽn lỗ chân lông, dẫn đến tình trạng mụn trở nên nghiêm trọng hơn. Chọn kem chống nắng không gây nhờn và có chỉ số chống nắng SPF 30 trở lên.\n" +
            "\n" +
            "Tránh cảm nhận da: Không nên chạm tay vào mặt nhiều lần trong ngày hoặc cố tình vò nặn mụn. Việc cảm nhận da có thể truyền vi khuẩn và gây nhiễm trùng, dẫn đến tình trạng mụn nặng hơn. Hạn chế tiếp xúc tay với mặt và sử dụng khăn sạch khi lau mặt.\n" +
            "\n" +
            "Đều đặn làm sạch gối và bộ cọ trang điểm: Gối và bộ cọ trang điểm có thể tích tụ vi khuẩn và dầu, gây kích ứng và tăng nguy cơ gây mụn. Hãy giặt gối thường xuyên và thay bộ cọ trang điểm đều đặn để tránh vi khuẩn tích tụ và lây lan trên da.\n" +
            "\n" +
            "Lưu ý rằng mỗi người có da và tình trạng da khác nhau, nên nếu tình trạng mụn nghiêm trọng hoặc không có sự cải thiện sau khi thực hiện những nguyên tắc cơ bản này, hãy tìm kiếm sự tư vấn từ bác sĩ da liễu để có phương pháp điều trị phù hợp.",
        "video": {
            filename: "",
            url: "https://www.youtube.com/watch?v=9Pd_HqshG_Q",
            publicId: "",
        },
        "likedAccounts": [],
        "commentList": [],
        "likes": 0,
        "comments": 0,
        "status": "Tuyệt vời",
        "canComment": true,
        "banned": false,
        "classification": "Share experience"
    },
    {
        "_id": "64a8ca91abecf92e44001011",
        "account_id": "63bbff18fc13ae6493001001",
        "described" : "Nói về em kem lót trang điểm Hàn Quốc giá rẻ này thì ai cũng biết rồi. Nó được cho là có tác dụng tạo nước trên da trước khi điều chỉnh tông màu da, có thể trộn với phấn nền hoặc sử dụng riêng lẻ. Nhưng khi dùng thử, tôi cảm thấy loại này phóng đại và rẻ tiền, có ánh nhũ hơi xanh, rất không tự nhiên khi dùng trên khuôn mặt người châu Á da vàng, khi dùng riêng sẽ rất bóng khiến mặt trông to hơn. Tròn tròn! Nhưng tôi không thể nhìn thấy ánh sáng lung linh với kem nền, vì vậy tôi phải cho nó 1 sao. Mẹ kiếp, hàng này rẻ quá, chất lượng tệ quá, vứt đi, phí tiền mua.",
        "likedAccounts": [],
        "commentList": [],
        "likes": 0,
        "comments": 0,
        "status": "Tức giận",
        "canComment": true,
        "banned": true,
        "classification": "Share experience"
    }
]

module.exports = realPosts;