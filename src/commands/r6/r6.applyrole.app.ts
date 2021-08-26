import { AppCommand, AppFunc, BaseSession, Card, GuildSession } from '../..';
import { bot } from 'tests/init';
class R6Applyrole extends AppCommand {
    code = 'applyrole'; // 只是用作标记
    trigger = 'applyrole'; // 用于触发的文字
    help = '.r6 applyrole+角色'; // 帮助文字
    intro = '申请角色';
    func: AppFunc<BaseSession> = async (session) => {
        if (session.args.length == 0)
            session.sendCard(new Card().addTitle(this.code).addText(this.intro).addText(this.help))
        var main = async function () {
            await give(await bot.API.guildRole.index(session.guildId));
        }()
        async function give(response: any) {
            for (var i = 0; i < response.length; i++) {
                if (response[i].name == session.args[0] && response[i].position >= 3 && response[i].position <= 44) {
                    var rid = response[i].roleId
                    bot.API.guild.userList(session.guildId)
                        .then(function (response) {
                            for (var j = 0; j < response.items.length; j++) {
                                if (response.items[j].id==session.userId) {
                                    for (var k = 0; k < response.items[j].roles.length; k++) {
                                        if(response.items[j].roles[k]==35688){
                                            session.send('请勿重复申请！')
                                            return;
                                        }
                                    }
                                    
                                }
                            }
                            session.user.grantRole(rid, session.guildId)
                            session.user.grantRole(35688, session.guildId)
                            session.send("申请成功");
                            return;
                        })
                }
            }
        }
    }
}
export const r6Applyrole = new R6Applyrole();
