console.log('Startms:' + new Date().getTime())
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as dotenv from 'dotenv';
import { KBotify } from '..';
dotenv.config();
// mod .env-template file
export const bot = new KBotify({
    mode: 'websocket',
    port: parseInt(process.env.KPORT!),
    token: process.env.TOKEN!,
    verifyToken: process.env.VERIFY,
    key: process.env.KEY,
    ignoreDecryptError: false,
    debug: false,
});
export const pars = {
    head: 9,
    tail: 64
}
async function send(itm: number) {
    list[itm].card = await getall(itm)
    //console.log(JSON.stringify(list[itm].card))
    bot.API.message.update(list[itm].msgid, JSON.stringify(list[itm].card));
    //bot.API.message.create(10, "2408081738284872", list[itm].card);
}
import { echoMenu } from 'commands/echo/echo.menu';
import { echoKmd } from 'commands/echo/echo.kmd.app';
import { testMenu } from 'commands/test/test.menu';
import { r6Menu } from 'commands/r6/r6.menu';
import { r6Active } from '../commands/r6/r6.active.app';
import { r6Applyrole } from '../commands/r6/r6.applyrole.app';
import { r6Record } from '../commands/r6/r6.record.app';
import { r6Search } from '../commands/r6/r6.search.app';
import { r6Team } from '../commands/r6/r6.team.app';
import { apexMenu } from '../commands/apex/apex.menu';
import { r6Revokerole } from '../commands/r6/r6.revokerole.app';
import { r6Announce } from '../commands/r6/r6.announce.app';
/*
import { kBotifyLogger } from 'core/logger';
import Application from 'koa';
import { AttachmentBase } from 'kaiheila-bot-root';
import { resolveLevel } from 'bunyan';
*/
bot.addCommands(echoMenu, echoKmd, testMenu, r6Menu);
bot.addCommands(apexMenu);
bot.connect();
bot.addAlias(r6Menu, "菜单");
bot.addAlias(r6Search, "查询");
bot.addAlias(r6Record, "记录");
bot.addAlias(r6Record, "绑定");
bot.addAlias(r6Applyrole, "申请角色");
bot.addAlias(r6Revokerole, "撤销角色");
bot.addAlias(r6Team, "组队");
bot.addAlias(r6Active, "激活");
bot.addAlias(r6Announce, "公告");
bot.logger.debug('system init success');
var https = require('https');
var mysql = require('mysql');
var tabname = 'usrlib';
var url = "https://r6.tracker.network/profile/pc/";
var list = [{
    chnname: 'DOC',
    chnid: 8574655462452796,
    userid: ['', '', '', '', ''],
    msgid: 'a6c80cd1-be62-401b-b83f-aef234762867',
    card: ''
}, {
    chnname: 'FUZE',
    chnid: 7228978838660995,
    userid: ['', '', '', '', ''],
    msgid: '7596e222-1c34-4f23-acf0-2aa14014e4f6',
    card: ''
}, {
    chnname: 'ROOK',
    chnid: 8666873622418147,
    userid: ['', '', '', '', ''],
    msgid: '54ce872a-5ce1-4af3-affb-74b138dc24ce',
    card: ''
}, {
    chnname: 'MUTE',
    chnid: 3671071360478648,
    userid: ['', '', '', '', ''],
    msgid: 'ac701ca6-e650-4556-a407-603172d31288',
    card: ''
}, {
    chnname: 'ORYX',
    chnid: 8099740112545843,
    userid: ['', '', '', '', ''],
    msgid: '5d64a9f8-ff2e-41e0-8a97-507a90cf5053',
    card: ''
}, {
    chnname: 'JAGER',
    chnid: 9853214616287407,
    userid: ['', '', '', '', ''],
    msgid: 'ee472f52-f5a3-47bd-a395-e96e99d21ff4',
    card: ''
}, {
    chnname: 'SLEDGE',
    chnid: 4522198069417620,
    userid: ['', '', '', '', ''],
    msgid: '34c0ccc8-4092-4ee6-be43-0354b678a8cd',
    card: ''
}, {
    chnname: 'WAMAI',
    chnid: 1505924438841986,
    userid: ['', '', '', '', ''],
    msgid: '51bc3fd8-cb52-44a8-8533-d6f3b9f2f52b',
    card: ''
}, {
    chnname: 'TWITCH',
    chnid: 7769514269829865,
    userid: ['', '', '', '', ''],
    msgid: '1312d0b8-25d6-4e19-abfe-55577738ba60',
    card: ''
}, {
    chnname: 'MOZZIE',
    chnid: 2494099237896157,
    userid: ['', '', '', '', ''],
    msgid: '678d38d4-9b7b-4a2d-846e-4621a756f0c4',
    card: ''
}, {
    chnname: 'HIBANA',
    chnid: 3205552061241304,
    userid: ['', '', '', '', ''],
    msgid: '38421844-f17b-484a-b6e4-e0d79c99320d',
    card: ''
}];
export var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '20060926Abc',
    database: 'bot_db'
});
bot.message.on('buttonEvent', (event) => {
    for (var i = 0; i < Object.keys(list).length; i++)
        if (event.content == list[i].chnname)
            break;
    bot.API.channel.moveUser(String(list[i].chnid), [event.userId])
})
async function getif(r6id: string) {
    return new Promise<boolean>(async (resolve, reject) => {
        var urln = url + r6id;
        https.get(urln, function (res: any) {
            var html: string = '';
            res.on('data', function (data: any) {
                html += data;
            });
            res.on('end', function () {
                if (html.indexOf("RankedKDRatio") !== -1)
                    resolve(true)
                else
                    resolve(false)
            })
        })
    })
}
bot.message.on('text', async (message) => {
    if (message.type == 1 && message.channelId == '1459838591677870' && !new RegExp("[\\u4E00-\\u9FFF]+", "g").test(message.content)) {
        if (await getif(message.content))
            recordid(message.authorId, message.content);
        function recordid(id: string, r6id: string) {
            var exp = 'INSERT INTO ' + tabname + '(id,r6id,sel) VALUES("' + id + '","' + r6id + '",1)'
            connection.query(exp, function (err: any) {
                if (err) {
                    exp = 'UPDATE ' + tabname + ' SET r6id=\'' + r6id + '\'WHERE id=' + id;
                    connection.query(exp, function (err: any) {
                        if (err) {
                            var tmstp = new Date().getTime()
                            console.log('[INSERT ERROR] - ', err.message, ' [ID] - ', tmstp);
                            bot.API.message.create(1, message.channelId, '[INSERT ERROR] - [ID] - ' + tmstp);
                        }
                        else {
                            bot.API.message.create(1, message.channelId, '查询到此ID并换绑：' + r6id, '', message.authorId);
                            updateList(id)

                        }
                    })
                }
                else {
                    bot.API.message.create(1, message.channelId, '查询到此ID并绑定：' + r6id, '', message.authorId);
                    updateList(id)
                }
            })
        }
    }
})
function updateList(id: string) {
    for (let i = 0; i < Object.keys(list).length; i++) {
        for (let j = 0; j < 5; j++) {
            if (list[i].userid[j] == id) {
                send(i);
                return;
            }
        }
    }
}
async function searchid(id: string) {
    return new Promise<any>(async (resolve, reject) => {
        var exp = 'SELECT r6id FROM ' + tabname + ' WHERE id=' + id;
        connection.query(exp, function (err: any, result: any) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
            }
            else if (result[0])
                resolve(result[0].r6id);
            else resolve(null)
        });
    });
}
async function getall(itm: number) {
    var avmmr: number = 0, xmmr: number = 0, nmmr: number = 9999, num: number = 0, tmp: number = 0;
    var rankable: boolean;
    return new Promise<any | void>(async (resolve) => {
        for (let usrid of list[itm].userid)
            if (usrid != '' && await searchid(usrid) != null)
                num++
        if (num == 0) {
            resolve([
                {
                    "type": "card",
                    "theme": "secondary",
                    "size": "lg",
                    "modules": [
                        {
                            "type": "section",
                            "text": {
                                "type": "kmarkdown",
                                "content": "**" + list[itm].chnname + "频道无人**"
                            }
                        }
                    ]
                }
            ])
            return;
        }
        var cardbind: string = '[';
        for (let usrid of list[itm].userid) {
            if (usrid != '') {
                var r6id = await searchid(usrid);
                if (r6id != null) {
                    tmp++;
                    var cardstr = JSON.stringify(await get(r6id, tmp));
                    cardbind = cardbind + cardstr.substring(1, cardstr.length - 1) + ',';
                }
            }
        }
        cardbind = cardbind.substring(0, cardbind.length - 1) + ']';
        resolve(JSON.parse(cardbind));
    })
    async function get(r6id: string, first: number) {
        return new Promise<object>(async (resolve, reject) => {
            var urln = url + r6id + '/';
            https.get(urln, function (res: any) {
                var html: string = '';
                res.on('data', function (data: any) {
                    html += data;
                });
                res.on('end', function () {
                    if (html.indexOf("RankedKDRatio") !== -1) {
                        html = html.replace(/\n/g, '');
                        var mmr = html.match('<div class="trn-defstat__name">MMR</div><div class="trn-defstat__value">(.*?)</div>')[1].replace(',', '');
                        var rank = html.match('<div class="trn-defstat__name">Rank</div><div class="trn-defstat__value">(.*?)</div>')[1];
                        var kd = html.match('<div class="trn-defstat__value" data-stat="RankedKDRatio">(.*?)</div>')[1];
                        var imglink = '';//session.user.avatar
                        var namer = html.match('R6Tracker - (.*?) -  Rainbow Six Siege Player Stats')[1];
                        var arg1 = namer;
                        var arg2 = mmr;
                        var arg3 = rank.replace(' ', '');
                        var arg4 = kd;
                        var arg6 = '#B2B6BB';
                        var rankcn;
                        if (rank.search(/COPPER/) === 0) { arg6 = "#B30B0D"; rankcn = "紫铜"; arg3 = arg3.replace('COPPER', ''); }
                        if (rank.search(/BRONZE/) === 0) { arg6 = "#C98B3B"; rankcn = "青铜"; arg3 = arg3.replace('BRONZE', ''); }
                        if (rank.search(/SILVER/) === 0) { arg6 = "#B0B0B0"; rankcn = "白银"; arg3 = arg3.replace('SILVER', ''); }
                        if (rank.search(/GOLD/) === 0) { arg6 = "#EED01E"; rankcn = "黄金"; arg3 = arg3.replace('GOLD', ''); }
                        if (rank.search(/PLATINUM/) === 0) { arg6 = "#5BB9B3"; rankcn = "白金"; arg3 = arg3.replace('PLATINUM', ''); }
                        if (rank.search(/DIAMOND/) === 0) { arg6 = "#BD9FF6"; rankcn = "钻石"; arg3 = arg3.replace('DIAMOND', ''); }
                        if (rank.search(/CHAMPION/) === 0) { arg6 = "#9D385C"; rankcn = "冠军"; arg3 = arg3.replace('CHAMPION', ''); }
                        if (rank.search(/-/) === 0) { arg6 = "#B2B6BB"; arg3 = "未定级"; }
                        if (arg3 === 'I') arg3 = rankcn += '1';
                        if (arg3 === 'II') arg3 = rankcn + '2';
                        if (arg3 === 'III') arg3 = rankcn + '3';
                        if (arg3 === 'IV') arg3 = rankcn + '4';
                        if (arg3 === 'V') arg3 = rankcn + '5';
                        var immr = parseInt(mmr)
                        avmmr += immr;
                        if (xmmr < immr) xmmr = immr;
                        if (nmmr > immr) nmmr = immr;
                        if (xmmr - nmmr <= 1000)
                            rankable = true;
                        else rankable = false;
                        if (first == 1)
                            var card: object = [{
                                "type": "card", "theme": "secondary", "color": arg6, "size": "lg",
                                "modules": [{
                                    "type": "section",
                                    "text": {
                                        "type": "kmarkdown",
                                        "content": "**频道：" + list[itm].chnname + "**"
                                    }
                                },
                                {
                                    "type": "divider"
                                }, {
                                    "type": "section",
                                    "text": { "type": "kmarkdown", "content": "**" + arg1 + "**" }, "mode": "left"
                                }, {
                                    "type": "section", "text": {
                                        "type": "paragraph",
                                        "cols": 3, "fields": [{
                                            "type": "kmarkdown", "content": "**MMR**\n" + arg2
                                        },
                                        { "type": "kmarkdown", "content": "**段位**\n" + arg3 },
                                        { "type": "kmarkdown", "content": "**赛季KD**\n" + arg4 }]
                                    }
                                }]
                            }]
                        else if (first == num)
                            var card: object = [{
                                "type": "card", "theme": "secondary", "color": arg6, "size": "lg", "modules": [
                                    {
                                        "type": "section",
                                        "text": { "type": "kmarkdown", "content": "**" + arg1 + "**" }, "mode": "left"
                                    }, {
                                        "type": "section", "text": {
                                            "type": "paragraph",
                                            "cols": 3, "fields": [{
                                                "type": "kmarkdown", "content": "**MMR**\n" + arg2
                                            },
                                            { "type": "kmarkdown", "content": "**段位**\n" + arg3 },
                                            { "type": "kmarkdown", "content": "**赛季KD**\n" + arg4 }]
                                        }
                                    }, {
                                        "type": "divider"
                                    }, {
                                        "type": "section",
                                        "text": {
                                            "type": "plain-text",
                                            "content": "Average MMR:" + avmmr / num
                                        }
                                    },
                                    {
                                        "type": "section",
                                        "text": {
                                            "type": "plain-text",
                                            "content": "MMR Max Difference:" + (xmmr - nmmr)
                                        }
                                    },
                                    {
                                        "type": "section",
                                        "text": {
                                            "type": "plain-text",
                                            "content": "是否可以排位：" + rankable
                                        }
                                    }]
                            }]
                        else
                            var card: object = [{
                                "type": "card", "theme": "secondary", "color": arg6, "size": "lg", "modules": [
                                    {
                                        "type": "section",
                                        "text": { "type": "kmarkdown", "content": "**" + arg1 + "**" }, "mode": "left"
                                    }, {
                                        "type": "section", "text": {
                                            "type": "paragraph",
                                            "cols": 3, "fields": [{
                                                "type": "kmarkdown", "content": "**MMR**\n" + arg2
                                            },
                                            { "type": "kmarkdown", "content": "**段位**\n" + arg3 },
                                            { "type": "kmarkdown", "content": "**赛季KD**\n" + arg4 }]
                                        }
                                    }]
                            }]
                        resolve(card);
                    }
                });
            })

        })
    }
}

