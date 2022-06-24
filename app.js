import 'dotenv/config';
import express from 'express';
import { VerifyDiscordRequest } from './utils.js';
import {
  getGuildRoles,
  updateUserRole,
  getGuildMembers,
} from './commands.js';
import axios from 'axios';

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

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

app.get('/success', (req, res, next) => {
  next();
});

app.listen(PORT, async () => {
  console.log('Listening on port', PORT);

  getGuildMembers(process.env.GUILD_ID).then(async (data) => {
    console.log("Found " + data.length + " Members");
    checkGuildMembersLicenseStatus(data);
  });
});
