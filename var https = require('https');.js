var https = require('https');
var querystring = require('querystring');
var url = "https://r6.tracker.network/profile/pc/";
var fs = require('fs');
var exec = require('child_process').exec;
var code = 0;
var avt;
async function send(cardr, channelID) {
    const axios = require('axios')
    axios({
        method: 'post',
        url: 'https://www.kaiheila.cn/api/v3/message/create',
        data: {
            type: '10',
            target_id: channelID,
            content: JSON.stringify(cardr)
        },
        headers: {
            'content-type': 'application/json',
            'Authorization': 'Bot 1/MTA0MTc=/sYIH9hZNtPtu4VUTOqC6eA=='
        }
    })
        .then(function (response) {
            console.log(response.data);
            if (JSON.stringify(response.data).match(/"code":(.*?),/)[1] == '40000') code = 40000;
            else code = 0;
        })
}
async function getavator(usrID) {
    return new Promise((resolve, reject) => {
        const axios = require('axios')
        axios({
            method: 'post',
            url: 'https://www.kaiheila.cn/api/v3/user/view',
            params: {
                user_id: usrID,
            },
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bot 1/MTA0MTc=/sYIH9hZNtPtu4VUTOqC6eA=='
            }
        })
            .then(function (response) {
                var reg = new RegExp('"avatar":"(.*?)/icon"', '');
                console.log(JSON.stringify(response.data).match(reg)[1]);
                resolve(JSON.stringify(response.data).match(reg)[1]);
            })
    })
}

module.exports = (ctx) => {
    ctx.middleware((session, next) => {
        console.log(session.username + ":" + session.content);
        if (session.content.search(/查询/) === 0) {
            async function main() {
                var imglink = await getavator(session.userId);
            }
            main();
            var name = session.content.replace('查询 ', '');
            name = name.replace(' --self', '');
            var urln = url + name;
            https.get(urln, function (res) {
                var html = '';
                res.on('data', function (data) {
                    html += data;
                });
                res.on('end', function () {
                    if (html.search("RankedKDRatio") === -1) {
                        session.send("查无此人");
                    }
                    else {
                        html = html.replace(/\n/g, '');
                        var mmr = html.match('<div class="trn-defstat__name">MMR</div><div class="trn-defstat__value">(.*?)</div>')[1];
                        console.log(mmr);
                        var rank = html.match('<div class="trn-defstat__name">Rank</div><div class="trn-defstat__value">(.*?)</div>')[1];
                        var kd = html.match('<div class="trn-defstat__value" data-stat="RankedKDRatio">(.*?)</div>')[1];

                        var arg1 = name;
                        var arg2 = mmr;
                        var arg3 = rank.replace(' ', '');
                        var arg4 = kd;
                        var arg5 = imglink;
                        var arg6 = '#B2B6BB';
                        var arg7 = session.channelId;
                        var rankcn = ''
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
                        card = [{ "type": "card", "theme": "secondary", "color": arg6, "size": "sm", "modules": [{ "type": "section", "text": { "type": "kmarkdown", "content": "                 **" + arg1 + "**" }, "mode": "left", "accessory": { "type": "image", "src": arg5, "size": "lg" } }] }, { "type": "card", "theme": "secondary", "color": arg6, "size": "lg", "modules": [{ "type": "section", "text": { "type": "paragraph", "cols": 3, "fields": [{ "type": "kmarkdown", "content": "**MMR**\n" + arg2 }, { "type": "kmarkdown", "content": "**段位**\n" + arg3 }, { "type": "kmarkdown", "content": "**赛季KD**\n" + arg4 }] } }] }];
                        send(card, arg7);
                        if (code === 40000) session.send("ERROR CODE 40000 请稍后再试");
                    }
                });
            }).on('error', function () {
                session.send("ERROR");
            });
        }

        if (session.content.search(/searchid /) === 0) {
            var useid = session.content.match('id=(.*?)]')[1];
            console.log(useid);
            fs.readFile("useridlib.txt", function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    var datastr = data.toString();
                    console.log(datastr);
                    var reg = new RegExp(useid + " (.*?)\\r\\n", "g");
                    var reg2 = new RegExp(useid, "g");
                    var id = datastr.match(reg).toString();
                    id = id.replace(reg2, '');
                    id = id.replace(/,/g, '');
                    id = id.replace(/ /g, '');
                    console.log(id);
                    session.send(id);
                }
            });
        }
        if (session.content.search(/申请角色 /) === 0) {
            var useid = session.userId;
            var command = "python getrole.py";
            var role = session.content.replace("申请角色 ", '');
            exec(command, function (error, stdout, stderr) {
                if (stdout.length > 1) {
                    var output = stdout;
                    var reg = new RegExp('"name":"' + role + '",(.*?)"role_id":', "");
                    temp = output.match(reg)[1];
                    var reg2 = new RegExp('"name":"' + role + '",' + temp + '"role_id":(.*?),"type":0', "");
                    var roleid = output.match(reg2)[1];
                    console.log(roleid);
                    command = "python postrole.py " + useid + " " + roleid + " ";
                    exec(command, function (error, stdout, stderr) {
                        if (stdout.length > 1) {
                            console.log(stdout);
                            var code = stdout.match('code":(.*?),"message')[1];
                            console.log(code);
                            if (code === '0') session.send("申请成功");

                        }
                        else {
                            console.log('you don\'t offer args');
                        }
                        if (error) {
                            console.info('stderr : ' + stderr);
                        }
                    });

                }
                else {
                    console.log('you don\'t offer args');
                }
                if (error) {
                    console.info('stderr : ' + stderr);
                }
            });
        }
        return next()
    })
}
