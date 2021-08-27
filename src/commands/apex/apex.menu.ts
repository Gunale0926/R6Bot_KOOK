import { MenuCommand } from '../..';
import { Card } from '../../core/card'
import { apexSearch } from './apex.search.app'
import { apexRecord } from './r6.record.app';
class ApexMenu extends MenuCommand {
    code = 'apex';
    trigger = 'apex';
    help = '输入".apex record+ID"（缩写".记录"）将录入ID到数据库(其他指令的前提)\n输入".apex search @某人"或".apex search apexID"（缩写.查询）查询某人ID和战绩';
    intro = '查询菜单';
    menu = new Card().addText(this.help).toString();
    useCardMenu = true; // 使用卡片菜单
}

export const apexMenu = new ApexMenu(apexSearch,apexRecord);