var https = require('https');
var querystring = require('querystring');
var url = "https://r6.tracker.network/profile/pc/";
var fs = require('fs');
var exec = require('child_process').exec;
const { sleep } = require('koishi');
const { timeStamp, time } = require('console');
var card;
var channelID;
var num;
var ok = 0;
var avmmr = 0, xmmr = 0, nmmr = 9999;
var rankable;
var exp;
var tabname = 'usrlib'
var mysql = require('mysql');
const { connect } = require('http2');
const { emit } = require('process');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bot_db'
});
connection.connect();

module.exports = (ctx) => {
    ctx.middleware((session, next) => {
        async function get(namer) {
            return new Promise((resolve, reject) => {
                setTimeout(function () {
                    var urln = url + namer;
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
                                card = [{ "type": "card", "theme": "secondary", "color": arg6, "size": "sm", "modules": [{ "type": "section", "text": { "type": "kmarkdown", "content": "                 **" + arg1 + "**" }, "mode": "left", "accessory": { "type": "image", "src": arg5, "size": "lg" } }] }, { "type": "card", "theme": "secondary", "color": arg6, "size": "lg", "modules": [{ "type": "section", "text": { "type": "paragraph", "cols": 3, "fields": [{ "type": "kmarkdown", "content": "**MMR**\n" + arg2 }, { "type": "kmarkdown", "content": "**段位**\n" + arg3 }, { "type": "kmarkdown", "content": "**赛季KD**\n" + arg4 }] } }] }]
                                avmmr += parseInt(mmr);
                                if (xmmr < mmr) xmmr = mmr;
                                if (nmmr > mmr) nmmr = mmr;
                                resolve(card);//成功返回
                            }
                        });
                    }).on('error', function () {
                        session.send("ERROR");
                        return -1;
                    });
                }, 500)
            })
        }

        async function send(cardr) {
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
                    'Authorization': 'Bot 1/MTA0NTQ=/fFUOF0vpnbkadTcSJhP5BA=='
                }
            })
                .then(function (response) {
                    console.log(response.data.code);
                    /*if (code.search('0') == -1) {
                    async function resend(){await send(cardr);}
                    resend();
                    console.log('Fuck');
                    }
                    else {*/
                    ok++;
                    if (ok == num) {
                        console.log('Finally!');
                        avmmr = avmmr / num;
                        if (xmmr - nmmr > 700) rankable = false;
                        else rankable = true;
                        send([
                            {
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
                            }
                        ]);
                    }
                    //}
                })
        }

        async function searchid(id) {
            return new Promise((resolve, reject) => {

                var exp = 'SELECT r6id FROM ' + tabname + ' WHERE id=' + id + ' && sel =1';
                connection.query(exp, function (err, result) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        reject(err.message);
                    }
                    else {
                        var r6id = JSON.stringify(result).match('"r6id":"(.*?)"}')[1]
                        resolve(r6id);
                    }

                });
            })
        }
        async function recordid(id, r6id) {
            return new Promise((resolve, reject) => {
                exp = 'INSERT INTO ' + tabname + '(id,r6id,sel) VALUES("' + id + '","' + r6id + '",1)'
                connection.query(exp, function (err, result) {
                    if (err) {
                        console.log('[SELECT ERROR] - ', err.message);
                        exp = 'UPDATE ' + tabname + ' SET r6id=\'' + r6id + '\'WHERE id=' + id;
                        connection.query(exp, function (err, result) {
                            if (err) {
                                console.log('[INSERT ERROR] - ', err.message);
                                reject('err')
                            }
                            else {
                                console.log('UPDATE ' + id + ' ' + r6id);
                                session.send('UPDATE ' + id + ' ' + r6id);
                                resolve(result);
                            }
                        });
                    }
                    else {
                        console.log('INSERT ' + id + ' ' + r6id);
                        session.send('INSERT ' + id + ' ' + r6id);
                        connection.end();
                        resolve(result);
                    }
                });
            })
        }


        if (session.content.search(/dash/) === 0) {
            avmmr = 0;
            ok = 0;
            xmmr = 0, nmmr = 9999;
            var cardn
            var name = session.content.replace('dash ', '');
            var stringArray = name.split(' ');
            console.log(stringArray);
            num = stringArray.length;
            channelID = session.channelId;
            for (let i = 0; i < stringArray.length; i++) {
                var useidn = stringArray[i];
                async function main() {
                    namen = await searchid(session.userId)
                    console.log(namen);
                    cardn = await get(namen);
                    await send(cardn);
                }
                main();
            }
        }

        if (session.content.search(/record/) === 0) {
            var id = (session.userId);
            var r6id = session.content.replace('record ', '');
            recordid(id, r6id)
        }
        return next()
    })
}