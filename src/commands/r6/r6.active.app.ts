import { AppCommand, AppFunc, BaseSession, Card } from '../..';
import { bot } from 'tests/init';
var tabname = 'cdklist'
import { connection } from '../../tests/init'
class R6Active extends AppCommand {
    code = '激活'; // 只是用作标记
    trigger = 'active'; // 用于触发的文字
    help = '`.激活 XXXX-XXXX-XXXX`（注意：仅私聊机器人有效）'; // 帮助文字
    intro = '激活机器人高级功能';
    response: 'private' = 'private';
    func: AppFunc<BaseSession> = async (session) => {
        if (session.args.length == 0) {
            session.sendCard(new Card().addTitle(this.code).addText(this.intro).addText(this.help));
            return;
        }
        var exp = 'SELECT act FROM ' + tabname + ' WHERE id="' + session.userId + '" && act=1';
        connection.query(exp, async function (err: any, result: any) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                session.send("内部参数错误")
            }
            else if (result[0]) {
                session.send("已经激活过高级功能")
                return;
            }
            else {
                if (await searchkey(session.args[0]) == true)
                    recordkey(session.args[0])
            }
        });
        async function searchkey(cdk: string) {
            return new Promise<boolean>((resolve, reject) => {
                var exp = 'SELECT act FROM ' + tabname + ' WHERE cdk="' + cdk + '" && act=0';
                connection.query(exp, function (err: any, result: any) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        session.send("参数错误")
                    }
                    else if (result[0]) {
                        resolve(true);
                    }
                    else {
                        session.send("CDK错误或已经被激活！")
                        resolve(false)
                    }
                });
            })
        }
        async function recordkey(cdk: string) {
            return new Promise<void>((resolve, reject) => {
                var today = new Date();
                var exp = 'UPDATE ' + tabname + ' SET act=1, actdate="' + today.toISOString().substring(0, 10) + '", id=' + session.userId + ' WHERE cdk="' + cdk + "\"";
                connection.query(exp, function (err: any, result: any) {
                    if (err) {
                        console.log('[UPDATE ERROR] - ', err.message);
                        session.send("参数错误")
                    }
                    else {
                        if (cdk.charAt(cdk.length - 1) != 'F') {
                            session.user.grantRole(373739, '3128617072930683');//赞助者
                            //session.user.grantRole(373758, '3128617072930683');//内测
                            session.send('激活成功，感谢支持');
                        }
                        else {
                            session.user.grantRole(373739, '3128617072930683');//赞助者
                            session.send('激活赠送激活码成功');
                        }
                        resolve()

                    }
                })
            })
        }
    }
}
export const r6Active = new R6Active();
