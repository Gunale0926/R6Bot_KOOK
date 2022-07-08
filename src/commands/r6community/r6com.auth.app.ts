import { AppCommand, AppFunc, BaseSession, Card} from '../..';
import { connection } from '../../tests/init';
import axios from 'axios';
class R6Auth extends AppCommand {
    code = '认证'; // 只是用作标记
    trigger = 'auth'; // 用于触发的文字
    help = '`.认证`'; // 帮助文字
    intro = '认证段位';
    response: 'private' = 'private';
    func: AppFunc<BaseSession> = async (session) => {
        if (session.guildId != '3128617072930683') {
            session.sendCard(
                new Card().addTitle('只能在Rainbow Six小队频道使用')
            );
            return;
        }
        var r6id = await searchid(session.userId);
        if (r6id == null) session.send('您未绑定R6ID，格式：`.绑定 R6ID`');
        else {
            get(r6id);
        }
        return;
        async function searchid(id: string) {
            return new Promise<any>(async (resolve) => {
                var exp = 'SELECT r6id FROM usrlib WHERE id=' + id;
                connection.query(exp, function (err: any, result: any) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                    } else if (result[0]) resolve(result[0].r6id);
                    else {
                        resolve(null);
                    }
                });
            });
        }
        function get(r6id: string) {
            var stats: any, highestMMR;
            axios
            .get(
                'http://localhost:9099/getUser.php?appcode=thisisthecode&name=' +
                r6id
            )
            .then(function (res: any) {
                stats = res.data.players[Object.keys(res.data.players)[0]];
            })
            .then(function () {
                var nodata: any;
                try {
                    nodata = stats.error.message;
                } catch {}
                if (nodata == 'User not found!') {
                    session.send('查无此人！请检查ID后重试！');
                    return;
                }

                try {
                    highestMMR = stats.max_mmr;
                } catch (error) {
                    session.send('未进行过排位！');
                    return;
                }
                var highestRank;
                if (highestMMR < 1600) highestRank = '紫铜';
                else if (highestMMR < 2100) highestRank = '黄铜';
                else if (highestMMR < 2600) highestRank = '白银';
                else if (highestMMR < 3200) highestRank = '黄金';
                else if (highestMMR < 4100) highestRank = '白金';
                else if (highestMMR < 5000) highestRank = '钻石';
                else highestRank = '冠军';
                session.send(
                    'ID：' +
                        r6id +
                        '\n本赛季最高段位：' +
                        highestRank +
                        '\n请等待审核！'
                );
                return;
            });
        }
    };
}

export const r6Auth = new R6Auth();