async function writeList(chnid: number, id: string) {
    return new Promise<void>((resolve, reject) => {
        for (let i = 0; i < Object.keys(list).length; i++) {
            if (list[i].chnid == chnid) {
                for (let j = 0; j < 5; j++) {
                    if (list[i].userid[j] == '') {
                        list[i].userid[j] = id;
                        resolve();
                        break;
                    }
                }
            }
        }
    })
}
async function deleteList(chnid: number, id: string) {
    return new Promise<void>((resolve, reject) => {
        for (var i = 0; i < Object.keys(list).length; i++) {
            if (list[i].chnid == chnid) {
                for (var j = 0; j < 5; j++) {
                    if (list[i].userid[j] == id) {
                        list[i].userid[j] = '';
                        resolve();
                        break;
                    }
                }
            }
        }
    })
}
bot.event.on('system', async (event) => {
    if (event.type == 'joined_channel') {
        writeList(event.body.channel_id, event.body.user_id)
        for (var i = 0; i < Object.keys(list).length; i++) {
            if (list[i].chnid == event.body.channel_id) {
                send(i);
                break;
            }
        }
    }
    if (event.type == 'exited_channel') {
        deleteList(event.body.channel_id, event.body.user_id);
        for (var i = 0; i < Object.keys(list).length; i++) {
            if (list[i].chnid == event.body.channel_id) {
                send(i);
                break;
            }
        }
    }
})

