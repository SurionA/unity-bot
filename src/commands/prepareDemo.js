import dotenv from 'dotenv';
import fetch from 'node-fetch';

import { botClient } from '../bots/userClient.js';
// roadmap-timeone/plateforme-annonceur-timeone
// 2020-02-19
// 2020-03-04
function getQuery({ demoType, gitlabProjectFullPath, sprintStart, sprintEnd }) {
  return `
fragment IssueFrag on Issue {
    iid
    title
    assignees {
      nodes {
        name
        username
      }
      }
  }

  query {

    roadmap: project(fullPath: "${gitlabProjectFullPath}") {
      fullPath
      name
      issuesClosed: issues(closedAfter: "${sprintStart}", closedBefore: "${sprintEnd}", labelName:["${demoType}"]) {
        nodes {
                   ...IssueFrag
        }
      }
      issuesDoing: issues( labelName:["${demoType}", "Doing"]) {
        nodes {
                   ...IssueFrag
        }
      }
      issuesReview: issues( labelName:["${demoType}", "Code Review"]) {
        nodes {
                   ...IssueFrag
        }
      }
      issuesToMep: issues( labelName:["${demoType}", "Validé PO / A MEP"]) {
        nodes {
                   ...IssueFrag
        }
      }
    }
  }
`;
}

export async function getSprintIssues({ gitlabAccessToken, gitlabUrl, ...queryParams }) {
  const res = await fetch(`${gitlabUrl}/api/graphql`, {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Accept-Language': 'en-US,en;q=0.5',
      'Content-Type': 'application/json',
      authorization: `Bearer ${gitlabAccessToken}`,
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
    },
    body: JSON.stringify({ query: getQuery(queryParams), variables: null }),
    method: 'POST',
    mode: 'cors',
  });
  const { data } = await res.json();

  return data;
}

dotenv.config();

function getIssuesTemplate({ issues, url, type, total }) {
  if (issues.length < 1) {
    return '';
  }

  return issues.reduce((acc, issue) => {
    const { iid, title, assignees } = issue;
    const issueUrl = `${url}/issues/${iid}`;
    const assignee =
      assignees && assignees.nodes && assignees.nodes[0] && assignees.nodes[0].username
        ? `@${assignees.nodes[0].username}`
        : `quelqu'un, quelque part, magiiiique (**[avec des poils et des paillettes](https://media.giphy.com/media/12NUbkX6p4xOO4/giphy.gif)**)`;

    return `${acc}
* [${title}](${issueUrl}) assigné à ${assignee}
  `;
  }, `**Stories ${type} - ${issues.length}/${total}**`);
}

export async function postPrepaDemo({
  gitlabUrl,
  mattermostChannel,
  mattermostUrl,
  mattermostAccessToken,
  demoType,
  ...queryParams
}) {
  const { postMessage } = botClient(mattermostUrl, mattermostAccessToken, mattermostChannel);
  const data = await getSprintIssues({ demoType, gitlabUrl, ...queryParams });

  const message = Object.values(data).reduce((acc, project) => {
    const { fullPath, issuesClosed, issuesDoing, issuesReview, issuesToMep } = project;
    const total = [issuesClosed, issuesDoing, issuesReview, issuesToMep].reduce((sum, issues) => {
      if (issues && issues.nodes) {
        return issues.nodes.length + sum;
      }
      return sum;
    }, 0);
    const url = `${gitlabUrl}/${fullPath}`;
    const issuesClosedTemplate =
      issuesClosed && issuesClosed.nodes
        ? getIssuesTemplate({ issues: issuesClosed.nodes, url, type: 'closed', total })
        : '';
    const issuesToMEPemplate =
      issuesToMep && issuesToMep.nodes
        ? getIssuesTemplate({ issues: issuesToMep.nodes, url, type: 'to MEP', total })
        : '';
    const issuesReviewTemplate =
      issuesReview && issuesReview.nodes
        ? getIssuesTemplate({ issues: issuesReview.nodes, url, type: 'in review', total })
        : '';
    const issuesDoingTemplate =
      issuesDoing && issuesDoing.nodes
        ? getIssuesTemplate({ issues: issuesDoing.nodes, url, type: 'doing', total })
        : '';

    return `${acc}
Durant le sprint **${total}** stories ont été traité.

${issuesClosedTemplate}

Et voilà la review
${issuesToMEPemplate}

${issuesReviewTemplate}

${issuesDoingTemplate}

    `;
  }, `@here voilà la préparation ${demoType} pour la démo baby !`);

  postMessage(message).catch(err => console.log('err', err));
}
