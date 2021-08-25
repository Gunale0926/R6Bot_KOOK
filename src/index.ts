<<<<<<< Updated upstream
import { r6Status } from 'commands/r6/r6.status.app';
import { r6Record } from 'commands/r6/r6.record.app';
import { r6Search } from 'commands/r6/r6.search.app';
import { bot } from 'init/client';
import { echoMenu } from './commands/echo/echo.menu';
import { r6Menu } from './commands/r6/r6.menu'
import { r6Applyrole } from 'commands/r6/r6.applyrole.app';
var mysql = require('mysql');
var tabname = 'usrlib'
var list: string[] = [null, null, null, null, null]
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bot_db'
});
async function searchid(id: string) {
    return new Promise<string>((resolve, reject) => {
        var exp = 'SELECT r6id FROM ' + tabname + ' WHERE id=' + id + ' && sel =1';
        connection.query(exp, function (err: any, result: any) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
            }
            result = JSON.parse(JSON.stringify(result))
            if (JSON.stringify(result).search('"r6id":"(.*?)"}') !== -1) {
                var r6id: string = JSON.stringify(result).match('"r6id":"(.*?)"}')[1]
                resolve(r6id);
            }
        });
    })
}

async function writeList(id: string) {
    return new Promise<void>((resolve, reject) => {
        for (var i = 0; i <= 4; i++) {
            if (list[i] == null) {
                list[i] = id;
                break;
            }
        }
        resolve();
    })
}
async function deleteList(id: string) {
    return new Promise<void>((resolve, reject) => {
        for (var i = 0; i <= 4; i++) {
            if (list[i] == id) {
                list[i] = null;
                break;
            }
        }
        resolve();
    })
}
bot.messageSource.on('message', (e) => {
    bot.logger.debug(`received:`, e);
});
bot.event.on('system', (event) => {
    if (event.type == 'joined_channel'&&event.body.channel_id=='2494099237896157') {
        //console.log(event)
        var write = async function () {
            await writeList(await searchid(event.body.user_id))
            console.log('LIST:'+List)
        }()
    }
})
bot.event.on('system', (event) => {
    if (event.type == 'exited_channel'&&event.body.channel_id=='2494099237896157') {
        //console.log(event)
        var del = async function () {
            await deleteList(await searchid(event.body.user_id));
            console.log('LIST:'+List)
        }()
    }
})
bot.addCommands(echoMenu);
bot.addCommands(r6Menu);
bot.addAlias(r6Status,"状态");
bot.addAlias(r6Search,"查询")
bot.addAlias(r6Record,"记录")
bot.addAlias(r6Applyrole,"申请角色")
bot.connect();
bot.logger.debug('system init success');
export var List = list;
=======
export * from './core/session';

export { ResultTypes } from './core/types';
export * from './core/command';
export * from './core/card';
export { SendOptions } from './core/msg.types';
export { kBotifyLogger as kBotifyLogger } from './core/logger';
export { KBotify } from './core/kbotify';

export * from './core/user';
export * from './core/message';
export * from './core/kbotify';
export * from './core/channel';
>>>>>>> Stashed changes
