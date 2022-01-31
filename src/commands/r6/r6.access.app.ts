import { AppCommand, AppFunc, BaseSession, Card } from '../..';
import { connection } from '../../tests/init'
class R6Access extends AppCommand {
    code = '权限'; // 只是用作标记
    trigger = 'access'; // 用于触发的文字
    help = '`.权限`（注意：仅私聊机器人有效）'; // 帮助文字
    intro = '查询剩余时间';
    response: 'both' = 'both';
    func: AppFunc<BaseSession> = async (session) => {
        var exp3 = 'SELECT expdate FROM usrlib WHERE id="' + session.userId + '"';
        connection.query(exp3, function (err: any, result: any) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
            }
            else {
                var expdate = new Date(result[0].expdate);
                var date = new Date(); //现在
                if (expdate >= date)
                    session.send('到期时间（ISO FORMAT）：' + expdate.toISOString());
                else
                    session.send('高级权限未激活或已经过期')
            }
        })
    }
}

export const r6Access = new R6Access();
