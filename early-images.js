// 传世画像、原始文物与相关地点的现代照片。
const earlyImageRecords = {
  "618": {
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/44/TangGaozu.jpg/500px-TangGaozu.jpg",
    "caption": "《唐高祖立像》｜后世传世画像，台北故宫博物院藏",
    "credit": "https://commons.wikimedia.org/wiki/File:TangGaozu.jpg",
    "position": "center 27%"
  },
  "626": {
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/b/b6/TangTaizongP.jpg/500px-TangTaizongP.jpg",
    "caption": "《唐太宗半身像》｜明代传世画像，台北故宫博物院藏",
    "credit": "https://commons.wikimedia.org/wiki/File:TangTaizongP.jpg",
    "position": "center 32%"
  },
  "645": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/b/b6/Portrait_of_Xuanzang_%28Genj%C5%8D%29_with_Attendant_MET_DP-15580-007.jpg",
    "caption": "《玄奘与侍从像》｜14 世纪日本绘本，纽约大都会艺术博物馆藏",
    "credit": "https://commons.wikimedia.org/wiki/File:Portrait_of_Xuanzang_(Genj%25C5%258D)_with_Attendant_MET_DP-15580-007.jpg",
    "position": "center 34%"
  },
  "690": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/8/83/Wuhou_%282%29.jpg",
    "caption": "武则天像｜18 世纪帝王画像册，大英图书馆藏",
    "credit": "https://commons.wikimedia.org/wiki/File:Wuhou_(2).jpg",
    "position": "center 37%"
  },
  "713": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/5/5a/%E6%9D%8E%E9%9A%86%E5%9F%BA%E5%83%8F.jpg",
    "caption": "李隆基像｜明人绘唐玄宗，见《中国历代名人画像谱》",
    "credit": "https://commons.wikimedia.org/wiki/File:%E6%9D%8E%E9%9A%86%E5%9F%BA%E5%83%8F.jpg",
    "position": "center 35%"
  },
  "723": {
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/87/Tang_Dynasty_musicians_on_camel%2C_723_ad.jpg/960px-Tang_Dynasty_musicians_on_camel%2C_723_ad.jpg",
    "caption": "三彩釉陶骆驼载乐俑｜唐代文物，Gary Todd 摄（CC0）",
    "credit": "https://commons.wikimedia.org/wiki/File:Tang_Dynasty_musicians_on_camel%2C_723_ad.jpg",
    "position": "center 38%"
  },
  "755": {
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/42/%E5%94%90%E9%A1%8F%E7%9C%9F%E5%8D%BF%E7%A5%AD%E5%A7%AA%E6%96%87%E7%A8%BF_%E5%8D%B7.png/960px-%E5%94%90%E9%A1%8F%E7%9C%9F%E5%8D%BF%E7%A5%AD%E5%A7%AA%E6%96%87%E7%A8%BF_%E5%8D%B7.png",
    "caption": "颜真卿《祭侄文稿》｜758 年所作，悼念安史之乱中遇难的颜季明，台北故宫博物院藏",
    "credit": "https://commons.wikimedia.org/wiki/File:%E5%94%90%E9%A1%8F%E7%9C%9F%E5%8D%BF%E7%A5%AD%E5%A7%AA%E6%96%87%E7%A8%BF_%E5%8D%B7.png",
    "position": "center"
  },
  "960": {
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/9/90/Song_Taizu.jpg/960px-Song_Taizu.jpg",
    "caption": "《宋太祖坐像》｜传世宫廷画像，台北故宫博物院藏",
    "credit": "https://commons.wikimedia.org/wiki/File:Song_Taizu.jpg",
    "position": "center 30%"
  },
  "1069": {
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/4/4a/Wang_Anshi.jpg/960px-Wang_Anshi.jpg",
    "caption": "王安石像｜后世所绘的王安石画像",
    "credit": "https://commons.wikimedia.org/wiki/File:Wang_Anshi.jpg",
    "position": "center 34%"
  },
  "1127": {
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/01/Gaozong_Of_Song.jpg/960px-Gaozong_Of_Song.jpg",
    "caption": "《宋高宗坐像》｜传世宫廷画像，台北故宫博物院藏",
    "credit": "https://commons.wikimedia.org/wiki/File:Gaozong_Of_Song.jpg",
    "position": "center 31%"
  },
  "1206": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/6/6d/Genghis_khan.jpg",
    "caption": "《元太祖像》局部｜传世成吉思汗画像，台北故宫博物院藏",
    "credit": "https://commons.wikimedia.org/wiki/File:Genghis_khan.jpg",
    "position": "center 36%"
  },
  "1271": {
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/1/1b/YuanEmperorAlbumKhubilaiPortrait.jpg/960px-YuanEmperorAlbumKhubilaiPortrait.jpg",
    "caption": "《元世祖像》｜元代忽必烈画像，台北故宫博物院藏",
    "credit": "https://commons.wikimedia.org/wiki/File:YuanEmperorAlbumKhubilaiPortrait.jpg",
    "position": "center 36%"
  },
  "1291": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/8/89/Song_Dynasty_Ancient_Ship_of_Quanzhou_Bay_20061229.jpg",
    "caption": "泉州湾宋代古船｜后渚港出土的宋代商船，meckleychina 摄（CC BY 2.0）",
    "credit": "https://commons.wikimedia.org/wiki/File:Song_Dynasty_Ancient_Ship_of_Quanzhou_Bay_20061229.jpg",
    "position": "center 48%"
  },
  "1368": {
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/0/00/A_Seated_Portrait_of_Ming_Emperor_Taizu.jpg/960px-A_Seated_Portrait_of_Ming_Emperor_Taizu.jpg",
    "caption": "《明太祖坐像》｜明代朱元璋画像，台北故宫博物院藏",
    "credit": "https://commons.wikimedia.org/wiki/File:A_Seated_Portrait_of_Ming_Emperor_Taizu.jpg",
    "position": "center 27%"
  },
  "1405": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/1/10/Zhenghe-sailing-chart.gif",
    "caption": "《郑和航海图》印度洋段｜明代航海图，见 1628 年《武备志》刊本",
    "credit": "https://commons.wikimedia.org/wiki/File:Zhenghe-sailing-chart.gif",
    "position": "center"
  },
  "1408": {
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/c/c5/Page_from_the_%27Great_encyclopaedia_of_the_Yongle_Reign%27_%28Yongle_dadian%29_%28CBL_C_1751%2C_f.34v%29.jpg/960px-Page_from_the_%27Great_encyclopaedia_of_the_Yongle_Reign%27_%28Yongle_dadian%29_%28CBL_C_1751%2C_f.34v%29.jpg",
    "caption": "《永乐大典》书页｜明嘉靖副本，爱尔兰切斯特·比蒂图书馆藏",
    "credit": "https://commons.wikimedia.org/wiki/File:Page_from_the_'Great_encyclopaedia_of_the_Yongle_Reign'_(Yongle_dadian)_(CBL_C_1751%2C_f.34v).jpg",
    "position": "center"
  },
  "1420": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Hall_of_Supreme_Harmony_Forbidden_City.jpg",
    "caption": "紫禁城太和殿｜现存主体为清代重建，Radosław Botev 摄（CC BY 3.0 PL）",
    "credit": "https://commons.wikimedia.org/wiki/File:Hall_of_Supreme_Harmony_Forbidden_City.jpg",
    "position": "center"
  },
  "1449": {
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/e/e6/Ming_Yingzong_%281%29.jpg/960px-Ming_Yingzong_%281%29.jpg",
    "caption": "《明英宗坐像》｜明代宫廷画像，所绘为土木之变时在位的朱祁镇",
    "credit": "https://commons.wikimedia.org/wiki/File:Ming_Yingzong_(1).jpg",
    "position": "center 32%"
  },
  "1637": {
    "url": "https://thumb.wikimedia.org/wikipedia/commons/thumb/8/89/ZHSY100082_%E5%A4%A9%E5%B7%A5%E9%96%8B%E7%89%A9_%E6%98%8E%E5%AE%8B%E6%87%89%E6%98%9F%E8%91%97_%E6%98%8E%E5%B4%87%E7%A6%8E%E5%8D%81%E5%B9%B4%E8%87%AA%E5%88%BB%E6%9C%AC.pdf/page1-960px-ZHSY100082_%E5%A4%A9%E5%B7%A5%E9%96%8B%E7%89%A9_%E6%98%8E%E5%AE%8B%E6%87%89%E6%98%9F%E8%91%97_%E6%98%8E%E5%B4%87%E7%A6%8E%E5%8D%81%E5%B9%B4%E8%87%AA%E5%88%BB%E6%9C%AC.pdf.jpg",
    "caption": "宋应星《天工开物》｜明崇祯十年（1637 年）自刻本书影",
    "credit": "https://commons.wikimedia.org/wiki/File:ZHSY100082_%E5%A4%A9%E5%B7%A5%E9%96%8B%E7%89%A9_%E6%98%8E%E5%AE%8B%E6%87%89%E6%98%9F%E8%91%97_%E6%98%8E%E5%B4%87%E7%A6%8E%E5%8D%81%E5%B9%B4%E8%87%AA%E5%88%BB%E6%9C%AC.pdf",
    "position": "center"
  },
  "1644": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/f/f5/First_Pass_Under_Heaven_%E5%A4%A9%E4%B8%8B%E7%AC%AC%E4%B8%80%E5%85%B3_%286234530972%29.jpg",
    "caption": "山海关“天下第一关”城楼｜现代照片，Caitriana Nicholson 摄（CC BY-SA 2.0）",
    "credit": "https://commons.wikimedia.org/wiki/File:First_Pass_Under_Heaven_%E5%A4%A9%E4%B8%8B%E7%AC%AC%E4%B8%80%E5%85%B3_(6234530972).jpg",
    "position": "center"
  },
  "1683": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/2/24/%E5%BA%B7%E7%86%99%E8%87%BA%E7%81%A3%E8%BC%BF%E5%9C%96.jpg",
    "caption": "《康熙台湾舆图》局部｜清初绘制的台湾历史地图，国立台湾博物馆藏",
    "credit": "https://commons.wikimedia.org/wiki/File:%E5%BA%B7%E7%86%99%E8%87%BA%E7%81%A3%E8%BC%BF%E5%9C%96.jpg",
    "position": "center"
  },
  "1793": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/7/79/The_reception_of_the_diplomatique_%26_his_suite%2C_at_the_court_of_Pekin_%28BM_1868%2C0808.6228%29.jpg",
    "caption": "马戛尔尼使团题材的 1792 年讽刺版画｜詹姆斯·吉尔雷绘，大英博物馆藏",
    "credit": "https://commons.wikimedia.org/wiki/File:The_reception_of_the_diplomatique_%26_his_suite%2C_at_the_court_of_Pekin_(BM_1868%2C0808.6228).jpg",
    "position": "center"
  },
  "1279-2": {
    "url": "https://upload.wikimedia.org/wikipedia/commons/f/f6/Dengfeng_Observatory.jpg",
    "caption": "登封观星台｜元代天文遗存，现代照片，takwing.kwong 摄（CC BY-SA 2.0）",
    "credit": "https://commons.wikimedia.org/wiki/File:Dengfeng_Observatory.jpg",
    "position": "center 48%"
  }
};
