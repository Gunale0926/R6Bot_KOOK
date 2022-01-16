import { AppCommand, AppFunc, BaseSession } from '../..';
import { bot } from 'tests/init';
class TestButton extends AppCommand {
    code = 'button';
    trigger = 'button';
    help = '`.test button`';
    intro = '发送一个按钮以进行按钮测试';
    func: AppFunc<BaseSession> = async (session) => {
        console.log(await bot.API.guildRole.index(session.guildId))
    };
}
export const testButton = new TestButton();