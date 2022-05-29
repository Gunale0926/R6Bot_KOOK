import { AppCommand, AppFunc, BaseSession, Card } from '../..';
import { bot } from '../../tests/init';
class R6Pm extends AppCommand {
    code = 'pm'; // 只是用作标记
    trigger = 'pm'; // 用于触发的文字
    help =
        '参数1处罚理由: \n1=第一类：文明交流规则；\n2=第二类：其他规则\n参数2处罚：\n1=第一次警告；\n2=第二次警告；\n3=踢出（不删除发言，仍可重新加入）；\n4=轻度封禁（删除发言，仍可重新加入）；\n5=永久封禁（删除发言，不可重新加入）'; // 帮助文字
    intro = '快捷处罚';
    response: 'private' = 'private';
    func: AppFunc<BaseSession> = async (session) => {
        if (session.args.length < 2) {
            session.sendCard(
                new Card().addTitle(this.intro).addText(this.help)
            );
            return;
        } else if (session.guildId != '3128617072930683') {
            session.sendCard(
                new Card().addTitle('只能在Rainbow Six小队频道使用')
            );
            return;
        }
        var flag = false;
        bot.API.guild
            .userList(session.guildId)
            .then(async function (usres: any) {
                for (var j = 0; j < usres.items.length; j++) {
                    if (usres.items[j].id == session.userId) {
                        for (var k = 0; k < usres.items[j].roles.length; k++) {
                            if (usres.items[j].roles[k] == 1343) {
                                flag = true;
                            }
                        }
                    }
                }
            })
            .finally(async function () {
                if (flag == false) {
                    session.send('no_acess');
                    return;
                }
                if (session.args[0] && session.args[1] && session.args[2]) {
                    if (session.args[0].search('#(.*?)') !== -1)
                        var id = session.args[0].match(/#(\S*)/)[1];
                    else var id = session.args[0];
                    try {
                        var arg1 = Number(session.args[1]);
                        var arg2 = Number(session.args[2]);
                    } catch (error) {
                        session.send('parametrics_1_or_2_not_number');
                        return;
                    }
                    switch (arg1) {
                        case 1:
                            var rule = '第一类：文明交流规则';
                            break;
                        case 2:
                            var rule = '第二类：其他规则';
                            break;
                    }
                    switch (arg2) {
                        case 1:
                            var penalize = '第一次警告';
                            break;
                        case 2:
                            var penalize = '第二次警告';
                            break;
                        case 3:
                            var penalize = '踢出（不删除发言，仍可重新加入）';
                            bot.API.guild.kickout(session.guildId, id);
                            break;
                        case 4:
                            var penalize = '轻度封禁（删除发言，仍可重新加入）';
                            bot.axios
                                .post(
                                    'https://www.kaiheila.cn/api/v3/blacklist/create',
                                    {
                                        guild_id: session.guildId,
                                        target_id: id,
                                        remark: rule,
                                        del_msg_days: 7,
                                    }
                                )
                                .then(async function () {
                                    bot.axios.post(
                                        'https://www.kaiheila.cn/api/v3/blacklist/delete',
                                        {
                                            guild_id: session.guildId,
                                            target_id: id,
                                        }
                                    );
                                });

                            break;
                        case 5:
                            var penalize = '永久封禁（删除发言，不可重新加入）';
                            bot.axios.post(
                                'https://www.kaiheila.cn/api/v3/blacklist/create',
                                {
                                    guild_id: session.guildId,
                                    target_id: id,
                                    remark: rule + ';' + penalize,
                                    del_msg_days: 7,
                                }
                            );
                            break;
                    }
                    bot.API.directMessage.create(
                        1,
                        id,
                        (await bot.API.userChat.create(id)).code,
                        '你好，我是开黑啦『Rainbow Six 小队丨玩家社区 』管理员，有人匿名举报你在本社区有违规行为，我们也能够理解你当时的心情，导致你出现违规的原因，但是玩家社区是一个公开公共游戏交流的地方，我们建议您在本社区进行文字聊天以及语音聊天时，能够做到文明友好的交流！文明共同营造良好的社区环境！！！\n\n根据『Rainbow Six 小队丨玩家社区 规则』你违反了' +
                            rule +
                            '\n特此 ' +
                            penalize +
                            ' ！\n\n感谢你对『Rainbow Six 小队丨玩家社区 』的支持与理解'
                    );
                    bot.API.message.create(
                        10,
                        '9515554930036017',
                        new Card()
                            .addTitle('处罚公示')
                            .addText('被处罚用户ID：' + id)
                            .addText('违反规则：' + rule)
                            .addText('处罚：' + penalize)
                            .setTheme('danger')
                            .toString()
                    );
                    session.send(
                        'OK:\nrule:' + rule + '\npenalize:' + penalize
                    );
                } else session.send('no_parametrics');
            });
    };
}
export const r6Pm = new R6Pm();