async function getJson() {
    return new Promise<object | void>(async (resolve, reject) => {
        let data = '',
            json_data: any;
        let req = https.get("https://www.kaiheila.cn/api/guilds/3128617072930683/widget.json", function (res: any) {
            res.on('data', function (stream: any) {
                data += stream;
            });
            res.on('end', function () {
                json_data = JSON.parse(data);
                resolve(json_data);
            });
        });
    });
}
async function def() {
    var json: any = await getJson()
    for (let i = 0; i < Object.keys(list).length; i++) {
        var tmp: string = JSON.stringify(list[i].userid);
        for (let j = 0; j < Object.keys(json.channels).length; j++)
            if (list[i].chnid == json.channels[j].id) {
                if (json.channels[j].users)
                    for (let k = 0; k < 5; k++) {
                        if (k < Object.keys(json.channels[j].users).length)
                            list[i].userid[k] = json.channels[j].users[k].id;
                        else
                            list[i].userid[k] = '';
                    }
                break;
            }
        if (JSON.stringify(list[i].userid) != tmp) {
            send(i)
        }
    }
}
def()
setInterval(function () {
    def()
}, 10 * 60 * 1000)
/*
setInterval(function () { def() }, 60000)
async function getJson() {
    return new Promise<object | void>(async (resolve, reject) => {
        let data = '',
            json_data: any;
        let req = https.get("https://www.kaiheila.cn/api/guilds/3128617072930683/widget.json", function (res: any) {
            res.on('data', function (stream: any) {
                data += stream;
            });
            res.on('end', function () {
                json_data = JSON.parse(data);
                resolve(json_data);
            });
        });
    });
}
var json: any
setInterval(async function () {
    json = await getJson()
    for (let i = 0; i < Object.keys(list).length; i++) {
        var tmp: string = JSON.stringify(list[i].userid);
        for (let j = 0; j < Object.keys(json.channels).length; j++)
            if (list[i].chnid == json.channels[j].id) {
                if (json.channels[j].users)
                    for (let k = 0; k < 5; k++) {
                        if (k < Object.keys(json.channels[j].users).length)
                            list[i].userid[k] = json.channels[j].users[k].id;
                        else
                            list[i].userid[k] = '';
                    }
                break;
            }
        if (JSON.stringify(list[i].userid) != tmp) {
            send(i)
        }
    }
}, 60000)

async function setup() {
    return new Promise<void>(async (resolve, reject) => {
        bot.axios.get("v3/message/list", {
            params: {
                target_id: '2408081738284872',
            }
        })
            .then(function (response: any) {
                for (var i = 0; i < Object.keys(list).length; i++)
                    list[i].card = response.data.data.items[i].content
                resolve()
            })
    })
}
setup()
    .then(function () {
        setInterval(async function () {
            bot.axios.get("v3/message/list", {
                params: {
                    target_id: '2408081738284872',
                }
            })
                .then(async function (response: any) {
                    for (var i = 0; i < Object.keys(list).length; i++) {
                        if (list[i].card != response.data.data.items[i].content) {
                            send(list[i].card, list[i].msgid);
                        }

                    }
                })
        }, 10000);
    })*/