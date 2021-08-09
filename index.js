const core = require('@actions/core');
const github = require('@actions/github');

try {
  const server = core.getInput('server');
  const room_id = core.getInput('room_id');
  const token = core.getInput('token');

  console.log(server, room_id, token);

} catch (error) {
  core.setFailed(error.message);
}