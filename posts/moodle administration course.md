1.  install free themes

2.  adjust front page

    there are 4 placs to customize front page:

        Front Page Setting

        Inpage editing(on the home page)

        (HTML block!!!!)

        Theme Setting

        Adding plugins

3.  admin creates the structure and shell of a course.

    then teachers will upload content and docs to each course.

4.  user creation (one user at a time or bulk upload). username maybe not allow capital char or special symbols

5.  Moodle groups:

    5.1 groups on course level (used by teacher)

    5.2 cohorts on site level (used by admin)

6.  role

7.  security

    backup!

    update moodle regularly

    strong password! for admin and teacher!

# Remaining tasks

1. Configure Cron

2. Set up backups

3. Secure your Moodle site

4. Increasing the maximum upload siz

5. Check mail works

# Install moodle in CentOS 7

1. update the system:

`sudo yum install epel-release -y`

`sudo yum update -y && sudo shutdown -r now`

2. install Apache 2.4

`sudo yum install httpd -y`

In production, you should remove the pre-set Apache welcome page:

`sudo sed -i 's/^/#&/g' /etc/httpd/conf.d/welcome.conf`

Prevent Apache from listing web directory files to visitors:

`sudo sed -i "s/Options Indexes FollowSymLinks/Options FollowSymLinks/" /etc/httpd/conf/httpd.conf`

Start the Apache service and enable it to auto-start on boot:

`sudo systemctl start httpd.service`
`sudo systemctl enable httpd.service`

3. install MySQL

add to yum
`rpm -Uvh http://repo.mysql.com/mysql80-community-release-el7-5.noarch.rpm`

install:
`yum install mysql-server`

run:
`systemctl start mysqld.service`
`systemctl enable mysqld.service`

config db(first try):

`CREATE DATABASE moodle DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;` (https://docs.moodle.org/311/en/MySQL)

`CREATE USER qienuser@localhost IDENTIFIED BY 'Qienpassword888~';`

`GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,CREATE TEMPORARY TABLES,DROP,INDEX,ALTER ON moodle.* TO qienuser@localhost;`

`FLUSH PRIVILEGES;`

secure the installation of mysql:
`sudo /usr/bin/mysql_secure_installation`

```shell
Enter current password for root (enter for none): Just press the Enter button
Set root password? [Y/n]: Y
New password: qienpassword
Re-enter new password: qienpassword
Remove anonymous users? [Y/n]: Y
Disallow root login remotely? [Y/n]: Y
Remove test database and access to it? [Y/n]: Y
Reload privilege tables now? [Y/n]: Y
```

4. install php

`sudo rpm -Uvh http://rpms.famillecollet.com/enterprise/remi-release-7.rpm`

`yum --enablerepo=remi-php74 install php`

Installed:
php.x86_64 0:7.4.28-1.el7.remi

Dependency Installed:
libsodium.x86_64 0:1.0.18-1.el7 php-cli.x86_64 0:7.4.28-1.el7.remi  
 php-common.x86_64 0:7.4.28-1.el7.remi php-json.x86_64 0:7.4.28-1.el7.remi  
 php-sodium.x86_64 0:7.4.28-1.el7.remi

`yum --enablerepo=remi-php74 install php-ldap php-xml php-soap php-xmlrpc php-mbstring php-json php-gd php-mcrypt php-curl php-pspell php-zip php-common`

(php71w-intl php71w-mysqlnd)

`yum --enablerepo=remi-php74 php-mysqlnd php-intl`(later)

(may need to install more php modules later?)

5. install moodle

put the moodle core application code in the /opt directory.

`cd /opt`

Download the Moodle Code and Index

`sudo git clone git://git.moodle.org/moodle.git`

Change directory into the downloaded Moodle folder

`cd moodle`

Retrieve a list of each branch available

`sudo git branch -a`

Tell git which branch to track or use

`sudo git branch --track MOODLE_311_STABLE origin/MOODLE_311_STABLE`

Finally, Check out the Moodle version specified

`sudo git checkout MOODLE_311_STABLE`

6. Copy local repository to /var/www/html/

`sudo cp -R /opt/moodle /var/www/html/`

`sudo mkdir /var/moodledata`

`sudo chown -R apache:apache /var/moodledata`
(Ubuntu: sudo chown -R www-data /var/moodledata)

`sudo chmod -R 777 /var/moodledata`
(TODO: `sudo chmod -R 755 /var/moodledata` on another tutorial, what is the difference between 777 and 755?)

`sudo chmod -R 0755 /var/www/html/moodle`
(TODO: `sudo chown -R root:root /var/www/html/moodle` on anpther tutorial)

7. Setup SELinux(TODO: what is SELinux?)

Show the status of SELinux:
`sestatus`

Install required SELinux management tools:
`sudo yum install -y policycoreutils policycoreutils-python`

Setup Moodle files' SELinux contexts as below:

`sudo semanage fcontext -a -t httpd_sys_rw_content_t '/var/www/html/moodle(/.*)?'`
`sudo restorecon -Rv '/var/www/html/moodle/'`
`sudo semanage fcontext -a -t httpd_sys_rw_content_t '/var/moodledata(/.*)?'`
`sudo restorecon -Rv '/var/moodledata/'`

8. Open your browser and go to http://IP.ADDRESS.OF.SERVER/moodle

9. Serve checks:

9.2 php_setting opcache.enable

PHP setting should be changed.
PHP opcode caching improves performance and lowers memory requirements, OPcache extension is recommended and fully supported.

9.5 site not https

It has been detected that your site is not secured using HTTPS. It is strongly recommended to migrate your site to HTTPS for increased security and improved integration with other systems.

9.6 max_input_vars

PHP setting max_input_vars is recommended to be at least 5000.

TODO: need to learn more about : (permission about moodle server's files!! maybe watch the video again!!)

`sudo chmod -R 0755 /var/www/html/moodle`
`sudo chown -R root:root /var/www/html/moodle`
`sudo chmod -R 777 /var/moodledata`
`sudo chmod -R 755 /var/moodledata`
