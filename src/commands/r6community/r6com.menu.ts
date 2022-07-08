import { MenuCommand } from '../..';
import { Card } from '../../core/card';
import { r6Applyrole } from './r6com.applyrole.app';
import { r6Revokerole } from './r6com.revokerole.app';
import { r6Auth } from './r6com.auth.app';
class R6ComMenu extends MenuCommand {
    code = 'r6com';
    trigger = 'r6com';
    help =
        '仅可以在Rainbow Six 小队服务器使用！\n`.申请角色 R6干员英文名（大写）`可获得该干员的角色\n`.撤销角色 R6干员英文名（大写）`可撤销该干员的角色\n`.认证`认证彩虹六号成绩';
    intro = 'R6小队菜单';
    menu = new Card().addText(this.help).setColor('danger').toString();
    useCardMenu = true; // 使用卡片菜单
}

export const r6ComMenu = new R6ComMenu(
    r6Applyrole,
    r6Revokerole,
    r6Auth,
);
