import { AppCommand, AppFunc, BaseSession, Card } from '../..';
import { bot } from 'tests/init';
var clkusr: string[];
class R6Team extends AppCommand {
    code = 'team'; // 只是用作标记s
    trigger = 'team'; // 用于触发的文字
    help = '注意：请私聊机器人此指令".r6 team + 频道名称（干员英文名）+模式+要求"(缩写.组队)（例如：.组队 BANDIT 排位 2500分左右 KD0.5以上）'; // 帮助文字
    intro = '发布组队';
    response: 'pm' = 'pm';
    func: AppFunc<BaseSession> = async (session) => {
        if (session.args.length == 0)
            session.sendCard(new Card().addTitle(this.code).addText(this.intro).addText(this.help))
        var card = new Card().addTitle('频道: ' + session.args[0] + ' 模式：' + session.args[1])
        for (var i = 2; i < session.args.length; i++)
            card.addText(session.args[i])
        if (session.args[0].search('DOC') !== -1 || session.args[0].search('ROOK') !== -1 || session.args[0].search('MUTE') !== -1 || session.args[0].search('ECHO') !== -1 || session.args[0].search('ORYX') !== -1 || session.args[0].search('JAGER') !== -1 || session.args[0].search('SLEDGE') !== -1 || session.args[0].search('BANDIT') !== -1 || session.args[0].search('HIBANA') !== -1){
            await bot.API.message.create(10, '9948172504885907', card.toString())
            await bot.API.message.create(10, '9948172504885907', getCard().toString())
        }else return session.sendCard(new Card().addTitle("频道名称输入不正确！"));
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
export const r6Team = new R6Team();
