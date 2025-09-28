// src/data.ts

export class HttpError extends Error {
    url: string;
    status: number;
  
    constructor(url: string, status: number, message?: string) {
      super(message ?? `${url} → ${status}`);
      this.name = 'HttpError';
      this.url = url;
      this.status = status;
  
      // 일부 런타임/트랜스파일 타깃에서 필요
      Object.setPrototypeOf(this, new.target.prototype);
    }
  }
  
  export async function getJSON<T = unknown>(
    path: string,
    init?: RequestInit,
    timeoutMs = 8000
  ): Promise<T> {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), timeoutMs);
  
    try {
      const res = await fetch(path, {
        headers: { Accept: 'application/json' },
        signal: ac.signal,
        ...init,
      });
      if (!res.ok) throw new HttpError(path, res.status);
      return (await res.json()) as T;
    } finally {
      clearTimeout(timer);
    }
  }
  
  /** /public/data/*.json 헬퍼: getData<Section>('recommend') → /data/recommend.json */
  export function getData<T = unknown>(name: string) {
    return getJSON<T>(`/data/${name}.json`);
  }
  