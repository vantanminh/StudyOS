/** Repository helpers — Firestore path builders and query limits. */

export const QUERY_LIMITS = {
  tasks: 50,
  sessions: 30,
  reviewItems: 40,
  errorLogs: 40,
  examAttempts: 30,
  topics: 100,
  subjects: 50,
} as const;

export function userCollectionPath(uid: string, collection: string): string {
  return `users/${uid}/${collection}`;
}

export function userDocPath(uid: string): string {
  return `users/${uid}`;
}

export function settingsPath(uid: string): string {
  return `users/${uid}/settings/profile`;
}
