require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config.js');
const commands = require('./commands.js');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const welcomeText = `👋 Welcome to Ghosty MD Bot!\n\nPlease join the groups/channels below and click Verify Membership to access all commands.`;

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

  // Send text message with buttons (no image for now)
  bot.sendMessage(chatId, welcomeText, buttons);
});

// Handle button clicks
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  if (data === 'verify_membership') {
    // Verified
    bot.sendMessage(chatId, "🎉 Verified! You can now use all commands.");
    bot.sendMessage(chatId, commands.list, { parse_mode: 'Markdown' });
  }

  if (data === 'all_functions') {
    bot.sendMessage(chatId, commands.list, { parse_mode: 'Markdown' });
  }

  if (data === 'pair') {
    bot.sendMessage(chatId, "Please send your number in international format, e.g., +923XXXXXXXXX");
  }

  if (data === 'unpair') {
    bot.sendMessage(chatId, "Your number/pair has been removed successfully.");
  }
});