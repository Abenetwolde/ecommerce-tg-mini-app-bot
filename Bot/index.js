const { Telegraf ,Markup} = require('telegraf');
const http = require('http');
const express = require('express');
const bot = new Telegraf('6109494690:AAGHFhZ0U9v5tz2Ii0rVlE3xm2j4bg5OaVA');
const app = express();
app.use(express.json()); //
app.post('/webapp-data', (req, res) => {
  const { userId, data } = req.body;

  // Send a message to the user through the bot
  bot.telegram.sendMessage(userId, `You sent: ${data}`);
  res.status(200).send({ message: 'Data received and message sent' });
})
bot.start((ctx) => {
    ctx.reply("Click Here!", {
        caption: "Caption",
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          Markup.button.webApp("Click", `https://o97nsm2a662x.share.zrok.io`),
        ])
}); 
})
// bot.on('callback_query', async (ctx) => {
//   const callbackData = ctx.callbackQuery.data;
//   if (callbackData.startsWith('view_order_')) {
//     const orderId = callbackData.replace('view_order_', '');
//     const orderInfoUrl = `https://a192r4rebja4.share.zrok.io/order/${orderId}`;
//     await ctx.answerCbQuery(); // Acknowledge the callback query
//     await ctx.reply(`You can view your order details here: ${orderInfoUrl}`);
//   }
// });

bot.on("message", async (ctx) => {
  // console.log(ctx.message.web_app_data)
  return ctx.reply(ctx.message.web_app_data?.data)

});

bot.launch(); 
// Start the Express server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));