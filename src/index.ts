import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { duration } from './util.ts'

//const github = require('@actions/github');
//const http = require('@actions/http-client');
async function run(): Promise<void> {
  try {
    const server = core.getInput('server');
    const roomId = core.getInput('room_id');
    const token = core.getInput('token');
    const status = core.getInput('status');
    const githubToken = core.getInput('github_token');

    const { owner, repo } = context.repo;
    const jobName = context.job;
    const { sha: ref } = context;
    const octokit = getOctokit(githubToken);
    const resp = await octokit.rest.repos.getCommit({owner, repo, ref});

    const resp2 = await octokit.rest.actions.listJobsForWorkflowRun({
      owner: owner,
      repo: repo,
      run_id: context.runId,
    });
    const currentJob = resp2?.data.jobs.find(job => job.name === jobName);
    const jobId = currentJob?.id;
    const startedAt = currentJob?.started_at

    core.debug(`status: ${status}`);
    core.debug(`repo: ${owner}/${repo}`)
    core.debug(`repo url: https://github.com/${owner}/${repo}`)
    core.debug(`message: ${resp.data.commit.message}`)
    core.debug(`commit ${ref.slice(0, 6)}`)
    core.debug(`commit_url: ${resp.data.html_url}`)
    core.debug(`actor: ${context.actor}`)
    core.debug(`author_url: https://github.com/${context.actor}`)
    core.debug(`job: ${jobName}`)
    core.debug(`job_url: https://github.com/${owner}/${repo}/runs/${jobId}`)
    core.debug(`duration: ${duration(startedAt)}`)
    core.debug(`event: ${context.eventName}`)
    core.debug(`ref: ${context.ref}`)

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