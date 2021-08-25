import { AppCommand, AppFunc, BaseSession } from '../..';
import { bot } from 'tests/init';
var mysql = require('mysql');
var tabname = 'cdklist'
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
    response: 'pm' = 'pm';
    func: AppFunc<BaseSession> = async (session) => {
        async function searchkey(cdk: string) {
            return new Promise<string>((resolve, reject) => {
                var exp = 'SELECT act FROM ' + tabname + ' WHERE cdk="' + cdk + '" && act=0';
                connection.query(exp, function (err: any, result: any) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        session.send("参数错误")
                        reject()
                    }
                    else if (JSON.stringify(result).search('"act":0') !== -1) {
                        //var r6id = JSON.stringify(result).match('"r6id":"(.*?)"}')[1]
                        session.send('激活中')
                        resolve(cdk);
                    }
                    else {
                        session.send("CDK错误或已经被激活！")
                    }
                });
            })
        }
        async function recordkey(cdk: string) {
            return new Promise<void>((resolve, reject) => {
                var today = new Date();
                var exp = 'UPDATE ' + tabname + ' SET act=1, actdate="' + today.toISOString().substring(0, 10) +'", id=' + session.userId + ' WHERE cdk="' + cdk + "\"";
                console.log(exp)
                connection.query(exp, function (err: any, result: any) {
                    if (err) {
                        console.log('[UPDATE ERROR] - ', err.message);
                        session.send("参数错误")
                        reject()
                    }
                    else {
                        session.send('激活成功');
                        resolve()
                    }
                })
            })
        }
        await recordkey(await searchkey(session.args[0]))
    }
}
export const r6Active = new R6Active();
