import { AppCommand, AppFunc, BaseSession, Card } from '../..';
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
        var req = session.args[0];
        var days = await searchkey(req);
        if (days != false)
            recordkey(req, days)
        else {
            session.send("CDK错误或已经被激活！")
            return;
        }

        async function searchkey(cdk: string) {
            return new Promise<number | boolean>((resolve) => {
                var exp = 'SELECT days FROM cdklist WHERE cdk="' + cdk + '" && act=0';
                connection.query(exp, function (err: any, result: any) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        session.send("参数错误")
                        return;
                    }
                    else if (result[0]) {
                        resolve(Number(result[0].days));
                    }
                    else {
                        resolve(false)
                    }
                });
            })
        }

        async function recordkey(cdk: string, days: any) {
            return new Promise<void>(async (resolve) => {
                var exp1 = 'UPDATE cdklist SET act=1, actid=' + session.userId + ' WHERE cdk="' + cdk + '"';
                await connection.query(exp1, function (err: any) { if (err) { console.log(err); session.send('ERROR'); } })
                await connection.query('INSERT IGNORE INTO usrlib (id) VALUES("' + session.userId + '")')
                var exp3 = 'SELECT expdate FROM usrlib WHERE id="' + session.userId + '"';
                await connection.query(exp3, function (err: any, result: any) {
                    if (err) { console.log(err); session.send('ERROR'); }
                    else {
                        var addDays = function (myDate: Date, days: number) {
                            myDate.setDate(myDate.getDate() + days);
                            return myDate;
                        }
                        var expdate = new Date(result[0].expdate);
                        var date = new Date(); //现在
                        if (expdate < date) {
                            var time = addDays(date, days)
                            //更新为现在+days
                        }
                        else {
                            var time = addDays(expdate, days)
                            //更新为expdate+date
                        }
                        console.log(time.toISOString());
                        var exp3 = 'UPDATE usrlib SET expdate="' + time.toISOString().replace('T', ' ').substr(0, 19) + '" WHERE id="' + session.userId + '"';
                        connection.query(exp3, function (err: any) {
                            if (err) { console.log(err); session.send('ERROR'); }
                            else {
                                session.send('激活成功！\n激活时长：' + days + '天\n到期时间（ISO FORMAT）：' + time.toISOString());
                            }
                        })
                    }
                })
            })
        }
    }
}

export const r6Active = new R6Active();
