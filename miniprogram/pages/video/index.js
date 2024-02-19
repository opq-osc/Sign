// pages/video/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    finderObj: {},
    hideCtrl:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    //检测授权
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              //  保存图片
              // console.log("scope.writePhotosAlbum");


            },
            fail: () => {
              //用户点击拒绝授权，跳转到设置页，引导用户授权
              wx.openSetting({
                success: () => {
                  wx.authorize({
                    scope: 'scope.writePhotosAlbum',
                    success: () => {
                      //  保存图片
                      //this.handleSaveCover(e.currentTarget.dataset.id)

                    }
                  })
                }
              })
            }
          })
        } else {
          //  保存图片

        }
      }
    })

    // 通过getOpenerEventChannel对象,对`parentPageEmit`进行监听
    const eventChannel = this.getOpenerEventChannel();

    eventChannel.on('finderObjEmit', (data) => {

      this.setData({
        finderObj: data.data,
      });
    });

    this.setData({
      hideCtrl: app.globalData.wxApp.HideCtrl
    
    })
  },

  handleCopyVideoUrl(e) {
    wx.setClipboardData({
      data: e.currentTarget.dataset.id,
      success(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        })
      }
    })

  },
  //保存封面
  handleSaveCover(e) {

    wx.downloadFile({
      url: e.currentTarget.dataset.id,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
              });
            },
            fail: (err) => {
              //console.error('保存失败:', err);
              wx.showToast({
                title: '保存失败',
                icon: 'none',
              });
            },
          });
        }
      }
    })

  },
  // 保存视频
  handleSaveVideo(e) {
    wx.downloadFile({
      url: e.currentTarget.dataset.id,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.saveVideoToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
              });
            },
            fail: (err) => {
              console.error('保存失败:', err);
              wx.showToast({
                title: '保存失败',
                icon: 'none',
              });
            },
          });
        }
      }
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