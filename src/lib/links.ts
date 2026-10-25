export type SiteLinks = {
  android: string;
  ios: string;
  web: string;
  linkedin: string;
  github: string;
};

function link(value: string | undefined, name: string) {
  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
}

export function getSiteLinks(): SiteLinks {
  return {
    android: link(process.env.ANDROID_URL, "ANDROID_URL"),
    ios: link(process.env.IOS_URL, "IOS_URL"),
    web: link(process.env.WEB_URL, "WEB_URL"),
    linkedin: link(process.env.LINKEDIN_URL, "LINKEDIN_URL"),
    github: link(process.env.GITHUB_URL, "GITHUB_URL"),
  };
}
