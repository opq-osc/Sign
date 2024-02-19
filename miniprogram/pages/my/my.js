// pages/my/my.js
const app = getApp()
import Dialog from '@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideCtrl: false,
    userInfo: null,
    projectColumns: [],
    vip: false,
    isUser: false,
    qiandaoShow: false,
    bangdingShow: false,
    shuomingShow: false,
    bangdinngShuomingShow: false,
    projectShow: false,
    projectName: "视频号",
    projectToken: "",
    projectIndex: 2,
    tutorials: [{
      tutorialImage: "https://mmbiz.qpic.cn/mmbiz_png/B4T4U634CNvjSicouW9iaM2K0k9PM4sTG7olsibmVOVYagGy9SibTia5XfvAA8hKicdp8x4u9nPMxRrsPKruf8M2PU6Q/640?wx_fmt=png&amp;from=appmsg",
      tutorialContent: "1、通过喜欢的作品找到作者名"
    }, {
      tutorialImage: "https://mmbiz.qpic.cn/mmbiz_png/B4T4U634CNvjSicouW9iaM2K0k9PM4sTG7siaDNb4mUYrw36ojMsEkE0vTN6DgoAIM1zL8Wu4mtx79WjxtUZRr86w/640?wx_fmt=png&amp;from=appmsg",
      tutorialContent: "2、小程序中搜索 作者名"
    }, {
      tutorialImage: "https://mmbiz.qpic.cn/mmbiz_png/B4T4U634CNvjSicouW9iaM2K0k9PM4sTG7a0xveAkZRuer4ZjST0vFDEQWMAYibqPqQmwUhIqlgURdz5owZ5GMl3w/640?wx_fmt=png&amp;from=appmsg",
      tutorialContent: "3、保存视频 建议复制视频地址自行下载 小程序内无法下载300M以上的资源"
    }]
  },
  onCancel() {
    this.setData({
      projectShow: false
    });
  },
  onConfirm(event) {
    // const {
    //   picker,
    //   value,
    //   index
    // } = event.detail;
    //console.log(`当前值：${value}, 当前索引：${index}`);
    this.setData({
      projectIndex: event.detail.index,
      projectName: event.detail.value,
      projectShow: false
    });
  },
  showPopupBanngDing() {
    this.setData({
      bangdingShow: true
    });
  },
  showPopupProject() {
    this.setData({
      qiandaoShow: true
    });
  },
  showShuoming() {
    this.setData({
      shuomingShow: true
    });
  },
  showBangDingShuoming() {
    this.setData({
      bangdinngShuomingShow: true
    });
  },
  onBangDingShuomingClose() {
    this.setData({
      bangdinngShuomingShow: false
    });
  },
  onshuomingClose() {
    this.setData({
      shuomingShow: false
    });

  },
  onBangdingClose() {
    this.setData({
      bangdingShow: false
    });
  },
  onProjecClick() {
    this.setData({
      projectShow: true
    });
  },
  onClose() {
    this.setData({
      qiandaoShow: false
    });
  },
  onBtnLoginClick() {

    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        //console.log(res)
        this.setData({
          userInfo: res.userInfo,
          isUser: true
        })
        wx.setStorageSync('userInfo', res.userInfo)
      }
    })

  },
  onBtnQianDaoClick() {
    //console.log(this.data.projecIndex)

    if (this.isLogin() == false) {

      Dialog.alert({
        title: '系统提示',
        message: "请先登录"
      }).then(() => {
        // on close
      });
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
        "CgiCmd": 1,
        "CgiRequest": {
          "AuthType": this.data.projectIndex
        },
      }
    }).then(res => {
      //console.log(res)
      if (res.data.CgiBaseResponse.Ret == 0) {
        //console.log(res.data.ResponseData)

        Dialog.alert({
          title: '提示',
          message: res.data.ResponseData
        }).then(() => {
          // on close
        });

      } else if (res.data.CgiBaseResponse.Ret == 1) {

        Dialog.alert({
          title: '提示',
          message: res.data.CgiBaseResponse.ErrMsg
        }).then(() => {
          // on close
        });

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

  onBtnBanngDingClick() {
    //console.log(this.data.projectIndex, this.data.projectToken)
    if (this.isLogin() == false) {

      Dialog.alert({
        title: '系统提示',
        message: "请先登录"
      }).then(() => {
        // on close
      });
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
        "CgiCmd": 2,
        "CgiRequest": {
          "AuthType": this.data.projectIndex,
          "NickName": this.data.userInfo.nickName,
          "Token": this.data.projectToken
        },
      }
    }).then(res => {
      //console.log(res)
      if (res.data.CgiBaseResponse.Ret == 0) {
        //console.log(res.data.ResponseData)

        Dialog.alert({
          title: '提示',
          message: res.data.ResponseData
        }).then(() => {
          // on close
        });
        wx.setClipboardData({
          data: res.data.ResponseData
        })

      } else if (res.data.CgiBaseResponse.Ret == 1) {


        Dialog.alert({
          title: '提示',
          message: res.data.CgiBaseResponse.ErrMsg
        }).then(() => {
          // on close
        });

        return

      } else {
        console.log("请求超时");
        wx.showModal({
          title: '系统提示',
          content: res.data.CgiBaseResponse.ErrMsg + '后端服务器响应错误 联系客服',
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      projectColumns: app.globalData.wxApp.Projects,
      hideCtrl: app.globalData.wxApp.HideCtrl

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

    this.isLogin()
  },
  isLogin() {
    var userInfo = wx.getStorageSync('userInfo')
    if (userInfo == '') {
      this.setData({
        isUser: false
      })

      return false
    } else {
      this.setData({
        userInfo: userInfo,
        isUser: true
      })
    }

    return true
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})