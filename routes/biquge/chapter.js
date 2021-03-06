const axios = require('axios');
const cheerio = require('cheerio');
const config = require('../../config');
const iconv = require('iconv-lite');

const baseUrl = 'https://www.biquge5200.com/';
// 获取小说的最新章节列表
module.exports = async (ctx) => {
    const id = ctx.params.id; // 小说id

    const response = await axios({
        method: 'get',
        url: `${baseUrl}${id}/`,
        headers: {
            'User-Agent': config.ua,
            'Host':'www.biquge5200.com',
            'Referer': `${baseUrl}${id}/`
        },
        // responseEncoding: 'gbk', //该配置项在 0.18版本中没有打包进去
        responseType: 'arraybuffer'
    });
    const responseHtml = iconv.decode(response.data, 'GBK');
    // console.log('responseHtml',responseHtml);
    const $ = cheerio.load(responseHtml);
    const title = $('#list>dl>dt>b').eq(0).text();
    const description = $('#intro>p').eq(0).text();
    const cover_url = $('#fmimg>img').eq(0).attr('src');
    const list = $('dd', '#list>dl').slice(0, 9);
    const chapter_item = [];
    for (let i = 0; i < list.length; i++) {
        const el = $(list[i]).find('a').eq(0);
        const item = {
            title: el.text(),
            link: el.attr('href')
        };
        chapter_item.push(item);
    }
    // console.log('chapter_item',chapter_item)
    ctx.state.data = {
        title: `笔趣阁 ${title}`,
        link: `${baseUrl}${id}/`,
        image: cover_url,
        description: description,
        item: chapter_item,
    };
};
