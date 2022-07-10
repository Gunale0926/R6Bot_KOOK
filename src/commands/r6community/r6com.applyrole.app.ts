import { AppCommand, AppFunc, BaseSession, Card } from '../..';
import { bot, pars } from 'tests/init';
import { connection } from '../../tests/init';
class R6Applyrole extends AppCommand {
    code = 'applyrole'; // 只是用作标记
    trigger = 'applyrole'; // 用于触发的文字
    help = '`.申请角色 列表`查看可申请角色列表'; // 帮助文字
    intro = '申请角色';
    func: AppFunc<BaseSession> = async (session) => {
        if (session.guildId != '3128617072930683') {
            session.sendCard(
                new Card().addTitle('只能在Rainbow Six小队频道使用')
                );
            return;
        }
        if (session.args.length == 0) {
            session.sendCard(
                new Card().addTitle('申请角色').addText(this.help)
                );
            return;
        }
        if (session.args[0] == '列表') {
            var response = await bot.API.guildRole.index(session.guildId);
            var card = new Card().addTitle('可申请的角色列表');
            var text: string = '';
            var num: number = 0;
            for (var i = 0; i < response.length; i++) {
                if (
                    response[i].position >= pars.head &&
                    response[i].position <= pars.tail
                    ) {
                    text = text + response[i].name + '\n';
                num++;
            }
        }
        session.sendCard(
            card.addText('总计' + num + '个角色').addText(text),
            { temp: true }
            );
        return;
    }
    var rid: number,
    flag = false;
    GetRole().then(function (num: number) {
        var exp3 =
        'SELECT expdate FROM usrlib WHERE id="' + session.userId + '"';
        connection.query(exp3, function (err: any, result: any) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
            } else {
                try {
                    var expdate = new Date(result[0].expdate);
                } catch {
                    var expdate = new Date('1900-1-1 00:00:00');
                }
                    var date = new Date(); //现在
                    if (expdate >= date) {
                        if (num < 2) {
                            session.user.grantRole(rid, session.guildId);
                            session.user.grantRole(35688, session.guildId);
                            session.send('申请成功（' + (num + 1) + '/2）');
                            return;
                        } else {
                            session.send('高级用户最多只能申请两个！');
                            return;
                        }
                    } else {
                        if (num == 0) {
                            session.user.grantRole(rid, session.guildId);
                            session.user.grantRole(35688, session.guildId);
                            session.send('申请成功（1/1）');
                            return;
                        } else {
                            session.send('普通用户最多只能申请一个！[提高上限](https://afdian.net/@Gunale)');
                            return;
                        }
                    }
                }
            });
    });
    function GetRole() {
        return new Promise<number>(async (resolve) => {
            var response = await bot.API.guildRole.index(session.guildId);
            var num = 0;
            for (var i = 0; i < response.length; i++) {
                if (
                    response[i].name == session.args[0] &&
                    response[i].position >= pars.head &&
                    response[i].position <= pars.tail
                    ) {
                    rid = response[i].roleId;
                flag = true;
                bot.API.guild
                .userList(session.guildId)
                .then(function (usres) {
                    for (var j = 0; j < usres.items.length; j++) {
                        if (usres.items[j].id == session.userId) {
                            for (
                                var k = 0;
                                k < usres.items[j].roles.length;
                                k++
                                ) {
                                for (
                                    var z = 0;
                                    z < response.length;
                                    z++
                                    ) {
                                    if (
                                        usres.items[j].roles[k] ==
                                        response[z].roleId &&
                                        response[z].position >=
                                        pars.head &&
                                        response[z].position <=
                                        pars.tail
                                        ) {
                                        num++;
                                }
                            }
                        }
                    }
                }
                resolve(num);
            });
            }
        }
        if (!flag)
            session.send(
                '没有该角色，输入`.申请角色 列表`查看可申请角色列表'
                );
    });
    }
};
}

export const r6Applyrole = new R6Applyrole();
