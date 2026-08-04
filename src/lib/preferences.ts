import type { StudyPreferences, UserProfile } from "@/types/domain";

/** Defaults aligned with onboarding / StudyOS calm study defaults. */
export function defaultStudyPreferences(
  profile?: Pick<UserProfile, "weeklyTargetHours" | "restDays" | "breakMinutes"> | null,
): StudyPreferences {
  return {
    weeklyTargetHours: profile?.weeklyTargetHours ?? 20,
    maxHoursPerDay: Math.max(1, Math.round((profile?.weeklyTargetHours ?? 20) / 5)),
    maxTaskMinutes: 120,
    minBreakMinutes: profile?.breakMinutes ?? 10,
    restDays: profile?.restDays ?? [0],
    pomodoroFocus: 25,
    pomodoroShortBreak: 5,
    pomodoroLongBreak: 15,
    pomodoroSessionsBeforeLong: 4,
    reviewIntervals: [1, 3, 7, 14, 30],
    maxReviewsPerDay: 10,
    autoReviewFromErrors: true,
    autoReviewFromWeakTopics: true,
  };
}

export function mergePreferences(
  existing: StudyPreferences | null | undefined,
  profile?: UserProfile | null,
): StudyPreferences {
  return {
    ...defaultStudyPreferences(profile),
    ...(existing ?? {}),
  };
}
