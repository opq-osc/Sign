// app.js
App({

  onShow(options) {
    
    // 检测更新
    this.checkUpdate()

  },

  globalData: {

    wxShare: { //需要设置的数据
      ShareTitle: "极萌助手",
      ShareImage: "极萌助手",
      SharePath: 'pages/index/index'

    }, //基本配置
    wxApp: { //需要设置的数据
      AppTitle: "",
      SubTitle: "",
      ShowVipTips: '',
      AdCtrl: false,
      HideCtrl: false,
      Projects: [],
      AppNotice: []

    },

    platform: "",

  },
  // 请求基本数据
  getGetConfig() {
    var that = this
    wx.cloud.callContainer({
      config: {
        env: "云环境"
      },
      path: "/service",
      header: {
        "X-WX-SERVICE": "service"
      },
      method: 'POST',
      data: {
        "CgiCmd": 200,
        "CgiRequest": {},
      }
    }).then(res => {

      that.globalData.wxApp = res.data.ResponseData.wxApp
      //that.globalData.wxApp.AppTitle = res.data.ResponseData.wxApp.AppTitle

      that.globalData.wxShare = res.data.ResponseData.wxShare
      //that.globalData.wxApp.HideCtrl=false


      //console.log(that.globalData.wxApp)
    }).catch(error => {
      console.log(error);
      wx.showModal({
        title: '系统提示',
        content: '云服务器请求超时 1分钟后重试',
        success(res) {

        }
      })
    })

  },
  checkUpdate() {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      if (res.hasUpdate) {
        // 新版本下载成功
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，请您重启应用，以确保正常使用。',
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })
        // 新版本下载失败
        updateManager.onUpdateFailed(function () {
          wx.showModal({
            title: '更新提示',
            content: '检测到了新版本，但是下载失败了~'
          })
        })
      }
    })

  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: '云环境',
        traceUser: true,
      });
    }
    this.getGetConfig()
  },

});