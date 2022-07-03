# vps environment

## install necesssary packages

nvm:(DONE)
`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`
run the script

node:(DONE)
some dependencies are missing for the lastest version(18)
so switch to lts version(16)

mongodb

nginx:(cannot play on the current server, use serverA?)
(NO)
maybe make nginx listen to other port number?
test on serverA first.

`sudo yum install epel-release`
`sudo yum install nginx`
`sudo systemctl start nginx`
`sudo systemctl status nginx`
`sudo firewall-cmd --permanent --zone=public --add-service=http`
`sudo firewall-cmd --permanent --zone=public --add-service=https`
`sudo firewall-cmd --reload`

docker(NOT NOW)

## get my project

(TODO)

error when login

```
-bash: /root/nvm/nvm.sh: No such file or directory
-bash: /root/nvm/nvm.sh: No such file or directory
-bash: ‘export: command not found
```
