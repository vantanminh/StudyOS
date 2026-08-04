import { lazy, Suspense } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";
import { useData } from "@/providers/data-provider";
import { AppShell } from "@/components/layout/app-shell";
import { SkeletonBlock } from "@/components/shared/page";
import { LoginPage } from "@/pages/login-page";
import { OnboardingPage } from "@/pages/onboarding-page";
import { TodayPage } from "@/pages/today-page";

const PlannerPage = lazy(() =>
  import("@/pages/planner-page").then((m) => ({ default: m.PlannerPage })),
);
const TasksPage = lazy(() =>
  import("@/pages/tasks-page").then((m) => ({ default: m.TasksPage })),
);
const SubjectsPage = lazy(() =>
  import("@/pages/subjects-page").then((m) => ({ default: m.SubjectsPage })),
);
const SubjectDetailPage = lazy(() =>
  import("@/pages/subjects-page").then((m) => ({ default: m.SubjectDetailPage })),
);
const ReviewPage = lazy(() =>
  import("@/pages/review-page").then((m) => ({ default: m.ReviewPage })),
);
const ExamsPage = lazy(() =>
  import("@/pages/exams-page").then((m) => ({ default: m.ExamsPage })),
);
const ErrorsPage = lazy(() =>
  import("@/pages/errors-page").then((m) => ({ default: m.ErrorsPage })),
);
const AnalyticsPage = lazy(() =>
  import("@/pages/analytics-page").then((m) => ({ default: m.AnalyticsPage })),
);
const DocumentsPage = lazy(() =>
  import("@/pages/documents-page").then((m) => ({ default: m.DocumentsPage })),
);
const SettingsPage = lazy(() =>
  import("@/pages/settings-page").then((m) => ({ default: m.SettingsPage })),
);
const SessionPage = lazy(() =>
  import("@/pages/session-page").then((m) => ({ default: m.SessionPage })),
);
const MorePage = lazy(() =>
  import("@/pages/more-page").then((m) => ({ default: m.MorePage })),
);
const HelpPage = lazy(() =>
  import("@/pages/help-page").then((m) => ({ default: m.HelpPage })),
);

function Loading() {
  return (
    <div className="space-y-4 p-2">
      <SkeletonBlock className="h-10 w-48" />
      <SkeletonBlock className="h-40 w-full" />
      <SkeletonBlock className="h-64 w-full" />
    </div>
  );
}

function AuthBootstrapping() {
  return (
    <div className="flex min-h-dvh items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-4">
        <SkeletonBlock className="mx-auto h-12 w-12 rounded-2xl" />
        <SkeletonBlock className="mx-auto h-6 w-40" />
        <SkeletonBlock className="h-24 w-full" />
      </div>
    </div>
  );
}

function RequireAuth() {
  const { isAuthenticated, authReady, state } = useData();
  if (!authReady) return <AuthBootstrapping />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!state.profile?.onboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }
  return <Outlet />;
}

function RequireLogin() {
  const { isAuthenticated, authReady, state } = useData();
  if (!authReady) return <AuthBootstrapping />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (state.profile?.onboardingCompleted) {
    return <Navigate to="/today" replace />;
  }
  return <Outlet />;
}

function SubjectDetailRoute() {
  const { subjectId } = useParams();
  if (!subjectId) return <Navigate to="/subjects" replace />;
  return <SubjectDetailPage subjectId={subjectId} />;
}

export const appRoutes = [
  { path: "/login", element: <LoginPage /> },
  {
    element: <RequireLogin />,
    children: [{ path: "/onboarding", element: <OnboardingPage /> }],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/session/:sessionId",
        element: (
          <Suspense fallback={<Loading />}>
            <SessionPage />
          </Suspense>
        ),
      },
      {
        element: <AppShell />,
        children: [
          { path: "/", element: <Navigate to="/today" replace /> },
          { path: "/today", element: <TodayPage /> },
          {
            path: "/planner",
            element: (
              <Suspense fallback={<Loading />}>
                <PlannerPage />
              </Suspense>
            ),
          },
          {
            path: "/tasks",
            element: (
              <Suspense fallback={<Loading />}>
                <TasksPage />
              </Suspense>
            ),
          },
          {
            path: "/subjects",
            element: (
              <Suspense fallback={<Loading />}>
                <SubjectsPage />
              </Suspense>
            ),
          },
          {
            path: "/subjects/:subjectId",
            element: (
              <Suspense fallback={<Loading />}>
                <SubjectDetailRoute />
              </Suspense>
            ),
          },
          {
            path: "/review",
            element: (
              <Suspense fallback={<Loading />}>
                <ReviewPage />
              </Suspense>
            ),
          },
          {
            path: "/exams",
            element: (
              <Suspense fallback={<Loading />}>
                <ExamsPage />
              </Suspense>
            ),
          },
          {
            path: "/errors",
            element: (
              <Suspense fallback={<Loading />}>
                <ErrorsPage />
              </Suspense>
            ),
          },
          {
            path: "/analytics",
            element: (
              <Suspense fallback={<Loading />}>
                <AnalyticsPage />
              </Suspense>
            ),
          },
          {
            path: "/documents",
            element: (
              <Suspense fallback={<Loading />}>
                <DocumentsPage />
              </Suspense>
            ),
          },
          {
            path: "/settings",
            element: (
              <Suspense fallback={<Loading />}>
                <SettingsPage />
              </Suspense>
            ),
          },
          {
            path: "/more",
            element: (
              <Suspense fallback={<Loading />}>
                <MorePage />
              </Suspense>
            ),
          },
          {
            path: "/help",
            element: (
              <Suspense fallback={<Loading />}>
                <HelpPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  { path: "*", element: <Navigate to="/today" replace /> },
];
