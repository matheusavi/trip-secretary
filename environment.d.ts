declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_AUTH_TOKEN: string;
      NODE_ENV: "development" | "production";
      PORT?: string;
      PWD: string;
      NEXT_PUBLIC_APPWRITE_ENDPOINT: string;
      NEXT_PUBLIC_APPWRITE_PROJECT: string;
      NEXT_APPWRITE_KEY: string;
      NEXT_APPWRITE_DATABASE: string;
      NEXT_APPWRITE_COMPROMISES: string;
    }
  }
}

export {};
