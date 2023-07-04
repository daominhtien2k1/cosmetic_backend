const brands = [
    {
        _id: "64639687ffa8cd1a203b408f",
        slug: "april_skin",
        name: "April skin",
        origin: "Hàn Quốc",
        description: "April skin là một thương hiệu mỹ phẩm nổi tiếng hàng đầu tại Hàn Quốc, từng nhận được rất nhiều giải thưởng uy tín cho việc phát triển những dòng sản phẩm từ thiên nhiên thân thiện với sức khỏe và mang đến những công dụng hữu hiệu nhất trong việc làm đẹp đối với phái nữ.",
        image: {
            filename: "",
            url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1684243097/datn/images/april_skin_brand_vfhfhv.png",
            publicId: ""
        },
        products: 83,
        followedAccounts: [],
        followers: 0,
        rating: 4.2
    },
    {
        _id: "64639687ffa8cd1a203b4090",
        slug: "ange",
        name: "Ange",
        origin: "Hàn Quốc",
        description: "ANGE là một thương hiệu nổi tiếng tại Hàn Quốc của công ty TNHH Takos - một nhà sản xuất chuyên về các sản phẩm an toàn cho bé như cắn răng, ngậm nướu, bình tập ăn...có trụ sở chính tại Busan, Hàn Quốc và được thành lập năm 1992\n" +
            "Takos tập trung vào nghiên cứu và phát triển sản phẩm cho bé với thiết kế sáng tạo, độc đáo và an toàn. Thương hiệu này phân phối rộng khắp các siêu thị Hàn Quốc như E-mart, Lotte mart cũng như được Takos xuất khẩu sang các thị trường lớn như Nhật Bản, Bắc Mỹ và Châu Âu",
        image: {
            filename: "",
            url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1684243097/datn/images/angei_brand_w8zbni.png",
            publicId: ""
        },
        products: 26,
        followedAccounts: [],
        followers: 0,
        rating: 4.6
    },
    {
        _id: "64639687ffa8cd1a203b4091",
        slug: "banobagi",
        name: "Banobagi",
        origin: "Hàn Quốc",
        description: "Thương hiệu mỹ phẩm đến từ bệnh viện thẩm mỹ Banobagi. Thành phần trong các sản phẩm đều được phân tích một cách kĩ lưỡng bởi các chuyên gia tư vấn làm đẹp với tiêu chí: không thành phần hóa học, không hóa chất kích ứng da",
        image: {
            filename: "",
            url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1684243097/datn/images/banobagi_brand_oii8f5.png",
            publicId: ""
        },
        products: 72,
        followedAccounts: [],
        followers: 0,
        rating: 4.2
    },
    {
        _id: "64639687ffa8cd1a203b4092",
        slug: "bnbg",
        name: "BNBG",
        origin: "Hàn Quốc",
        description: "BNBG là một thương hiệu mặt nạ nổi tiếng ở Hàn Quốc, tiền thân là thương hiệu mặt nạ mang tên Banobagi.",
        image: {
            filename: "",
            url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1684245914/datn/images/bnbg_zfbaij.png",
            publicId: ""
        },
        products: 82,
        followedAccounts: ["63bbff18fc13ae649300082a"],
        followers: 1,
        rating: 4.2
    },
    {
        _id: "64639687ffa8cd1a203b4093",
        slug: "chacott",
        name: "Chacott",
        origin: "Hàn Quốc",
        description: "Chacott là 1 thương hiệu ba lê nổi tiếng tại Nhật Bản, và cùng với sự phát triển của thương hiệu, chacott phát triển dòng mỹ phẩm chuyên nghiệp dành cho các diễn viên múa Ba lê chuyên nghiệp",
        image: {
            filename: "",
            url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1684243097/datn/images/chatcott_brand_izmapb.png",
            publicId: ""
        },
        products: 42,
        followedAccounts: [],
        followers: 0,
        rating: 4.7
    },

];

// reviewty
const categories = [
    {
        _id: "6463983574f12a46a0ce5228",
        slug: "mask",
        name: "Mặt nạ",
        // parentCategory: "Chăm sóc da",
        description: "Mặt nạ"
    },
    {
        _id: "6463983574f12a46a0ce5229",
        slug: "face_cream",
        name: "Kem dưỡng da mặt",
        // parentCategory: "Chăm sóc da",
        description: "Kem dưỡng da mặt"
    },
    {
        _id: "6463983574f12a46a0ce522a",
        slug: "toner",
        name: "Toner",
        // parentCategory: "Chăm sóc da",
        description: "Nước cân bằng da"
    },
    {
        _id: "6463983574f12a46a0ce522b",
        slug: "skin_whitening_care",
        name: "Chăm sóc trắng da",
        // parentCategory: "Mỹ phẩm chức năng",
        description: "Chăm sóc trắng da"
    },
    {
        _id: "6463983574f12a46a0ce522c",
        slug: "shampoo",
        name: "Dầu gội",
        // parentCategory: "Chăm sóc tóc",
        description: "Dầu gội"
    },
];

