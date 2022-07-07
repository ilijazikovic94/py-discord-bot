import discord
import os # default module
from dotenv import load_dotenv
import requests
import aiocron

load_dotenv() # load all the variables from the env file
bot = discord.Bot(debug_guilds=[986772331944886313])

headers = {
	"Content-Type": "application/json; charset=UTF-8",
	"User-Agent": "DiscordBot (https://github.com/discord/discord-app, 1.0.0)",
	"Authorization": "Bot " + os.getenv('TOKEN') 
}

def checkSubscriptionStatus(username):
	endpoint = os.getenv('SHIKARI_WEBSITE_URL') + '/check-subscription/'
	res = requests.post(endpoint, data={ 'username': username })
	data = res.json()
	return data

def getGuildMembers():
  endpoint = "https://discord.com/api/v10/guilds/986772331944886313/members"
  res = requests.get(endpoint, headers=headers)
  data = res.json()
  return data

def updateUserRole(userId, status):
  endpoint = "https://discord.com/api/v10/guilds/986772331944886313/members/" + userId

  if not status:
    if os.getenv('EMPTY_ROLES'):
      data = {'roles': os.getenv('EMPTY_ROLES').split(',')}
    else:
      data = {'roles': []}
  else:
    if os.getenv('SUBSCRIBED_ROLES'):
      data = {'roles': os.getenv('SUBSCRIBED_ROLES').split(',')}
    else:
      data = {'roles': []}

  res = requests.patch(endpoint, data=data, headers=headers)
  data = res.json()
  return data

def verifyShikariSubscription():
  members = getGuildMembers()
  for i in members:
  	user = members[i].user;
  	print("Checking " + user.username + "'s subscription status from shikari...")
  	response = checkSubscriptionStatus(user.username)
  	licenseStatus = response.data.licensed;
  	if licenseStatus:
  		print(user.username + "'s subscription status: Subscribed");
  	else:
  		print(user.username + "'s subscription status: Not Subscribed");
  	updateUserRole(user.id, licenseStatus)
  	return True

@aiocron.crontab('0 22 * * *')
async def runCronJob():
  verifyShikariSubscription();

@bot.event
async def on_ready():
    print(f"{bot.user} is ready and online!")

@bot.slash_command(name = "hello", description = "Say hello to the bot")
async def hello(ctx):
    await ctx.respond("Hey!")

@bot.slash_command(name = "verify-subscription", description = "Verify subscription")
async def verifySubscription(ctx):
  verifyShikariSubscription();
  await ctx.respond("Updated successfully!")

bot.run(os.getenv('TOKEN')) # run the bot with the token

