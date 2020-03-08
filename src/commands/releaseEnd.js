import dotenv from 'dotenv';
import { botClient } from '../bots/userClient.js';

dotenv.config();

export default function releaseEnd({ mattermostChannel, mattermostUrl, mattermostAccessToken }) {
  const { replyMessage } = botClient(mattermostUrl, mattermostAccessToken, mattermostChannel);

  replyMessage('MEP réalisé avec succès')({ id: process.env.MATTERMOST_PARENT_POST_ID });
}
