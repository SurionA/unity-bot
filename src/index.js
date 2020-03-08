import dotenv from 'dotenv';
import argparse from 'argparse';

import releaseStart from './commands/releaseStart.js';
import publishChangelog from './commands/publishChangelog.js';
import releaseEnd from './commands/releaseEnd.js';
import { postPrepaDemo } from './commands/prepareDemo.js';

try {
  dotenv.config({ path: '.unity-config' });

  const { ArgumentParser } = argparse;
  const parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'Argparse example',
  });

  const subparsers = parser.addSubparsers({
    title: 'subcommands',
    dest: 'subcommand_name',
  });

  const releaseStartSubparser = subparsers.addParser('release-start', { addHelp: true });
  const releaseEndSubparser = subparsers.addParser('release-end', { addHelp: true });

  [releaseStartSubparser, releaseEndSubparser].forEach(subparser => {
    subparser.addArgument(['-c', '--mattermost-channel'], {
      help: 'Mattermost channel ID to post the message',
      dest: 'mattermostChannel',
      defaultValue: process.env.RELEASE_MATTERMOST_CHANNEL_ID,
    });
  });

  releaseEndSubparser.addArgument(['-p', '--mattermost-parent-post-id'], {
    help: 'Mattermost parent post ID for reply to a post',
    dest: 'mattermostParentPostId',
    defaultValue: process.env.MATTERMOST_PARENT_POST_ID,
  });

  const publishChangelogSubparser = subparsers.addParser('publish-changelog', { addHelp: true });

  publishChangelogSubparser.addArgument(['-c', '--mattermost-channel'], {
    help: 'Mattermost channel ID to post the message',
    dest: 'mattermostChannel',
    defaultValue: process.env.PUBLISH_CHANGELOG_MATTERMOST_CHANNEL_ID,
  });

  const prepaDemoSubparser = subparsers.addParser('prepare-demo', { addHelp: true });

  prepaDemoSubparser.addArgument(['-t', '--demo-type'], {
    help: 'Label gitlab qui type les stories',
    dest: 'demoType',
    defaultValue: process.env.DEMO_TYPE,
  });

  prepaDemoSubparser.addArgument(['-s', '--sprint-start'], {
    help: 'Date de début de sprint au format YYYY-MM-DD',
    dest: 'sprintStart',
    defaultValue: process.env.SPRINT_START,
  });

  prepaDemoSubparser.addArgument(['-e', '--sprint-end'], {
    help: 'Date de fin de sprint au format YYYY-MM-DD',
    dest: 'sprintEnd',
    defaultValue: process.env.SPRINT_END,
  });

  prepaDemoSubparser.addArgument(['-f', '--gitlab-project-full-path'], {
    help: 'Full path du projet gitlab',
    dest: 'gitlabProjectFullPath',
    defaultValue: process.env.GITLAB_PROJECT_FULLPATH,
  });

  prepaDemoSubparser.addArgument(['-c', '--mattermost-channel'], {
    help: 'Mattermost channel ID to post the message',
    dest: 'mattermostChannel',
    defaultValue: process.env.PREPA_DEMO_MATTERMOST_CHANNEL_ID,
  });

  [releaseStartSubparser, releaseEndSubparser, publishChangelogSubparser, prepaDemoSubparser].forEach(subparser => {
    subparser.addArgument(['-u', '--mattermost-url'], {
      help: 'Mattermost server url',
      dest: 'mattermostUrl',
      defaultValue: process.env.MATTERMOST_BASE_URL,
    });

    subparser.addArgument(['-w', '--mattermost-webhook-url'], {
      help: 'Mattermost incoming webhook url',
      dest: 'mattermostIncomingWebhookUrl',
      defaultValue: process.env.MATTERMOST_INCOMING_WEBHOOK_URL,
    });

    subparser.addArgument(['-a', '--mattermost-access-token'], {
      help: 'Mattermost access token',
      dest: 'mattermostAccessToken',
      defaultValue: process.env.MATTERMOST_ACCESS_TOKEN,
    });

    subparser.addArgument(['-l', '--gitlabt-access-token'], {
      help: 'Gitlab access token',
      dest: 'gitlabAccessToken',
      defaultValue: process.env.GITLAB_ACCESS_TOKEN,
    });

    subparser.addArgument(['-g', '--gitlab-url'], {
      help: 'Gitlab url',
      dest: 'gitlabUrl',
      defaultValue: process.env.GITLAB_URL,
    });
  });

  const args = parser.parseArgs();

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
