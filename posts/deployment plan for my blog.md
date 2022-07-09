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
test on serverA first.(`/usr/local/lighthouse/softwares/nginx`)

`sudo yum install epel-release`
`sudo yum install nginx`
`sudo systemctl start nginx`
`sudo systemctl status nginx`
`sudo firewall-cmd --permanent --zone=public --add-service=http`
`sudo firewall-cmd --permanent --zone=public --add-service=https`
`sudo firewall-cmd --reload`

install nginx on macbook:
`brew update`
`brew install nginx`

```
The default port has been set in /usr/local/etc/nginx/nginx.conf to 8080 so that
nginx can run without sudo.

nginx will load all files in /usr/local/etc/nginx/servers/.
```

`nginx` to run as a daemon service
`nginx -s stop` to stop
`nginx -s reload` to reload config file, but better `nginx -t` first!
`nginx -t`
`code /usr/local/etc/nginx/nginx.conf` to open the config file and edit by vscode

pm2:

docker:
install docker locally first to try.
what is `docker-compose`
(NO) focus on nginx now.

## get my project

`https://expressjs.com/en/advanced/best-practice-performance.html`

1.  Things to do in your code (the dev part):
    Use gzip compression:
    For a high-traffic website in production, the best way to put compression in place is to implement it at a reverse proxy level (see Use a reverse proxy). In that case, you do not need to use compression middleware. For details on enabling gzip compression in Nginx, see Module ngx_http_gzip_module in the Nginx documentation.

    Don’t use synchronous functions

    Do logging correctly:
    If you’re logging app activity (for example, tracking traffic or API calls), instead of using console.log(), use a logging library like Winston or Bunyan. For a detailed comparison of these two libraries, see the StrongLoop blog post Comparing Winston and Bunyan Node.js Logging.

    Handle exceptions properly

2.  Things to do in your environment / setup (the ops part):
    Set NODE_ENV to “production”
    Ensure your app automatically restarts:
    Using a process manager to restart the app (and Node) when it crashes.
    Using the init system provided by your OS to restart the process manager when the OS crashes. It’s also possible to use the init system without a process manager.

    Run your app in a cluster
    Cache request results
    Use a load balancer
    Use a reverse proxy

    error when login

`I want to deploy the blog and try a completed devops workflow, including code update, migration...`

run mongodb:
`mongod --config /usr/local/etc/mongod.conf --fork` to run mongodb at background(or without --fork).

locally setup nginx and pm2

pm2:
`pm2 start server.js -i <processes>` <processes> can be 'max'
`pm2 list`
`pm2 monit`
`pm2 describe <name>`

1. each instance need to listen to different port number? so nginx can balance load?
   I think in a single server, no need to config different port number for node instaces.
   pm2 already can balance traffic to each instance.
   Only when you have multiple server with different IPs, then Nginx can be used as a load balancer

2. need to hide these port number and only keep 80?
   set firewall rules or iptables to forbid other ports.

deploy my blog in the domestic server, and migrate later.

nginx: `/usr/local/lighthouse/softwares/nginx/conf/nginx.conf`

(DONE)get git
(DONE)get pm2
mongodb
`sudo nano /etc/yum.repos.d/mongodb-org.repo`

```r
[mongodb-org]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.4.asc
```

`dnf repolist`
`sudo dnf install mongodb-org`
to disables Transparent Huge Pages (THP):
`sudo nano /etc/systemd/system/disable-thp.service`

```r
[Unit]
Description=Disable Transparent Huge Pages (THP)
After=sysinit.target local-fs.target
Before=mongod.service

[Service]
Type=oneshot
ExecStart=/bin/sh -c 'echo never | tee /sys/kernel/mm/transparent_hugepage/enabled > /dev/null'

[Install]
WantedBy=basic.target
```

`sudo systemctl daemon-reload`
`sudo systemctl start disable-thp.service`

`chown -R mongod:mongod /var/lib/mongo/` (maybe already in correct mod)
`chown mongod:mongod /tmp/mongodb-27017.sock`
`sudo systemctl start mongod`
`sudo systemctl enable mongod`(using MongoDB as a permanent feature, you can set it to run at boot)

Create MongoDB Admin User:
`mongo`
`use admin`

```s
db.createUser(
 {
 user: "yang",
 pwd: "Jy199172238~",
 roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
 }
 )
```

(you can also update user by `db.updateUser(`yang`, {roles:[{ role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase"]})`)

Configure MongoDB Authentication:

`sudo nano /lib/systemd/system/mongod.service`
change `Environment="OPTIONS=--f /etc/mongod.conf"` to `Environment="OPTIONS= --auth -f /etc/mongod.conf"`

`sudo systemctl daemon-reload`
`sudo systemctl restart mongod`

`mongo`
`use admin`
`show users`(without auth will get an error mesg)
`db.auth(`mdbadmin`, `password`)` to get auth
(watch out the smart quote!)

(reference:
https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-centos-8
https://www.digitalocean.com/community/tutorials/how-to-secure-mongodb-on-centos-8
)
