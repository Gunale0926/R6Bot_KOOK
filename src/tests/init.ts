console.log('Startms:' + new Date().getTime())
import * as dotenv from 'dotenv';
import { KBotify } from '..';
dotenv.config();
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
    head: 11,
    tail: 67
}
import { r6Menu } from 'commands/r6/r6.menu';
import { r6ComMenu } from 'commands/r6community/r6com.menu';
import { r6Active } from '../commands/r6/r6.active.app';
import { r6Applyrole } from '../commands/r6community/r6com.applyrole.app';
import { r6Record } from '../commands/r6/r6.record.app';
import { r6Search } from '../commands/r6/r6.search.app';
import { r6Revokerole } from '../commands/r6community/r6com.revokerole.app';
import { r6Auth } from '../commands/r6community/r6com.auth.app';
import { r6Access } from '../commands/r6/r6.access.app';
/*
import { kBotifyLogger } from 'core/logger';
import Application from 'koa';
import { AttachmentBase } from 'kaiheila-bot-root';
import { resolveLevel } from 'bunyan';
*/
bot.addCommands(r6ComMenu,r6Menu);
bot.addAlias(r6Menu, "菜单");
bot.addAlias(r6Access, "权限");
bot.addAlias(r6Search, "查询");
bot.addAlias(r6Record, "记录");
bot.addAlias(r6Record, "绑定");
bot.addAlias(r6Applyrole, "申请角色");
bot.addAlias(r6Revokerole, "撤销角色");
bot.addAlias(r6Active, "激活");
bot.addAlias(r6Auth, '认证')
bot.connect();
bot.logger.debug('Init Success');
var https = require('https');
var mysql = require('mysql');
var url = "https://r6.tracker.network/profile/pc/";
export var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '20060926Abc',
    database: 'bot_db'
});
async function getif(r6id: string) {
    return new Promise<boolean>(async (resolve) => {
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
            var exp = 'INSERT INTO usrlib(id,r6id) VALUES("' + id + '","' + r6id + '")'
            connection.query(exp, function (err: any) {
                if (err) {
                    exp = 'UPDATE usrlib SET r6id=\'' + r6id + '\'WHERE id=' + id;
                    connection.query(exp, function (err: any) {
                        if (err) {
                            var tmstp = new Date().getTime()
                            console.log('[INSERT ERROR] - ', err.message, ' [ID] - ', tmstp);
                            bot.API.message.create(1, message.channelId, '[INSERT ERROR] - [ID] - ' + tmstp);
                        }
                        else {
                            bot.API.message.create(1, message.channelId, '查询到此ID并换绑：' + r6id, '', message.authorId);
                            //updateList(id)

                        }
                    })
                }
                else {
                    bot.API.message.create(1, message.channelId, '查询到此ID并绑定：' + r6id, '', message.authorId);
                    //updateList(id)
                }
            })
        }
    }
})
