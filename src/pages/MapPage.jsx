import { PageIntro, Panel } from '../components/Primitives'

export function MapPage() {
  return (
    <>
      <PageIntro
        eyebrow="Explore"
        title="Map is ready for a richer TanStack route, even if the location layer ships next."
        description="I kept this route in the new app shell so the product stays coherent while the map and community surface mature."
      />

      <Panel title="Map roadmap" kicker="Next build">
        <div className="feature-grid">
          <div className="feature-card">
            <strong>Nearby classes</strong>
            <p>Surface local sessions, facilities, and field bookings in a discoverable browse experience.</p>
          </div>
          <div className="feature-card">
            <strong>Coach hotspots</strong>
            <p>Show where live sessions, huddles, and academy activity are happening around the user.</p>
          </div>
          <div className="feature-card">
            <strong>Location-aware filters</strong>
            <p>Use route search params and Query state to make map exploration feel first-class.</p>
          </div>
        </div>
      </Panel>
    </>
  )
}
