require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true })

// 1️⃣ FIRST MESSAGE (ONLY START BUTTON)
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id

  const welcome = `
࿊═══════════════════࿊
【 ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ GHOST MD BOT 】
࿊═══════════════════࿊
`

  bot.sendMessage(chatId, welcome, {
    reply_markup: {
      inline_keyboard: [
        [{ text: '▶ START BOT', callback_data: 'start_bot' }]
      ]
    }
  })
})

// 2️⃣ START BOT BUTTON CLICK
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id

  if (query.data === 'start_bot') {
    const mainText = `
࿊═══════════════════࿊
🌅 ɢᴏᴏᴅ ᴍᴏʀɴɪɴɢ, Ghost hacker!

ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ GHOST-MD
ʏᴏᴜʀ ғᴀsᴛᴇsᴛ WhatsApp pairing solution!

━━━━━━━━━━━━━━━
〔 ʙᴏᴛ ɪɴғᴏ 〕
➩ ʙᴏᴛ ɴᴀᴍᴇ: GHOST-MD
➩ ᴠᴇʀsɪᴏɴ: 1.0
━━━━━━━━━━━━━━━
〔 ᴄᴏᴍᴍᴀɴᴅs 〕
➩ /connect - Pair device
➩ /delpair - Remove pair
➩ /sessionid - Get session
➩ /ping - Check speed
➩ /report - Report issue
➩ /help - Show help
━━━━━━━━━━━━━━━
࿊═══════════════════࿊
`

    bot.sendMessage(chatId, mainText)
  }
})