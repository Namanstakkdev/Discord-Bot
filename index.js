const Discord = require("discord.js");
const config = require("./config.json");
const axios = require("axios");

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
  ],
});

Check = (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
};

handlePing = (message) => {
  const timeTaken = Date.now() - message.createdTimestamp;
  message.reply(`Pong! This message had a latency of ${timeTaken}ms.`);
};

handleSum = (message, args) => {
  const numArgs = args.map((x) => parseFloat(x));
  const sum = numArgs.reduce((counter, x) => (counter += x));
  message.reply(`The sum of all the arguments you provided is ${sum}!`);
};

handleGetdata = (message, args) => {
  if (args[0] === undefined) {
    let data;
    let axiosOptions = {
      method: "get",
      url: config.URL_ADDRESS,
    };
    axios(axiosOptions).then((response) => {
      data = JSON.stringify(response.data);
      data.length >= 4000 ? message.reply("Data to Long") : message.reply(data);
    });
  } else {
    let axiosOptions = {
      method: "get",
      url: `${config.URL_ADDRESS}/${args[0]}`,
    };
    axios(axiosOptions).then((response) => {
      message.reply(JSON.stringify(response.data));
    });
  }
};

handlePostdata = (message, args) => {
  let title = args[0],
    body = args[1];
  if (args[0] === undefined) {
    message.reply("Arguments are must for POST requests");
  } else {
    axios
      .post(config.URL_ADDRESS, {
        title: `${title}`,
        body: `${body}`,
      })
      .then((response) =>
        message.reply(`Inserted ${JSON.stringify(response.data)}`)
      )
      .catch((err) => console.log(err));
  }
};

const prefix = "!";

client.on("messageCreate", function (message) {
  Check(message);

  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  if (command === "ping") {
    handlePing(message);
  } else if (command === "sum") {
    handleSum(message, args);
  } else if (command === "getdata") {
    handleGetdata(message, args);
  } else if (command === "postdata") {
    handlePostdata(message, args);
  }
});

client.once(Discord.Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(config.BOT_TOKEN);
