import { AppCommand, AppFunc, BaseSession, Card } from '../..';
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
        var flag = false;
        var exp = 'SELECT act FROM cdklist WHERE id="' + session.userId + '" && act=1';
        connection.query(exp, async function (err: any, result: any) {
            if (err) {
                console.log('[SELECT ERROR] - ', err.message);
                session.send("INJECT")
            }
            else if (result[0]) {
                flag = true
                main()
            }
            else {
                //session.send("前往[爱发电](https://afdian.net/item?plan_id=399e6166059011ec865552540025c377)支持后可使用高级版！")
                flag = false
                main()
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
                        var rawhtml = html;
                        html = html.replace(/\n/g, '');
                        var mmr = html.match('<div class="trn-defstat__name">MMR</div><div class="trn-defstat__value">(.*?)</div>')[1].replace(',', '');
                        var rank = html.match('<div class="trn-defstat__name">Rank</div><div class="trn-defstat__value">(.*?)</div>')[1];
                        var kd = html.match('<div class="trn-defstat__value" data-stat="RankedKDRatio">(.*?)</div>')[1];
                        //if (flag) var src = html.match('<div class="trn-profile-header__avatar trn-roundavatar trn-roundavatar--white "><img src="(.*?)" /></div>')[1];
                        //else
                        var src = session.user.avatar;
                        if (src == 'https://img.kaiheila.cn/assets/avatar_7.jpg/icon')
                            src = 'https://img.kaiheila.cn/assets/avatar_1.jpg/icon'
                        var namer = html.match('R6Tracker - (.*?) -  Rainbow Six Siege Player Stats')[1];
                        var level = html.match('<div class="trn-defstat__name">Level</div><div class="trn-defstat__value-stylized">(.*?)</div>')[1];
                        var WLratio = html.match('<div class="trn-defstat__value" data-stat="PVPWLRatio">(.*?)</div>')[1];
                        var highestMMR = html.match('<div class="trn-defstat__name">Best MMR</div><div class="trn-defstat__value-stylized">(.*?)</div>')[1].replace(',', '');
                        var time = html.match('<div class="trn-defstat__value" data-stat="PVPTimePlayed">(.*?)</div>')[1];
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
                        if (rank.search(/CHAMPION/) === 0) { arg6 = "#9D385C"; rankcn = "冠军"; arg3 = arg3.replace('CHAMPION', ''); }
                        if (rank.search(/-/) === 0) { arg6 = "#B2B6BB"; arg3 = "未定级"; }
                        if (arg3 === 'I') arg3 = rankcn += '1';
                        if (arg3 === 'II') arg3 = rankcn + '2';
                        if (arg3 === 'III') arg3 = rankcn + '3';
                        if (arg3 === 'IV') arg3 = rankcn + '4';
                        if (arg3 === 'V') arg3 = rankcn + '5';
                        var l1 = 'High Calibre'
                        var l1v = html.match(l1 + '</div><div><span class="r6-quickseason__value[\\s\\S]*?">(.*?)</span>')[1].replace(',', '');
                        var l2 = 'Crystal Guard'
                        var l2v = html.match(l2 + '</div><div><span class="r6-quickseason__value[\\s\\S]*?">(.*?)</span>')[1].replace(',', '');
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
                                            { "type": "kmarkdown", "content": "**多人游戏时长**\n" + time },
                                            { "type": "kmarkdown", "content": "**历史最高分**\n" + highestMMR },
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
                                            { "type": "kmarkdown", "content": "**MMR**\n(spl)[¥10解锁](https://afdian.net/item?plan_id=399e6166059011ec865552540025c377)(spl)" },
                                            { "type": "kmarkdown", "content": "**赛季KD**\n(spl)[¥10解锁](https://afdian.net/item?plan_id=399e6166059011ec865552540025c377)(spl)" },
                                            { "type": "kmarkdown", "content": "**多人游戏时长**\n(spl)[¥10解锁](https://afdian.net/item?plan_id=399e6166059011ec865552540025c377)(spl)" },
                                            { "type": "kmarkdown", "content": "**历史最高分**\n" + highestMMR },
                                            { "type": "kmarkdown", "content": "**" + l1 + "**\n" + l1v },
                                            { "type": "kmarkdown", "content": "**" + l2 + "**\n" + l2v },
                                        ]
                                    }
                                },
                                {
                                    "type": "section",
                                    "text": {
                                        "type": "kmarkdown",
                                        "content": "~~查看更多~~[解锁](https://afdian.net/item?plan_id=399e6166059011ec865552540025c377)"
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
