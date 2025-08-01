// ===== MÚA RỐI NƯỚC - DI SẢN VĂN HÓA VIỆT NAM =====
// Hệ thống giáo dục văn hóa tương tác cho người mới - 7 Chương hoàn chỉnh
// Phím điều khiển: W = Cúi đầu, A = Quay trái, S = Vẫy tay, D = Quay phải

const chapters = {
    1: {
        title: "Bước chân đầu tiên - Chào Chú Tễu",
        culturalContext: {
            background: "Múa rối nước Việt Nam có lịch sử hơn 1000 năm, khởi nguồn từ các làng ven đồng bằng sông Hồng. Đây là nghệ thuật biểu diễn duy nhất trên thế giới diễn ra trên mặt nước.",
            significance: "Chú Tễu là nhân vật mở đầu mọi buổi biểu diễn, tượng trưng cho tinh thần vui tươi, lạc quan của người Việt.",
            location: "Nghệ thuật này chủ yếu phát triển tại các làng Đông Hiếu, Đào Thục (Nam Định), Thổ Tang (Hà Nam)."
        },
        story: {
            isUnlocked: false,
            content: "Bạn là Minh, một học sinh lớp 8 tham gia chuyến trải nghiệm văn hóa tại làng Đào Thục - cái nôi của múa rối nước. Ông Năm, nghệ nhân 70 tuổi với 50 năm kinh nghiệm, mỉm cười chào đón: 'Cháu à, múa rối nước không chỉ là nghệ thuật mà còn là linh hồn của dân tộc ta. Hôm nay ta sẽ bắt đầu từ việc làm quen với Chú Tễu - người bạn đầu tiên của mọi khán giả.' Nước hồ trong vắt phản chiếu những tia nắng chiều, tạo nên không gian huyền diệu."
        },
        npcDialogue: [
            "Chào cháu! Ta là nghệ nhân Năm. Chú Tễu đây sẽ dạy cháu những bước đầu tiên!",
            "Chú Tễu luôn xuất hiện đầu tiên để chào hỏi, làm quen với khán giả. Cháu hãy học cách cúi đầu chào!",
            "Vẫy tay là cách Chú Tễu thể hiện sự thân thiện. Hãy thực hiện thật tự nhiên nhé!"
        ],
        sequences: [
            {
                keys: "W",
                time: 2000,
                description: "Cúi đầu chào khán giả (Lễ phép truyền thống)"
            },
            {
                keys: "SS", 
                time: 3000,
                description: "Vẫy tay thân thiện (Chú Tễu chào mọi người)"
            },
            {
                keys: "WSS",
                time: 3500,
                description: "Cúi đầu và vẫy tay tạm biệt (Kết thúc lời chào)"
            }
        ],
        educationalContent: {
            keyLearning: "Chú Tễu là biểu tượng của sự thân thiện, gần gũi trong văn hóa Việt. Mọi buổi múa rối đều bắt đầu bằng lời chào của Chú Tễu.",
            funFact: "Múa rối nước là di sản văn hóa phi vật thể đại diện của nhân loại được UNESCO công nhận năm 2008.",
            tradition: "Trước mỗi buổi biểu diễn, nghệ nhân phải thực hiện nghi lễ cúng thần nước để cầu may mắn và an toàn."
        },
        difficulty: 1
    },

    2: {
        title: "Lịch sử hình thành - Từ ruộng đồng đến sân khấu",
        culturalContext: {
            background: "Múa rối nước xuất hiện từ thế kỷ 11, ban đầu là hoạt động giải trí của nông dân sau mùa gặt. Nghệ thuật này phát triển mạnh dưới các triều đại Lý, Trần.",
            significance: "Sân khấu nước tượng trưng cho môi trường sống nông nghiệp lúa nước, thể hiện mối quan hệ hài hòa giữa con người và thiên nhiên.",
            evolution: "Từ những màn biểu diễn đơn giản bên ruộng lúa, múa rối nước đã phát triển thành nghệ thuật sân khấu hoàn chỉnh."
        },
        story: {
            isUnlocked: false,
            content: "Ông Năm dẫn Minh đi quanh làng, chỉ vào những cánh đồng lúa xanh mướt: 'Cháu thấy không? Xưa kia, sau mùa gặt, nước đọng lại trong ruộng. Ông cha ta nghĩ ra cách làm những con rối gỗ nhỏ để múa trên mặt nước, vừa giải trí vừa cầu mong mùa màng bội thu.' Ông dừng lại bên một ao cổ: 'Đây chính là nơi đầu tiên có múa rối nước ở làng ta, từ hơn 800 năm trước. Cháu đang đứng trên mảnh đất thiêng của nghệ thuật dân tộc đấy!'"
        },
        npcDialogue: [
            "Cháu hãy tưởng tượng cảnh nông dân xưa múa rối bên ruộng lúa sau mùa gặt...",
            "Họ dùng những thanh tre, sợi dây đơn giản để tạo nên phép màu trên mặt nước!",
            "Bây giờ cháu sẽ học cách di chuyển con rối như tổ tiên ta đã làm!"
        ],
        sequences: [
            {
                keys: "AD",
                time: 4000,
                description: "Rối quay trái phải (Dạo chơi trên mặt nước)"
            },
            {
                keys: "SSAD", 
                time: 5000,
                description: "Vẫy tay và quay mình (Múa trong ruộng lúa)"
            },
            {
                keys: "WSASD",
                time: 5500,
                description: "Động tác cổ truyền (Kỹ thuật của tổ tiên)"
            }
        ],
        educationalContent: {
            keyLearning: "Múa rối nước sinh ra từ đời sống nông nghiệp, thể hiện sự sáng tạo và tình yêu nghệ thuật của người Việt.",
            funFact: "Múa rối nước là nghệ thuật biểu diễn trên nước duy nhất còn tồn tại trên thế giới, chỉ có ở Việt Nam.",
            tradition: "Các làng có múa rối nước thường tổ chức lễ hội vào tháng 2-3 âm lịch để tôn vinh nghề truyền thống."
        },
        difficulty: 2
    },

    3: {
        title: "Kỹ thuật cơ bản - Làm chủ dây và nước",
        culturalContext: {
            background: "Nghệ nhân múa rối cần thuần thục kỹ thuật điều khiển con rối bằng hệ thống dây phức tạp dưới nước. Mỗi con rối có 3-8 sợi dây điều khiển.",
            significance: "Sự phối hợp giữa tay, chân và hơi thở của nghệ nhân tạo nên sự sống động cho con rối trên mặt nước.",
            mastery: "Cần ít nhất 5-7 năm luyện tập để thành thạo kỹ thuật điều khiển rối cơ bản."
        },
        story: {
            isUnlocked: false,
            content: "Ông Năm đưa Minh xuống sau màn tre, nơi các nghệ nhân đứng điều khiển rối. 'Cháu thấy không? Chúng ta đứng trong nước đến eo, tay cầm những thanh tre có gắn dây.' Ông chỉ vào hệ thống dây phức tạp: 'Sợi dây này điều khiển đầu, sợi này điều khiển tay, sợi kia điều khiển chân. Muốn con rối sống động, nghệ nhân phải như thổi hồn vào từng động tác.' Minh ngạc nhiên khi thấy những động tác tưởng đơn giản lại đòi hỏi sự khéo léo đến vậy."
        },
        npcDialogue: [
            "Bây giờ cháu sẽ học cách điều khiển con rối như một nghệ nhân thật sự!",
            "Mỗi phím tương ứng với một sợi dây - cháu phải phối hợp thật khéo léo!",
            "Nhớ rằng, con rối chỉ sống động khi nghệ nhân thổi hồn vào đó!"
        ],
        sequences: [
            {
                keys: "WASD",
                time: 6000,
                description: "Điều khiển cơ bản (Cúi đầu, quay trái, vẫy tay, quay phải)"
            },
            {
                keys: "WDSA", 
                time: 6000,
                description: "Phối hợp động tác (Kỹ thuật điều khiển)"
            },
            {
                keys: "SWADSAD",
                time: 7000,
                description: "Múa trên mặt nước (Thổi hồn vào con rối)"
            }
        ],
        educationalContent: {
            keyLearning: "Kỹ thuật múa rối nước đòi hỏi sự phối hợp tinh tế giữa tay, mắt và tâm hồn nghệ nhân.",
            funFact: "Nghệ nhân múa rối phải đứng trong nước 2-3 tiếng liên tục, đòi hỏi sức khỏe và sức bền tốt.",
            tradition: "Kỹ thuật điều khiển rối được truyền từ thầy sang trò, mỗi dòng họ có những bí quyết riêng."
        },
        difficulty: 3
    },

    4: {
        title: "Tấm Cám qua múa rối - Truyện cổ tích bất hủ",
        culturalContext: {
            background: "Tấm Cám là truyện cổ tích kinh điển, được múa rối nước biểu diễn từ thời Lê Trung Hưng. Đây là một trong những vở múa rối phức tạp nhất.",
            significance: "Câu chuyện thể hiện triết lý nhân quả, lòng tốt sẽ được đền đáp, điều ác sẽ bị trừng phạt.",
            artistry: "Vở múa này đòi hỏi nhiều con rối, nhiều nghệ nhân phối hợp, thể hiện đỉnh cao kỹ thuật."
        },
        story: {
            isUnlocked: false,
            content: "Buổi tối, toàn làng tụ họp xem múa rối. Ông Năm thì thầm: 'Đây là vở Tấm Cám - câu chuyện mà ai trong chúng ta cũng lớn lên cùng.' Trên mặt nước, cô Tấm hiền lành xuất hiện, cần mẫn làm việc. Khi mẹ kế và Cám tỏ ra độc ác, nước hồ như rung rinh theo cảm xúc. 'Cháu thấy không? Múa rối không chỉ diễn câu chuyện mà còn truyền tải tâm hồn,' ông giải thích. 'Mỗi nhân vật đều mang một thông điệp đạo đức sâu sắc.'"
        },
        npcDialogue: [
            "Hôm nay chúng ta sẽ kể lại câu chuyện Tấm Cám qua múa rối!",
            "Cô Tấm hiền lành, chăm chỉ - hãy thể hiện tính cách này qua từng động tác!",
            "Hãy cảm nhận niềm đau và niềm vui của Tấm qua cách điều khiển con rối!"
        ],
        sequences: [
            {
                keys: "WSWSWS",
                time: 8000,
                description: "Tấm cần mẫn làm việc (Đạp lúa, giã gạo)"
            },
            {
                keys: "SADWSAD", 
                time: 8500,
                description: "Tấm buồn bã bị bắt nạt (Nước mắt rơi)"
            },
            {
                keys: "WSADWSAD",
                time: 9000,
                description: "Tấm gặp cá bống (Bạn tốt giúp đỡ)"
            },
            {
                keys: "DWSADWSAD",
                time: 9500,
                description: "Tấm hóa công chúa (Phép màu và lòng tốt)"
            }
        ],
        educationalContent: {
            keyLearning: "Tấm Cám trong múa rối dạy về đức tính chăm chỉ, hiền lành và niềm tin vào sự công bằng.",
            funFact: "Vở Tấm Cám có thể kéo dài 45 phút với hơn 10 con rối khác nhau được điều khiển đồng thời.",
            tradition: "Truyện này thường được biểu diễn trong các dịp Tết Trung thu để giáo dục trẻ em về đạo đức."
        },
        difficulty: 4
    },

    5: {
        title: "Lễ hội làng - Đình thần và múa rối",
        culturalContext: {
            background: "Đình làng là trung tâm sinh hoạt cộng đồng, nơi thờ thành hoàng bảo hộ. Múa rối nước là phần quan trọng trong các lễ hội đình.",
            significance: "Lễ hội thể hiện tinh thần đoàn kết cộng đồng, tôn vinh tổ tiên và cầu mong bình an cho làng.",
            celebration: "Các màn múa trong lễ hội thường có tính chất cầu phúc, mô tả đời sống nông nghiệp thịnh vượng."
        },
        story: {
            isUnlocked: false,
            content: "Mùa xuân về, lễ hội đình làng được tổ chức long trọng. Minh được chứng kiến cảnh tượng hào hùng: trống chiêng rộn ràng, người dân mặc áo dài truyền thống. Ông Năm khoác chiếc áo dài lễ phục: 'Đây là ngày trọng đại nhất của làng, cháu ạ. Múa rối hôm nay không chỉ để giải trí mà còn để tạ ơn thần linh, cầu mong năm mới mưa thuận gió hòa.' Trên hồ múa rối, những con rối thể hiện cảnh vườn tược phong phú, lúa vàng trĩu bông."
        },
        npcDialogue: [
            "Hôm nay là ngày lễ hội đình làng - dịp thiêng liêng nhất trong năm!",
            "Cháu sẽ múa những màn thể hiện sự thịnh vượng của làng quê ta!",
            "Hãy múa thật trang nghiêm để tỏ lòng thành kính với thần linh!"
        ],
        sequences: [
            {
                keys: "WSDAWSDA",
                time: 10000,
                description: "Khai mạc lễ hội (Trống chiêng vang dậy)"
            },
            {
                keys: "DWSADWSA", 
                time: 10500,
                description: "Cúng tạ thần linh (Lòng thành kính)"
            },
            {
                keys: "SWADWSADW",
                time: 11000,
                description: "Múa mừng mùa màng (Vui mừng bội thu)"
            },
            {
                keys: "ADWSADWSA",
                time: 11500,
                description: "Cầu phúc năm mới (Hy vọng tốt lành)"
            }
        ],
        educationalContent: {
            keyLearning: "Lễ hội đình làng thể hiện giá trị cộng đồng và niềm tin tâm linh sâu sắc của người Việt.",
            funFact: "Một lễ hội đình có thể kéo dài 3 ngày với hàng chục màn múa rối khác nhau.",
            tradition: "Mỗi làng có thành hoàng riêng, múa rối sẽ thể hiện truyền thuyết về vị thần bảo hộ đó."
        },
        difficulty: 5
    },

    6: {
        title: "Rồng thiêng phun nước - Đỉnh cao nghệ thuật",
        culturalContext: {
            background: "Rồng là biểu tượng thiêng liêng nhất trong văn hóa Việt, đại diện cho quyền lực, sự bảo vệ và mang lại mưa thuận gió hòa.",
            significance: "Màn múa rồng phun nước là đỉnh cao kỹ thuật múa rối, chỉ những nghệ nhân lão luyện nhất mới điều khiển được.",
            legend: "Theo truyền thuyết, rồng nước sống ở sông Hồng, bảo vệ vùng đất Kinh Bắc khỏi thiên tai."
        },
        story: {
            isUnlocked: false,
            content: "Đêm rằm tháng 8, ông Năm quyết định dạy Minh màn múa khó nhất. 'Cháu có thấy con rồng kia không?' Ông chỉ vào con rối rồng lớn nhất. 'Nó nặng gần 10kg, cần 3 người điều khiển. Miệng rồng có thể phun nước thật!' Minh mở to mắt khi con rồng bỗng nhiên sống dậy, bay lượn trên mặt nước, phun ra những tia nước lấp lánh dưới ánh trăng. 'Đây là linh hồn của múa rối nước, cháu ạ. Ai làm chủ được rồng là đã trở thành nghệ nhân thực thụ.'"
        },
        npcDialogue: [
            "Đây là màn múa thiêng liêng và khó nhất - Rồng phun nước!",
            "Con rồng này đại diện cho sức mạnh thiêng liêng, cháu phải tập trung cao độ!",
            "Hãy thể hiện sự uy nghi và từ bi của long thần qua từng động tác!"
        ],
        sequences: [
            {
                keys: "WASDWASDW",
                time: 12000,
                description: "Rồng thức tỉnh (Mở mắt long thần)"
            },
            {
                keys: "SWADWSADWS", 
                time: 12500,
                description: "Rồng bay lên trời (Thăng thiên uy nghi)"
            },
            {
                keys: "DWADSWADWSA",
                time: 13000,
                description: "Rồng phun nước thiêng (Ban phước lành)"
            },
            {
                keys: "ASDWADSWADS",
                time: 13500,
                description: "Rồng múa trong mây (Huyền bí thiêng liêng)"
            }
        ],
        educationalContent: {
            keyLearning: "Rồng trong múa rối thể hiện niềm tin vào thần linh và sự tôn kính thiên nhiên của dân tộc Việt.",
            funFact: "Con rồng múa rối có thể phun nước thật cao tới 2-3 mét, tạo hiệu ứng ngoạn mục.",
            tradition: "Màn múa rồng chỉ được biểu diễn trong những dịp trọng đại nhất như Tết, lễ hội lớn."
        },
        difficulty: 6
    },

    7: {
        title: "Nghệ nhân tương lai - Truyền lửa văn hóa",
        culturalContext: {
            background: "Nghệ nhân múa rối nước không chỉ là người biểu diễn mà còn là người gìn giữ và truyền dạy di sản văn hóa cho thế hệ sau.",
            significance: "Trở thành nghệ nhân nghĩa là gánh vác trách nhiệm bảo tồn một nghệ thuật đang đối mặt với nguy cơ mai một.",
            future: "Thế hệ nghệ nhân trẻ cần vừa kế thừa truyền thống vừa đổi mới để múa rối nước tiếp tục phát triển."
        },
        story: {
            isUnlocked: false,
            content: "Sau một năm học tập, Minh đã thành thạo tất cả kỹ năng cơ bản. Trong buổi tối cuối cùng, ông Năm trang trọng trao cho cậu chiếc khăn thêu hoa sen - biểu tượng của nghệ nhân. 'Cháu đã sẵn sàng trở thành người truyền lửa cho thế hệ sau,' ông nói với giọng đầy xúc động. 'Múa rối nước đã sống qua 1000 năm lịch sử. Nó không bao giờ chết đi được, vì nó sống trong trái tim mỗi người Việt Nam. Bây giờ, trách nhiệm thuộc về cháu và thế hệ trẻ. Hãy yêu thương và gìn giữ nghệ thuật này nhé!'"
        },
        npcDialogue: [
            "Chúc mừng cháu! Cháu đã trở thành một nghệ nhân múa rối thực thụ!",
            "Hãy thể hiện tất cả những gì đã học - từ kỹ thuật đến tâm hồn!",
            "Từ nay, cháu có trách nhiệm truyền dạy và gìn giữ di sản này cho mai sau!"
        ],
        sequences: [
            {
                keys: "WASDWASDWASD",
                time: 14000,
                description: "Tổng hợp kỹ thuật (Thành thạo mọi động tác)"
            },
            {
                keys: "SWADSWADSWAD", 
                time: 14500,
                description: "Tâm hồn nghệ sĩ (Truyền cảm xúc qua rối)"
            },
            {
                keys: "DWADSWADSWADS",
                time: 15000,
                description: "Kế thừa truyền thống (Gìn giữ di sản)"
            },
            {
                keys: "ADSWADSWADWSA",
                time: 15500,
                description: "Sáng tạo tương lai (Phát triển nghệ thuật)"
            },
            {
                keys: "WASDWASDWASDW",
                time: 16000,
                description: "Nghệ nhân tương lai (Truyền lửa cho đời sau)"
            }
        ],
        educationalContent: {
            keyLearning: "Trở thành nghệ nhân múa rối nước là gánh vác sứ mệnh bảo tồn và phát triển di sản văn hóa dân tộc.",
            funFact: "Hiện nay chỉ có khoảng 50 nghệ nhân múa rối nước chuyên nghiệp trên toàn quốc, đa số đều trên 60 tuổi.",
            tradition: "Nghề múa rối nước được truyền từ thầy sang trò theo dòng họ, mỗi gia đình nghề có những bí quyết riêng."
        },
        difficulty: 7
    }
};

