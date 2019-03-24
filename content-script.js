class GetDom {
  constructor() {
    this._element = null;
    this._elementBackground = '';
    this._id = '';
    this._tab = null;
    this._className = '';
    this._origin = window
    this._msg = {
      'className': '',
      'id': ''
    };

  }
  _intiTab() {

    window.addEventListener('DOMContentLoaded', () => {

      const tab = document.createElement('div')
      tab.className = 'tab'

      tab.innerHTML =
        `
        <div class="tab-title" style="width: 100%;height: 20px;background-color: #f3f3f3;border-bottom: #d0d0d0 1px solid">
            <p class="tab-title-text" style="line-height: 20px">欢迎使用晴空爬虫系统</p>
        </div>
        <div class="tab-left" style="width: 70%;height: 100%;border-right: #d0d0d0 solid 1px;float: left">
            <h1 class="tab-left-content" style="font-size: 15px;line-height: 15px;">这里将显示dom元素</h1>
        </div>
        <div class="tab-right" style="width: 29%;height: 100%; float: left">
            <h1 class="tab-right-options">这里将显示选项</h1>
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
  changeBackgroundColor() {
    this._origin.addEventListener('mouseover', (event) => {
      if (event.target.className === 'tab'
        || event.target.className === 'tab-title'
        || event.target.className === 'tab-title-text'
        || event.target.className === 'tab-left'
        || event.target.className === 'tab-left-content'
        || event.target.className === 'tab-right'
        || event.target.className === 'tab-right-options'
      ) return
      this._element = event.target
      this._elementBackground = this._element.style.backgroundColor
      this._element.style.backgroundColor = '#a7c4e5'
      this.showDom(this._element)
    })
  }
  restoreBackgroundColor() {
    this._origin.addEventListener('mouseout', () => {
      this._element.style.backgroundColor = this._elementBackground
    })
  }
  getId() {
    window.addEventListener('click', (event) => {
      this._id = event.target.id
      console.log(`ID: ${this._id}`)
      event.preventDefault()
    })
  }
  showDom(dom) {
    document.querySelector('.tab-left-content').innerText =
      `
        标签名：${dom.tagName}\t类名：${dom.className}\t${dom.id? +'id:'+dom.id : ''}\n
        ${dom.innerText ? '标签内的值为：' + dom.innerText : '媒体链接：' + dom.src}
      `
  }
  getClassName() {
    window.addEventListener('click', (event) => {
      for (let x in this._tab.children) {
        console.log(x.innerHTML)
      }
      this._className = event.target.className
      console.log(`类名: ${this._className}`)
      event.preventDefault()
    })
  }
  sendMessage() {
    chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
      console.log(response.farewell);
    });
  }
  show() {
    this._tab.style.transform = 'scale(1,1)'
  }
}
const target = new GetDom()
target._intiTab()
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.cmd === "test")
      sendResponse({ok: "start"});
    alert('aaa')
    target.show()
    target.changeBackgroundColor();
    target.restoreBackgroundColor()
    target.getClassName()
    target.getId()
    // target.sendMessage()
  });




