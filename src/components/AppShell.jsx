import { Outlet } from '@tanstack/react-router'

// Pages now own their own chrome (header / nav / layout). The shell is
// intentionally minimal — it just hosts the routed page.
export function AppShell() {
  return <Outlet />
}
