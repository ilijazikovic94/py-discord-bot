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
