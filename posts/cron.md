cron 有 crond 和 crontab 两个概念。

crond 是后台守护进程的名称，用来实际执行脚本，它在系统中是一直运行的。

crontab 是一个工具，用来管理定时任务列表，比如添加作业、编辑作业、删除作业、查看作业。作为管理工具，不会后台运行，需要手动调用，执行完自动退出。

启动服务：`systemctl start crond`
关闭服务：`systemctl stop crond`
重启服务：`systemctl restart crond`

查看定时任务：

`crontab -l`

删除所有作业：

`crontab -r`

查看任务日志：

在作业执行出现异常（或作业脚本写日志）时，cron 服务会输出日志。查看的地址位于 /var/log 下。

如 `ls /var/log | grep cron`

```
A B C D E USERNAME /path/to/command arg1 arg2
OR
A B C D E USERNAME /root/backup.sh
```

A：分钟范围：0 – 59
B：时间范围：0 – 23
C：天数范围：1 – 31
D：月范围：1 – 12 or JAN-DEC
E：星期几：0 – 6 or SUN-SAT，Sunday=0 or 7。
USERNAME： 用户名
/path/to/command – 你要计划的脚本或命令的名称

```
┌───────────── minute (0 - 59)
│ ┌───────────── hour (0 - 23)
│ │ ┌───────────── day of the month (1 - 31)
│ │ │ ┌───────────── month (1 - 12 or JAN-DEC)
│ │ │ │ ┌───────────── day of the week (0 - 6 or SUN-SAT, Sunday=0 or 7)
│ │ │ │ │
│ │ │ │ │
│ │ │ │ │
* * * * *
```

Cron 具有特定的字符串，可用于更快地创建命令：

```
@hourly：每小时运行一次，即"0 * * * *"
@midnight：每天运行一次，即"0 0 * * *"
@daily：与午夜相同
@weekly：每周运行一次，即"0 0 * * 0"
@monthly：每月运行一次，即"0 0 1 * *"
@annually：每年运行一次，即"0 0 1 1 *"
@yearly：与**@annually**相同
@reboot：每次启动时运行一次
```

example: `@daily /path/to/backup/script.sh`

还有更简单的方法，你可以在 https://crontab.guru/ 网站进行在线设置，设置好了直接拷贝过来。网页提供了图形化的操作界面，对新手特别友好。

测试：

设置一个最近的时间进行测试，测试正常后就可以换到真实的周期了。

如何在 Cron 任务中发送邮件通知：

第一步，设置邮件地址、端口等信息：

`https://www.nixtutor.com/linux/send-mail-with-gmail-and-ssmtp/`

第二步，在 Cron 任务中加上发送邮件的指令，

`1 * * * * script.sh | mail -s "Subject of Mail" someother@address.com`
