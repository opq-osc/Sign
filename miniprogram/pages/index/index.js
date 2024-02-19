// index.js
const app = getApp()

Page({
  data: {
    // app_title: "极萌助手",
    // sub_title: "",
    // showVipTips: "",
    // notice_title: [],
    wxApp: '',
    keywords: "",
    finnderLists: []
  },


  onLoad() {
    //app.getGetConfig()
    var that =this
    this.setData({
      wxApp: app.globalData.wxApp,
      // sub_title: app.globalData.wxApp.SubTitle,
      // showVipTips: app.globalData.wxApp.ShowVipTips,
      // notice_title: app.globalData.wxApp.AppNotice,
    })
    // console.log(this.data.wxApp)
    // if (JSON.stringify(this.data.wxApp) == '{}') {
    //   console.log(this.data.wxApp)
    //   //this.onLoad()
    //   //wx.redirectTo({url: 'pages/index/index'})
    // }
    console.log(app.globalData.wxApp.AppTitle)
    if (app.globalData.wxApp.AppTitle == '') {
      wx.showLoading({
        title: '加载中...',
      })

      setTimeout(function () {
        wx.hideLoading()
        that.setData({
          wxApp: app.globalData.wxApp,
         
        })
        console.log(app.globalData.wxApp)
      }, 2000)
    }

  },
  //分享盆友圈
  onShareTimeline(res) {

    return {
      title: app.globalData.wxShare.ShareTitle,
      imageUrl: app.globalData.wxShare.ShareImage,
    }
  },
  // 页面内分享
  onShareAppMessage(res) {
    // console.log(res)
    // if (res.from === 'button') {
    //   console.log(res.target)
    // }
    return {
      title: app.globalData.wxShare.ShareTitle,
      imageUrl: app.globalData.wxShare.ShareImage,
      path: app.globalData.wxShare.SharePath,
    }
  },
  // 列表跳转
  indexListsTap(e) {
    var finderObj = e.currentTarget.dataset.id;
    //console.log(finderObj);
    wx.navigateTo({
      url: '../video/index',
      success: (res) => {
        // 通过eventChannel向被打开页面传送数据,目标页面是listDetail,这个data名字是你自己取的任意,在目标页面中有个参数接收就可以
        res.eventChannel.emit('finderObjEmit', {
          data: finderObj
        });
      },
    })
  },

  handleVideoPares: function (e) {
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo == '') {
      wx.showModal({
        title: '系统提示',
        content: '请先登录',
        success(res) {
        
        }
      })
      return
    }
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
        "CgiCmd": 1000000011,
        "CgiRequest": {
          "Scene": 0,
          "Query": this.data.keywords,
          "LastBuffer": ""
        },
      }
    }).then(res => {
      //console.log(res)
      if (res.data.CgiBaseResponse.Ret == 0) {
        console.log(res.data.ResponseData.FinderObjects[0].FinderObjectDesc.Media[0].Url)
        res.data.ResponseData.FinderObjects.forEach(element => {
          element.FinderObjectDesc.Media[0].ThumbUrl = element.FinderObjectDesc.Media[0].ThumbUrl.replace("http://", "https://")
          element.FinderObjectDesc.Media[0].Url = element.FinderObjectDesc.Media[0].Url.replace("http://", "https://")
          //console.log(element.FinderObjectDesc.Media[0].ThumbUrl)
        });
        this.setData({
          finnderLists: res.data.ResponseData.FinderObjects
        })
      } else if (res.data.CgiBaseResponse.Ret == 1) {
        wx.showModal({
          title: '系统提示',
          content: res.data.CgiBaseResponse.ErrMsg,
          success(res) {}
        })

        return

      } else {
        console.log("请求超时");
        wx.showModal({
          title: '系统提示',
          content: '后端服务器响应错误 联系客服',
          success(res) {
            // if (res.confirm) {
            //   console.log('用户点击确定')
            // } else if (res.cancel) {
            //   console.log('用户点击取消')
            // }
          }
        })
      }
    }).catch(error => {
      console.log(error);
      wx.showModal({
        title: '系统提示',
        content: '云服务器请求超时 1分钟后重试',
        success(res) {
          // if (res.confirm) {
          //   console.log('用户点击确定')
          // } else if (res.cancel) {
          //   console.log('用户点击取消')
          // }
        }
      })
    })

  },

  handlePares: function (e) {
    wx.getClipboardData({
      success: (res) => {
        //console.log(res.data);
        this.setData({
          keywords: res.data
        })
      }
    })

  },
  handleInput: function (e) {

  },
  handleClean: function (e) {
    this.setData({
      keywords: ""
    });
  },

});