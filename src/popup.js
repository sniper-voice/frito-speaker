import * as storage from './storage.js'

init()

async function init() {
  const muted = await storage.isMuted()
  const muteButton = document.getElementById('muteButton')
  muteButton.innerText = muted ? 'ミュート解除' : 'ミュート'
  muteButton.addEventListener('click', async (ev) => {
    const muted = await storage.isMuted()
    const newValue = !muted
    muteButton.innerText = newValue ? 'ミュート解除' : 'ミュート'
    chrome.action.setBadgeText({ text: newValue ? 'MUTE' : '' })
    await storage.setMuted(newValue)
  })

  const volumeInput = document.getElementById('volumeInput')
  const volumeValue = await storage.getVolume()
  volumeInput.value = await storage.getVolume()
  volumeInput.addEventListener('change', async (ev) => {
    await storage.setVolume(ev.currentTarget.value)
  })

  const pitchInput = document.getElementById('pitchInput')
  pitchInput.value = await storage.getPitch()
  pitchInput.addEventListener('change', async (ev) => {
    await storage.setPitch(ev.currentTarget.value)
  })

  const rateInput = document.getElementById('rateInput')
  rateInput.value = await storage.getRate()
  rateInput.addEventListener('change', async (ev) => {
    await storage.setRate(ev.currentTarget.value)
  })

  const timesCheckbox = document.getElementById('timesCheckbox')
  timesCheckbox.checked = await storage.isTimesEnabled()
  timesCheckbox.addEventListener('change', async (ev) => {
    await storage.setTimesEnabled(ev.currentTarget.checked)
  })
}
