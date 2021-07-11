function getStorageValue(key, defaultValue) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get({ [key]: defaultValue }, (items) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError)
      }
      resolve(items[key])
    })
  })
}

function getMuted() {
  return getStorageValue('mute', 'off').then((mute) => mute === 'on')
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable()

  getMuted().then((isMuted) => {
    chrome.action.setBadgeText({ text: isMuted ? 'MUTE' : '' })
  })

  chrome.declarativeContent.onPageChanged.removeRules(undefined, () => {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'stage.boikone.jp', schemes: ['https'] },
          }),
        ],
        actions: [new chrome.declarativeContent.ShowAction()],
      },
    ])
  })
})
