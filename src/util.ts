const http = require('@actions/http-client');

export function duration(since: string | undefined): string {
  if (!since) {
    return '';
  }
  let time = new Date().getTime() - new Date(since).getTime();

  const h = Math.floor(time / (1000 * 60 * 60));
  time -= h * 1000 * 60 * 60;
  const m = Math.floor(time / (1000 * 60));
  time -= m * 1000 * 60;
  const s = Math.floor(time / 1000);

  let durationStr = '';
  if (h > 0) {
    durationStr += `${h} hour `;
  }
  if (m > 0) {
    durationStr += `${m} min `;
  }
  if  (s > 0) {
    durationStr += `${s} sec`;
  }
  return durationStr
}

export async function post(server: string, room_id: string, token: string, msg: string) {
  const data = {
    formatted_body: `${msg}`,
    body: '',
    format: 'org.matrix.custom.html',
    msgtype: 'm.text'
  }
  const client = new http.HttpClient('matrix-action');
  const reqURL = `${server}/_matrix/client/r0/rooms/${room_id}/send/m.room.message?access_token=${token}`;
  await client.post(reqURL, JSON.stringify(data));
  return;
}