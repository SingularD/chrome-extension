class GetDom {
  constructor() {
    this._element = null; // 鼠标移动和点击时候被改变背景颜色的元素
    this._elementBackground = ''; // 储存鼠标移动时候获取的元素本身的背景元素
    this._id = ''; // 元素id
    this._tab = null; // 爬虫展示框
    this._hrefList = []; // 用于储存点击时候获取的超链接，临时变量，之后会转化为字符串
    this._msg = {
      'className': '',
      'id': ''
    }; // 发送给后台的json

  }

  /**
   *  初始化元素，添加显示框
   */
  _intiTab() {

    window.addEventListener('DOMContentLoaded', () => {

      const tab = document.createElement('div')
      tab.className = 'tab'

      tab.innerHTML =
        `
        <div class="tab-title" style="width: 100%;height: 20px;background-color: #f3f3f3;border-bottom: #d0d0d0 1px solid">
            <p class="tab-title-text" style="margin-left:50px;line-height: 20px">欢迎使用晴空爬虫系统</p>
        </div>
        <div class="tab-left" style="width: 49%;height: 100%;border-right: #d0d0d0 solid 1px;float: left;overflow: auto">
            <h1 class="tab-left-content" style="margin-left:50px;font-size: 15px;line-height: 15px;">这里将显示dom元素</h1>
        </div>
        <div class="tab-right" style="width: 50%;height: 100%; float: left;overflow: auto">
            <h1 class="tab-right-content" style="margin-left: 30px">点击获取DOM元素</h1>
        </div>
        `
      tab.style.cssText =
        `
         width: 100%;
         height: 20vh;
         position: fixed;
         bottom: 0%;
         background-color: white;
         z-index: 10000;
         border-top: #d0d0d0 solid 1px;
         transform: scale(0,0);
         transition: all 2s;
        `
      document.body.appendChild(tab)
      this._tab = tab
    })
  }

  /**
   * 全局监听鼠标移动事件，改变鼠标所指元素的背景颜色
   */
  changeBackgroundColor() {
    window.addEventListener('mouseover', (event) => {
      if (event.target.className === 'tab'
        || event.target.className === 'tab-title'
        || event.target.className === 'tab-title-text'
        || event.target.className === 'tab-left'
        || event.target.className === 'tab-left-content'
        || event.target.className === 'tab-right'
        || event.target.className === 'tab-right-content'
      ) return
      this._element = event.target
      this._elementBackground = this._element.style.backgroundColor
      this._element.style.backgroundColor = '#a7c4e5'
      this.showDom(this._element)
    })
  }

  /**
   * 全局监听，鼠标移开时回复背景颜色
   */
  restoreBackgroundColor() {
    window.addEventListener('mouseout', () => {
      this._element.style.backgroundColor = this._elementBackground
    })
  }

  /**
   * 全局监听点击事件，获取触发事件的id
   */
  getId() {
    window.addEventListener('click', (event) => {
      this._id = event.target.id
      console.log(`ID: ${this._id}`)
      event.preventDefault()
    })
  }

  /**
   * 左边显示框
   * 显示输入元素的标签名，类名，id，标签内的值以及媒体链接（src）
   * @param dom
   */
  showDom(dom) {
    document.querySelector('.tab-left-content').innerText =
      `
        标签名：${dom.tagName}\t类名：${dom.className}\t${dom.id? +'id:'+dom.id : ''}\n
        ${dom.innerText ? '标签内的值为：' + dom.innerText : '媒体链接：' + dom.src}
      `
  }

  /**
   * 右边显示框
   * 点击事件触发时对应元素的标签名，类名，id，标签内的值以及媒体链接（src）
   * @param dom
   */
  confirmDom(dom) {
    document.querySelector('.tab-right-content').innerText =
      `
        标签名：${dom.tagName}\t类名：${dom.className}\t${dom.id? +'id:'+dom.id : ''}\n
        ${dom.innerText ? '标签内的值为：' + dom.innerText : '媒体链接：' + dom.src}\n
        ${this.getHref(dom)}
      `
  }

  /**
   * 改变原来网页的高度，使得爬虫信息显示框拉到最底部是不会覆盖原来网页的内容
   */
  addBodyHeight() {
    window.onload = () => {
      document.body.style.height = document.querySelector('body').offsetHeight + 600 + 'px'
      console.log(document.querySelector('body').offsetHeight)
    }
  }

  /**
   * 获得输入元素或者子元素a标签链接（href）
   * @param dom
   * @returns {string} 返回一个字符串，为所有输入元素下的href
   */
  getHref(dom) {
    this._hrefList = []
    let count = 1;
    if (dom.getElementsByTagName('a').length > 0) {
      console.log(dom.getElementsByTagName('a'))

      for (let x of dom.getElementsByTagName('a')) {
        let singleHref = `超链接${count++}为: ${x.href}\n`
        this._hrefList.push(singleHref)
      }
    }
    return this._hrefList.join('')
  }

  /**
   * 全局监听点击事件，获取点击元素的类名
   */
  getClassName() {
    window.addEventListener('click', (event) => {
      this.confirmDom(this._element)
      event.preventDefault()
    })
  }

  /**
   * 接受popup.js消息，'start'开始爬虫模式，'end'关闭爬虫模式，并重新刷新网页
   */
  receiveMessage() {
    const _this = this
    chrome.runtime.onMessage.addListener(
      (request, sender, sendResponse) => {
        if (request.state === "start") {
          alert(request.value)
          _this.show()
          _this.changeBackgroundColor();
          _this.restoreBackgroundColor()
          _this.getClassName()
          _this.getId()
          sendResponse({state: 'start'})
        }else {
          document.body.removeChild(this._tab)
          alert('爬虫模式即将关闭！')
          window.location.reload()
        }
      });
  }

  /**
   * 爬虫信息显示框动画
   */
  show() {
    this._tab.style.transform = 'scale(1,1)'
  }
}
const target = new GetDom()
target._intiTab();
target.addBodyHeight();
target.receiveMessage();




