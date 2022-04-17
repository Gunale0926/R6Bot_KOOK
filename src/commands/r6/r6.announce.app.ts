import { AppCommand, AppFunc, BaseSession, Card } from '../..';
import { bot } from 'tests/init';
class R6Announce extends AppCommand {
    code = 'announce'; // 只是用作标记
    trigger = 'announce'; // 用于触发的文字
    help = '`.公告 内容`\n内容语法：\n`-div-`添加分割线\n`-title- 标题`添加标题\n`-color- #FFFFFF`设置颜色\n`-img- link`添加图片\n`内容` 文本'; // 帮助文字
    intro = '发布公告';
    func: AppFunc<BaseSession> = async (session) => {
        if (session.args.length < 2) {
            session.sendCard(new Card().addTitle(this.intro).addText(this.help));
            return;
        }
        else if (session.guildId != '3128617072930683') {
            session.sendCard(new Card().addTitle("只能在Rainbow Six小队频道使用"));
            return;
        }
        bot.API.guild.userList(session.guildId)
            .then(function (usres: any) {
                for (var j = 0; j < usres.items.length; j++) {
                    if (usres.items[j].id == session.userId) {
                        for (var k = 0; k < usres.items[j].roles.length; k++) {
                            if (usres.items[j].roles[k] == 1343) {
                                var card = new Card()
                                for (let i = 0; i < session.args.length; i++) {
                                    if (session.args[i] == '-div-')
                                        card.addDivider()
                                    else if (session.args[i] == '-title-') {
                                        i++
                                        card.addTitle(session.args[i])
                                    }
                                    else if (session.args[i] == '-color-') {
                                        i++
                                        card.setColor(session.args[i]);
                                    }
                                    else if (session.args[i] == '-img-') {
                                        i++
                                        card.addImage(session.args[i])
                                    }
                                    else
                                        card.addText(session.args[i])
                                }
                                session.sendCard(card);
                                return;
                            }
                            else session.send('无权限！')
                        }
                    }
                }
            })
    }
}
export const r6Announce = new R6Announce();
