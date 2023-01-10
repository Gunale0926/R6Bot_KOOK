import { MenuCommand } from '../..';
import { Card } from '../../core/card';
import { r6Record } from './r6.record.app';
import { r6Search } from './r6.search.app';
import { r6Active } from './r6.active.app';
import { r6Access } from './r6.access.app';
class R6Menu extends MenuCommand {
    code = 'r6';
    trigger = 'r6';
    help = '`.查询 R6ID (PS/Xbox)`查询某人绑定ID和战绩，默认PC平台，可在ID后加平台\n`.绑定 R6ID`绑定用户的R6ID\n私聊机器人`.激活 CDK`激活赞助者权限';
    intro = '查询菜单';
    menu = new Card().addText(this.help).setColor('danger').toString();
    useCardMenu = true; // 使用卡片菜单
}

export const r6Menu = new R6Menu(
    r6Record,
    r6Search,
    r6Active,
    r6Access
);
