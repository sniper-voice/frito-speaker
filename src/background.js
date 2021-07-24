import { isMuted } from './storage.js'

chrome.runtime.onInstalled.addListener(async () => {
  chrome.action.disable()

  const muted = await isMuted()
  chrome.action.setBadgeText({ text: muted ? 'MUTE' : '' })

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

  const boikoneTabs = await chrome.tabs.query({
    url: 'https://stage.boikone.jp/*',
  })
  for (const tab of boikoneTabs) {
    chrome.tabs.reload(tab.id)
  }
})
