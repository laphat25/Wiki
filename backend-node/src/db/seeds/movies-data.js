// ============================================
// db/seeds/movies-data.js — 43 Doraemon theatrical films
// ============================================

const BASE_MOVIES = [
  { id: 1, title_vi: 'Nobita và Khủng long', title_jp: 'のび太の恐竜', release_year: 1980, release_date: '15/03/1980', director: 'Tsutomu Shibayama' },
  { id: 2, title_vi: 'Nobita và Cuộc chiến vũ trụ', title_jp: 'のび太の宇宙開拓史', release_year: 1981, release_date: '14/03/1981', director: 'Tsutomu Shibayama' },
  { id: 3, title_vi: 'Nobita và Người khổng lồ', title_jp: 'のび太の大魔境', release_year: 1982, release_date: '13/03/1982', director: 'Tsutomu Shibayama' },
  { id: 4, title_vi: 'Nobita và Hải tặc biển khơi', title_jp: 'のび太の海底鬼岩城', release_year: 1983, release_date: '12/03/1983', director: 'Tsutomu Shibayama' },
  { id: 5, title_vi: 'Nobita và Lâu đài dưới đáy biển', title_jp: 'のび太の魔界大冒険', release_year: 1984, release_date: '17/03/1984', director: 'Tsutomu Shibayama' },
  { id: 6, title_vi: 'Nobita và Chuyến phiêu lưu vào lòng đất', title_jp: 'のび太の宇宙小戦争', release_year: 1985, release_date: '16/03/1985', director: 'Tsutomu Shibayama' },
  { id: 7, title_vi: 'Nobita và Thiết nhân binh đoàn', title_jp: 'のび太と鉄人兵団', release_year: 1986, release_date: '15/03/1986', director: 'Tsutomu Shibayama' },
  { id: 8, title_vi: 'Nobita và Hiệp sĩ rồng', title_jp: 'のび太と竜の騎士', release_year: 1987, release_date: '14/03/1987', director: 'Tsutomu Shibayama' },
  { id: 9, title_vi: 'Nobita và Những người khổng lồ dưới biển', title_jp: 'のび太のパラレル西遊記', release_year: 1988, release_date: '12/03/1988', director: 'Tsutomu Shibayama' },
  { id: 10, title_vi: 'Nobita và Vương quốc thú vật', title_jp: 'のび太の日本誕生', release_year: 1989, release_date: '11/03/1989', director: 'Tsutomu Shibayama' },
  { id: 11, title_vi: 'Nobita và Cuộc chiến vũ trụ nhỏ', title_jp: 'のび太とアニマル惑星', release_year: 1990, release_date: '10/03/1990', director: 'Tsutomu Shibayama' },
  { id: 12, title_vi: 'Nobita và thế giới lý tưởng', title_jp: 'のび太のドラビアンナイト', release_year: 1991, release_date: '09/03/1991', director: 'Tsutomu Shibayama' },
  { id: 13, title_vi: 'Nobita và Vương quốc mây', title_jp: 'のび太と雲の王国', release_year: 1992, release_date: '07/03/1992', director: 'Tsutomu Shibayama' },
  { id: 14, title_vi: 'Nobita và lâu đài tinh linh', title_jp: 'のび太とブリキの迷宮', release_year: 1993, release_date: '06/03/1993', director: 'Tsutomu Shibayama' },
  { id: 15, title_vi: 'Nobita và những người thợ may tương lai', title_jp: 'のび太と夢幻三剣士', release_year: 1994, release_date: '05/03/1994', director: 'Tsutomu Shibayama' },
  { id: 16, title_vi: 'Nobita phiêu lưu ký', title_jp: 'のび太の創世日記', release_year: 1995, release_date: '04/03/1995', director: 'Tsutomu Shibayama' },
  { id: 17, title_vi: 'Nobita và thiên hà siêu tốc', title_jp: 'のび太と銀河超特急', release_year: 1996, release_date: '02/03/1996', director: 'Tsutomu Shibayama' },
  { id: 18, title_vi: 'Nobita và vương quốc gió', title_jp: 'のび太のねじ巻き都市冒険記', release_year: 1997, release_date: '08/03/1997', director: 'Tsutomu Shibayama' },
  { id: 19, title_vi: 'Nobita và truyền thuyết vua mặt trời', title_jp: 'のび太の南海大冒険', release_year: 1998, release_date: '07/03/1998', director: 'Tsutomu Shibayama' },
  { id: 20, title_vi: 'Nobita khám phá vũ trụ', title_jp: 'のび太の宇宙漂流記', release_year: 1999, release_date: '06/03/1999', director: 'Tsutomu Shibayama' },
  { id: 21, title_vi: 'Nobita và cuộc chiến vũ trụ tí hon', title_jp: 'のび太の太陽王伝説', release_year: 2000, release_date: '11/03/2000', director: 'Tsutomu Shibayama' },
  { id: 22, title_vi: 'Nobita và đại thủy tặc biển khơi', title_jp: 'のび太とロボット王国', release_year: 2001, release_date: '10/03/2001', director: 'Tsutomu Shibayama' },
  { id: 23, title_vi: 'Nobita và xứ sở người tuyết', title_jp: 'のび太とふしぎ風使い', release_year: 2002, release_date: '09/03/2002', director: 'Tsutomu Shibayama' },
  { id: 24, title_vi: 'Nobita và người khổng lồ mặt trăng', title_jp: 'のび太とアパッチ野球軍', release_year: 2003, release_date: '08/03/2003', director: 'Tsutomu Shibayama' },
  { id: 25, title_vi: 'Nobita khám phá xứ sở diệu kỳ', title_jp: 'のび太のワンニャン時空伝', release_year: 2004, release_date: '06/03/2004', director: 'Tsutomu Shibayama' },
  { id: 26, title_vi: 'Nobita và Vương quốc người máy', title_jp: 'のび太の恐竜2006', release_year: 2006, release_date: '04/03/2006', director: 'Kozo Kusuba' },
  { id: 27, title_vi: 'Nobita và vùng đất lý tưởng', title_jp: 'のび太の新魔界大冒険~7人の魔法使い~', release_year: 2007, release_date: '10/03/2007', director: 'Kozo Kusuba' },
  { id: 28, title_vi: 'Nobita và sự tích nguyên thủy', title_jp: 'のび太と緑の巨人伝', release_year: 2008, release_date: '08/03/2008', director: 'Kozo Kusuba' },
  { id: 29, title_vi: 'Nobita và người khổng lồ xanh', title_jp: '新・のび太の宇宙開拓史', release_year: 2009, release_date: '07/03/2009', director: 'Kozo Kusuba' },
  { id: 30, title_vi: 'Nobita và thiết nhân binh đoàn', title_jp: 'のび太の人魚大海戦', release_year: 2010, release_date: '06/03/2010', director: 'Kozo Kusuba' },
  { id: 31, title_vi: 'Nobita và thiết nhân binh đoàn (mới)', title_jp: '新・のび太と鉄人兵団〜はばたけ 天使たち〜', release_year: 2011, release_date: '05/03/2011', director: 'Kozo Kusuba' },
  { id: 32, title_vi: 'Nobita và nước Nhật thời nguyên thủy', title_jp: 'のび太と奇跡の島〜アニマル アドベンチャー〜', release_year: 2012, release_date: '03/03/2012', director: 'Kozo Kusuba' },
  { id: 33, title_vi: 'Nobita trong thế giới bí mật nhiều kỳ diệu', title_jp: 'のび太のひみつ道具博物館', release_year: 2013, release_date: '09/03/2013', director: 'Kozo Kusuba' },
  { id: 34, title_vi: 'Nobita và vương quốc trăng mới', title_jp: '新・のび太の大魔境〜ペコと5人の探検隊〜', release_year: 2014, release_date: '08/03/2014', director: 'Yoshio Takeuchi' },
  { id: 35, title_vi: 'Nobita và hành tinh thú', title_jp: 'のび太の宇宙英雄記', release_year: 2015, release_date: '07/03/2015', director: 'Yoshio Takeuchi' },
  { id: 36, title_vi: 'Nobita và nước Nhật thời nguyên thủy (Remake)', title_jp: '新・のび太の日本誕生', release_year: 2016, release_date: '05/03/2016', director: 'Yoshio Takeuchi' },
  { id: 37, title_vi: 'Nobita và chuyến phiêu lưu Nam cực Kachi Kochi', title_jp: 'のび太の南極カチコチ大冒険', release_year: 2017, release_date: '04/03/2017', director: 'Yoshio Takeuchi' },
  { id: 38, title_vi: 'Nobita và đảo giấu vàng', title_jp: 'のび太の宝島', release_year: 2018, release_date: '03/03/2018', director: 'Kazuaki Imai' },
  { id: 39, title_vi: 'Nobita và mặt trăng phiêu lưu ký', title_jp: 'のび太の月面探査記', release_year: 2019, release_date: '01/03/2019', director: 'Kazuaki Imai' },
  { id: 40, title_vi: 'Nobita và những bạn khủng long mới', title_jp: 'のび太の新恐竜', release_year: 2020, release_date: '07/08/2020', director: 'Kazuaki Imai' },
  { id: 41, title_vi: 'Nobita và cuộc chiến vũ trụ tí hon 2021', title_jp: 'のび太の宇宙小戦争2021', release_year: 2022, release_date: '04/03/2022', director: 'Shinnosuke Yakuwa' },
  { id: 42, title_vi: 'Nobita và vùng đất lý tưởng trên bầu trời', title_jp: 'のび太と空の理想郷', release_year: 2023, release_date: '03/03/2023', director: 'Takumi Dohi' },
  { id: 43, title_vi: 'Nobita và bản giao hưởng Địa Cầu', title_jp: 'のび太の地球交響楽', release_year: 2024, release_date: '01/03/2024', director: 'Yukiyo Teramoto' },
];

