import { getMuted } from './storage.js'

chrome.runtime.onInstalled.addListener(async () => {
  chrome.action.disable()

  const isMuted = await getMuted()
  chrome.action.setBadgeText({ text: isMuted ? 'MUTE' : '' })

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
