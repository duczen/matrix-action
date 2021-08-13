import * as core from '@actions/core';

//const github = require('@actions/github');
//const http = require('@actions/http-client');
async function run(): Promise<void> {
  try {
    const server = core.getInput('server');
    const roomId = core.getInput('room_id');
    const token = core.getInput('token');
    const status = core.getInput('status');

    const runId = process.env.GITHUB_RUN_ID;
    const runNumber = process.env.GITHUB_RUN_NUMBER;
    const githubServer = process.env.GITHUB_SERVER_URL;
    const repo = process.env.GITHUB_REPOSITORY;
    const buildURL = `${githubServer}/${repo}/actions/runs/${runId}`;
    const workflow = process.env.GITHUB_WORKFLOW;
    const actor = process.env.GITHUB_ACTOR;
    const actorURL = `${githubServer}/${actor}`;

    core.debug(`server: ${server}`);
    core.debug(`room_id: ${roomId}`);
    core.debug(`token: ${token}`);
    core.debug(`status: ${status}`);
    core.debug(`runId: ${runId}`);
    core.debug(`runNumber: ${runNumber}`);
    core.debug(`githubServer: ${githubServer}`);
    core.debug(`buildURL: ${buildURL}`);
    core.debug(`workflow: ${workflow}`);
    core.debug(`actor: ${actor}`);
    core.debug(`actorURL: ${actorURL}`);

    //post(server, room_id, token);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

// async function post(server, room_id, token) {
//   const client = new http.HttpClient('matrix-action');
//   const reqURL = `${server}/_matrix/client/r0/rooms/${room_id}/send/m.room.message?access_token=${token}`;
//   await client.post(reqURL, JSON.stringify({formatted_body: '<span>test</span>', body: 'test', format: 'org.matrix.custom.html', msgtype: 'm.text'}));
//   return;
// }