import dotenv from 'dotenv';
import lineReader from 'line-reader';
import path from 'path';
import { promisify } from 'util';

import { botClient } from '../bots/webHookClient.js';

dotenv.config();

const readLineByLine = promisify(lineReader.eachLine);

export default function post({ mattermostChannel, mattermostIncomingWebhookUrl }) {
  const { postMessage } = botClient(mattermostIncomingWebhookUrl, mattermostChannel);

  let countLine = 0;
  const changelog = [];
  const sanitazePath = [process.cwd(), 'CHANGELOG.md'].filter(Boolean);

  readLineByLine(
    path.resolve.apply(null, sanitazePath),
    line => {
      countLine += 1;
      if (countLine > 7 && line.indexOf('/compare/') > -1) {
        return false;
      }
      changelog.push(line);

      return true;
    },
    err => {
      if (err) {
        console.error(err);
        return;
      }

      const attachments = [
        {
          fallback: 'test',
          color: '#ffc844',
          pretext: `<!here> [${process.env.CI_PROJECT_NAME}](${process.env.CI_PROJECT_URL})  **${process.env.CI_COMMIT_TAG}** a été release avec succès :rocket: :tada: !`,
          text: changelog.join('\n'),
          author_link: 'http://www.mattermost.org/',
          title_link: `${process.env.CI_PROJECT_URL}/tags/${process.env.CI_COMMIT_TAG}`,
          fields: [
            {
              short: false,
              title: 'CHANGELOG',
              value: '',
            },
          ],
        },
      ];

      postMessage(null, attachments).catch(error => console.error(error));
    }
  );
}
