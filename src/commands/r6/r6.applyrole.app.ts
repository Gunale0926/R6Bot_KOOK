import { AppCommand, AppFunc, BaseSession, Card, GuildSession } from 'kbotify';
import { bot } from 'init/client';
var flag = 0;
class R6Applyrole extends AppCommand {
    code = 'applyrole'; // 只是用作标记
    trigger = 'applyrole'; // 用于触发的文字
    help = '.r6 applyrole+角色'; // 帮助文字
    intro = '申请角色';
    func: AppFunc<BaseSession> = async (session) => {
        var main = async function () {
            await give(await bot.API.guildRole.index(session.guildId));
        }()
        async function give(response: any) {
            for (var i = 0; i < response.length; i++) {
                if (response[i].name == session.args[0]&&response[i].position >=3 &&response[i].position <= 44) {
                    session.user.grantRole(35688, session.guildId)
                        .then(function (res) {
                            if (res) {
                                for (var j = 0; j < res.roles.length; j++) {
                                    if (res.roles[j] === 35688) {
                                        session.send("请勿重复申请")
                                        return;
                                    }
                                }
                                    session.user.grantRole(response[i].roleId, session.guildId)
                                    session.send("申请成功");
                                    return;
                            }
                            else {
                                console.log('you don\'t offer args');
                                return;
                            }
                        })
                }
            }
        }
    }
}
export const r6Applyrole = new R6Applyrole();
