
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