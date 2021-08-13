import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { captureRejectionSymbol } from 'events';

//const github = require('@actions/github');
//const http = require('@actions/http-client');
async function run(): Promise<void> {
  try {
    const server = core.getInput('server');
    const roomId = core.getInput('room_id');
    const token = core.getInput('token');
    const status = core.getInput('status');
    const githubToken = core.getInput('github_token');

    const runId = process.env.GITHUB_RUN_ID;
    const runNumber = process.env.GITHUB_RUN_NUMBER;
    const githubServer = process.env.GITHUB_SERVER_URL;
    const repoName = process.env.GITHUB_REPOSITORY;
    const buildURL = `${githubServer}/${repoName}/actions/runs/${runId}`;
    const workflow = process.env.GITHUB_WORKFLOW;
    const actor = process.env.GITHUB_ACTOR;
    const actorURL = `${githubServer}/${actor}`;

    core.debug(`status: ${status}`);
    core.debug(`runId: ${runId}`);
    core.debug(`runNumber: ${runNumber}`);
    core.debug(`githubServer: ${githubServer}`);
    core.debug(`repoName: ${repoName}`)
    core.debug(`buildURL: ${buildURL}`)
    core.debug(`workflow: ${workflow}`)
    core.debug(`actor: ${actor}`)
    core.debug(`actorURL: ${actorURL}`)

    const { owner, repo } = context.repo;
    const { sha: ref } = context;
    const octokit = getOctokit(githubToken);
    const resp = await octokit.rest.repos.getCommit({owner, repo, ref});

    core.debug(`resp.data.html_url: ${resp.data.html_url}`);
    core.debug(`resp.data.commit.message: ${resp.data.commit.message}`);
    core.debug(`resp.data.commit.author: ${resp.data.commit.author}`)
    const author = resp.data.commit.author;
    core.debug(`author.name: ${author?.name}`)
    core.debug(`author.email: ${author?.email}`)

    const resp2 = await octokit.rest.actions.listJobsForWorkflowRun({
      owner: context.repo.owner,
      repo: context.repo.repo,
      run_id: context.runId,
    });
    const jobName= context.job;
    const currentJob = resp2?.data.jobs.find(job => job.name === jobName);
    if (currentJob) {
      let time = new Date().getTime() - new Date(currentJob.started_at).getTime();

      const h = Math.floor(time / (1000 * 60 * 60));
      time -= h * 1000 * 60 * 60;
      const m = Math.floor(time / (1000 * 60));
      time -= m * 1000 * 60;
      const s = Math.floor(time / 1000);

      let value = '';
      if (h > 0) {
        value += `${h} hour `;
      }
      if (m > 0) {
        value += `${m} min `;
      }
      if  (s > 0) {
        value += `${s} sec`;
      }
      core.debug(`value: ${value}`)
      const jobId = currentJob.id;

      const url = `<https://github.com/${owner}/${context.repo.repo}/runs/${jobId}|${jobName}>`;
      //post(server, room_id, token);
      console.log(`url: ${url}`)
      const sha = context.sha
      const url2 = `<https://github.com/${owner}/${repo}/commit/${sha}|${sha.slice(0, 8)}>`;
      console.log(`url2: ${url2}`)
      const url3 = `<https://github.com/${owner}/${repo}|${owner}/${repo}>`;
      console.log(`url3: ${url3}`)
      console.log(`context.event: ${context.eventName}`)
      console.log(`context.ref: ${context.ref}`)

      const sha1 = context.payload.pull_request?.head.sha ?? context.sha;
      const url4 = `<https://github.com/${owner}/${repo}/commit/${sha1}/checks|${context.workflow}>`;
      console.log(`url4: ${url4}`)

      const sha2 = context.payload.pull_request?.head.sha ?? context.sha;
      const url5 = `<https://github.com/${owner}/${repo}/commit/${sha2}/checks|action>`;
      console.log(`url5: ${url5}`)

    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

// async function post(server, room_id, token) {
//   const client = new http.HttpClient('matrix-action');
//   const reqURL = `${server}/_matrix/client/r0/rooms/${room_id}/send/m.room.message?access_token=${token}`;
//   await client.post(reqURL, JSON.stringify({formatted_body: '<span>test</span>', body: 'test', format: 'org.matrix.custom.html', msgtype: 'm.text'}));
//   return;
// }