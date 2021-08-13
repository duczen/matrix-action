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

    console.log(`server: ${server}`);
    console.log(`room_id: ${roomId}`);
    console.log(`token: ${token}`);
    console.log(`status: ${status}`);
    console.log(`runId: ${runId}`);
    console.log(`runNumber: ${runNumber}`);
    console.log(`githubServer: ${githubServer}`);
    console.log(`buildURL: ${buildURL}`);
    console.log(`workflow: ${workflow}`);
    console.log(`actor: ${actor}`);
    console.log(`actorURL: ${actorURL}`);

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