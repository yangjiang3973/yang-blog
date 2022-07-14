实战笔记：Jenkins打造强大的前端自动化工作流
(https://juejin.cn/post/6844903591417757710)

持续集成是什么？
(http://www.ruanyifeng.com/blog/2015/09/continuous-integration.html)

从 0 到 1 实现一套 CI/CD 流程:
https://juejin.cn/book/6897616008173846543

前端开源项目持续集成三剑客
(https://efe.baidu.com/blog/front-end-continuous-integration-tools/)



# git push 触发钩子通知 Jenkins

钩子的实现原理是在远端仓库上配置一个 Jenkins 服务器的接口地址，
当本地向远端仓库发起 push 时，
远端仓库会向配置的 Jenkins 服务器的接口地址发起一个带参数的请求，
jenkins 收到后开始工作。

# 自动化构建

git push 触发钩子后，jenkins 就要开始工作了，
自动化的构建任务可以有很多种，比如说安装升级依赖包，单元测试，e2e 测试，压缩静态资源，批量重命名等等，
无论是 npm script 还是 webpack，gulp 之类的工作流，你之前在本地能做的，在这里同样可以做。

# 自动化部署

Jenkins 想要往服务器上部署代码必须登录服务器才可以，
这里有两种登录验证方式，一种是 ssh 验证，一种是密码验证，
就像你自己登录你的服务器，你可以使用 ssh 免密登录，也可以每次输密码登录

如果你的项目是开源项目，也可以使用 Travis CI 做持续集成，这个配置起来比 Jenkins 简单
