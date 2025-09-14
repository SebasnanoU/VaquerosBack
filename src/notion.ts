const NOTION_VERSION = '2022-06-28';

export type Env = {
  NOTION_API_KEY: string
}

const base = 'https://api.notion.com/v1';

export async function notionQueryDatabase(env: Env, databaseId: string, body?: unknown) {
  const res = await fetch(`${base}/databases/${databaseId}/query`, {
    method: 'POST',
    headers: headers(env),
    body: JSON.stringify(body ?? {})
  });
  if (!res.ok) throw await errorFrom(res);
  return res.json();
}

export async function notionRetrievePage(env: Env, pageId: string) {
  const res = await fetch(`${base}/pages/${pageId}`, { headers: headers(env) });
  if (!res.ok) throw await errorFrom(res);
  return res.json();
}

export async function notionCreatePage(env: Env, payload: unknown) {
  const res = await fetch(`${base}/pages`, {
    method: 'POST',
    headers: headers(env),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw await errorFrom(res);
  return res.json();
}

export async function notionUpdatePage(env: Env, pageId: string, payload: unknown) {
  const res = await fetch(`${base}/pages/${pageId}`, {
    method: 'PATCH',
    headers: headers(env),
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw await errorFrom(res);
  return res.json();
}

function headers(env: Env): HeadersInit {
  return {
    'Authorization': `Bearer ${env.NOTION_API_KEY}`,
    'Notion-Version': NOTION_VERSION,
    'Content-Type': 'application/json'
  };
}

async function errorFrom(res: Response) {
  let text: string;
  try { text = await res.text(); } catch { text = `${res.status} ${res.statusText}`; }
  return new Error(`Notion error ${res.status}: ${text}`);
}

