import { AppCommand, AppFunc, BaseSession, Card, GuildSession } from '../..';
import { bot } from 'tests/init';
class R6Applyrole extends AppCommand {
    code = 'applyrole'; // 只是用作标记
    trigger = 'applyrole'; // 用于触发的文字
    help = '.r6 applyrole+角色'; // 帮助文字
    intro = '申请角色';
    func: AppFunc<BaseSession> = async (session) => {
        var rid: any;
        if (session.args.length == 0)
            session.sendCard(new Card().addTitle(this.code).addText(this.intro).addText(this.help))
        var main = async function () {
            await give(await bot.API.guildRole.index(session.guildId))
            .then(function(num){
                giverole(num);
            })
        }()
        async function giverole(num:number) {
            if (num <= 1) {
                session.user.grantRole(rid, session.guildId)
                session.user.grantRole(35688, session.guildId)
                session.send("申请成功");
                return;
            } else {
                session.send('最多只能申请两个！')
                return;
            }
        }
        async function give(response: any) {
            var num = 0;
            return new Promise<number>((resolve, reject) => {
                for (var i = 0; i < response.length; i++) {
                    if (response[i].name == session.args[0] && response[i].position >= 4 && response[i].position <= 52) {
                        rid = response[i].roleId
                        bot.API.guild.userList(session.guildId)
                            .then(function (usres) {
                                for (var j = 0; j < usres.items.length; j++) {
                                    if (usres.items[j].id == session.userId) {
                                        for (var k = 0; k < usres.items[j].roles.length; k++) {
                                            for (var z = 0; z < response.length; z++) {
                                                if (usres.items[j].roles[k] == response[z].roleId && response[z].position >= 4 && response[z].position <= 51) {
                                                    num++;
                                                }
                                                
                                            }
                                        }
                                    }
                                }
                                resolve(num)
                            })
                    }
                }
            })
        }
    }
}
export const r6Applyrole = new R6Applyrole();
