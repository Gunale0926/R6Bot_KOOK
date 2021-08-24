import { AppCommand, AppFunc, BaseSession, Card } from 'kbotify';
var mysql = require('mysql');
var tabname = 'usrlib'
var https = require('https');
var url = "https://r6.tracker.network/profile/pc/";
var avmmr: number = 0, xmmr: number = 0, nmmr: number = 9999, num = 0;
var connection = mysql.createConnection({
    host: 'localhost',
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
        async function searchid(id: string) {
            return new Promise<string>((resolve, reject) => {

                var exp = 'SELECT r6id FROM ' + tabname + ' WHERE id=' + id + ' && sel =1';
                connection.query(exp, function (err: any, result: any) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                    }
                    else {
                        var r6id = JSON.stringify(result).match('"r6id":"(.*?)"}')[1]
                        resolve(r6id);
                    }

                });
            })
        }
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
                            var imglink = session.user.avatar
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
                    await session.sendCard(card);
                    resolve()
                }()
            })
        }
        async function main() {
            if (session.args[0]) {
                if (session.args[0].search('#(.*?)') !== -1) {
                    var id = session.args[0].match(/#(\S*)/)[1];
                    await send(await get(await searchid(id)));
                }
                else if (session.args[0])
                    await send(await get(session.args[0]))
            }
            else
                session.sendCard(new Card().addText(r6Search.help).toString())
        }
        main()
    }

}
export const r6Search = new R6Search();
