bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  if (data === 'verify_membership') {
    // Assume verified for now
    const verified = true;

    if (verified) {
      // Send verification success message
      await bot.sendMessage(
        chatId,
        "🎉 Verified! You can now use all commands."
      );

      // Optional: Send your WhatsApp/Telegram links as extra info
      await bot.sendMessage(
        chatId,
        `📢 Join WhatsApp Channel: ${config.whatsappChannel}\n📢 Join WhatsApp Group: ${config.whatsappGroup}\n📢 Join Telegram Group: ${config.telegramGroup}`
      );

      // **Send full commands list automatically**
      await bot.sendMessage(chatId, commands.list, { parse_mode: 'Markdown' });
    } else {
      await bot.sendMessage(
        chatId,
        "⚠️ You need to join all groups/channels before verification."
      );
    }
  }

  // Handle other buttons
  if (data === 'all_functions') {
    await bot.sendMessage(chatId, commands.list, { parse_mode: 'Markdown' });
  }
});