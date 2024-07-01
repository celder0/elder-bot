# elder-bot

This is a multipurpose discord bot.

## Prerequisites

* npm

## Starting the bot for development

* Create application on discord https://discord.com/developers/applications
  * Go to bot on the left side nav
  * Create bot
  * Turn on precense and server members intent

* Invite bot to your server with these urls to give it permissions
  * `https://discord.com/api/oauth2/authorize?client_id=<BotClientId>&scope=bot&permissions=397284478016` 
  * `https://discord.com/api/oauth2/authorize?client_id=<botClientId>&scope=applications.commands`

* Set up the environment variables below

  `TOKEN=<DISCORD_BOT_TOKEN>`

* Start bot with

  `npm start`
