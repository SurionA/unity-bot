import dotenv from 'dotenv';
import { botClient } from '../bots/userClient.js';

dotenv.config();

function releaseStartRequirement() {
  if (
    [
      process.env.CI_PROJECT_NAME,
      process.env.CI_PROJECT_URL,
      process.env.GITLAB_USER_NAME,
      process.env.CI_COMMIT_TITLE,
    ].every(env => !!env)
  ) {
    return true;
  }

  console.error('Missing some environnement variables. Please check the documentation.');

  return false;
}

export default function releaseStart({ mattermostChannel, mattermostUrl, mattermostAccessToken }) {
  if (releaseStartRequirement()) {
    const { postMessage } = botClient(mattermostUrl, mattermostAccessToken, mattermostChannel);

    postMessage(
      `@here ${process.env.GITLAB_USER_NAME} est en train de MEP sur [${process.env.CI_PROJECT_NAME}](${process.env.CI_PROJECT_URL}) - ${process.env.CI_COMMIT_TITLE}`
    ).catch(err => console.log('err', err));
  }
}
