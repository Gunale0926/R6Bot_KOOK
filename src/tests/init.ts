/* eslint-disable @typescript-eslint/no-non-null-assertion */
import * as dotenv from 'dotenv';
import { Card, KBotify } from '..';
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
import { echoMenu } from 'commands/echo/echo.menu';
import { echoKmd } from 'commands/echo/echo.kmd.app';
import { testMenu } from 'commands/test/test.menu';
import { kBotifyLogger } from 'core/logger';
import { r6Menu } from 'commands/r6/r6.menu';
import { r6Active } from '../commands/r6/r6.active.app';
import { r6Applyrole } from '../commands/r6/r6.applyrole.app';
import { r6Record } from '../commands/r6/r6.record.app';
import { r6Search } from '../commands/r6/r6.search.app';
import { r6Team } from '../commands/r6/r6.team.app';
import { apexMenu } from '../commands/apex/apex.menu';
bot.addCommands(echoMenu, echoKmd, testMenu, r6Menu, apexMenu);
bot.connect();
bot.addAlias(r6Search, "查询")
bot.addAlias(r6Record, "记录")
bot.addAlias(r6Applyrole, "申请角色")
bot.addAlias(r6Team, "组队")
bot.addAlias(r6Active, "激活")
bot.logger.debug('system init success');
bot.messageSource.on('message', (e) => {
    //bot.logger.debug(`received:`, e);
});
var mysql = require('mysql');
var tabname = 'usrlib'
var list = [{
    chnname: 'DOC',
    chnid: 8574655462452796,
    userid: ['', '', '', '', ''],
    msgid: 'a6c80cd1-be62-401b-b83f-aef234762867'
}, {
    chnname: 'FUZE',
    chnid: 7228978838660995,
    userid: ['', '', '', '', ''],
    msgid: '7596e222-1c34-4f23-acf0-2aa14014e4f6'
}, {
    chnname: 'ROOK',
    chnid: 8666873622418147,
    userid: ['', '', '', '', ''],
    msgid: '54ce872a-5ce1-4af3-affb-74b138dc24ce'
}, {
    chnname: 'MUTE',
    chnid: 3671071360478648,
    userid: ['', '', '', '', ''],
    msgid: 'ac701ca6-e650-4556-a407-603172d31288'
}, {
    chnname: 'ORYX',
    chnid: 8099740112545843,
    userid: ['', '', '', '', ''],
    msgid: '5d64a9f8-ff2e-41e0-8a97-507a90cf5053'
}, {
    chnname: 'JAGER',
    chnid: 9853214616287407,
    userid: ['', '', '', '', ''],
    msgid: 'ee472f52-f5a3-47bd-a395-e96e99d21ff4'
}, {
    chnname: 'SLEDGE',
    chnid: 4522198069417620,
    userid: ['', '', '', '', ''],
    msgid: '34c0ccc8-4092-4ee6-be43-0354b678a8cd'
}, {
    chnname: 'WAMAI',
    chnid: 1505924438841986,
    userid: ['', '', '', '', ''],
    msgid: '51bc3fd8-cb52-44a8-8533-d6f3b9f2f52b'
}, {
    chnname: 'TWITCH',
    chnid: 7769514269829865,
    userid: ['', '', '', '', ''],
    msgid: '1312d0b8-25d6-4e19-abfe-55577738ba60'
}, {
    chnname: 'MOZZIE',
    chnid: 2494099237896157,
    userid: ['', '', '', '', ''],
    msgid: '678d38d4-9b7b-4a2d-846e-4621a756f0c4'
}, {
    chnname: 'HIBANA',
    chnid: 3205552061241304,
    userid: ['', '', '', '', ''],
    msgid: '38421844-f17b-484a-b6e4-e0d79c99320d'
}];
export var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '20060926Abc',
    database: 'bot_db'
});

async function searchid(id: string) {
    return new Promise<string>((resolve, reject) => {
        var exp = 'SELECT r6id FROM ' + tabname + ' WHERE id=' + id;
        connection.query(exp, function (err: any, result: any) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
            }
            if (result[0])
                resolve(result[0].r6id);
        });
    })
}

