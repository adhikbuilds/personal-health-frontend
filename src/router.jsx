import React from 'react'
import { createRootRoute, createRoute, createRouter, useNavigate } from '@tanstack/react-router'
import { AppShell } from './components/AppShell'
import { LandingPage } from './pages/LandingPage'
import { ProperLoginPage } from './pages/ProperLoginPage'
import { ProperSignupPage } from './pages/ProperSignupPage'
import { EnhancedCoachDashboard } from './pages/coach/EnhancedCoachDashboard'
import { TeamAnalyticsPage } from './pages/coach/TeamAnalyticsPage'
import { DrillLibraryPage } from './pages/coach/DrillLibraryPage'
import { PerformanceReportsPage } from './pages/coach/PerformanceReportsPage'
import { MessagingPage } from './pages/MessagingPage'
import { AthleteHomePageContent } from './pages/AthleteHomePageContent'
import { FormAnalyticsPage } from './pages/athlete/FormAnalyticsPage'
import { TrainingCalendarPage } from './pages/athlete/TrainingCalendarPage'
import { LeaderboardPage } from './pages/athlete/LeaderboardPage'
import { UnifiedAthleteDetailPage } from './pages/UnifiedAthleteDetailPage'
import { SessionPage } from './pages/SessionPage'
import { ParentSummaryPage } from './pages/parent/ParentSummaryPage'
import { ParentDigestPage } from './pages/parent/ParentDigestPage'
import { FeedPage } from './pages/FeedPage'
import { HuddleLivePage } from './pages/HuddleLivePage'
import { LoadingBlock } from './components/Primitives'
import { useUser } from './context/UserContext'

const rootRoute = createRootRoute({
  component: AppShell,
  errorComponent: ({ error }) => (
    <div className="empty-block">Something went wrong: {error.message}</div>
  ),
})

function IndexComponent() {
  const { user, loading } = useUser()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (loading) return
    if (user) {
      navigate({ to: '/dashboard' })
    }
  }, [user, loading, navigate])

  if (loading) return <LoadingBlock label="Loading…" />
  return <LandingPage />
}

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: IndexComponent,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: ProperLoginPage,
})

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  validateSearch: (search) => ({
    role: typeof search?.role === 'string' ? search.role : null,
  }),
  component: ProperSignupPage,
})

function DashboardComponent() {
  const { user, isCoach, isAthlete, loading } = useUser()
  const navigate = useNavigate()

  React.useEffect(() => {
    if (loading) return
    if (!user) {
      navigate({ to: '/login' })
    }
  }, [user, loading, navigate])

  if (loading || !user) return <LoadingBlock label="Loading…" />

  if (isCoach) {
    return <EnhancedCoachDashboard />
  }

  if (isAthlete) {
    return <AthleteHomePageContent />
  }

  return <LoadingBlock label="Loading…" />
}

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardComponent,
})

const athleteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/athlete/$athleteId',
  component: function AthleteWrap() {
    const { athleteId } = athleteRoute.useParams()
    return <UnifiedAthleteDetailPage athleteId={athleteId} />
  },
})

const sessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/session/$sessionId',
  component: function SessionWrap() {
    const { sessionId } = sessionRoute.useParams()
    return <SessionPage sessionId={sessionId} />
  },
})

// ── Parent (token-based, no login) ────────────────────────────────────────
const parentSummaryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parent/$consentId',
  validateSearch: (search) => ({
    token: typeof search?.token === 'string' ? search.token : '',
  }),
  component: function ParentSummaryWrap() {
    const { consentId } = parentSummaryRoute.useParams()
    const { token } = parentSummaryRoute.useSearch()
    return <ParentSummaryPage consentId={consentId} token={token} />
  },
})

const parentDigestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/digest/$token',
  component: function ParentDigestWrap() {
    const { token } = parentDigestRoute.useParams()
    return <ParentDigestPage token={token} />
  },
})

const formAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/athlete/analytics',
  component: FormAnalyticsPage,
})

const trainingCalendarRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/athlete/calendar',
  component: TrainingCalendarPage,
})

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/athlete/leaderboard',
  component: LeaderboardPage,
})

const teamAnalyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/coach/analytics',
  component: TeamAnalyticsPage,
})

const drillLibraryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/coach/drills',
  component: DrillLibraryPage,
})

const performanceReportsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/coach/reports',
  component: PerformanceReportsPage,
})

const messagingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/messages',
  component: MessagingPage,
})

const feedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feed',
  component: FeedPage,
})

const huddleLiveRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/huddle/$huddleId',
  component: function HuddleWrap() {
    const { huddleId } = huddleLiveRoute.useParams()
    return <HuddleLivePage huddleId={huddleId} />
  },
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  dashboardRoute,
  athleteRoute,
  sessionRoute,
  parentSummaryRoute,
  parentDigestRoute,
  formAnalyticsRoute,
  trainingCalendarRoute,
  leaderboardRoute,
  teamAnalyticsRoute,
  drillLibraryRoute,
  performanceReportsRoute,
  messagingRoute,
  feedRoute,
  huddleLiveRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPendingMinMs: 150,
})
