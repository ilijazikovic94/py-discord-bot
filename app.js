import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
} from 'discord-interactions';
import { VerifyDiscordRequest } from './utils.js';
import {
  getGuildRoles,
  updateUserRole,
  getGuildMembers,
  createCommand,
} from './commands.js';
import axios from 'axios';
import cron from 'node-cron';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
 app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;
    
    if (name === 'verify-subscription') {
      runUpdateMembers();

      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `Updated successfully`,
          components: [],
        },
      });
    }
  }
});

const checkGuildMembersLicenseStatus = async (data) => {
  const users = data;
  const roles = await getGuildRoles(process.env.GUILD_ID);
  console.log('Roles List: ' + roles);
  for(let i in users) {
    const user = users[i].user;
    console.log("Checking " + user.username + "'s subscription status from shikari...")
    const response = await axios.post(process.env.SHIKARI_WEBSITE_URL + '/check-subscription/', { username: user.username });
    const licenseStatus = response.data.licensed;
    console.log(user.username + "'s subscription status: " + (licenseStatus ? "Subscribed" : "Not Subscribed"));
    await updateUserRole(process.env.GUILD_ID, user.id, licenseStatus);
    console.log(user.username + "'s roles updated");
  }
}

const runUpdateMembers = async (data) => {
  getGuildMembers(process.env.GUILD_ID).then(async (data) => {
    console.log("Found " + data.length + " Members");
    checkGuildMembersLicenseStatus(data);
  });
}

app.get('/success', (req, res, next) => {
  next();
});
// running verification users at 10 pm every day
cron.schedule('0 22 * * *', () => {
  runUpdateMembers();
});

app.listen(PORT, async () => {
  console.log('Listening on port', PORT);
  createCommand();

  runUpdateMembers();
});
