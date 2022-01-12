import { MenuCommand } from '../..';
import { Card } from '../../core/card'
import { r6Record } from './r6.record.app';
import { r6Search } from './r6.search.app'
import { r6Active } from './r6.active.app'
import { r6Applyrole } from './r6.applyrole.app'
import { r6Team } from './r6.team.app'
import { r6Revokerole } from './r6.revokerole.app';
import { r6Announce } from './r6.announce.app';
import { r6Auth } from './r6.auth.app';
class R6Menu extends MenuCommand {
    code = 'r6';
    trigger = 'r6';
    help = '`.查询 @某人`或`.查询 R6ID`查询某人绑定ID和战绩\n`.绑定 R6ID`绑定用户的R6ID\n`.申请角色 R6干员英文名（大写）`可获得该干员的角色\n`.撤销角色 R6干员英文名（大写）`可撤销该干员的角色\n`.组队`查看组队帮助菜单\n`.激活 CDK`激活赞助者权限（仅限私聊机器人触发）\n`.认证`认证彩虹六号成绩';
    intro = '查询菜单';
    menu = new Card().addText(this.help).setColor("danger").toString();
    useCardMenu = true; // 使用卡片菜单
}

export const r6Menu = new R6Menu(r6Record, r6Search, r6Active, r6Applyrole, r6Team, r6Revokerole, r6Announce, r6Auth);