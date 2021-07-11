chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable()

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
