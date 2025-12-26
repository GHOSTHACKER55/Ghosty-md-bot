// Handle button callbacks
bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const data = callbackQuery.data;

  // Verify Membership button
  if (data === 'verify_membership') {
    // For now, we assume user is verified. Replace with real join check if needed.
    const verified = true;

    if (verified) {
      // Congratulate user
      await bot.sendMessage(chatId, "🎉 Congratulations! You are now a member of the Ghosty Team.");

      // Send full commands list automatically
      await bot.sendMessage(chatId, commands.list, { parse_mode: 'Markdown' });

      // Optional: Notify admin/log channel if needed
      // await bot.sendMessage(<ADMIN_CHAT_ID>, `User ${chatId} has verified and received commands.`);
    } else {
      // User not verified yet
      await bot.sendMessage(chatId, "⚠️ You need to join all groups/channels before verification.");
    }
  }

  // All Functions button
  if (data === 'all_functions') {
    await bot.sendMessage(chatId, commands.list, { parse_mode: 'Markdown' });
  }

  // Pair button
  if (data === 'pair') {
    await bot.sendMessage(chatId, "Please send your number in international format, e.g., +923XXXXXXXXX");
  }

  // Unpair button
  if (data === 'unpair') {
    await bot.sendMessage(chatId, "Your number/pair has been removed successfully.");
  }
});