async function writeList(chnid: number, id: string) {
    return new Promise<void>((resolve, reject) => {
        for (var i = 0; i < Object.keys(list).length; i++) {
            if (list[i].chnid == chnid) {
                for (var j = 0; j < 5; j++) {
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
bot.event.on('system', (event) => {
    //console.log(event)
    if (event.type == 'joined_channel') {
        var write = async function () {
            await writeList(event.body.channel_id, event.body.user_id)
            await sendall(event.body.channel_id);
        }()
    }
    if (event.type == 'exited_channel') {
        var del = async function () {
            await deleteList(event.body.channel_id, event.body.user_id);
            await sendall(event.body.channel_id);
        }()

    }
    if (event.type == 'buttonClick') {
        var done = async function () {
            var channelId: string
            var clkusr: string;
            clkusr = await event.userId;
            if (event.value == 'DOC') channelId = '8574655462452796'
            if (event.value == 'FUZW') channelId = '7228978838660995'
            if (event.value == 'ROOK') channelId = '8666873622418147'
            if (event.value == 'MUTE') channelId = '3671071360478648'
            if (event.value == 'ORYX') channelId = '8099740112545843'
            if (event.value == 'JAGER') channelId = '9853214616287407'
            if (event.value == 'SLEDGE') channelId = '4522198069417620'
            if (event.value == 'WAMAI') channelId = '1505924438841986'
            if (event.value == 'TWITCH') channelId = '7769514269829865'
            if (event.value == 'MOZZIE') channelId = '2494099237896157'
            if (event.value == 'HIBANA') channelId = '3205552061241304'
            await bot.API.channel.moveUser(channelId, [clkusr])
        }()
    }
    async function sendall(inputid: number) {
        var https = require('https');
        var url = "https://r6.tracker.network/profile/pc/";
        var avmmr: number = 0, xmmr: number = 0, nmmr: number = 9999, num: number = 0, itm: number = 0, tmp: number = 0;
        var name: string;
        var rankable: boolean;
        var main = async function () {
            for (itm = 0; itm < Object.keys(list).length; itm++) {
                if (list[itm].chnid == inputid) {
                    name = list[itm].chnname;
                    for (var j = 0; j < 5; j++)
                        if (list[itm].userid[j] != '')
                            num++;
                    break;
                }
            }
            var cardbind: string = '['
            for (var i = 0; i < 5; i++) {
                if (list[itm].userid[i] != '') {
                    tmp++;
                    var r6id = await searchid(list[itm].userid[i]);
                    var cardstr = JSON.stringify(await get(r6id, tmp));
                    cardbind = cardbind + cardstr.substring(1, cardstr.length - 1) + ',';
                }
            }
            cardbind = cardbind.substring(0, cardbind.length - 1) + ']';
            if (num == 0) {
                console.log(name + ' 0');
                await send([
                    {
                        "type": "card",
                        "theme": "secondary",
                        "size": "lg",
                        "modules": [
                            {
                                "type": "section",
                                "text": {
                                    "type": "kmarkdown",
                                    "content": "**" + name + "频道无人**"
                                }
                            }
                        ]
                    }
                ], list[itm].msgid)
                return 0;
            }
            await send(JSON.parse(cardbind), list[itm].msgid);
        }()

        async function send(card: object, id: string) {
            return new Promise<void>(async (resolve) => {
                //await bot.API.message.create(10, "2408081738284872", JSON.stringify(card));
                await bot.API.message.update(id, JSON.stringify(card));
                resolve()
            })
        }
        async function get(r6id: string, first: number) {
            return new Promise<object>(async (resolve, reject) => {
                var urln = url + r6id;
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
                            var arg5 = imglink;
                            var arg6 = '#B2B6BB';
                            if (rank.search(/COPPER/) === 0) { arg6 = "#B30B0D"; }
                            if (rank.search(/BRONZE/) === 0) { arg6 = "#C98B3B"; }
                            if (rank.search(/SILVER/) === 0) { arg6 = "#B0B0B0"; }
                            if (rank.search(/GOLD/) === 0) { arg6 = "#EED01E"; }
                            if (rank.search(/PLATINUM/) === 0) { arg6 = "#5BB9B3"; }
                            if (rank.search(/DIAMOND/) === 0) { arg6 = "#BD9FF6"; }
                            if (rank.search(/CHAMPION/) === 0) { arg6 = "#9D385C"; }
                            var immr = parseInt(mmr)
                            avmmr += immr;
                            if (xmmr < immr) xmmr = immr;
                            if (nmmr > immr) nmmr = immr;
                            if (xmmr - nmmr <= 1000)
                                rankable = true;
                            else rankable = false;
                            if (first == 1)
                                var card: object = [{
                                    "type": "card", "theme": "secondary", "color": arg6, "size": "lg", "modules": [{
                                        "type": "section",
                                        "text": {
                                            "type": "kmarkdown",
                                            "content": "**频道：" + name + "**"
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
})
export var List = list;