Build the frontend for this product as a senior product designer who can also ship code.

Context:
- The backend already supports athlete monitoring, live biomechanics sessions, weekly training plans, wellness, huddles, leaderboards, athlete profiles, and coach triage.
- Treat this as a coaching product, not a generic fitness dashboard.
- Design for clarity under pressure: coaches need fast scanning, athletes need motivation, and stakeholders need confidence that the system is intelligent.

What to do:
- Read the backend routes and current frontend before changing anything.
- Infer the main user journeys from the codebase, especially monitor, triage, plan, review, and motivate.
- Upgrade the frontend into a cohesive product experience with strong information hierarchy and intentional visual language.
- Preserve existing functionality and backend compatibility.
- Prefer bold but usable design decisions over safe generic admin UI.

Design direction:
- Use expressive typography, clear section framing, and premium sports-performance energy.
- Make key states obvious: live, ready, at risk, improving, completed, offline.
- Use cards, rails, and summary strips to help scanning.
- Avoid purple-heavy defaults and bland SaaS styling.
- Desktop and mobile both need to feel considered.

Implementation expectations:
- Reuse the existing frontend stack and patterns where possible.
- Keep copy product-minded and concrete.
- Add lightweight motion or visual emphasis only where it improves comprehension.
- If data is missing, show elegant fallback states instead of broken UI.
- When helpful, derive UI summaries from existing API data rather than inventing new endpoints.

Deliverables:
- Ship the code changes directly.
- Keep the result believable as a real product surface for coaches and athletes.
- Briefly summarize what changed, why it improves the product, and any remaining gaps.
