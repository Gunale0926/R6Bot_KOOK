#!/bin/sh
proc_name="node /usr/bin/npx ts-node -r tsconfig-paths/register src/tests/init.ts" #进程名字
while :
do
    stillRunning=$(ps -ef|grep "$proc_name"|grep -v "grep")
    if [ "$stillRunning" ]
    then
        sleep 5
    else
        cd /root/r6bot
        nohup npm test &
    fi
    sleep 5
 done