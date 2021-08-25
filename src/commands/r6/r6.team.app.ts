import { AppCommand, AppFunc, BaseSession, Card } from 'kbotify';
import { bot } from 'init/client';
class R6Active extends AppCommand {
    code = 'team'; // 只是用作标记
    trigger = 'team'; // 用于触发的文字
    help = '.r6 team + 组队的要求（例如：排位 2500分左右 KD0.5以上）'; // 帮助文字
    intro = '发布组队';
    func: AppFunc<BaseSession> = async (session) => {
        
    }
}
export const r6Active = new R6Active();
