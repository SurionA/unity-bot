import axios from 'axios';

const _createClient = (baseURL) =>
axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export function botClient(baseURL, channelId) {
  const client = _createClient(baseURL);
  const rawBody = {
    username: process.env.BOT_USERNAME,
    icon_url: process.env.BOT_AVATAR_URL,
    type: 'slack_attachment',
    attachments: []
  };


  const postMessage = async (message, attachments) =>{
    const  response  = await client.post(``, {
      ...rawBody,
      channel_id: channelId,
      channel: channelId,
      text: message,
      attachments
    });

    // IMPORTANT console.log. Allow to stdout the post ID and set env variable in CI
    console.log(response);

    return response.data;
  }

  const  replyMessage =  (message)=> {
    return async function reply(data) {
    const  response  = await client.post(`posts`, {
      ...rawBody,
      channel_id: channelId,
      channel: channelId,
      parent_id: data.id,
      root_id: data.id,
      message,
    });

    return response.data;
  }}


return {postMessage, replyMessage}
}