const products = [
    {
        _id: "646398c7bc8ef0469c38d7ba",
        slug: "bnbg_vita_genic_lifting_jelly_mask",
        name: "Mặt Nạ BNBG Vitamin A Vita Genic Lifting Jelly Mask Cấp Nước, Dưỡng Ẩm Da",
        origin: "Hàn Quốc",
        guarantee: 1,
        expiredYear: 1,
        description: "BNBG Vita Genic Lifting Mask được thiết kế rất bắt mắt và dễ thương. Nhiều bạn còn lầm tưởng mặt nạ này có dạng bột hay hình viên thuốc nữa, nhưng thật ra không phải nhé! Mặt nạ có dạng miếng giấy cotton và kèm theo các loại vitamins và khoáng chất thiết yếu cho làn da với hàm lượng cao lên đến 20000ppm được chiết xuất hoàn toàn từ thiên nhiên. Ngoài ra, mặt nạ còn chứa các tinh chất từ cây, quả thiên nhiên như tinh chất trái cam, lô hội, việt quất... giúp hỗ trợ trong việc tăng sức đề kháng và hỗ trợ trẻ hóa làn da.\n" +
            "\n" +
            "Bên cạnh đó, BNBG còn chứa một lượng lớn vi khoáng – được tách chế từ nước biển vừa giúp tăng sức đề kháng, vừa bổ sung khoáng chất đặc biệt khiến da luôn căng mịn. BNBG Vita Genic Jelly Mask gồm 4 loại: 1. Vita Genic Lifting Jelly Mask (Màu đỏ)\n" +
            "Bổ sung Vitamin A hàm lượng 20.000ppm được chiết xuất cây xương rồng tại đảo Jeju Hàn Quốc, giúp nâng cơ, ngăn ngừa chảy xệ, làm da sáng hồng tự nhiên từ bên trong. Ngoài ra, sản phẩm còn bổ sung hàm lượng ẩm, cho làn da luôn căng mịn và không bị khô ráp do thiếu nước và khoáng chất. Sản phẩm cực phù hợp với các bạn gái từ 25 tuổi bởi ngoài việc dưỡng sáng và dưỡng ẩm, mặt nạ Vita Genic Lifting Jelly Mask còn giúp hỗ trợ nâng cơ và săn chắc da. Góp phần giúp da luôn trong trạng thái đàn hồi, ngăn ngừa nguy cơ lão hóa và chảy xệ.\n" +
            "\n" +
            "2. Vita Genic Relaxing Mask (Màu xanh lá)\n" +
            "Đúng như tên gọi, loại mặt nạ này có công dụng thư giãn và làm giảm stress cho cơ thể. Bổ sung Vitamin A hàm lượng 20.000ppm được chiết xuất cây lô hội tại đảo Jeju Hàn Quốc, có tác dụng thư giãn, hỗ trợ phục hồi làn da mệt mỏi. Đồng thời còn có công dụng hỗ trợ trong việc trẻ hóa da, giúp da luôn trong trạng thái khỏe mạnh và căng tràn sức sống. 3. Vita GenicHydrating Mask (Màu xanh dương): \n" +
            "Đây là loại mặt nạ dành riêng cho các cô nàng da khô hoặc thường xuyên phải tiếp xúc với điều hòa gây nên tình trạng da mất nước, bong tróc. Bổ sung Vitamin E hàm lượng 20.000ppm được chiết xuất từ nguồn nước khoáng tại đảo Jeju Hàn Quốc, có tác dụng cấp ẩm cho làn da thiếu nước, da căng mọng trở nên rạng rỡ hơn và ngừa lão hóa.\n" +
            "\n",
        category_id: "6463983574f12a46a0ce5228",
        brand_id: "64639687ffa8cd1a203b4092",
        images: [
            {
                filename: "",
                url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1687360388/datn/images/vitamin_A_main_k9o8bo.jpg",
                publicId: "",
            },
            {
                filename: "",
                url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1687360389/datn/images/vitamin_A_mwt4wd.jpg",
                publicId: "",
            },
            {
                filename: "",
                url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1687360390/datn/images/vitamin_A_1_ldv6bn.jpg",
                publicId: "",
            },
            {
                filename: "",
                url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1687360388/datn/images/vitamin_A_2_lnjmex.jpg",
                publicId: "",
            },
        ],
        lowPrice: 18000,
        highPrice: 20000,
        available: true,
        type: "Bình thường",
        lovedAccounts: ["63bbff18fc13ae649300082a"],
        viewedAccounts: ["63bbff18fc13ae649300082a"],
        loves: 1,
        reviews: 6,
        rating: 3.8,
        recentReviewList: [],
        highestStarReviewList: [],
        gender: ["Nam", "Nữ"],
        skin: ["Da sạm, xỉn, không đều màu", "Da thường/ Mọi loại da"],
        tag: [],
        relateProductList: []
    },
    {
        _id: "646398c7bc8ef0469c38d7bb",
        slug: "bnbg_vita_genic_relaxing_jelly_mask",
        name: "Mặt Nạ BNBG Vitamin B Vita Genic Relaxing Jelly Mask Hỗ Trợ Phục Hồi Da Hư Tổn 30ml",
        origin: "Hàn Quốc",
        guarantee: 1,
        expiredYear: 1,
        description: "BNBG Vita Genic Jelly Mask được thiết kế rất bắt mắt và dễ thương. Nhiều bạn còn lầm tưởng mặt nạ này có dạng bột hay hình viên thuốc nữa, nhưng thật ra không phải nhé! Mặt nạ có dạng miếng giấy cotton và kèm theo các loại vitamins và khoáng chất thiết yếu cho làn da với hàm lượng cao lên đến 20000ppm được chiết xuất hoàn toàn từ thiên nhiên. Ngoài ra, mặt nạ còn chứa các tinh chất từ cây, quả thiên nhiên như tinh chất trái cam, lô hội, việt quất... giúp hỗ trợ trong việc tăng sức đề kháng và hỗ trợ trẻ hóa làn da.\n" +
            "\n" +
            "Bên cạnh đó, BNBG còn chứa một lượng lớn vi khoáng – được tách chế từ nước biển vừa giúp tăng sức đề kháng, vừa bổ sung khoáng chất đặc biệt khiến da luôn căng mịn. BNBG Vita Genic Jelly Mask gồm 4 loại: 1. Vita Genic Lifting Jelly Mask (Màu đỏ)\n" +
            "Bổ sung Vitamin A hàm lượng 20.000ppm được chiết xuất cây xương rồng tại đảo Jeju Hàn Quốc, giúp nâng cơ, ngăn ngừa chảy xệ, làm da sáng hồng tự nhiên từ bên trong. Ngoài ra, sản phẩm còn bổ sung hàm lượng ẩm, cho làn da luôn căng mịn và không bị khô ráp do thiếu nước và khoáng chất. Sản phẩm cực phù hợp với các bạn gái từ 25 tuổi bởi ngoài việc dưỡng sáng và dưỡng ẩm, mặt nạ Vita Genic Lifting Jelly Mask còn giúp hỗ trợ nâng cơ và săn chắc da. Góp phần giúp da luôn trong trạng thái đàn hồi, ngăn ngừa nguy cơ lão hóa và chảy xệ.\n" +
            "\n" +
            "2. Vita Genic Relaxing Mask (Màu xanh lá)\n" +
            "Đúng như tên gọi, loại mặt nạ này có công dụng thư giãn và làm giảm stress cho cơ thể. Bổ sung Vitamin A hàm lượng 20.000ppm được chiết xuất cây lô hội tại đảo Jeju Hàn Quốc, có tác dụng thư giãn, hỗ trợ phục hồi làn da mệt mỏi. Đồng thời còn có công dụng hỗ trợ trong việc trẻ hóa da, giúp da luôn trong trạng thái khỏe mạnh và căng tràn sức sống. 3. Vita GenicHydrating Mask (Màu xanh dương): \n" +
            "Đây là loại mặt nạ dành riêng cho các cô nàng da khô hoặc thường xuyên phải tiếp xúc với điều hòa gây nên tình trạng da mất nước, bong tróc. Bổ sung Vitamin E hàm lượng 20.000ppm được chiết xuất từ nguồn nước khoáng tại đảo Jeju Hàn Quốc, có tác dụng cấp ẩm cho làn da thiếu nước, da căng mọng trở nên rạng rỡ hơn và ngừa lão hóa.\n" +
            "\n",
        category_id: "6463983574f12a46a0ce5228",
        brand_id: "64639687ffa8cd1a203b4092",
        images: [
            {
                filename: "",
                url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1687360406/datn/images/vitamin_B_main_uawjqa.jpg",
                publicId: "",
            },
            {
                filename: "",
                url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1687360407/datn/images/vitamin_B_kctyb8.jpg",
                publicId: "",
            },
            {
                filename: "",
                url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1687360408/datn/images/vitamin_B_1_wdoyvp.jpg",
                publicId: "",
            },
            {
                filename: "",
                url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1687360406/datn/images/vitamin_B_2_jj29pe.jpg",
                publicId: "",
            },
        ],
        lowPrice: 17000,
        highPrice: 21000,
        available: true,
        type: "Bình thường",
        lovedAccounts: ["63bbff18fc13ae649300082a"],
        viewedAccounts: ["63bbff18fc13ae649300082a"],
        loves: 1,
        reviews: 3,
        rating: 2.7,
        recentReviewList: [],
        highestStarReviewList: [],
        gender: ["Nam", "Nữ"],
        skin: ["Da sạm, xỉn, không đều màu", "Da thường/ Mọi loại da"],
        tag: [],
        relateProductList: ["646398c7bc8ef0469c38d7bb", "646398c7bc8ef0469c38d7bc"]
    },
    {
        _id: "646398c7bc8ef0469c38d7bc",
        slug: "bnbg_vita_genic_whitening_jelly_mask",
        name: "Mặt Nạ BNBG Vitamin C Vita Genic Whitening Jelly Mask Cấp Nước, Dưỡng Ẩm Da",
        origin: "Hàn Quốc",
        guarantee: 1,
        expiredYear: 1,
        description: "BNBG Vita Genic Jelly Mask được thiết kế rất bắt mắt và dễ thương. Nhiều bạn còn lầm tưởng mặt nạ này có dạng bột hay hình viên thuốc nữa, nhưng thật ra không phải nhé! Mặt nạ có dạng miếng giấy cotton và kèm theo các loại vitamins và khoáng chất thiết yếu cho làn da với hàm lượng cao lên đến 20000ppm được chiết xuất hoàn toàn từ thiên nhiên. Ngoài ra, mặt nạ còn chứa các tinh chất từ cây, quả thiên nhiên như tinh chất trái cam, lô hội, việt quất... giúp hỗ trợ trong việc tăng sức đề kháng và hỗ trợ trẻ hóa làn da.\n" +
            "\n" +
            "Bên cạnh đó, BNBG còn chứa một lượng lớn vi khoáng – được tách chế từ nước biển vừa giúp tăng sức đề kháng, vừa bổ sung khoáng chất đặc biệt khiến da luôn căng mịn. BNBG Vita Genic Jelly Mask gồm 4 loại: 1. Vita Genic Lifting Jelly Mask (Màu đỏ)\n" +
            "Bổ sung Vitamin A hàm lượng 20.000ppm được chiết xuất cây xương rồng tại đảo Jeju Hàn Quốc, giúp nâng cơ, ngăn ngừa chảy xệ, làm da sáng hồng tự nhiên từ bên trong. Ngoài ra, sản phẩm còn bổ sung hàm lượng ẩm, cho làn da luôn căng mịn và không bị khô ráp do thiếu nước và khoáng chất. Sản phẩm cực phù hợp với các bạn gái từ 25 tuổi bởi ngoài việc dưỡng sáng và dưỡng ẩm, mặt nạ Vita Genic Lifting Jelly Mask còn giúp hỗ trợ nâng cơ và săn chắc da. Góp phần giúp da luôn trong trạng thái đàn hồi, ngăn ngừa nguy cơ lão hóa và chảy xệ.\n" +
            "\n" +
            "2. Vita Genic Relaxing Mask (Màu xanh lá)\n" +
            "Đúng như tên gọi, loại mặt nạ này có công dụng thư giãn và làm giảm stress cho cơ thể. Bổ sung Vitamin A hàm lượng 20.000ppm được chiết xuất cây lô hội tại đảo Jeju Hàn Quốc, có tác dụng thư giãn, hỗ trợ phục hồi làn da mệt mỏi. Đồng thời còn có công dụng hỗ trợ trong việc trẻ hóa da, giúp da luôn trong trạng thái khỏe mạnh và căng tràn sức sống. 3. Vita GenicHydrating Mask (Màu xanh dương): \n" +
            "Đây là loại mặt nạ dành riêng cho các cô nàng da khô hoặc thường xuyên phải tiếp xúc với điều hòa gây nên tình trạng da mất nước, bong tróc. Bổ sung Vitamin E hàm lượng 20.000ppm được chiết xuất từ nguồn nước khoáng tại đảo Jeju Hàn Quốc, có tác dụng cấp ẩm cho làn da thiếu nước, da căng mọng trở nên rạng rỡ hơn và ngừa lão hóa.\n" +
            "\n",
        category_id: "6463983574f12a46a0ce5228",
        brand_id: "64639687ffa8cd1a203b4092",
        images: [
            {
                filename: "",
                url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1687360415/datn/images/Vitamin_C_main_bfgewt.jpg",
                publicId: "",
            },
            {
                filename: "",
                url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1687360415/datn/images/vitamin_C_mkfivn.jpg",
                publicId: "",
            },
            {
                filename: "",
                url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1687360417/datn/images/vitamin_C_1_ce9sva.jpg",
                publicId: "",
            },
            {
                filename: "",
                url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1687360415/datn/images/vitamin_C_2_o4c7pj.jpg",
                publicId: "",
            },
        ],
        lowPrice: 19000,
        highPrice: 22000,
        available: true,
        type: "Bình thường",
        lovedAccounts: ["63bbff18fc13ae649300082a"],
        viewedAccounts: ["63bbff18fc13ae649300082a"],
        loves: 1,
        reviews: 1,
        rating: 4.0,
        recentReviewList: [],
        highestStarReviewList: [],
        gender: ["Nam", "Nữ"],
        skin: ["Da sạm, xỉn, không đều màu", "Da thường/ Mọi loại da"],
        tag: [],
        relateProductList: []
    },
    {
        _id: "646398c7bc8ef0469c38d7be",
        slug: "bnbg_vita_genic_hydrating_jelly_mask",
        name: "Mặt Nạ BNBG Vitamin E Vita Genic Hydrating Jelly Mask Cấp Nước, Dưỡng Ẩm Da",
        origin: "Hàn Quốc",
        guarantee: 1,
        expiredYear: 1,
        description: "BNBG Vita Genic Jelly Mask được thiết kế rất bắt mắt và dễ thương. Nhiều bạn còn lầm tưởng mặt nạ này có dạng bột hay hình viên thuốc nữa, nhưng thật ra không phải nhé! Mặt nạ có dạng miếng giấy cotton và kèm theo các loại vitamins và khoáng chất thiết yếu cho làn da với hàm lượng cao lên đến 20000ppm được chiết xuất hoàn toàn từ thiên nhiên. Ngoài ra, mặt nạ còn chứa các tinh chất từ cây, quả thiên nhiên như tinh chất trái cam, lô hội, việt quất... giúp hỗ trợ trong việc tăng sức đề kháng và hỗ trợ trẻ hóa làn da.\n" +
            "\n" +
            "Bên cạnh đó, BNBG còn chứa một lượng lớn vi khoáng – được tách chế từ nước biển vừa giúp tăng sức đề kháng, vừa bổ sung khoáng chất đặc biệt khiến da luôn căng mịn. BNBG Vita Genic Jelly Mask gồm 4 loại: 1. Vita Genic Lifting Jelly Mask (Màu đỏ)\n" +
            "Bổ sung Vitamin A hàm lượng 20.000ppm được chiết xuất cây xương rồng tại đảo Jeju Hàn Quốc, giúp nâng cơ, ngăn ngừa chảy xệ, làm da sáng hồng tự nhiên từ bên trong. Ngoài ra, sản phẩm còn bổ sung hàm lượng ẩm, cho làn da luôn căng mịn và không bị khô ráp do thiếu nước và khoáng chất. Sản phẩm cực phù hợp với các bạn gái từ 25 tuổi bởi ngoài việc dưỡng sáng và dưỡng ẩm, mặt nạ Vita Genic Lifting Jelly Mask còn giúp hỗ trợ nâng cơ và săn chắc da. Góp phần giúp da luôn trong trạng thái đàn hồi, ngăn ngừa nguy cơ lão hóa và chảy xệ.\n" +
            "\n" +
            "2. Vita Genic Relaxing Mask (Màu xanh lá)\n" +
            "Đúng như tên gọi, loại mặt nạ này có công dụng thư giãn và làm giảm stress cho cơ thể. Bổ sung Vitamin A hàm lượng 20.000ppm được chiết xuất cây lô hội tại đảo Jeju Hàn Quốc, có tác dụng thư giãn, hỗ trợ phục hồi làn da mệt mỏi. Đồng thời còn có công dụng hỗ trợ trong việc trẻ hóa da, giúp da luôn trong trạng thái khỏe mạnh và căng tràn sức sống. 3. Vita GenicHydrating Mask (Màu xanh dương): \n" +
            "Đây là loại mặt nạ dành riêng cho các cô nàng da khô hoặc thường xuyên phải tiếp xúc với điều hòa gây nên tình trạng da mất nước, bong tróc. Bổ sung Vitamin E hàm lượng 20.000ppm được chiết xuất từ nguồn nước khoáng tại đảo Jeju Hàn Quốc, có tác dụng cấp ẩm cho làn da thiếu nước, da căng mọng trở nên rạng rỡ hơn và ngừa lão hóa.\n" +
            "\n",
        category_id: "6463983574f12a46a0ce5228",
        brand_id: "64639687ffa8cd1a203b4092",
        images: [
            {
                filename: "",
                url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1687360462/datn/images/Vitamin_E_main_ue1iqo.jpg",
                publicId: "",
            },
            {
                filename: "",
                url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1687360462/datn/images/vitamin_E_mr3o4q.jpg",
                publicId: "",
            },
            {
                filename: "",
                url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1687360463/datn/images/vitamin_E_1_bekfh8.jpg",
                publicId: "",
            },
            {
                filename: "",
                url: "https://res.cloudinary.com/dnway4ykc/image/upload/v1687360462/datn/images/vitamin_E_2_dlxtfv.jpg",
                publicId: "",
            },
        ],
        lowPrice: 20000,
        highPrice: 22000,
        available: true,
        type: "Bình thường",
        lovedAccounts: ["63bbff18fc13ae649300082a"],
        viewedAccounts: ["63bbff18fc13ae649300082a"],
        loves: 1,
        reviews: 1,
        rating: 2.0,
        recentReviewList: [],
        highestStarReviewList: [],
        gender: ["Nam", "Nữ"],
        skin: ["Da sạm, xỉn, không đều màu", "Da thường/ Mọi loại da"],
        tag: [],
        relateProductList: []
    }

];

