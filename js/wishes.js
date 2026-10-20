/* =========================================================
   WISHES.JS - DATA & PERSONALIZED GREETINGS FOR MOM, CHỊ BÉ & CHỊ TRỌC
   ========================================================= */

const RECIPIENTS_DATA = {
  me: {
    id: 'me',
    name: 'Mẹ Kính Yêu',
    roleTag: 'MẸ YÊU DẤU ❤️',
    photo: 'asset/me_yeu.jpg',
    cardTag: 'CON CHÚC MỪNG MẸ NGÀY 20/10',
    quote: 'Mẹ là bến đỗ bình yên nhất, là tình yêu thương vô điều kiện của cả cuộc đời con.',
    gardenHint: 'Chạm vào bông hoa hồng để cả vườn hoa dâng tặng Mẹ bung nở!',
    gardenReady: 'Một vườn hoa ngát hương kính dâng tặng Mẹ yêu dấu 🌸',
    message: `Nhân ngày Phụ nữ Việt Nam 20/10, con xin gửi đến Mẹ kính yêu ngàn lời chúc tốt đẹp, ấm áp và chân thành nhất!

Con chúc Mẹ luôn luôn dồi dào sức khỏe, tràn đầy niềm vui, tâm hồn luôn an yên và giữ mãi nụ cười thật tươi trên môi. 

Cảm ơn Mẹ vì tất cả những vất vả nhọc nhằn, những hy sinh thầm lặng và tình yêu thương bao la mà Mẹ đã dành cho chúng con suốt bao năm qua. Nhìn thấy Mẹ vui vẻ và khỏe mạnh mỗi ngày chính là niềm hạnh phúc lớn nhất của chúng con.

Con yêu Mẹ rất nhiều! Chúc Mẹ một ngày 20/10 thật ngập tràn niềm vui và ấm áp bên gia đình!`
  },
  chi_be: {
    id: 'chi_be',
    name: 'Chị Bé',
    roleTag: 'CHỊ BÉ YÊU QUÝ 🌷',
    photo: 'asset/chi_hai.jpg',
    cardTag: 'CHÚC MỪNG CHỊ BÉ NGÀY 20/10',
    quote: 'Chúc gia đình Chị luôn ấm êm, may mắn ngập tràn, tài lộc dồi dào và bé con ngoan ngoãn.',
    gardenHint: 'Chạm vào bông hoa hồng để cả vườn hoa chúc mừng Chị Bé bung nở!',
    gardenReady: 'Cả vườn hoa rạng rỡ dành tặng Chị Bé và gia đình nhỏ 🌸',
    message: `Nhân ngày Phụ nữ Việt Nam 20/10, em xin chúc Chị Bé luôn luôn xinh đẹp, trẻ trung, rạng rỡ và tràn ngập năng lượng tích cực!

Em chúc cho gia đình nhỏ của chị lúc nào cũng ấm êm, thuận hòa và rộn rã tiếng cười. Chúc cho công việc của anh chị luôn gặp nhiều may mắn, vạn sự hanh thông, tài lộc dồi dào và tiền bạc rủng rỉnh đầy túi!

Đặc biệt, chúc bé con 2 tuổi của chị trộm vía hay ăn chóng lớn, luôn khỏe mạnh, thông minh, lanh lợi và ngoan ngoãn, mãi là niềm vui to lớn của cả nhà. 

Chúc Chị Bé một ngày 20/10 thật vui vẻ, hạnh phúc trọn vẹn và nhận được thật nhiều yêu thương!`
  },
  chi_troc: {
    id: 'chi_troc',
    name: 'Chị Trọc',
    roleTag: 'CHỊ TRỌC XINH ĐẸP 🌸',
    photo: 'asset/chi_hien_minh.jpg',
    cardTag: 'CHÚC MỪNG CHỊ TRỌC NGÀY 20/10',
    quote: 'Chúc Chị mẹ tròn con vuông, gia đình viên mãn, tiền tài hanh thông và hạnh phúc đong đầy.',
    gardenHint: 'Chạm vào bông hoa hồng để cả vườn hoa chúc mừng Chị Trọc bung nở!',
    gardenReady: 'Vườn hoa nở rộ chúc mừng Chị Trọc sắp đón thiên thần nhỏ 🌸',
    message: `Chúc mừng ngày 20/10 đến Chị Trọc xinh đẹp của em!

Em chúc chị luôn giữ trọn nét duyên dáng, nụ cười tỏa nắng và luôn được cả gia đình yêu thương, chiều chuộng hết mực. Chúc cho tổ ấm nhỏ của chị luôn thuận hòa, hạnh phúc viên mãn, công việc và cuộc sống gặp nhiều may mắn, tài lộc dồi dào, tiền bạc hanh thông!

Đặc biệt nhất trong dịp này, chúc chị chuẩn bị vượt cạn thật suôn sẻ, "mẹ tròn con vuông", đón thiên thần nhỏ chào đời thật bình an, khỏe mạnh và đáng yêu! 

Chúc Chị Trọc một ngày 20/10 thật rực rỡ, bình an và ngập tràn niềm vui hạnh phúc!`
  }
};
