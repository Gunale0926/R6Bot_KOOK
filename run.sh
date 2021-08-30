#!/bin/sh
proc_name="node /root/kBotify-template-main/node_modules/.bin/ts-node -r tsconfig-paths/register src/tests/init.ts" #进程名字
while :
do
    stillRunning=$(ps -ef|grep "$proc_name"|grep -v "grep")
    if [ "$stillRunning" ]
    then
        sleep 10
    else
        cd /root/kBotify-template-main
        nohup npm test &
    fi
    sleep 10
 done