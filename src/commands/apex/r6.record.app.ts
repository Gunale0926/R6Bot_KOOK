import { AppCommand, AppFunc, BaseSession, Card } from '../..';
var mysql = require('mysql');
var tabname = 'apexlib'
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bot_db'
});
class ApexRecord extends AppCommand {
    code = 'record'; // 只是用作标记
    trigger = 'record'; // 用于触发的文字
    help = '.apex record+r6id\n缩写".记录"'; // 帮助文字
    intro = '记录apexid到数据库中';
    func: AppFunc<BaseSession> = async (session) => {
        if (session.args.length == 0)
            session.sendCard(new Card().addTitle(this.code).addText(this.intro).addText(this.help))
        else
            await recordid(session.userId, session.args[0])
        async function recordid(id: string, apexid: string) {
            return new Promise((resolve, reject) => {
                var exp = 'INSERT INTO ' + tabname + '(id,apexid,sel) VALUES("' + id + '","' + apexid + '",1)'
                connection.query(exp, function (err: any, result: any) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        exp = 'UPDATE ' + tabname + ' SET r6id=\'' + apexid + '\'WHERE id=' + id;
                        connection.query(exp, function (err: any, result: any) {
                            if (err) {
                                console.log('[INSERT ERROR] - ', err.message);
                            }
                            else {
                                session.send('更新了ID： ' + id + ' ' + apexid);
                                resolve(result);
                            }
                        })
                    }
                    else {
                        session.send('记录了ID： ' + id + ' ' + apexid);
                    }
                })
            })
        }
    }
}
export const apexRecord = new ApexRecord();
