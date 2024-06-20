import {Bot,
  GrammyError,
  HttpError,
  Keyboard,
  InlineKeyboard,
  webhookCallback} from 'grammy'
import request from 'request'
import cheerio from 'cheerio'
import fs from 'fs'
import dotenv from "dotenv/config";


// https://api.telegram.org/bot5075619990:AAEyF5W1D_JmFuN6y6BGp2lpxXupKyR0Ays/setWebhook?remove
const token = process.env.BOT_API_KEY;
if (!token) throw new Error("BOT_TOKEN is unset");
const bot = new Bot(token);

const bus = 'https://yandex.ru/maps/213/moscow/stops/stop__9643717/?ll=37.826208%2C55.777070&tab=overview&z=16'

bot.api.setMyCommands([
  {
    command: "start",
    description: "Запуск Бота",
  },
  {
    command: "id",
    description: "Мой ID",
  },
  {
    command: "serega",
    description: "Приветствие Сереги",
  },
  {
    command: "keyboard",
    description: "Клавиатура",
  },
  {
    command: "share",
    description: "Поделиться контактом или локации",
  },
  {
    command: "html",
    description: "Запрос Yandex",
  },
]);

// Клавиатура Custom Keyboard...
const customKeyboard = new Keyboard()
  .text("Хорошо")
  .row()
  .text("Плохо")
  .row()
  .text("Нормально")
  .oneTime();

const shareKeyboard = new Keyboard()
  .requestContact("Контакт")
  .requestLocation("Геолокация")
  .resized();
//
bot.command(["start", "privet"], async (ctx) => {
  if (ctx.from.id === 1085738828) {
    await ctx.react("👍");
    await ctx.reply("Привет Серега рад тебя видеть...");
  } else {
    await ctx.reply("Привет! Я - Бот 🤖");
  }
});

bot.command("id", async (ctx) => {
  await ctx.reply(`Мой ID:  ${ctx.from.id}`);
});

// bot.on(':text', async (ctx) => {
//     ctx.reply("Надо подумать...");
// })
bot.on(":photo", async (ctx) => {
  ctx.reply("Это фотография");
});

bot.on("::email", async (ctx) => {
  ctx.reply("Это Email");
});

bot.hears("serega", async (ctx) => {
  await ctx.reply("Привет, Серега! ты Супер Кодер...");
});

bot.command("keyboard", async (ctx) => {
  await ctx.reply("Как настроение Серега", {
    reply_markup: customKeyboard,
  });
});

bot.hears("Хорошо", (ctx) => {
  ctx.reply("Здорово что хорошо, рад слышать так держать!!!");
});

bot.command("share", async (ctx) => {
  await ctx.reply("Поделится контактом или геолокации", {
    reply_markup: shareKeyboard,
  });
});

bot.command("html", async (ctx) => {

  request(bus, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      fs.writeFile('page.html', body, (err) => {
        if (err) throw err
        console.log('Страница сохранена в формате page.html')
      })
    }
  });

    await ctx.reply("Страница сохранена в формате page.html");
 
});

// Обработка Ошибки Grammy...
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handle update ${ctx.update.update_id}`);
  const e = err.err;
  if (e instanceof GrammyError) {
    console.error(`Error in Request ${e.description}`);
  } else if (e instanceof HttpError) {
    console.error("Cold not Contact Grammy", e);
  } else {
    console.error("Unknown error", e);
  }
});


// Запуск Бота ...
export default webhookCallback(bot, "std/http");
// bot.start();
