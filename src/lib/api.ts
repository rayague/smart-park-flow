const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_BASE_URL =
  configuredBaseUrl || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000');

export async function fetchJson<T>(input: string, init?: RequestInit): Promise<T> {
  const authHeaderFromStorage =
    typeof window !== 'undefined' ? window.localStorage.getItem('smartpark-token') : null;

  const res = await fetch(`${API_BASE_URL}${input}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(authHeaderFromStorage ? { Authorization: `Bearer ${authHeaderFromStorage}` } : {}),
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Request failed: ${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`);
  }

  return (await res.json()) as T;
}
