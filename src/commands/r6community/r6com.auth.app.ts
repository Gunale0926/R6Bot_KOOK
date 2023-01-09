import { AppCommand, AppFunc, BaseSession } from '../..';
import { connection, r6api } from '../../tests/init';
class R6Auth extends AppCommand {
    code = '认证'; // 只是用作标记
    trigger = 'auth'; // 用于触发的文字
    help = '`.认证 + platform`'; // 帮助文字
    intro = '认证段位';
    response: 'private' = 'private';
    func: AppFunc<BaseSession> = async (session) => {
        var platform = 'uplay'
        if (session.args[1]) {
            if (session.args[1].charAt(0) == 'p' || session.args[1].charAt(0) == 'P')
                platform = "ps";
            else if (session.args[1].charAt(0) == 'x' || session.args[1].charAt(0) == 'X')
                platform = "xbox";
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
        async function get(r6id: string) {
            var r6id = r6id.replace(/\\/g, "");
            const { 0: player } = await r6api.findByUsername(platform, r6id);
            if (!player) {
                session.send("用户未找到")
                return 'Player not found';
            }
            const { 0: ranks } = await r6api.getRanks(platform, player.id, { seasonIds: -1 })
            var rank = ranks.seasons[Object.keys(ranks.seasons)[0]].regions.apac.boards.pvp_ranked
            var max = rank.max.name
            session.send(
                'ID：' +
                r6id +
                '\n本赛季最高段位：' +
                max +
                '\n请发送段位截图并等待审核！'
            );
            return;
        }
    };
}

export const r6Auth = new R6Auth();
