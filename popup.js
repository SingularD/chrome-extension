document.querySelector('.start').addEventListener('click', () => {
  send({cmd:'test', value:'你好，我是popup！'}, function(response)
  {
    alert('bbb')
    console.log('来自content的回复：'+response);
  })
})

const send = (msg, callback) => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
  {
    chrome.tabs.sendMessage(tabs[0].id, msg, function(response)
    {
      if(callback) callback(response);
    });
  });
}

