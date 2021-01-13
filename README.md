# IDo实习管理的前端代码

#### 介绍
IDo实习管理，旅院的实习管理项目，主要是使用uniapp开发的小程序端的前端应用

#### 软件架构
软件架构说明
pages目录的页面结构和介绍

```js
├── error
│   └── error.vue //错误页面，当出现错误时跳转到这个页面
├── home
│   └── home.vue //”首页“页面，一登录成功后跳转到这个页面
├── internship
│   └── internship.vue //”实习圈“页面，目前的计划还未迭代到这里
├── login
│   ├── loginForm.vue //登录页面，所有的用户都是在这个页面登录
│   └── register.vue //注册页面，企业员工使用企业注册码在这个页面填写个人信息并注册，注册成功后跳转到登录页面登录
└── student
    ├── addMessage
    │   ├── addMessage.vue //发布页面，用户选择需要发布的消息类型
    │   └── edit.vue //消息的编辑页面，目前只是一个页面，还未与后台有联系
    ├── message
    │   ├── guardAngel
    │   │   ├── chat.vue //聊天界面，目前还只能发送文字，还未能发送图片，支持下拉刷新，消息更新
    │   │   └── guardAngel.vue //守护天使的选择界面，选择与哪一位进行聊天
    │   ├── interview
    │   │   └── interview.vue //还未迭代到这里来
    │   ├── lectureMeeting
    │   │   └── lectureMeeting.vue //还未迭代到这里来
    │   ├── message.vue //”消息“页面，主要显示系统消息和一些实习通知，守护天使通知等
    │   ├── messageDetails.vue //消息详情页面
    │   └── monthlySummary
    │       └── monthlySummary.vue //还未迭代到这里来
    └── my
        ├── my.vue //"我的"页面，显示自己的头像姓名和一些功能模块，会根据用户的身份形式不同的功能
        ├── myDetails
        │   ├── changeIntro.vue //修改信息的页面，如修改手机号，密码等
        │   └── myDetails.vue //”我的“详细信息的页面，可对头像、性别进行修改，还能看自己的一些信息
        ├── set
        │   └── set.vue //”设置“页面，可修改自己的手机号、邮箱、登录密码等
        └── treasure
            ├── starRank.vue //实习宝藏星星数排行页面
            ├── submitTask.vue //实习宝藏任务提交页面，可提交文字和图片
            ├── taskDescribe.vue //企业员工审核学生提交的任务和详细信息，并给出自己的分数
            ├── taskRecord.vue //任务记录页面，可查看自己进行中、审核中和已完成的任务记录
            ├── treasure.vue //”实习宝藏“页面，可查看目前可进行的任务和已进行、审核中和已完成的任务
            └── treasureCheck.vue //企业员工的实习宝藏审核页面，查看自己关联学生提交的任务
```





#### 安装教程

1.直接在hbuilderx里面打开应该就行（可能需sass编译插件）

#### 使用说明

1.  使用hbuildrx运行在浏览器，打开控制台，点击手机视角即可看见页面

#### 参与贡献

1.信息院的小组,前端项目主要由两人搞定