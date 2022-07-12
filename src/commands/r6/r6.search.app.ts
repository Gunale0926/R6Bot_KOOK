import { AppCommand, AppFunc, BaseSession } from "../..";
import { connection } from "../../tests/init";
import axios from "axios";
class R6Search extends AppCommand {
    code = "search"; // 只是用作标记
    trigger = "search"; // 用于触发的文字
    help = "`.查询 @某人`或`.查询 R6ID`查询某人战绩"; // 帮助文字
    intro = "查询ID";
    func: AppFunc<BaseSession> = async (session) => {
        if (session.channel.id == "2249183588482976") {
            session.send("此频道禁止查询");
            return;
        }
        var flag = false;
        var exp3 = 'SELECT expdate FROM usrlib WHERE id="' + session.userId + '"';
        connection.query(exp3, function(err: any, result: any) {
            if (err) {
                console.log("[SELECT ERROR] - ", err.message);
            } else {
                try {
                    var expdate = new Date(result[0].expdate);
                } catch {
                    var expdate = new Date("1900-1-1 00:00:00");
                }
                var date = new Date(); //现在
                if (expdate >= date) flag = true;
                else flag = false;
                main();
            }
        });
        async function main() {
            if (session.args[0]) {
                if (session.args[0].search("#(.*?)") !== -1) {
                    var id = session.args[0].match(/#(\S*)/)[1];
                    var r6id = await searchid(id);
                    if (r6id == null) session.send("此人未绑定R6ID，需先`.绑定 R6ID`");
                    else {
                        get(r6id);
                    }
                    return;
                } else if (session.args[0]) get(session.args[0]);
                return;
            } else {
                var r6id = await searchid(session.userId);
                if (r6id == null)
                    session.send(
                        "您未绑定R6ID，`.绑定 R6ID`后直接输入`.查询`可直接查询自己的战绩"
                    );
                else {
                    get(r6id);
                }
                return;
            }
        }
        async function searchid(id: string) {
            return new Promise<any>(async (resolve) => {
                var exp = "SELECT r6id FROM usrlib WHERE id=" + id;
                connection.query(exp, function(err: any, result: any) {
                    if (err) {
                        console.log("[SELECT ERROR] - ", err.message);
                    } else if (result[0]) resolve(result[0].r6id);
                    else {
                        resolve(null);
                    }
                });
            });
        }
        async function get(r6id: string) {
            var kd: any,
                src: string,
                arg6: string,
                stats: any,
                time: any,
                WLratio: any;
            src = session.user.avatar;
            r6id = r6id.replace(/\\/g, "");
            axios
                .get(
                    "http://127.0.0.1:9099/getUser.php?appcode=thisisthecode&name=" + r6id
                )
                .then(function(res: any) {
                    stats = res.data.players[Object.keys(res.data.players)[0]];
                })
                .then(function() {
                    try {
                        if (stats.error.message) {
                            session.send("查无此人！请检查ID后重试！");
                            return;
                        }
                    }
                    catch { }
                    axios
                        .get(
                            "http://127.0.0.1:9099/getStats.php?appcode=thisisthecode&name=" +
                            r6id
                        )
                        .then(function(res: any) {
                            var result: any =
                                res.data.players[Object.keys(res.data.players)[0]];
                            if (!result) {
                                return;
                            }
                            time = (result.generalpvp_timeplayed / 3600).toFixed(2);
                            kd = (result.generalpvp_kills / result.generalpvp_death).toFixed(
                                2
                            );
                            WLratio = (
                                result.generalpvp_matchwon / result.generalpvp_matchplayed
                            ).toFixed(2);
                        })
                        .then(function() {
                            if (stats.rankInfo.name.search(/Copper/) === 0) {
                                arg6 = "#B30B0D";
                            }
                            if (stats.rankInfo.name.search(/Bronze/) === 0) {
                                arg6 = "#C98B3B";
                            }
                            if (stats.rankInfo.name.search(/Silver/) === 0) {
                                arg6 = "#B0B0B0";
                            }
                            if (stats.rankInfo.name.search(/Gold/) === 0) {
                                arg6 = "#EED01E";
                            }
                            if (stats.rankInfo.name.search(/Platinum/) === 0) {
                                arg6 = "#5BB9B3";
                            }
                            if (stats.rankInfo.name.search(/Diamond/) === 0) {
                                arg6 = "#BD9FF6";
                            }
                            if (stats.rankInfo.name.search(/Champion/) === 0) {
                                arg6 = "#9D385C";
                            }
                            if (stats.rankInfo.name.search(/Unranked/) === 0) {
                                arg6 = "#B2B6BB";
                            }
                            if (flag)
                                var card = [
                                    {
                                        type: "card",
                                        theme: "secondary",
                                        color: arg6,
                                        size: "lg",
                                        modules: [
                                            {
                                                type: "section",
                                                text: {
                                                    type: "kmarkdown",
                                                    content: "**:crown:" + r6id + "**",
                                                },
                                                mode: "left",
                                                accessory: {
                                                    type: "image",
                                                    src: src,
                                                    size: "lg",
                                                },
                                            },
                                            {
                                                type: "section",
                                                text: {
                                                    type: "paragraph",
                                                    cols: 3,
                                                    fields: [
                                                        {
                                                            type: "kmarkdown",
                                                            content: "**等级**\n" + stats.level,
                                                        }, {
                                                            type: "kmarkdown",
                                                            content: "**段位**\n" + stats.rankInfo.name,
                                                        }, {
                                                            type: "kmarkdown",
                                                            content: "**总KD**\n" + kd,
                                                        }, {
                                                            type: "kmarkdown",
                                                            content:
                                                                "**赛季KD**\n" +
                                                                (stats.kills / stats.deaths).toFixed(1),
                                                        }, {
                                                            type: "kmarkdown",
                                                            content: "**胜率**\n" + WLratio * 100 + "%",
                                                        }, {
                                                            type: "kmarkdown",
                                                            content:
                                                                "**赛季胜率**\n" +
                                                                (stats.wins / stats.losses).toFixed(2),
                                                        }, {
                                                            type: "kmarkdown",
                                                            content: "**MMR**\n" + stats.mmr,
                                                        }, {
                                                            type: "kmarkdown",
                                                            content: "**赛季最高分**\n" + stats.max_mmr,
                                                        }, {
                                                            type: "kmarkdown",
                                                            content: "**多人游戏时长**\n" + time,
                                                        },
                                                    ],
                                                },
                                            }, {
                                                type: "section",
                                                text: {
                                                    type: "kmarkdown",
                                                    content:
                                                        "(ins)[查看更多](https://r6.tracker.network/profile/pc/" +
                                                        r6id +
                                                        "/)(ins)",
                                                },
                                            },
                                        ],
                                    },
                                ];
                            else
                                var card = [
                                    {
                                        type: "card",
                                        theme: "secondary",
                                        color: arg6,
                                        size: "lg",
                                        modules: [
                                            {
                                                type: "section",
                                                text: {
                                                    type: "kmarkdown",
                                                    content: "**" + r6id + "**",
                                                },
                                                mode: "left",
                                                accessory: {
                                                    type: "image",
                                                    src: src,
                                                    size: "lg",
                                                },
                                            },
                                            {
                                                type: "section",
                                                text: {
                                                    type: "paragraph",
                                                    cols: 3,
                                                    fields: [
                                                        {
                                                            type: "kmarkdown",
                                                            content: "**等级**\n" + stats.level,
                                                        }, {
                                                            type: "kmarkdown",
                                                            content: "**段位**\n" + stats.rankInfo.name,
                                                        }, {

                                                            type: "kmarkdown",
                                                            content: "**总KD**\n" + kd,
                                                        }, {

                                                            type: "kmarkdown",
                                                            content:
                                                                "**赛季KD**\n" +
                                                                (stats.kills / stats.deaths).toFixed(2),
                                                        }, {

                                                            type: "kmarkdown",
                                                            content: "**胜率**\n" + WLratio * 100 + "%",
                                                        }, {

                                                            type: "kmarkdown",
                                                            content:
                                                                "**赛季胜率**\n" +
                                                                (stats.wins / stats.losses).toFixed(2),
                                                        }, {

                                                            type: "kmarkdown",
                                                            content:
                                                                "**MMR**\n(spl)[解锁](https://afdian.net/@Gunale)(spl)",
                                                        }, {

                                                            type: "kmarkdown",
                                                            content:
                                                                "**赛季最高分**\n(spl)[解锁](https://afdian.net/@Gunale)(spl)",
                                                        }, {
                                                            type: "kmarkdown",
                                                            content:
                                                                "**多人游戏时长**\n(spl)[解锁](https://afdian.net/@Gunale)(spl)",
                                                        },
                                                    ],
                                                },
                                            }, {
                                                type: "section",
                                                text: {
                                                    type: "kmarkdown",
                                                    content:
                                                        "[解锁](https://afdian.net/@Gunale)~~查看更多~~",
                                                },
                                            },
                                        ],
                                    },
                                ];
                            session.sendCard(JSON.stringify(card));
                        });
                });
        }
    };
}

export const r6Search = new R6Search();
