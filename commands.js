import { DiscordRequest } from './utils.js';

// get all guild members
export async function getGuildMembers(guildId) {
  // API endpoint to get and post guild commands
  const endpoint = `/guilds/${guildId}/members`;

  try {
    const res = await DiscordRequest(endpoint, { method: 'GET' });
    const data = await res.json();

    if (data) {
      return data;
    }
  } catch (err) {
    console.error(err);
  }
}

// update user roles
export async function updateUserRole(guildId, userId, status) {
  // API endpoint to get and post guild commands
  const endpoint = `guilds/${guildId}/members/${userId}`;
  const patchData = {
    roles: !status ? (process.env.EMPTY_ROLES ? process.env.EMPTY_ROLES.split(',') : []) : (process.env.SUBSCRIBED_ROLES ? process.env.SUBSCRIBED_ROLES.split(',') : []),
  };

  try {
    const res = await DiscordRequest(endpoint, { method: 'PATCH', body: patchData });
    const data = await res.json();
    console.log(data);
    if (data) {
      return data;
    }
  } catch (err) {
    console.error(err);
  }
}

// get roles list from guild number
export async function getGuildRoles(guildId) {
  // API endpoint to get and post guild commands
  const endpoint = `/guilds/${guildId}/roles`;
  try {
    const res = await DiscordRequest(endpoint, { method: 'GET' });
    const data = await res.json();

    if (data) {
      return data;
    }
  } catch (err) {
    console.error(err);
  }
}

export async function createCommand() {
  const appId = process.env.APP_ID;
  const guildId = process.env.GUILD_ID;

  /**
   * Globally-scoped slash commands (generally only recommended for production)
   * See https://discord.com/developers/docs/interactions/application-commands#create-global-application-command
   */
  // const globalEndpoint = `applications/${appId}/commands`;

  /**
   * Guild-scoped slash commands
   * See https://discord.com/developers/docs/interactions/application-commands#create-guild-application-command
   */
  const guildEndpoint = `applications/${appId}/guilds/${guildId}/commands`;
  const commandBody = {
    name: 'verify-subscription',
    description: 'Verify Subscription',
    type: 1,
  };

  try {
    // Send HTTP request with bot token
    const res = await DiscordRequest(guildEndpoint, {
      method: 'POST',
      body: commandBody,
    });
    console.log(await res.json());
  } catch (err) {
    console.error('Error installing commands: ', err);
  }
}