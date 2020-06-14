OS: choose CentOS 7
ssh root@<public IP>

config server:
wget --no-check-certificate https://raw.githubusercontent.com/teddysun/shadowsocks_install/master/shadowsocks-all.sh
chmod +x shadowsocks-all.sh
./shadowsocks-all.sh 2>&1 | tee shadowsocks-all.log

aes-256-cfb
protocol: origin
Obfs: origin

bbr:
wget --no-check-certificate https://github.com/teddysun/across/raw/master/bbr.sh
chmod +x bbr.sh
./bbr.sh

config:
/etc/shadowsocks-go/config.json

command:
0. check process: ps -ef | grep ss-server
1. check status: /etc/init.d/shadowsocks-go status  
2. restart: /etc/init.d/shadowsocks-go restart