const characteristics = [
    {
        _id: "6475d20319f32362c05956ec",
        criteria: "Làm sáng da",
        product_id: "646398c7bc8ef0469c38d7ba",
        reviews: 0,
        ratings: 0
    },
    {
        _id: "6475d20319f32362c05956ed",
        criteria: "Kháng khuẩn",
        product_id: "646398c7bc8ef0469c38d7ba",
        reviews: 0,
        ratings: 0
    },
    {
        _id: "6475d20319f32362c05956ee",
        criteria: "Chống tia UV",
        product_id: "646398c7bc8ef0469c38d7ba",
        reviews: 0,
        ratings: 0
    },
    {
        _id: "6475d20319f32362c05956ef",
        criteria: "Không gây kích ứng",
        product_id: "646398c7bc8ef0469c38d7ba",
        reviews: 0,
        ratings: 0
    },
    {
        _id: "6475d20319f32362c05956f0",
        criteria: "Chất liệu",
        product_id: "646398c7bc8ef0469c38d7ba",
        reviews: 0,
        ratings: 0
    },
    {
        _id: "6475d20319f32362c05956f1",
        criteria: "Giá cả",
        product_id: "646398c7bc8ef0469c38d7ba",
        reviews: 0,
        ratings: 0
    },
    {
        _id: "6475d20319f32362c05956f2",
        criteria: "Hiệu quả",
        product_id: "646398c7bc8ef0469c38d7ba",
        reviews: 0,
        ratings: 0
    },
    {
        _id: "6475d20319f32362c05956f3",
        criteria: "An toàn",
        product_id: "646398c7bc8ef0469c38d7ba",
        reviews: 0,
        ratings: 0
    },
    {
        _id: "6475d20319f32362c05956f4",
        criteria: "Chất liệu",
        product_id: "646398c7bc8ef0469c38d7bb",
        reviews: 0,
        ratings: 0
    },
    {
        _id: "6475d20319f32362c05956f5",
        criteria: "Giá cả",
        product_id: "646398c7bc8ef0469c38d7bb",
        reviews: 0,
        ratings: 0
    },
    {
        _id: "6475d20319f32362c05956f6",
        criteria: "Hiệu quả",
        product_id: "646398c7bc8ef0469c38d7bb",
        reviews: 0,
        ratings: 0
    },
    {
        _id: "6475d20319f32362c05956f7",
        criteria: "An toàn",
        product_id: "646398c7bc8ef0469c38d7bb",
        reviews: 0,
        ratings: 0
    },

];

