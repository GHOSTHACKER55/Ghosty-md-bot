require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config.js');
const commands = require('./commands.js');

// Initialize bot
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// /start command
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  const welcomeText = `Welcome to Ghosty MD Bot!\n\nPlease join the required groups/channels to access all functions.`;

  // Inline buttons
  const opts = {
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

  // Send welcome message with buttons
  bot.sendPhoto(chatId, config.botBanner, { caption: welcomeText, reply_markup: opts.reply_markup });
});

// Handle button callbacks
bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === 'verify_membership') {
    // Here you would check if the user joined all groups/channels
    const verified = true; // Replace with real check
    if (verified) {
      await bot.sendMessage(chatId, `🎉 Congratulations! You are now a member of the Ghosty Team.`);
      await bot.sendMessage(chatId, commands.list, { parse_mode: 'Markdown' });
    } else {
      await bot.sendMessage(chatId, `⚠️ You need to join all groups/channels before verification.`);
    }
  }

  if (data === 'all_functions') {
    await bot.sendMessage(chatId, commands.list, { parse_mode: 'Markdown' });
  }

  if (data === 'pair') {
    await bot.sendMessage(chatId, `Please send your number in international format, e.g., +923XXXXXXXXX`);
  }

  if (data === 'unpair') {
    await bot.sendMessage(chatId, `Your number/pair has been removed successfully.`);
  }
});

// Optional: handle messages for pair/unpair inputs
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text.startsWith('+')) {
    // Example: Pair number
    await bot.sendMessage(chatId, `Number ${text} has been paired successfully.`);
  }
});