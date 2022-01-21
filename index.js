const express = require("express");
const app = express();
let port = process.env.PORT || 8080;
const TelegramApi = require("node-telegram-bot-api");
require("dotenv").config();
const { gameOptions, againOptions } = require("./options");

const bot = new TelegramApi(process.env.TLG_TOKEN, { polling: true });
// console.log(process.env.TLG_TOKEN);
const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `I'm thinking of a number from 0 to 9.`);
  const randomNum = Math.floor(Math.random() * 10);
  chats[chatId] = randomNum;
  return bot.sendMessage(chatId, `Can you guess what is it?`, gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "initial greating" },
    { command: "/info", description: "user info" },
    { command: "/game", description: "guess number game" },
    { command: "/xona", description: "xona roi kadan" },
  ]);

  bot.on("message", async (msg) => {
    console.log(msg);
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        `https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/1.webp`
      );
      return bot.sendMessage(chatId, `wellcome ${msg.chat.first_name}`);
    }
    if (text === "/delete") {
      return await setTimeout(async () => {
        for (let i = 0; i < 101; i++) {
          await bot.deleteMessage(msg.chat.id, msg.message_id - i);
        }
      }, 500);
    }
    if (text === "/xona") {
      return await setTimeout(async () => {
        for (let i = 0; i <= 20; i++) {
          await bot.sendMessage(chatId, `bra xona bachajon`);
          if (i === 20) {
            return bot.sendMessage(chatId, `basay`);
          }
        }
      }, 2000);
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `your name is ${msg.chat.first_name} and username is ${msg.chat.username}`
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, `${text} is an invalid command`);
  });

  bot.on("callback_query", async (msg) => {
    const chatId = msg.message.chat.id;
    const data = msg.data;
    if (data === "/again-game") {
      return startGame(chatId);
    }
    if (data == chats[chatId]) {
      return bot.sendMessage(chatId, `${data} is correct`, againOptions);
    } else {
      return bot.sendMessage(
        chatId,
        `${data} is incorrect (--${chats[chatId]}--)`,
        againOptions
      );
    }
  });
};

start();

app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on Port ${port}`);
});
