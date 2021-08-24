import { AppCommand, AppFunc, BaseSession, Card } from 'kbotify';
import { NodeArray, resolveModuleName } from 'typescript';
import { R6id } from '../../index'
var https = require('https');
var url = "https://r6.tracker.network/profile/pc/";
var avmmr: number = 0, xmmr: number = 0, nmmr: number = 9999, num = 0;
var cd: any
var ok: number = 0;
var rankable: boolean;
class R6Query extends AppCommand {
    code = 'query'; // 只是用作标记
    trigger = '查询'; // 用于触发的文字
    help = '`.r6 query+r6id`'; // 帮助文字
    intro = '复读你所说的文字, 并用kmarkdown格式返回。';
    func: AppFunc<BaseSession> = async (session) => {
        if (!session.args.length)
            return session.reply(this.help);
        num = session.args.length;
        ok = 0;
        xmmr = 0;
        nmmr = 9999;

        var main = async function () {
            for (var i = 0; i < num; i++) {
                var r6id = session.args[i];
                send(await get(r6id))
            }
            await setTimeout(() => {
                final()
            }, 1000);
        }()

        async function get(r6id: string) {
            return new Promise<string>((resolve, reject) => {
                var urln = url + r6id;
                console.log(r6id);
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
                            var imglink = html.match('<meta property="og:image" content="(.*?)" />')[1];
                            var namer = html.match('R6Tracker - (.*?) -  Rainbow Six Siege Player Stats')[1];
                            var arg1 = namer;
                            var arg2 = mmr;
                            var arg3 = rank.replace(' ', '');
                            var arg4 = kd;
                            var arg5 = imglink;
                            var arg6 = '#B2B6BB';
                            if (rank.search(/COPPER/) === 0) { arg6 = "#B30B0D"; }
                            if (rank.search(/BRONZE/) === 0) { arg6 = "#C98B3B"; }
                            if (rank.search(/SILVER/) === 0) { arg6 = "#B0B0B0"; }
                            if (rank.search(/GOLD/) === 0) { arg6 = "#EED01E"; }
                            if (rank.search(/PLATINUM/) === 0) { arg6 = "#5BB9B3"; }
                            if (rank.search(/DIAMOND/) === 0) { arg6 = "#BD9FF6"; }
                            if (rank.search(/CHAMPION/) === 0) { arg6 = "#9D385C"; }
                            var card: any = [{ "type": "card", "theme": "secondary", "color": arg6, "size": "sm", "modules": [{ "type": "section", "text": { "type": "kmarkdown", "content": "                 **" + arg1 + "**" }, "mode": "left", "accessory": { "type": "image", "src": arg5, "size": "lg" } }] }, { "type": "card", "theme": "secondary", "color": arg6, "size": "lg", "modules": [{ "type": "section", "text": { "type": "paragraph", "cols": 3, "fields": [{ "type": "kmarkdown", "content": "**MMR**\n" + arg2 }, { "type": "kmarkdown", "content": "**段位**\n" + arg3 }, { "type": "kmarkdown", "content": "**赛季KD**\n" + arg4 }] } }] }]
                            var immr = parseInt(mmr)
                            avmmr = avmmr + immr;
                            if (xmmr < immr) xmmr = immr;
                            if (nmmr > immr) nmmr = immr;
                            resolve(JSON.stringify(card));//成功返回
                        }
                    });
                }).on('error', function () {
                    session.send("ERROR");
                    reject(-1);
                })
            })
        }
        async function send(card: string) {
            return new Promise<void>((resolve, reject) => {
                var send = async function () {
                    ok++;
                    await session.sendCard(card);
                    resolve()
                }()
            })
        }

        async function final() {
            console.log(ok);
            console.log(num);
            return new Promise<void>((resolve, reject) => {
                if (ok == num) {
                    console.log('Finally!');
                    avmmr = avmmr / num;
                    if (xmmr - nmmr > 700) rankable = false;
                    else rankable = true;
                    var card = [{
                        "type": "card",
                        "theme": "secondary",
                        "size": "lg",
                        "modules": [
                            {
                                "type": "section",
                                "text": {
                                    "type": "plain-text",
                                    "content": "Average MMR:" + avmmr
                                }
                            },
                            {
                                "type": "section",
                                "text": {
                                    "type": "plain-text",
                                    "content": "MMR Max Difference:" + (xmmr - nmmr)
                                }
                            },
                            {
                                "type": "section",
                                "text": {
                                    "type": "plain-text",
                                    "content": "是否可以排位：" + rankable
                                }
                            }
                        ]
                    }]
                    session.sendCard(JSON.stringify(card));
                    resolve();
                }
            })
        }
    }

}
export const r6Query = new R6Query();
