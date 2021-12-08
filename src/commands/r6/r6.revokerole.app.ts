import { AppCommand, AppFunc, BaseSession, Card, GuildSession } from '../..';
import { bot, pars } from 'tests/init';
class R6Revokerole extends AppCommand {
    code = 'revokerole'; // 只是用作标记
    trigger = 'revokerole'; // 用于触发的文字
    help = '`.申请角色 角色英文名（大写）`'; // 帮助文字
    intro = '申请角色';
    func: AppFunc<BaseSession> = async (session) => {
        if (session.args.length == 0) {
            session.sendCard(new Card().addTitle(this.code).addText(this.intro).addText(this.help));
            return;
        }
        if (session.guildId != '3128617072930683') {
            session.sendCard(new Card().addTitle("只能在Rainbow Six小队频道使用"));
            return;
        }
        var response = await bot.API.guildRole.index(session.guildId)
        for (var i = 0; i < response.length; i++) {
            if (response[i].name == session.args[0] && response[i].position >= pars.head && response[i].position <= pars.tail) {
                try {
                    await session.user.revokeRole(response[i].roleId, session.guildId);
                } catch (error) {
                    session.send('用户没有此角色');
                    return;
                }
                session.send('撤销成功');
                return;
            }
        }
        session.send('无效参数')
    }
}
export const r6Revokerole = new R6Revokerole();
