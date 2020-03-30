import axios from 'axios';
import fs from 'fs';
import os from 'os';

const _createClient = (baseURL, accessToken) =>
axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  },
});

export function botClient(baseURL, accessToken, channelId) {
  const client = _createClient(baseURL, accessToken);
  const rawBody = {
    username: process.env.BOT_USERNAME,
    iconUrl: process.env.BOT_AVATAR_URL,
    type: 'slack_attachment',
  };


  const postMessage = async (message) =>{
    const  response  = await client.post(`posts`, {
      ...rawBody,
      channel_id: channelId,
      message,
    });

fs.appendFile('.unity-config', `${os.EOL}MATTERMOST_PARENT_POST_ID=${response.data.id}`, function (err) {
  if (err) return console.log(err);
});

    return response.data;
  }

  const  replyMessage =  (message)=> {
    return async function reply(data) {
    const  response  = await client.post(`posts`, {
      ...rawBody,
      channel_id: channelId,
      parent_id: data.id,
      root_id: data.id,

      message,
    });

    return response.data;
  }}

return {postMessage, replyMessage}
}

