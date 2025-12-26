require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const config = require("./config");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// ================= STORAGE =================
const users = {};   // joined users
const pairs = {};   // paired numbers

// ================= HELPERS =================
function sendBotMessage(chatId, text, buttons = null) {
  const caption =
    `${text}\n\n` +
    `📢 *Join WhatsApp Channel:*\n${config.whatsappChannel}`;

  const options = {
    caption,
    parse_mode: "Markdown",
  };

  if (buttons) {
    options.reply_markup = { inline_keyboard: buttons };
  }

  return bot.sendPhoto(chatId, config.botImage, options);
}

// ================= /START =================
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  // Check Telegram group join
  try {
    const member = await bot.getChatMember(
      "@CyropesTricks",
      userId
    );

    if (member.status === "left") {
      return sendBotMessage(
        chatId,
        "❌ You must join our Telegram group first!",
        [[{ text: "Join Telegram Group", url: config.telegramGroup }]]
      );
    }
  } catch (e) {
    return sendBotMessage(
      chatId,
      "❌ You must join our Telegram group first!",
      [[{ text: "Join Telegram Group", url: config.telegramGroup }]]
    );
  }

  // WhatsApp join step
  sendBotMessage(
    chatId,
    "✅ Telegram verified!\n\nNow join WhatsApp Group & Channel, then click *I Joined*.",
    [
      [{ text: "Join WhatsApp Group", url: config.whatsappGroup }],
      [{ text: "Join WhatsApp Channel", url: config.whatsappChannel }],
      [{ text: "✅ I Joined", callback_data: "joined_whatsapp" }],
    ]
  );
});

// ================= CALLBACK =================
bot.on("callback_query", (q) => {
  const chatId = q.message.chat.id;
  const userId = q.from.id;

  if (q.data === "joined_whatsapp") {
    users[userId] = true;
    sendBotMessage(chatId, "🎉 Verified! You can now use all commands.");
  }
});

// ================= PAIR =================
bot.onText(/\.pair (\+92\d{10})/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const number = match[1];

  if (!users[userId]) {
    return sendBotMessage(chatId, "❌ Please complete join verification first.");
  }

  if (pairs[number]) {
    return sendBotMessage(chatId, `⚠️ ${number} is already paired.`);
  }

  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  pairs[number] = code;

  sendBotMessage(
    chatId,
    `✅ *PAIR SUCCESS*\n\n📞 Number: ${number}\n🔑 Code: ${code}`
  );

  sendBotMessage(
    config.logChannelId,
    `🔔 *NEW PAIR*\n\n👤 User: @${msg.from.username || msg.from.first_name}\n📞 ${number}\n🔑 ${code}`
  );
});

// ================= UNPAIR =================
bot.onText(/\.unpair (\+92\d{10})/, (msg, match) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const number = match[1];

  if (!users[userId]) {
    return sendBotMessage(chatId, "❌ Please complete join verification first.");
  }

  if (!pairs[number]) {
    return sendBotMessage(chatId, `⚠️ ${number} is not paired.`);
  }

  delete pairs[number];

  sendBotMessage(chatId, `✅ *PAIR REMOVED*\n\n📞 Number: ${number}`);

  sendBotMessage(
    config.logChannelId,
    `❌ *PAIR REMOVED*\n\n👤 User: @${msg.from.username || msg.from.first_name}\n📞 ${number}`
  );
});

// ================= STATUS =================
console.log("✅ MD Telegram Bot is running...");
