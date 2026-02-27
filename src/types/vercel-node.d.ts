declare module '@vercel/node' {
  export interface VercelRequest {
    method?: string;
    query: Record<string, string | string[]>;
    cookies: Record<string, string>;
    body?: unknown;
  }

  export interface VercelResponse {
    status(statusCode: number): this;
    setHeader(name: string, value: string | readonly string[]): this;
    end(): this;
    send(body: unknown): this;
    json(body: unknown): this;
  }
}


