chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable()

  chrome.storage.sync.get(null, (items) => {
    chrome.action.setBadgeText({ text: items.mute === 'on' ? 'MUTE' : '' })

    if (items.mute === undefined) {
      chrome.storage.sync.set({ mute: 'off' })
    }

    if (items.volume === undefined) {
      chrome.storage.sync.set({ volume: '1.0' })
    }

    if (items.pitch === undefined) {
      chrome.storage.sync.set({ pitch: '1.0' })
    }

    if (items.rate === undefined) {
      chrome.storage.sync.set({ rate: '1.0' })
    }
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
