class Popup{
  /**
   * 封装chrome插件js文件之间的通信
   * @param msg 需要发送的信息
   * @param callback 发送成功后的回调函数
   */
  send(msg, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
    {
      chrome.tabs.sendMessage(tabs[0].id, msg, function(response)
      {
        if(callback) callback(response);
      });
    });
  }

  /**
   * 向content-script.js页面发送消息
   * @param state 插件点击的按钮
   * @param value 点击按钮代表的值，会在页面中以弹出框的形式显示
   */
  sendInfo(state,value) {
    this.send({state: state, value: value}, (response) => {
      console.log('来自content的回复：' + response);
    })
  }

  /**
   * 监听点击事件，发送按钮对应的值给content-script.js
   */
  judge() {
    window.addEventListener('click', (event) => {
      if (event.target.className === 'btn start') {
        this.sendInfo('start','开启爬虫模式~')
      } else {
        this.sendInfo('end','关闭爬虫模式~')
      }
    })
  }
}
const popup = new Popup()
popup.judge()


