import { AppCommand, AppFunc, BaseSession, Card, GuildSession } from '../..';
import { bot, pars } from 'tests/init';
class R6Applyrole extends AppCommand {
    code = 'applyrole'; // 只是用作标记
    trigger = 'applyrole'; // 用于触发的文字
    help = '.r6 applyrole+角色'; // 帮助文字
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
        var rid: number, flag = false;
        give().then(function (num) {
            if (num < 2) {
                session.user.grantRole(rid, session.guildId)
                session.user.grantRole(35688, session.guildId)
                session.send("申请成功");
                return;
            } else {
                session.send('最多只能申请两个！')
                return;
            }
        })
        async function give() {
            var response = await bot.API.guildRole.index(session.guildId)
            var num = 0;
            return new Promise<number>((resolve) => {
                for (var i = 0; i < response.length; i++) {
                    if (response[i].name == session.args[0] && response[i].position >= 7 && response[i].position <= 62) {
                        rid = response[i].roleId;
                        flag = true;
                        bot.API.guild.userList(session.guildId)
                            .then(function (usres) {
                                for (var j = 0; j < usres.items.length; j++) {
                                    if (usres.items[j].id == session.userId) {
                                        for (var k = 0; k < usres.items[j].roles.length; k++) {
                                            for (var z = 0; z < response.length; z++) {
                                                if (usres.items[j].roles[k] == response[z].roleId && response[z].position >= 8 && response[z].position <= 62) {
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
                if (!flag)
                    session.send("没有该角色")
            })
        }
    }
}

export const r6Applyrole = new R6Applyrole();
