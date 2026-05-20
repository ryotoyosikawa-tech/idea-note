import 'server-only';

export function getCurrentUserId(): string {
  return process.env.APP_USER_ID ?? 'ryoto';
}