// ===== STORY UNLOCK SYSTEM =====
class StoryManager {
    constructor() {
        this.unlockedStories = this.loadUnlockedStories();
    }

    loadUnlockedStories() {
        const saved = localStorage.getItem('waterPuppet_unlockedStories');
        return saved ? JSON.parse(saved) : [];
    }

    saveUnlockedStories() {
        localStorage.setItem('waterPuppet_unlockedStories', JSON.stringify(this.unlockedStories));
    }

    unlockStory(chapterNum) {
        if (!this.unlockedStories.includes(chapterNum)) {
            this.unlockedStories.push(chapterNum);
            chapters[chapterNum].story.isUnlocked = true;
            this.saveUnlockedStories();
            return true; // New story unlocked
        }
        return false; // Already unlocked
    }

    isStoryUnlocked(chapterNum) {
        return this.unlockedStories.includes(chapterNum);
    }

    getStoryContent(chapterNum) {
        if (this.isStoryUnlocked(chapterNum)) {
            return chapters[chapterNum].story.content;
        }
        return "🔒 Hoàn thành chương này để mở khóa cốt truyện!";
    }

    getAllUnlockedStories() {
        return this.unlockedStories.map(chapterNum => ({
            chapter: chapterNum,
            title: chapters[chapterNum].title,
            story: chapters[chapterNum].story.content,
            culturalContext: chapters[chapterNum].culturalContext,
            educationalContent: chapters[chapterNum].educationalContent
        }));
    }
}

// Global story manager instance
window.storyManager = new StoryManager();

// Initialize unlocked stories from localStorage
Object.keys(chapters).forEach(chapterNum => {
    const num = parseInt(chapterNum);
    if (window.storyManager.isStoryUnlocked(num)) {
        chapters[num].story.isUnlocked = true;
    }
});