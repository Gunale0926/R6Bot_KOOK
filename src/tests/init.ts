console.log('Startms:' + new Date().getTime())
import * as dotenv from 'dotenv';
import { KBotify } from '..';
dotenv.config();
export const bot = new KBotify({
	mode: 'websocket',
	port: parseInt(process.env.KPORT!),
	token: process.env.TOKEN!,
	verifyToken: process.env.VERIFY,
	key: process.env.KEY,
	ignoreDecryptError: false,
	debug: false,
});
const R6API = require('r6api.js').default;
const { UBI_EMAIL: email = '', UBI_PASSWORD: password = '' } = process.env;
const r6api = new R6API({ email, password });
export const pars = {
	head: 11,
	tail: 68
}
import { r6Menu } from 'commands/r6/r6.menu';
import { r6ComMenu } from 'commands/r6community/r6com.menu';
import { r6Active } from '../commands/r6/r6.active.app';
import { r6Applyrole } from '../commands/r6community/r6com.applyrole.app';
import { r6Record } from '../commands/r6/r6.record.app';
import { r6Search } from '../commands/r6/r6.search.app';
import { r6Revokerole } from '../commands/r6community/r6com.revokerole.app';
import { r6Auth } from '../commands/r6community/r6com.auth.app';
import { r6Access } from '../commands/r6/r6.access.app';
/*
   import { kBotifyLogger } from 'core/logger';
   import Application from 'koa';
   import { AttachmentBase } from 'kaiheila-bot-root';
   import { resolveLevel } from 'bunyan';
 */
bot.addCommands(r6ComMenu, r6Menu);
bot.addAlias(r6Menu, "菜单");
bot.addAlias(r6Access, "权限");
bot.addAlias(r6Search, "查询");
bot.addAlias(r6Record, "记录");
bot.addAlias(r6Record, "绑定");
bot.addAlias(r6Applyrole, "申请角色");
bot.addAlias(r6Revokerole, "撤销角色");
bot.addAlias(r6Active, "激活");
bot.addAlias(r6Auth, '认证')
bot.connect();
bot.logger.debug('Init Success');
var mysql = require('mysql');
var connection = mysql.createConnection({
	//socketPath: '/var/run/mysqld/mysqld.sock',
	host: '127.0.0.1',
	user: 'root',
	password: '20060926Abc',
	database: 'bot_db'
});
export { connection, r6api }
