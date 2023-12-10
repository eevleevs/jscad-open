chrome.runtime.onInstalled.addListener(() => {
  chrome.action.onClicked.addListener(tab => {
    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: redirect,
        args: [tabs[0].url],
      })
    })
  })

  chrome.contextMenus.create({
    id: 'redirectMenuItem',
    title: 'Open in JSCAD',
    contexts: ['link'],
  })

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'redirectMenuItem') {
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: redirect,
        args: [info.linkUrl],
      })
    }
  })
})

async function redirect(link) {
  let url = new URL(link)
  if (!url.pathname.endsWith('.js'))
    return alert('This is not a JavaScript link')
  if (url.host == 'github.com') url = (await fetch(url + '?raw=true')).url
  location.assign('https://jscad.app#' + url)
}
