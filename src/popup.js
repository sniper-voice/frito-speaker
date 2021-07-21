import * as storage from './storage.js'

init()

async function init() {
  const isMuted = await storage.getMuted()
  const muteButton = document.getElementById('muteButton')
  muteButton.innerText = isMuted ? 'ミュート解除' : 'ミュート'
  muteButton.addEventListener('click', async (ev) => {
    const isMuted = await storage.getMuted()
    const newValue = !isMuted
    muteButton.innerText = newValue ? 'ミュート解除' : 'ミュート'
    chrome.action.setBadgeText({ text: newValue ? 'MUTE' : '' })
    await storage.setMuted(newValue)
  })

  const volumeInput = document.getElementById('volumeInput')
  volumeInput.value = await storage.getVolume()
  volumeInput.addEventListener('change', async (ev) => {
    await storage.setVolume(ev.target.value)
  })

  const pitchInput = document.getElementById('pitchInput')
  pitchInput.value = await storage.getPitch()
  pitchInput.addEventListener('change', async (ev) => {
    await storage.setPitch(ev.target.value)
  })

  const rateInput = document.getElementById('rateInput')
  rateInput.value = await storage.getRate()
  rateInput.addEventListener('change', async (ev) => {
    await storage.setRate(ev.target.value)
  })
}
