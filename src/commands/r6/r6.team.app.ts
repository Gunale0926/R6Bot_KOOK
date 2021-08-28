import { AppCommand, AppFunc, BaseSession, Card } from '../..';
import { bot } from 'tests/init';
class R6Team extends AppCommand {
    code = 'team'; // 只是用作标记s
    trigger = 'team'; // 用于触发的文字
    help = '注意：请私聊机器人此指令".r6 team + 频道名称（干员英文名）+模式+要求"(缩写.组队)（例如：.组队 BANDIT 排位 2500分左右 KD0.5以上）'; // 帮助文字
    intro = '发布组队';
    response: 'both';
    func: AppFunc<BaseSession> = async (session) => {
        var flag = 0;
        bot.API.guild.userList('3128617072930683')//r6小队频道id
            .then(function (response) {
                for (var i = 0; i < response.items.length; i++) {
                    if (response.items[i].id == session.userId) {
                        for (var j = 0; j < response.items[i].roles.length; j++) {
                            if (response.items[i].roles[j] == 373758) {//内测用户组
                                break;
                            } else flag++
                        }
                        if (flag == response.items[i].roles.length) {
                            var forbidden = async function () {
                                return await session.send("没有权限");
                            }()
                        }
                        else {
                            main()
                        }
                    }
                }
            })
        async function main() {
            if (session.args.length == 0)
                session.sendCard(new Card().addTitle(r6Team.code).addText(r6Team.intro).addText(r6Team.help))
            var card = new Card().addTitle('频道: ' + session.args[0] + ' 模式：' + session.args[1]).addText('发布者：' + session.user.nickname)
            for (var i = 2; i < session.args.length; i++)
                card.addText(session.args[i])
            if (session.args[0].search('DOC') !== -1 || session.args[0].search('ROOK') !== -1 || session.args[0].search('MUTE') !== -1 || session.args[0].search('ECHO') !== -1 || session.args[0].search('ORYX') !== -1 || session.args[0].search('JAGER') !== -1 || session.args[0].search('SLEDGE') !== -1 || session.args[0].search('BANDIT') !== -1 || session.args[0].search('HIBANA') !== -1) {
                await bot.API.message.create(10, '3028698496410440', card.toString())
                await bot.API.message.create(10, '3028698496410440', getCard().addTitle('点击按钮之前请先进入挂机语音频道').toString())
                await session.send("发送成功，请在组队频道查询")
            } else return session.sendCard(new Card().addTitle("频道名称输入不正确！"));
            function getCard() {
                return new Card({
                    type: 'card',
                    theme: 'secondary',
                    size: 'lg',
                    modules: [
                        {
                            type: 'header',
                            text: {
                                type: 'plain-text',
                                content: '加入该队的语音',
                            },
                        },
                        {
                            type: 'action-group',
                            elements: [
                                {
                                    type: 'button',
                                    theme: 'primary',
                                    value: session.args[0],
                                    click: 'return-val',
                                    text: {
                                        type: 'plain-text',
                                        content: '加入',
                                    },
                                },
                            ],
                        },
                    ],
                });
            }
        }
    }
}
export const r6Team = new R6Team();
