import * as core from '@actions/core';
import { context, getOctokit } from '@actions/github';
import { duration, post, format } from './util'
import { marked } from 'marked';

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
    core.debug(`commit: ${ref.slice(0, 8)}`)
    core.debug(`commit_url: ${resp.data.html_url}`)
    core.debug(`actor: ${context.actor}`)
    core.debug(`actor_url: https://github.com/${context.actor}`)
    core.debug(`job: ${jobName}`)
    core.debug(`job_url: https://github.com/${owner}/${repo}/runs/${jobId}`)
    core.debug(`duration: ${duration(startedAt)}`)
    core.debug(`event: ${context.eventName}`)
    core.debug(`ref: ${context.ref}`)

    const jobLabel = jobName.charAt(0).toUpperCase() + jobName.slice(1);
    const bodyMarkdown = `
# ${jobLabel}: ${status}
**repo**: [${owner}/${repo}](https://github.com/${owner}/${repo})
**commit**: [${ref.slice(0, 8)}](${resp.data.html_url})
**actor**: [${context.actor}](https://github.com/${context.actor})
**job**: [${jobName}](https://github.com/${owner}/${repo}/runs/${jobId})
**duration**: ${duration(startedAt)}
**event**: ${context.eventName}
**ref**: ${context.ref}
**message**: ${format(resp.data.commit.message)}`;

    const bodyHTML = `${marked.parse(bodyMarkdown, {breaks: true})}<br>`;
    const body = `${owner}/${repo} - ${jobName}: ${status}`;
    core.debug(bodyHTML);
    core.debug(body);

    await post(server, roomId, token, body, bodyHTML);

  } catch (e) {
    core.setFailed((e as Error).message);
  }
}

run()
