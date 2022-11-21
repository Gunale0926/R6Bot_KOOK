import { AppCommand, AppFunc, BaseSession } from "../..";
import { connection, r6api } from "../../tests/init";
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
    var platform = 'uplay'
    if (session.args[1]) {
      if (session.args[1].charAt(0) == 'p' || session.args[1].charAt(0) == 'P')
        platform = "ps";
      else if (session.args[1].charAt(0) == 'x' || session.args[1].charAt(0) == 'X')
        platform = "xbox";
    }
    var exp3 = 'SELECT expdate FROM usrlib WHERE id="' + session.userId + '"';
    connection.query(exp3, function (err: any, result: any) {
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
        connection.query(exp, function (err: any, result: any) {
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
      var src = session.user.avatar
      var r6id = r6id.replace(/\\/g, "");
      const { 0: player } = await r6api.findByUsername(platform, r6id);
      if (!player) {
        session.send("用户未找到")
        return 'Player not found';
      }
      const { 0: stats } = await r6api.getStats(platform, player.id);
      if (!stats) {
        session.send("无数据")
        return 'Stats not found';
      }
      const { 0: ranks } = await r6api.getRanks(platform, player.id, { seasonIds: -1 })
      var time = (stats.pvp.general.playtime / 3600).toFixed(2)
      var kd = stats.pvp.general.kd
      var WLratio = stats.pvp.general.winRate
      var rank = ranks.seasons[Object.keys(ranks.seasons)[0]].regions.apac.boards.pvp_ranked
      var rankname = rank.current.name
      var mmr = rank.current.mmr
      var max = rank.max.mmr
      var rankWL = rank.winRate
      var rankKD = rank.kd
      var arg6 = "#B2B6BB"
      if (rankname.search(/Copper/) === 0) {
        arg6 = "#B30B0D";
      }
      if (rankname.search(/Bronze/) === 0) {
        arg6 = "#C98B3B";
      }
      if (rankname.search(/Silver/) === 0) {
        arg6 = "#B0B0B0";
      }
      if (rankname.search(/Gold/) === 0) {
        arg6 = "#EED01E";
      }
      if (rankname.search(/Platinum/) === 0) {
        arg6 = "#5BB9B3";
      }
      if (rankname.search(/Diamond/) === 0) {
        arg6 = "#BD9FF6";
      }
      if (rankname.search(/Champion/) === 0) {
        arg6 = "#9D385C";
      }
      if (rankname.search(/Unranked/) === 0) {
        arg6 = "#B2B6BB";
      }
      var ctn;
      if (flag)
        ctn = "**:crown:" + r6id + "**"
      else
        ctn = "**" + r6id + "**"
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
                content: ctn,
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
                    content: "**总KD**\n" + kd,
                  }, {
                    type: "kmarkdown",
                    content: "**胜率**\n" + WLratio,
                  }, {
                    type: "kmarkdown",
                    content: "**多人游戏时长**\n" + time,
                  }, {
                    type: "kmarkdown",
                    content: "**段位**\n" + rankname,
                  }, {
                    type: "kmarkdown",
                    content: "**MMR**\n" + mmr,
                  }, {
                    type: "kmarkdown",
                    content: "**上次排位**\n" + rank.lastMatch.result + " " + rank.lastMatch.mmrChange,
                  }, {
                    type: "kmarkdown",
                    content:
                      "**赛季KD**\n" +
                      rankKD,
                  }, {
                    type: "kmarkdown",
                    content:
                      "**赛季胜率**\n" +
                      rankWL,
                  }, {
                    type: "kmarkdown",
                    content: "**赛季最高分**\n" + max,
                  },],
              },
            }, {
              type: "section",
              text: {
                type: "kmarkdown",
                content:
                  "[发电支持作者！](https://afdian.net/@Gunale)",
              },
            },
          ],
        },
      ];
      session.sendCard(JSON.stringify(card));
    }
  };
}

export const r6Search = new R6Search();