const FEATURED_IDS = new Set([1, 5, 10, 26, 38, 43]);

const EXTRA = {
  1:  { trailer_url: null, wiki_url: 'https://en.wikipedia.org/wiki/Doraemon:_Nobita%27s_Dinosaur', plot: 'Nobita tìm thấy trứng khủng long và cùng Doraemon nuôi dưỡng Piisuke. Khi Piisuke trở về thời đại của mình, nhóm bạn vượt qua nhiều hiểm nguy để đưa cậu về đúng thời điểm.', box_office: '¥1.66 tỷ' },
  38: { trailer_url: 'xMEDN7jLTpU', wiki_url: 'https://en.wikipedia.org/wiki/Doraemon:_Nobita%27s_Treasure_Island', streaming_url: 'https://www.bilibili.tv/vi', plot: 'Nobita lập đội hải tặc và dấn thân vào hòn đảo kho báu bí ẩn, nơi anh gặp Fio và phát hiện âm mưu đe dọa hành tinh.', box_office: '¥4.83 tỷ' },
  39: { trailer_url: 'V0mKFGVnN0A', wiki_url: 'https://en.wikipedia.org/wiki/Doraemon:_Nobita%27s_Chronicle_of_the_Moon_Exploration', plot: 'Nobita khám phá mặt trăng bằng bảo bối và gặp Lucis — mở ra bí mật về nền văn minh ẩn giấu phía sau vẻ đẹp của Mặt Trăng.', box_office: '¥4.02 tỷ' },
  40: { trailer_url: 'qOW-fJJm_GU', wiki_url: 'https://en.wikipedia.org/wiki/Doraemon:_Nobita%27s_New_Dinosaur', plot: 'Nobita nuôi hai khủng long song sinh và cùng chúng phiêu lưu qua thời gian để bảo vệ sự sống trước thảm họa diệt vong.', box_office: '¥3.35 tỷ' },
  41: { trailer_url: 'GgDrE1_9yJM', wiki_url: 'https://en.wikipedia.org/wiki/Doraemon:_Nobita%27s_Little_Star_Wars_2021', plot: 'Phiên bản làm lại năm 2022: Nobita và Papi — hoàng tử hành tinh tí hon — đối đầu với quân đội tàn bạo đe dọa hòa bình vũ trụ.', box_office: '¥2.60 tỷ' },
  42: { trailer_url: 'pT-3IgCNgHE', wiki_url: 'https://en.wikipedia.org/wiki/Doraemon:_Nobita%27s_Sky_Utopia', plot: 'Nhóm bạn bay lên thành phố trên mây Parapara, nơi được quảng cáo là thiên đường lý tưởng nhưng ẩn chứa sự thật đáng sợ.', box_office: '¥3.52 tỷ' },
  43: { trailer_url: 'N8lB6UX0IDo', wiki_url: 'https://en.wikipedia.org/wiki/Doraemon:_Nobita%27s_Earth_Symphony', plot: 'Âm nhạc trên Trái Đất biến mất. Nobita và Doraemon hợp tác với Miria để khôi phục giai điệu và cứu hành tinh khỏi sự im lặng.', box_office: '¥3.58 tỷ' },
};

