import { AppCommand, AppFunc, BaseSession, Card } from '../..';
import { bot } from 'tests/init';
var mysql = require('mysql');
var tabname = 'usrlib'
var https = require('https');
var url = "https://r6.tracker.network/profile/pc/";
var avmmr: number = 0, xmmr: number = 0, nmmr: number = 9999, num = 0;
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'bot_db'
});
class R6Search extends AppCommand {
    code = 'search'; // 只是用作标记
    trigger = 'search'; // 用于触发的文字
    help = '.r6 search+@你要查询的人\n或者\n.r6 search+ID\n(缩写".查询")'; // 帮助文字
    intro = '查询ID';
    func: AppFunc<BaseSession> = async (session) => {
        if (session.args.length == 0)
            session.sendCard(new Card().addTitle(this.code).addText(this.intro).addText(this.help))
        bot.API.guild.userList('3128617072930683')//r6小队频道id
            .then(function (response) {
                var flag = 0;
                for (var i = 0; i < response.items.length; i++) {
                    if (response.items[i].id == session.userId) {
                        for (var j = 0; j < response.items[i].roles.length; j++) {
                            if (response.items[i].roles[j] == 373739) {//赞助用户组
                                var permission = async function () {
                                    return await main(true)
                                }()
                            } else flag++;
                        }
                        if (flag == response.items[i].roles.length) {
                            var forbidden = async function () {
                                return await main(false)
                            }()
                        }
                    }
                }
            })
        async function searchid(id: string) {
            return new Promise<string>((resolve, reject) => {
                var exp = 'SELECT r6id FROM ' + tabname + ' WHERE id=' + id + ' && sel =1';
                connection.query(exp, function (err: any, result: any) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        session.send("数据库中查无此人，请先\".记录\"")
                    }
                    else if (JSON.stringify(result).search('r6id') !== -1) {
                        var r6id = JSON.stringify(result).match('"r6id":"(.*?)"}')[1]
                        resolve(r6id);
                    } else {
                        session.send("数据库中查无此人，请先\".记录\"")
                    }

                });
            })
        }
        async function get(r6id: string, vip: boolean) {
            return new Promise<void>((resolve, reject) => {
                var urln = url + r6id;
                https.get(urln, function (res: any) {
                    var html: string = '';
                    res.on('data', function (data: any) {
                        html += data;
                    });
                    res.on('end', function () {
                        if (html.indexOf("RankedKDRatio") == -1) {
                            session.send("查无此人");
                        }
                        else {
                            html = html.replace(/\n/g, '');
                            var mmr = html.match('<div class="trn-defstat__name">MMR</div><div class="trn-defstat__value">(.*?)</div>')[1].replace(',', '');
                            var rank = html.match('<div class="trn-defstat__name">Rank</div><div class="trn-defstat__value">(.*?)</div>')[1];
                            var kd = html.match('<div class="trn-defstat__value" data-stat="RankedKDRatio">(.*?)</div>')[1];
                            var imglink = session.user.avatar
                            var namer = html.match('R6Tracker - (.*?) -  Rainbow Six Siege Player Stats')[1];
                            var arg1: string = '';
                            for (var i = 0; i < (35 - namer.length) / 2; i++) {
                                arg1 += ' ';
                            }
                            arg1 += namer;
                            if (vip == true) {
                                for (var i = 0; i < (35 - namer.length) / 2; i++) {
                                    arg1 += ' ';
                                }
                                arg1 += ':crown:'
                            }
                            var arg2 = mmr;
                            var arg3 = rank.replace(' ', '');
                            var arg4 = kd;
                            var arg5 = imglink;
                            var arg6 = '#B2B6BB';
                            var rankcn;
                            if (rank.search(/COPPER/) === 0) { arg6 = "#B30B0D"; rankcn = "紫铜"; arg3 = arg3.replace('COPPER', ''); }
                            if (rank.search(/BRONZE/) === 0) { arg6 = "#C98B3B"; rankcn = "青铜"; arg3 = arg3.replace('BRONZE', ''); }
                            if (rank.search(/SILVER/) === 0) { arg6 = "#B0B0B0"; rankcn = "白银"; arg3 = arg3.replace('SILVER', ''); }
                            if (rank.search(/GOLD/) === 0) { arg6 = "#EED01E"; rankcn = "黄金"; arg3 = arg3.replace('GOLD', ''); }
                            if (rank.search(/PLATINUM/) === 0) { arg6 = "#5BB9B3"; rankcn = "白金"; arg3 = arg3.replace('PLATINUM', ''); }
                            if (rank.search(/DIAMOND/) === 0) { arg6 = "#BD9FF6"; rankcn = "钻石"; arg3 = arg3.replace('DIAMOND', ''); }
                            if (rank.search(/CHAMPION/) === 0) { arg6 = "#9D385C"; rankcn = "冠军"; arg3 = arg3.replace('CHAMPION', ''); }
                            if (arg3 === 'I') arg3 = rankcn + '1';
                            if (arg3 === 'II') arg3 = rankcn + '2';
                            if (arg3 === 'III') arg3 = rankcn + '3';
                            if (arg3 === 'IV') arg3 = rankcn + '4';
                            if (arg3 === 'V') arg3 = rankcn + '5';
                            if (arg3 === '') arg3 = rankcn;
                            if (arg3.search(/NoRank/) === 0) arg3 = "未定级";
                            var card = [{ "type": "card", "theme": "secondary", "color": arg6, "size": "sm", "modules": [{ "type": "section", "text": { "type": "kmarkdown", "content": "**" + arg1 + "**" }, "mode": "left", "accessory": { "type": "image", "src": arg5, "size": "lg" } }] }, { "type": "card", "theme": "secondary", "color": arg6, "size": "lg", "modules": [{ "type": "section", "text": { "type": "paragraph", "cols": 3, "fields": [{ "type": "kmarkdown", "content": "**MMR**\n" + arg2 }, { "type": "kmarkdown", "content": "**段位**\n" + arg3 }, { "type": "kmarkdown", "content": "**赛季KD**\n" + arg4 }] } }] }]
                            var immr = parseInt(mmr)
                            avmmr = avmmr + immr;
                            if (xmmr < immr) xmmr = immr;
                            if (nmmr > immr) nmmr = immr;
                            var send = async function () {
                                await session.sendCard(JSON.stringify(card));
                            }()
                            resolve();//成功返回
                        }
                    });
                }).on('error', function () {
                    session.send("ERROR");
                    reject(-1);
                })
            })
        }
        async function main(vip: boolean) {
            if (session.args[0]) {
                if (session.args[0].search('#(.*?)') !== -1) {
                    var id = session.args[0].match(/#(\S*)/)[1];
                    await get(await searchid(id), vip)
                    return;
                }
                else if (session.args[0])
                    await get(session.args[0], vip)
                return;
            }
        }
    }

}
export const r6Search = new R6Search();
