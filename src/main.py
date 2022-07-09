import discord
from discord.ext import commands
import os # default module
from dotenv import load_dotenv
import requests
import aiocron

load_dotenv() # load all the variables from the env file

intents = discord.Intents.all()

bot = commands.Bot(command_prefix='', intents=intents)

def checkSubscriptionStatus(username):
	endpoint = os.getenv('SHIKARI_WEBSITE_URL') + '/check-subscription/'
	res = requests.post(endpoint, json={ 'username': username }, headers={"Content-Type": "application/json"})
	data = res.json()
	return data

async def verifyShikariSubscription():
  takenGuild = bot.get_guild(int(os.getenv('GUILD_ID')))
  members = await takenGuild.fetch_members(limit=None).flatten()
  # need to find correct role id to subscribe user using this line
  print(takenGuild.roles)

  role = discord.utils.get(takenGuild.roles, id=int(os.getenv('SUBSCRIBED_ROLE')))
  for member in members:
  	# to avoid bot and server administrator for checking subscription
  	if (not member.bot) and (member.name != os.getenv('SERVER_ADMIN_NAME')):
	  	print("Checking " + member.name + "'s subscription status from shikari...")
	  	# getting subscription status from shikari website
	  	response = checkSubscriptionStatus(member.name)
	  	licenseStatus = response["licensed"];
	  	if licenseStatus:
	  		print(member.name + "'s subscription status: Subscribed");
	  	else:
	  		print(member.name + "'s subscription status: Not Subscribed");

	  	# add/remove role based on license status
	  	if licenseStatus:
	  	    await member.add_roles(role)
	  	else:
	  		await member.remove_roles(role)
  return True

@aiocron.crontab('0 22 * * *')
async def runCronJob():
  data = await verifyShikariSubscription();

@bot.event
async def on_ready():
    print(f"{bot.user} is ready and online!")

@bot.slash_command(name = "hello", description = "Say hello to the bot")
async def hello(ctx):
    await ctx.respond("Hey!")

@bot.slash_command(name = "verify-subscription", description = "Verify subscription")
async def verifySubscription(ctx):
  data = await verifyShikariSubscription();
  await ctx.respond("Updated successfully!")

bot.run(os.getenv('TOKEN')) # run the bot with the token

