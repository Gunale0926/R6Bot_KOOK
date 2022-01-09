import { AppCommand, AppFunc, BaseSession, Card } from '../..';
import { connection } from '../../tests/init'
var tabname = 'usrlib'
var https = require('https');
var url = "https://r6.tracker.network/profile/pc/";
class R6Auth extends AppCommand {
    code = '认证'; // 只是用作标记
    trigger = 'auth'; // 用于触发的文字
    help = '`.认证`'; // 帮助文字
    intro = '认证段位';
    response: 'private' = 'private';
    func: AppFunc<BaseSession> = async (session) => {
        var r6id = await searchid(session.userId)
        if (r6id == null)
            session.send("您未绑定R6ID，格式：`.绑定 R6ID`")
        else {
            get(r6id)
        }
        return;
        async function searchid(id: string) {
            return new Promise<any>(async (resolve) => {
                var exp = 'SELECT r6id FROM ' + tabname + ' WHERE id=' + id;
                connection.query(exp, function (err: any, result: any) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                    }
                    else if (result[0])
                        resolve(result[0].r6id);
                    else {
                        resolve(null)
                    }
                });
            });
        }
        function get(r6id: string) {
            var urln = url + r6id + '/';
            https.get(urln, function (res: any) {
                var html: string = '';
                res.on('data', function (data: any) {
                    html += data;
                });
                res.on('end', function () {
                    if (html.match("RankedKDRatio") == null) {
                        session.send("查无此人，请检查ID后重试");
                        return;
                    }
                    else {
                        html = html.replace(/\n/g, '');
                        try {
                            var highestMMR = Number(html.match('<div class="trn-defstat__name">Best MMR</div><div class="trn-defstat__value-stylized">(.*?)</div>')[1].replace(',', ''));
                        } catch (error) {
                            session.send('未进行过排位！')
                            return;
                        }
                        var highestRank;
                        if (highestMMR < 1600)
                            highestRank = '紫铜';
                        else if (highestMMR < 2100)
                            highestRank = '黄铜';
                        else if (highestMMR < 2600)
                            highestRank = '白银';
                        else if (highestMMR < 3200)
                            highestRank = '黄金';
                        else if (highestMMR < 4100)
                            highestRank = '铂金';
                        else if (highestMMR < 5000)
                            highestRank = '钻石';
                        else
                            highestRank = '冠军';
                        session.send('ID：' + r6id + '\n最高段位：' + highestRank+'\n请将游戏内截图（含该ID）发送到频道中，等待审核！');
                        return;
                    }
                });
            }).on('error', function () {
                session.send("ERROR");
            })
        }
    }
}
export const r6Auth = new R6Auth();
