import { AppCommand, AppFunc, BaseSession, Card } from 'kbotify';
var mysql = require('mysql');
var tabname = 'usrlib'
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bot_db'
});
class R6Record extends AppCommand {
    code = 'record'; // 只是用作标记
    trigger = 'record'; // 用于触发的文字
    help = '.r6 record+r6id\n缩写".记录"'; // 帮助文字
    intro = '记录r6id到数据库中';
    func: AppFunc<BaseSession> = async (session) => {
        async function recordid(id: string, r6id: string) {
            return new Promise((resolve, reject) => {
                var exp = 'INSERT INTO ' + tabname + '(id,r6id,sel) VALUES("' + id + '","' + r6id + '",1)'
                connection.query(exp, function (err: any, result: any) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        exp = 'UPDATE ' + tabname + ' SET r6id=\'' + r6id + '\'WHERE id=' + id;
                        connection.query(exp, function (err:any, result:any) {
                            if (err) {
                                console.log('[INSERT ERROR] - ', err.message);
                            }
                            else {
                                console.log('UPDATE ' + id + ' ' + r6id);
                                session.send('UPDATE ' + id + ' ' + r6id);
                                resolve(result);
                            }
                        })
                    }
                    else{
                        session.send('INSERT ' + id + ' ' + r6id);
                    }
                })
            })
        }
        await recordid(session.userId,session.args[0])
    }
}
export const r6Record = new R6Record();
