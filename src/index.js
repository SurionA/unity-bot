import dotenv from 'dotenv';
import argparse from 'argparse';
import path from 'path';

import releaseStart from './commands/releaseStart.js';
import publishChangelog from './commands/publishChangelog.js';
import releaseEnd from './commands/releaseEnd.js';
import { postPrepaDemo } from './commands/prepareDemo.js';

import packageJson from '../package.json';

const sanitazePath = [process.cwd(), '.unity-config'].filter(Boolean);
const { version } = packageJson;

try {
  dotenv.config({ path: path.resolve.apply(null, sanitazePath) });

  const { ArgumentParser } = argparse;
  const parser = new ArgumentParser({
    add_help: true,
    description: 'Argparse example',
  });

  parser.add_argument('-v', '--version', { action: 'version', version });

  const subparsers = parser.add_subparsers({
    title: 'subcommands',
    dest: 'subcommand_name',
  });

  const releaseStartSubparser = subparsers.add_parser('release-start', { add_help: true });
  const releaseEndSubparser = subparsers.add_parser('release-end', { add_help: true });

  [releaseStartSubparser, releaseEndSubparser].forEach(subparser => {
    subparser.add_argument('-c', '--mattermost-channel', {
      help: 'Mattermost channel ID to post the message',
      dest: 'mattermostChannel',
      default: process.env.RELEASE_MATTERMOST_CHANNEL_ID,
    });
  });

  releaseEndSubparser.add_argument('-p', '--mattermost-parent-post-id', {
    help: 'Mattermost parent post ID for reply to a post',
    dest: 'mattermostParentPostId',
    default: process.env.MATTERMOST_PARENT_POST_ID,
  });

  const publishChangelogSubparser = subparsers.add_parser('publish-changelog', { add_help: true });

  publishChangelogSubparser.add_argument('-c', '--mattermost-channel', {
    help: 'Mattermost channel ID to post the message',
    dest: 'mattermostChannel',
    default: process.env.PUBLISH_CHANGELOG_MATTERMOST_CHANNEL_ID,
  });

  const prepaDemoSubparser = subparsers.add_parser('prepare-demo', { add_help: true });

  prepaDemoSubparser.add_argument('-t', '--demo-type', {
    help: 'Label gitlab qui type les stories',
    dest: 'demoType',
    default: process.env.DEMO_TYPE,
  });

  prepaDemoSubparser.add_argument('-s', '--sprint-start', {
    help: 'Date de début de sprint au format YYYY-MM-DD',
    dest: 'sprintStart',
    default: process.env.SPRINT_START,
  });

  prepaDemoSubparser.add_argument('-e', '--sprint-end', {
    help: 'Date de fin de sprint au format YYYY-MM-DD',
    dest: 'sprintEnd',
    default: process.env.SPRINT_END,
  });

  prepaDemoSubparser.add_argument('-f', '--gitlab-project-full-path', {
    help: 'Full path du projet gitlab',
    dest: 'gitlabProjectFullPath',
    default: process.env.GITLAB_PROJECT_FULLPATH,
  });

  prepaDemoSubparser.add_argument('-c', '--mattermost-channel', {
    help: 'Mattermost channel ID to post the message',
    dest: 'mattermostChannel',
    default: process.env.PREPA_DEMO_MATTERMOST_CHANNEL_ID,
  });

  [releaseStartSubparser, releaseEndSubparser, publishChangelogSubparser, prepaDemoSubparser].forEach(subparser => {
    subparser.add_argument('-u', '--mattermost-url', {
      help: 'Mattermost server url',
      dest: 'mattermostUrl',
      default: process.env.MATTERMOST_BASE_URL,
    });

    subparser.add_argument('-w', '--mattermost-webhook-url', {
      help: 'Mattermost incoming webhook url',
      dest: 'mattermostIncomingWebhookUrl',
      default: process.env.MATTERMOST_INCOMING_WEBHOOK_URL,
    });

    subparser.add_argument('-a', '--mattermost-access-token', {
      help: 'Mattermost access token',
      dest: 'mattermostAccessToken',
      default: process.env.MATTERMOST_ACCESS_TOKEN,
    });

    subparser.add_argument('-l', '--gitlabt-access-token', {
      help: 'Gitlab access token',
      dest: 'gitlabAccessToken',
      default: process.env.GITLAB_ACCESS_TOKEN,
    });

    subparser.add_argument('-g', '--gitlab-url', {
      help: 'Gitlab url',
      dest: 'gitlabUrl',
      default: process.env.GITLAB_URL,
    });
  });

  const args = parser.parse_args();

  switch (args.subcommand_name) {
    case 'release-start':
      releaseStart(args);
      break;
    case 'release-end':
      releaseEnd(args);
      break;
    case 'publish-changelog':
      publishChangelog(args);
      break;
    case 'prepare-demo':
      postPrepaDemo(args);
      break;
    default:
      break;
  }
} catch (e) {
  console.error(e.message);
  process.exit(1);
}
