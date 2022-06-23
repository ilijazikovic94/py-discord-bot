import { getRPSChoices } from './game.js';
import { capitalize, DiscordRequest } from './utils.js';

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

// Installs a command
export async function updateUserRole(guildId, userId, status) {
  // API endpoint to get and post guild commands
  const endpoint = `guilds/${guildId}/members/${userId}`;
  const patchData = {
    roles: !status ? [] : ['986772592977387521'],
  };
  console.log(endpoint);
  console.log(patchData);

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

// Installs a command
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

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
export const TEST_COMMAND = {
  name: 'test',
  description: 'Basic guild command',
  type: 1,
};

// Command containing options
export const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
};
