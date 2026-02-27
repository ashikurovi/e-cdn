declare var process: {
  env: {
    VERCEL?: string;
    PORT?: string;
    BACKEND_URL?: string;
    [key: string]: string | undefined;
  };
  cwd(): string;
};
