/*
 * @Description: 
 * @Version: 1.0
 * @Autor: cherry
 * @Date: 2020-06-11 10:11:59
 * @LastEditors: cherry
 * @LastEditTime: 2020-08-11 16:50:59
 */ 
import axios from 'axios'
import wx from 'weixin-js-sdk'
import { WX_API, WX_APIS } from '@/config/index.js'

export default function getWXSign() {
  var wxPath = window.location.href.indexOf('https') > -1 ? WX_APIS : WX_API 
  // var wxPath = WX_API
  // if(~window.location.href.indexOf('https')) {
  //   wxPath.replace(/^http/, 'https')
  // }
  return new Promise((resolve, reject) => {
    if (!window.$wx) {
      // 必填，需要使用的JS接口列表
      const jsApiList = [
        'chooseWXPay', 
        'getLocation', 
        'openLocation', 
        'hideMenuItems', 
        'invokeMiniProgramAPI',
        'miniProgram', 
        'chooseImage',
        'uploadImage', 
        'closeWindow',
        'onMenuShareAppMessage',
        'scanQRCode'
      ] 
      let url
      if(~window.location.href.indexOf("#")) {
        url = window.location.href.split('#')[0]
      } else {
        // url = window.location.origin
        url = window.location.href
      }
      console.log(window.location, 'window.location', url)
      axios.post( wxPath, {   
        url: window.encodeURIComponent(url)
      }).then(function(res) {
        if(res.data.success) {
          window.setTimeout(() => {
            const data = res.data.data
            console.log(data, 'data')
            wx.config({
              // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: data.appid, // 必填，企业号的唯一标识，此处填写企业号corpid
              timestamp: data.timestamp, // 必填，生成签名的时间戳
              nonceStr: data.noncestr, // 必填，生成签名的随机串
              signature: data.sign, // 必填，签名，见附录1
              jsApiList: jsApiList
            })
            wx.ready(function(res) {
              //自定义分享
              wx.onMenuShareAppMessage({
                title: '潮级VIP', // 分享标题
                desc: "潮级VIP 爱生活",
                link: url,
                imgUrl: "http://doyd-test.oss-cn-shenzhen.aliyuncs.com/jkb/wxmedia/20180910/1536573577108.png", // 分享图标
                // type: '', // 分享类型,music、video或link，不填默认为link
                // dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                success: function () { 
                    // 用户确认分享后执行的回调函数
                    console.log(url, '分享出去的地址链接')
                },
                cancel: function () { 
                    // 用户取消分享后执行的回调函数
                }
              });
              window.$wx = wx
              resolve(wx)
            })
            wx.error(function(res) {
              reject(res)
              // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            })
          }, 0);
        } else {
          reject(res)
        }
      })
      .catch(function(error) {
        reject(error)
      })
    } else {
      resolve(window.$wx)
    }
   
  })
}