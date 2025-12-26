bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === 'verify_membership') {
    const verified = true; // Replace with real check if needed

    if (verified) {
      // 1️⃣ Send verified message
      await bot.sendMessage(chatId, "🎉 Verified! You can now use all commands.");

      // 2️⃣ Send group/channel links
      await bot.sendMessage(chatId,
        `📢 Join WhatsApp Channel: ${config.whatsappChannel}\n📢 Join WhatsApp Group: ${config.whatsappGroup}\n📢 Join Telegram Group: ${config.telegramGroup}`
      );

      // 3️⃣ Send full commands list
      await bot.sendMessage(chatId, commands.list, { parse_mode: 'Markdown' });
    } else {
      await bot.sendMessage(chatId, "⚠️ You need to join all groups/channels before verification.");
    }
  }
});