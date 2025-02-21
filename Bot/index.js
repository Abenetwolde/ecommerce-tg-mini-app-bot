const { Telegraf ,Markup} = require('telegraf');
const http = require('http');
const express = require('express');
const bot = new Telegraf('7933890817:AAHuRrmLm3zdypK1Z2jdKhlShgg0PlBALTE');
const app = express();
app.use(express.json()); //
app.post('/webapp-data', (req, res) => {
  const { userId, data } = req.body;

  // Send a message to the user through the bot
  bot.telegram.sendMessage(userId, `You sent: ${data}`);
  res.status(200).send({ message: 'Data received and message sent' });
})  
bot.start((ctx) => {
    ctx.reply(`Hello, ${ctx.from.first_name}! 👋

🛍 Shop your favorite products right here inside Telegram!
🆕 Browse our latest collections, 🛒 add items to your cart, and ✅ securely checkout—all without leaving the app!
 `, {
        caption: "Caption",
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard([
          //https://ecommerce-tg-mini-app-bot.vercel.app  https://ecommerce-tg-mini-app-bot-1.onrender.com
          Markup.button.webApp("🚀 Order Now & Get It Fast!", `https://xexymtbtkdkj.share.zrok.io`),
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
const PORT = 4500;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));