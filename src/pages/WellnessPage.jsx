import { useQuery } from '@tanstack/react-query'
import { api, safeQuery } from '../lib/api'
import { MiniBars, PageIntro, Panel, Pill, StatCard, StatGrid } from '../components/Primitives'

const fallback = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  wellness: [65, 72, 68, 75],
  sleep: [60, 66, 70, 73],
}

export function WellnessPage() {
  const wellnessQuery = useQuery({
    queryKey: ['wellness-summary'],
    queryFn: () => safeQuery(() => api.get('/wellness/weekly-summary'), fallback),
  })

  const data = wellnessQuery.data || fallback

  return (
    <>
      <PageIntro
        eyebrow="Recovery"
        title="Wellness signals presented like a product, not a placeholder."
        description="This view keeps the existing backend weekly summary, but the interface now reads like a recovery dashboard coaches would actually use."
      />

      <StatGrid>
        <StatCard label="Weeks tracked" value={data.labels.length} hint="Current summary horizon" />
        <StatCard label="Latest wellness" value={data.wellness[data.wellness.length - 1]} hint="Current team average" tone="success" />
        <StatCard label="Latest sleep" value={data.sleep[data.sleep.length - 1]} hint="Current sleep average" tone="brand" />
        <StatCard label="Source" value={wellnessQuery.isError ? 'sample' : 'backend'} hint="Fallback-safe rendering" tone="warm" />
      </StatGrid>

      <div className="content-grid">
        <Panel title="Wellness trend" kicker="Weekly averages" right={<Pill tone={wellnessQuery.isError ? 'warm' : 'success'}>{wellnessQuery.isError ? 'sample data' : 'live data'}</Pill>}>
          <div className="trend-compare">
            <div>
              <strong>Wellness</strong>
              <MiniBars values={data.wellness} />
            </div>
            <div>
              <strong>Sleep</strong>
              <MiniBars values={data.sleep} />
            </div>
          </div>
        </Panel>

        <Panel title="What this should become" kicker="Roadmap">
          <div className="feature-grid">
            <div className="feature-card">
              <strong>Recovery score</strong>
              <p>Blend sleep, soreness, stress, and training load into a pre-session readiness signal.</p>
            </div>
            <div className="feature-card">
              <strong>Nutrition log</strong>
              <p>Use the backend nutrition services to turn meal data into actual fueling guidance.</p>
            </div>
            <div className="feature-card">
              <strong>Hydration prompts</strong>
              <p>Make the wellness area actionable with reminders and late-day interventions.</p>
            </div>
          </div>
        </Panel>
      </div>
    </>
  )
}
