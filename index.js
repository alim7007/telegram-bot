const express = require("express");
const app = express();

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
  ]);

  bot.on("message", async (msg) => {
    console.log(msg);
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        `https://tlgrm.ru/_/stickers/ea5/382/ea53826d-c192-376a-b766-e5abc535f1c9/1.webp`
      );
      return bot.sendMessage(chatId, `wellcome ${msg.chat.first_name}`);
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
      return bot.sendMessage(
        chatId,
        `${data}=> and congrats, that is correct number`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `${data}=> unfortunately, that is incorrect`,
        againOptions
      );
    }
  });
};

start();

app.listen(3000, "0.0.0.0", function () {
  console.log("Listening on Port 3000");
});