// 1 user chỉ được đánh giá 1 sản phẩm 1 lần (Quick/Standard/Detail 1 lần: Quick được chuyển sang Standard được chuyển sang Detail, Instruction vô hạn)
const reviews = [
    {
        _id: "6465eaca7372cc1938755d99",
        classification: "Standard",
        product_id: "646398c7bc8ef0469c38d7ba",
        userReview_id: "63bbff18fc13ae6493000833",
        rating: 4,
        title: "Dùng rất ổn nhé",
        content:
            "In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
        images: [
            {
                _id: "63ddd33e5fa9cf5634bb2807",
                filename: "",
                url: "http://dummyimage.com/228x177.png/c4bad7/ffffff",
                publicId: "",
            },
            {
                _id: "63ddd33e5fa9cf5634bb2808",
                filename: "",
                url: "http://dummyimage.com/129x127.png/61aa68/000000",
                publicId: "",
            },
            {
                _id: "63ddd33e5fa9cf5634bb2809",
                filename: "",
                url: "http://dummyimage.com/213x161.png/8f2f7a/ffffff",
                publicId: "",
            },
            {
                _id: "63ddd33e5fa9cf5634bb280a",
                filename: "",
                url: "http://dummyimage.com/266x279.png/76937e/ffffff",
                publicId: "",
            }
        ],
        settedUsefulAccounts: [
            "63bbff18fc13ae649300082a",
            "63bbff18fc13ae649300082b",
            "63bbff18fc13ae6493000833",
            "63bbff18fc13ae6493000831",
            "63bbff18fc13ae6493000830",
            "63bbff18fc13ae649300082f",
        ],
        replyList: [
            "6465fcb89d40d52ff8b805ca",
            "6465fcb89d40d52ff8b805cb"
        ],
        usefuls: 6,
        replies: 2,
        canReply: false,
        banned: false,
        reports_review: [],
    },
    {
        _id: "6465eaca7372cc1938755da0",
        classification: "Standard",
        product_id: "646398c7bc8ef0469c38d7ba",
        userReview_id: "63bbff18fc13ae649300082b",
        rating: 4,
        title: "Dùng ổn và có video",
        video: {
            filename: "",
            url: "https://www.youtube.com/watch?v=j5-yKhDd64s",
            publicId: "",
        },
        content:
            "Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue.",
        settedUsefulAccounts: ["63bbff18fc13ae649300082f"],
        replyList: [
            "6465fcb89d40d52ff8b805cd"
        ],
        usefuls: 1,
        replies: 1,
        canReply: false,
        banned: false,
        reports_review: [],
    },
    {
        _id: "6465eaca7372cc1938755da1",
        classification: "Standard",
        product_id: "646398c7bc8ef0469c38d7ba",
        userReview_id: "63bbff18fc13ae6493000831",
        rating: 2,
        title: "Tệ",
        content:
            "Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue.",
        images: [
            {
                _id: "63ddd33e5fa9cf5634bb280f",
                filename: "",
                url: "http://dummyimage.com/273x271.png/2016da/ffffff",
                publicId: "",
            }
        ],
        settedUsefulAccounts: [
            "63bbff18fc13ae649300082a",
            "63bbff18fc13ae6493000831",
            "63bbff18fc13ae649300082b",
            "63bbff18fc13ae649300082e",
            "63bbff18fc13ae649300082c",
            "63bbff18fc13ae6493000830",
            "63bbff18fc13ae649300082d",
        ],
        replyList: [],
        usefuls: 7,
        replies: 0,
        canReply: false,
        banned: false,
        reports_review: [],
    },
    {
        _id: "6465eaca7372cc1938755da2",
        classification: "Standard",
        product_id: "646398c7bc8ef0469c38d7bb",
        userReview_id: "63bbff18fc13ae6493000831",
        rating: 2,
        title: "Tệ",
        content:
            "Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue.",
        settedUsefulAccounts: [
            "63bbff18fc13ae649300082e",
            "63bbff18fc13ae6493000831",
            "63bbff18fc13ae649300082b",
            "63bbff18fc13ae6493000833",
            "63bbff18fc13ae649300082a",
            "63bbff18fc13ae6493000832",
            "63bbff18fc13ae649300082d",
            "63bbff18fc13ae6493000830",
            "63bbff18fc13ae649300082f",
        ],
        replyList: [
            "6465fcb89d40d52ff8b805ce",
            "6465fcb89d40d52ff8b805cf",
            "6465fcb89d40d52ff8b805d0",
            "6465fcb89d40d52ff8b805d1",
            "6465fcb89d40d52ff8b805d2"
        ],
        usefuls: 9,
        replies: 5,
        canReply: false,
        banned: false,
        reports_review: [],
    },
    {
        _id: "6465eaca7372cc1938755da3",
        classification: "Standard",
        product_id: "646398c7bc8ef0469c38d7be",
        userReview_id: "63bbff18fc13ae649300082b",
        rating: 2,
        title: "Tệ",
        content: "Donec posuere metus vitae ipsum.",
        settedUsefulAccounts: ["63bbff18fc13ae649300082f"],
        replyList: [],
        usefuls: 1,
        replies: 0,
        canReply: false,
        banned: false,
        reports_review: [],
    },
    {
        _id: "6465eaca7372cc1938755da4",
        classification: "Standard",
        product_id: "646398c7bc8ef0469c38d7bc",
        userReview_id: "63bbff18fc13ae649300082b",
        rating: 4,
        title: "Ổn áp",
        content:
            "Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl.",
        settedUsefulAccounts: ["63bbff18fc13ae649300082d"],
        replyList: [],
        usefuls: 1,
        replies: 0,
        canReply: false,
        banned: false,
        reports_review: [],
    },
    {
        _id: "6465eaca7372cc1938755da5",
        classification: "Standard",
        product_id: "646398c7bc8ef0469c38d7bb",
        userReview_id: "63bbff18fc13ae649300082b",
        rating: 5,
        title: "Ổn áp",
        content:
            "Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum.",
        settedUsefulAccounts: [
            "63bbff18fc13ae649300082d",
            "63bbff18fc13ae649300082b",
            "63bbff18fc13ae649300082f",
            "63bbff18fc13ae6493000833",
            "63bbff18fc13ae6493000831",
        ],
        replyList: [
            "6465fcb89d40d52ff8b805d3",
            "6465fcb89d40d52ff8b805d4"
        ],
        usefuls: 5,
        replies: 2,
        canReply: false,
        banned: false,
        reports_review: [],
    },
    {
        _id: "6465eaca7372cc1938755da6",
        classification: "Standard",
        product_id: "646398c7bc8ef0469c38d7ba",
        userReview_id: "63bbff18fc13ae649300082f",
        rating: 4,
        title: "Ổn áp",
        content: "Proin at turpis a pede posuere nonummy.",
        settedUsefulAccounts: [
            "63bbff18fc13ae6493000831",
            "63bbff18fc13ae649300082b",
            "63bbff18fc13ae649300082e",
            "63bbff18fc13ae649300082d",
        ],
        replyList: [
            "6465fcb89d40d52ff8b805d5",
            "6465fcb89d40d52ff8b805d6",
            "6465fcb89d40d52ff8b805d7",
            "6465fcb89d40d52ff8b805d8",
            "6465fcb89d40d52ff8b805d9",
        ],
        usefuls: 4,
        replies: 5,
        canReply: false,
        banned: false,
        reports_review: [],
    },
    {
        _id: "6465eaca7372cc1938755da7",
        classification: "Standard",
        product_id: "646398c7bc8ef0469c38d7bb",
        userReview_id: "63bbff18fc13ae649300082f",
        rating: 1,
        title: "Buồn",
        content: "Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat.",
        settedUsefulAccounts: [],
        replyList: [
            "6465fcb89d40d52ff8b805da",
            "6465fcb89d40d52ff8b805db",
            "6465fcb89d40d52ff8b805dc",
            "6465fcb89d40d52ff8b805dd"
        ],
        usefuls: 0,
        replies: 4,
        canReply: false,
        banned: false,
        reports_review: [],
    },
    {
        _id: "6465eaca7372cc1938755da8",
        classification: "Detail",
        characteristic_reviews: [
            {
                characteristic_id: "6475d20319f32362c05956ec",
                point: 4,
            },
            {
                characteristic_id: "6475d20319f32362c05956ed",
                point: 3,
            },
            {
                characteristic_id: "6475d20319f32362c05956ee",
                point: 5,
            },
            {
                characteristic_id: "6475d20319f32362c05956ef",
                point: 5,
            },
            {
                characteristic_id: "6475d20319f32362c05956f0",
                point: 2,
            },
            {
                characteristic_id: "6475d20319f32362c05956f1",
                point: 2,
            },
            {
                characteristic_id: "6475d20319f32362c05956f2",
                point: 3,
            },
            {
                characteristic_id: "6475d20319f32362c05956f3",
                point: 5,
            },
        ],
        product_id: "646398c7bc8ef0469c38d7ba",
        userReview_id: "63bbff18fc13ae649300082a",
        rating: 4,
        title: "Buồn",
        content: "Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat.",
        settedUsefulAccounts: [],
        replyList: [],
        usefuls: 0,
        replies: 0,
        canReply: false,
        banned: false,
        reports_review: []
    },
    {
        _id: "6465eaca7372cc1938755da9",
        classification: "Detail",
        characteristic_reviews: [
            {
                characteristic_id: "6475d20319f32362c05956ec",
                point: 3,
            },
            {
                characteristic_id: "6475d20319f32362c05956ed",
                point: 2,
            },
            {
                characteristic_id: "6475d20319f32362c05956ee",
                point: 4,
            },
            {
                characteristic_id: "6475d20319f32362c05956ef",
                point: 4,
            },
            {
                characteristic_id: "6475d20319f32362c05956f0",
                point: 3,
            },
            {
                characteristic_id: "6475d20319f32362c05956f1",
                point: 5,
            },
            {
                characteristic_id: "6475d20319f32362c05956f2",
                point: 5,
            },
            // xóa cái này đi để có thể thử testcase
            {
                characteristic_id: "6475d20319f32362c05956f3",
                point: 1,
            },
        ],
        product_id: "646398c7bc8ef0469c38d7ba",
        userReview_id: "63bbff18fc13ae649300082c",
        rating: 5,
        title: "Buồn",
        content: "Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat.",
        settedUsefulAccounts: [],
        replyList: [],
        usefuls: 0,
        replies: 0,
        canReply: false,
        banned: false,
        reports_review: []
    },
];

