import { AppCommand, AppFunc, BaseSession, Card } from 'kbotify';
import { bot } from 'init/client';
var mysql = require('mysql');
var tabname = 'keylib'
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bot_db'
});
class R6Active extends AppCommand {
    code = 'active'; // 只是用作标记
    trigger = 'active'; // 用于触发的文字
    help = '.r6 active+KEY'; // 帮助文字
    intro = '激活测试权限';
    response : 'pm';
    func: AppFunc<BaseSession> = async (session) => {
        
    }
}
export const r6Active = new R6Active();
