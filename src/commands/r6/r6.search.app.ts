import { AppCommand, AppFunc, BaseSession } from '../..';
import { connection } from '../../tests/init'
var tabname = 'usrlib'
var https = require('https');
var url = "https://r6.tracker.network/profile/pc/";
class R6Search extends AppCommand {
    code = 'search'; // 只是用作标记
    trigger = 'search'; // 用于触发的文字
    help = '`.查询 @某人`或`.查询 R6ID`查询某人战绩'; // 帮助文字
    intro = '查询ID';
    func: AppFunc<BaseSession> = async (session) => {
        if (session.channel.id == '2249183588482976') {
            session.send('此频道禁止查询')
            return;
        }
        var flag = false;
        var exp3 = 'SELECT expdate FROM usrlib WHERE id="' + session.userId + '"';
        connection.query(exp3, function (err: any, result: any) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
            }
            else {
                try {
                    var expdate = new Date(result[0].expdate);
                }
                catch {
                    var expdate = new Date('1900-1-1 00:00:00');
                }
                var date = new Date(); //现在
                if (expdate >= date)
                    flag = true;
                else
                    flag = false;
                main();
            }
        });
        async function main() {
            if (session.args[0]) {
                if (session.args[0].search('#(.*?)') !== -1) {
                    var id = session.args[0].match(/#(\S*)/)[1];
                    var r6id = await searchid(id)
                    if (r6id == null)
                        session.send("此人未绑定R6ID，需先`.绑定 R6ID`")
                    else {
                        get(r6id)
                    }
                    return;
                }
                else if (session.args[0])
                    get(session.args[0])
                return;
            }
            else {
                var r6id = await searchid(session.userId)
                if (r6id == null)
                    session.send("您未绑定R6ID，`.绑定 R6ID`后直接输入`.查询`可直接查询自己的战绩")
                else {
                    get(r6id)
                }
                return;
            }
        }
        async function searchid(id: string) {
            return new Promise<any>(async (resolve) => {
                var exp = 'SELECT r6id FROM ' + tabname + ' WHERE id=' + id;
                connection.query(exp, function (err: any, result: any) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                    }
                    else if (result[0])
                        resolve(result[0].r6id);
                    else {
                        resolve(null)
                    }
                });
            });
        }
        function get(r6id: string) {
            var urln = url + r6id + '/';
            https.get(urln, function (res: any) {
                var html: string = '';
                res.on('data', function (data: any) {
                    html += data;
                });
                res.on('end', function () {
                    if (html.match("RankedKDRatio") == null) {
                        session.send("查无此人，请检查ID后重试");
                        return;
                    }
                    else {
                        html = html.replace(/\n/g, '');
                        try {
                            var mmr = html.match('<div class="trn-defstat__name">MMR</div><div class="trn-defstat__value">(.*?)</div>')[1].replace(',', '');
                            var rank = html.match('<div class="trn-defstat__name">Rank</div><div class="trn-defstat__value">(.*?)</div>')[1];
                            var kd = html.match('<div class="trn-defstat__value" data-stat="RankedKDRatio">(.*?)</div>')[1];
                            //if (flag) var src = html.match('<div class="trn-profile-header__avatar trn-roundavatar trn-roundavatar--white "><img src="(.*?)" /></div>')[1];
                            //else
                            var src = session.user.avatar;
                            var namer = html.match('R6Tracker - (.*?) -  Rainbow Six Siege Player Stats')[1];
                            var level = html.match('<div class="trn-defstat__name">Level</div><div class="trn-defstat__value-stylized">(.*?)</div>')[1];
                            //var WLratio = html.match('<div class="trn-defstat__value" data-stat="PVPWLRatio">(.*?)</div>')[1];
                            var time = html.match('<div class="trn-defstat__value" data-stat="PVPTimePlayed">(.*?)</div>')[1];
                        } catch (error) {
                            throw (error)
                        }
                        try {
                            var highestMMR = html.match('<div class="trn-defstat__name">Best MMR</div><div class="trn-defstat__value-stylized">(.*?)</div>')[1].replace(',', '');
                        } catch (error) {
                            highestMMR = 'N/A'
                        }
                        try {
                            var skd = html.match('<div class="trn-defstat__name">K/D</div><div class="trn-defstat__value">(.*?)<small>')[1];
                        } catch (error) {
                            skd = 'N/A'
                        }
                        var arg3 = rank.replace(' ', '');
                        var arg6 = '#B2B6BB';
                        var rankcn;
                        if (rank.search(/COPPER/) === 0) { arg6 = "#B30B0D"; rankcn = "紫铜"; arg3 = arg3.replace('COPPER', ''); }
                        if (rank.search(/BRONZE/) === 0) { arg6 = "#C98B3B"; rankcn = "青铜"; arg3 = arg3.replace('BRONZE', ''); }
                        if (rank.search(/SILVER/) === 0) { arg6 = "#B0B0B0"; rankcn = "白银"; arg3 = arg3.replace('SILVER', ''); }
                        if (rank.search(/GOLD/) === 0) { arg6 = "#EED01E"; rankcn = "黄金"; arg3 = arg3.replace('GOLD', ''); }
                        if (rank.search(/PLATINUM/) === 0) { arg6 = "#5BB9B3"; rankcn = "白金"; arg3 = arg3.replace('PLATINUM', ''); }
                        if (rank.search(/DIAMOND/) === 0) { arg6 = "#BD9FF6"; rankcn = "钻石"; arg3 = arg3.replace('DIAMOND', ''); }
                        if (rank.search(/CHAMPION/) === 0) { arg6 = "#9D385C"; arg3 = '冠军'; }
                        if (rank.search(/-/) === 0) { arg6 = "#B2B6BB"; arg3 = "未定级"; }
                        if (arg3 === 'I') arg3 = rankcn += '1';
                        else if (arg3 === 'II') arg3 = rankcn + '2';
                        else if (arg3 === 'III') arg3 = rankcn + '3';
                        else if (arg3 === 'IV') arg3 = rankcn + '4';
                        else if (arg3 === 'V') arg3 = rankcn + '5';
                        try {
                            var l1 = 'High Calibre';
                            var l1v = html.match(l1 + '</div><div><span class="r6-quickseason__value[\\s\\S]*?">(.*?)</span>')[1].replace(',', '');
                        } catch (error) {
                            l1v = '未定级';
                        }
                        try {
                            var l2 = 'Crystal Guard';
                            var l2v = html.match(l2 + '</div><div><span class="r6-quickseason__value[\\s\\S]*?">(.*?)</span>')[1].replace(',', '');
                        } catch (error) {
                            l2v = '未定级';
                        }
                        if (flag)
                            var card = [{
                                "type": "card", "theme": "secondary", "color": arg6, "size": "lg",
                                "modules": [{
                                    "type": "section", "text": { "type": "kmarkdown", "content": "**:crown:" + namer + "**" },
                                    "mode": "left", "accessory": { "type": "image", "src": src, "size": "lg" }
                                }, {
                                    "type": "section", "text": {
                                        "type": "paragraph", "cols": 3, "fields": [
                                            { "type": "kmarkdown", "content": "**等级**\n" + level },
                                            { "type": "kmarkdown", "content": "**段位**\n" + arg3 },
                                            { "type": "kmarkdown", "content": "**总KD**\n" + kd },
                                            { "type": "kmarkdown", "content": "**MMR**\n" + mmr },
                                            { "type": "kmarkdown", "content": "**赛季KD**\n" + skd },
                                            { "type": "kmarkdown", "content": "**历史最高分**\n" + highestMMR },
                                            { "type": "kmarkdown", "content": "**多人游戏时长**\n" + time },
                                            { "type": "kmarkdown", "content": "**" + l1 + "**\n" + l1v },
                                            { "type": "kmarkdown", "content": "**" + l2 + "**\n" + l2v },
                                        ]
                                    }
                                },
                                {
                                    "type": "section",
                                    "text": {
                                        "type": "kmarkdown",
                                        "content": "(ins)[查看更多](" + urln + ")(ins)"
                                    }
                                }]
                            }]
                        else
                            var card = [{
                                "type": "card", "theme": "secondary", "color": arg6, "size": "lg",
                                "modules": [{
                                    "type": "section", "text": { "type": "kmarkdown", "content": "**" + namer + "**" },
                                    "mode": "left", "accessory": { "type": "image", "src": src, "size": "lg" }
                                }, {
                                    "type": "section", "text": {
                                        "type": "paragraph", "cols": 3, "fields": [
                                            { "type": "kmarkdown", "content": "**等级**\n" + level },
                                            { "type": "kmarkdown", "content": "**段位**\n" + arg3 },
                                            { "type": "kmarkdown", "content": "**总KD**\n" + kd },
                                            { "type": "kmarkdown", "content": "**MMR**\n(spl)[解锁](https://afdian.net/@Gunale)(spl)" },
                                            { "type": "kmarkdown", "content": "**赛季KD**\n(spl)[解锁](https://afdian.net/@Gunale)(spl)" },
                                            { "type": "kmarkdown", "content": "**历史最高分**\n(spl)[解锁](https://afdian.net/@Gunale)(spl)" },
                                            { "type": "kmarkdown", "content": "**多人游戏时长**\n" + time },
                                            { "type": "kmarkdown", "content": "**" + l1 + "**\n" + l1v },
                                            { "type": "kmarkdown", "content": "**" + l2 + "**\n" + l2v },
                                        ]
                                    }
                                },
                                {
                                    "type": "section",
                                    "text": {
                                        "type": "kmarkdown",
                                        "content": "[解锁](https://afdian.net/@Gunale)~~查看更多~~"
                                    }
                                }]
                            }]
                        session.sendCard(JSON.stringify(card));
                    }
                });
            }).on('error', function () {
                session.send("ERROR");
            })
        }
    }
}
export const r6Search = new R6Search();