const replies = [
    {
        _id: "6465fcb89d40d52ff8b805ca",
        review_id: "6465eaca7372cc1938755d99",
        userReply_id: "63bbff18fc13ae6493000833",
        content:
            "In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit."
    },
    {
        _id: "6465fcb89d40d52ff8b805cb",
        review_id: "6465eaca7372cc1938755d99",
        userReply_id: "63bbff18fc13ae649300082b",
        content: "Curabitur at ipsum ac tellus semper interdum."
    },
    {
        _id: "6465fcb89d40d52ff8b805cc",
        review_id: "6465eaca7372cc1938755d99",
        userReply_id: "63bbff18fc13ae649300082b",
        content:
            "Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue."
    },
    {
        _id: "6465fcb89d40d52ff8b805cd",
        review_id: "6465eaca7372cc1938755da0",
        userReply_id: "63bbff18fc13ae6493000831",
        content:
            "Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue."
    },
    {
        _id: "6465fcb89d40d52ff8b805ce",
        review_id: "6465eaca7372cc1938755da2",
        userReply_id: "63bbff18fc13ae6493000831",
        content:
            "Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat. In congue."
    },
    {
        _id: "6465fcb89d40d52ff8b805cf",
        review_id: "6465eaca7372cc1938755da2",
        userReply_id: "63bbff18fc13ae649300082b",
        content: "Donec posuere metus vitae ipsum."
    },
    {
        _id: "6465fcb89d40d52ff8b805d0",
        review_id: "6465eaca7372cc1938755da2",
        userReply_id: "63bbff18fc13ae649300082b",
        content:
            "Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl."
    },
    {
        _id: "6465fcb89d40d52ff8b805d1",
        review_id: "6465eaca7372cc1938755da2",
        userReply_id: "63bbff18fc13ae649300082b",
        content:
            "Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum."
    },
    {
        _id: "6465fcb89d40d52ff8b805d2",
        review_id: "6465eaca7372cc1938755da2",
        userReply_id: "63bbff18fc13ae649300082f",
        content: "Proin at turpis a pede posuere nonummy."
    },
    {
        _id: "6465fcb89d40d52ff8b805d3",
        review_id: "6465eaca7372cc1938755da5",
        userReply_id: "63bbff18fc13ae649300082f",
        content: "Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat."
    },
    {
        _id: "6465fcb89d40d52ff8b805d4",
        review_id: "6465eaca7372cc1938755da5",
        userReply_id: "63bbff18fc13ae649300082f",
        content:
            "Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.",
    },
    {
        _id: "6465fcb89d40d52ff8b805d5",
        review_id: "6465eaca7372cc1938755da6",
        userReply_id: "63bbff18fc13ae6493000830",
        content:
            "Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum."
    },
    {
        _id: "6465fcb89d40d52ff8b805d6",
        review_id: "6465eaca7372cc1938755da6",
        userReply_id: "63bbff18fc13ae6493000830",
        content: "Nulla facilisi."
    },
    {
        _id: "6465fcb89d40d52ff8b805d7",
        review_id: "6465eaca7372cc1938755da6",
        userReply_id: "63bbff18fc13ae6493000830",
        content:
            "Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla."
    },
    {
        _id: "6465fcb89d40d52ff8b805d8",
        review_id: "6465eaca7372cc1938755da6",
        userReply_id: "63bbff18fc13ae649300082b",
        content: "Aliquam non mauris. Morbi non lectus."
    },
    {
        _id: "6465fcb89d40d52ff8b805d9",
        review_id: "6465eaca7372cc1938755da6",
        userReply_id: "63bbff18fc13ae649300082a",
        content:
            "The lazy bird humbly ran because some clock elegantly ran into a beautiful duck which, became a rough, lazy old lady."
    },
    {
        _id: "6465fcb89d40d52ff8b805da",
        review_id: "6465eaca7372cc1938755da7",
        userReply_id: "63bbff18fc13ae649300082f",
        content:
            "The vibrating dog precisely ran because some hamster calmly slept across a slimy professor which, became a professional, lazy duck."
    },
    {
        _id: "6465fcb89d40d52ff8b805db",
        review_id: "6465eaca7372cc1938755da7",
        userReply_id: "63bbff18fc13ae6493000833",
        content:
            "The rough plastic sadly sliced because some teacher humbly rolled below a lovely hamster which, became a dumb, dumb plastic."
    },
    {
        _id: "6465fcb89d40d52ff8b805dc",
        review_id: "6465eaca7372cc1938755da7",
        userReply_id: "63bbff18fc13ae6493000830",
        content:
            "The dumb professor proudly slept because some duck sadly sliced upon a hot dog which, became a soft, vibrating clock."
    },
    {
        _id: "6465fcb89d40d52ff8b805dd",
        review_id: "6465eaca7372cc1938755da7",
        userReply_id: "63bbff18fc13ae6493000830",
        content:
            "The lovely duck precisely dodged because some plastic quickly dodged on a dumb old lady which, became a professional, lovely boy."
    },
];

module.exports = {brands, categories, products, characteristics, reviews, replies};