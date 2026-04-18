import React from 'react'
import { createRootRoute, createRoute, createRouter } from '@tanstack/react-router'
import { AppShell } from './components/AppShell'
import { HomePage } from './pages/HomePage'
import { DashboardPage } from './pages/DashboardPage'
import { PlanPage } from './pages/PlanPage'
import { HuddlePage } from './pages/HuddlePage'
import { WellnessPage } from './pages/WellnessPage'
import { AthletePage } from './pages/AthletePage'
import { SessionPage } from './pages/SessionPage'
import { CoachMorningPage } from './pages/CoachMorningPage'
import { MapPage } from './pages/MapPage'
import { CommunityPage } from './pages/CommunityPage'
import { LeaderboardPage } from './pages/LeaderboardPage'
import { InboxPage } from './pages/InboxPage'

const rootRoute = createRootRoute({
  component: AppShell,
  errorComponent: ({ error }) => (
    <div className="empty-block">Something went wrong: {error.message}</div>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
})

const planRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/plan',
  component: PlanPage,
})

const huddleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/huddle',
  component: HuddlePage,
})

const wellnessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wellness',
  component: WellnessPage,
})

const mapRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/map',
  component: MapPage,
})

const communityRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/community',
  component: CommunityPage,
})

const leaderboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leaderboard',
  component: LeaderboardPage,
})

const inboxRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/inbox',
  component: InboxPage,
})

const athleteRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/athlete/$athleteId',
  component: AthleteRouteComponent,
})

const sessionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/session/$sessionId',
  component: SessionRouteComponent,
})

const coachMorningRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/coach/$coachId/morning',
  component: CoachMorningRouteComponent,
})

function AthleteRouteComponent() {
  const { athleteId } = athleteRoute.useParams()
  return <AthletePage athleteId={athleteId} />
}

function SessionRouteComponent() {
  const { sessionId } = sessionRoute.useParams()
  return <SessionPage sessionId={sessionId} />
}

function CoachMorningRouteComponent() {
  const { coachId } = coachMorningRoute.useParams()
  return <CoachMorningPage coachId={coachId} />
}

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  planRoute,
  huddleRoute,
  wellnessRoute,
  mapRoute,
  communityRoute,
  leaderboardRoute,
  inboxRoute,
  athleteRoute,
  sessionRoute,
  coachMorningRoute,
])

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultPendingMinMs: 150,
})
