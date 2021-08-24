import { AppCommand, AppFunc, BaseSession, Card, GuildSession } from 'kbotify';
import { GuildRoleAPI } from 'kaiheila-bot-root/dist/api/guildRole/guildRole.api';
import { bot } from 'init/client';
import { Guild } from 'kbotify/dist/core/guild';
var mysql = require('mysql');
var tabname = 'usrlib'
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bot_db'
});
class R6Applyrole extends AppCommand {
    code = 'applyrole'; // 只是用作标记
    trigger = 'applyrole'; // 用于触发的文字
    help = '`.r6 applyrole+角色`'; // 帮助文字
    intro = '';
    func: AppFunc<BaseSession> = async (session) => {
        var main = async function () {
            await give(await bot.API.guildRole.index(session.guildId));
        }()
        async function give(response: any) {
                for (var i = 0; i < response.length; i++) {
                    if (response[i].name == session.args[0]){
                        console.log(response[i].roleId)
                        session.user.grantRole(response[i].roleId, session.guildId)
                        .then(function (response) {
                            if (JSON.stringify(response).length > 1) {
                                session.user.grantRole(35688, session.guildId)
                                session.send("申请成功");
                            }
                            else {
                                console.log('you don\'t offer args');
                            }
                        })
                        break;
                    } 
                }
                return;
        }
    }
}
export const r6Applyrole = new R6Applyrole();
