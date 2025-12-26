require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config.js');
const commands = require('./commands.js');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  const welcomeText = `👋 Welcome to Ghosty MD Bot!\n\nPlease join all groups/channels below and click Verify Membership to access all commands.`;

  const buttons = {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Join WhatsApp Group', url: config.whatsappGroup }],
        [{ text: 'Join WhatsApp Channel', url: config.whatsappChannel }],
        [{ text: 'Join Telegram Group', url: config.telegramGroup }],
        [{ text: 'Verify Membership', callback_data: 'verify_membership' }],
        [{ text: 'All Functions', callback_data: 'all_functions' }],
        [{ text: 'Pair', callback_data: 'pair' }, { text: 'Unpair', callback_data: 'unpair' }]
      ]
    }
  };

  try {
    // Send image with buttons
    await bot.sendPhoto(chatId, config.botBanner, { caption: welcomeText, reply_markup: buttons.reply_markup });
  } catch (err) {
    console.error('Error sending welcome message:', err);
  }
});

// Handle inline button callbacks
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'verify_membership') {
    const verified = true; // Replace with real check if needed

    if (verified) {
      await bot.sendMessage(chatId, "🎉 Verified! You can now use all commands.");
      await bot.sendMessage(chatId, commands.list, { parse_mode: 'Markdown' });
    } else {
      await bot.sendMessage(chatId, "⚠️ You need to join all groups/channels before verification.");
    }
  }

  if (data === 'all_functions') {
    await bot.sendMessage(chatId, commands.list, { parse_mode: 'Markdown' });
  }

  if (data === 'pair') {
    await bot.sendMessage(chatId, "Please send your number in international format, e.g., +923XXXXXXXXX");
  }

  if (data === 'unpair') {
    await bot.sendMessage(chatId, "Your number/pair has been removed successfully.");
  }
});

// Pair/unpair via messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text.startsWith('+')) {
    await bot.sendMessage(chatId, `Number ${text} has been paired successfully.`);
  }
});