function buildPlot(movie) {
  return `Năm ${movie.release_year}, ${movie.title_vi} đưa Nobita, Doraemon và các bạn vào một cuộc phiêu lưu đầy cảm xúc dưới bàn tay đạo diễn ${movie.director}. Họ phải vượt qua thử thách, học cách đoàn kết và bảo vệ những người mình yêu thương.`;
}

function estimateBoxOffice(year) {
  if (year >= 2018) return '¥3.0–5.0 tỷ';
  if (year >= 2010) return '¥2.5–4.5 tỷ';
  if (year >= 2000) return '¥2.0–3.5 tỷ';
  if (year >= 1990) return '¥1.5–2.5 tỷ';
  return '¥1.0–2.0 tỷ';
}

function getMoviesSeedData() {
  return BASE_MOVIES.map((m) => {
    const extra = EXTRA[m.id] || {};
    return {
      ...m,
      plot: extra.plot || buildPlot(m),
      box_office: extra.box_office || estimateBoxOffice(m.release_year),
      image_url: '/assets/images/movies/poster.svg',
      trailer_url: extra.trailer_url ?? null,
      wiki_url: extra.wiki_url ?? null,
      streaming_url: extra.streaming_url ?? null,
      theme_song: `Nhạc phim ${m.title_vi}`,
      is_featured: FEATURED_IDS.has(m.id) ? 1 : 0,
    };
  });
}

module.exports = { getMoviesSeedData, BASE_MOVIES, FEATURED_IDS };
