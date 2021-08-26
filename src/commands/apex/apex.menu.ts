import { MenuCommand } from '../..';
import { Card } from '../../core/card'
import { r6Status } from './apex.status.app';
import { r6Record } from './apex.record.app';
import { apexSearch } from './apex.search.app'
import { r6Active } from './apex.active.app'
import { r6Applyrole } from './apex.applyrole.app'
import { r6Team } from './apex.team.app'
class R6Menu extends MenuCommand {
    code = 'r6';
    trigger = 'r6';
    help = '输入".r6 record+ID"（缩写".记录"）将录入ID到数据库(其他指令的前提)\n输入".r6 search @某人"或".r6 search R6ID"（缩写.查询）查询某人ID和战绩\n输入".r6 status"(缩写".状态")查询频道内人员排位情况（目前只能在电箱频道使用）\n输入".r6 applyrole + 彩虹六号内的干员"（缩写".申请角色"）可获得该干员的角色\n输入".r6 team"(缩写.组队)查看组队帮助菜单(此指令目前内测当中，目前只有内测用户可以发布组队)\n输入".r6 active + CDK"激活内测权限（https://afdian.net/@Gunale 处可获取）（注意：此指令只能私聊机器人触发！！！）';
    intro = '查询菜单';
    menu = new Card().addText(this.help).toString();
    useCardMenu = true; // 使用卡片菜单
}

export const r6Menu = new R6Menu(r6Status, r6Record, apexSearch, r6Active, r6Applyrole, r6Team);