import React from 'react'
import { Link } from '@tanstack/react-router'

const ORANGE = '#FC4C02'
const DARK = '#242428'
const GRAY = '#6D6D78'
const LIGHT = '#F7F7FA'
const BORDER = '#E6E6EA'

export function LandingPage() {
  return (
    <div style={{
      background: '#fff',
      color: DARK,
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* STICKY HEADER */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: '#fff',
        borderBottom: `1px solid ${BORDER}`,
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 32px',
          height: '64px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ fontSize: '20px', fontWeight: 800, color: ORANGE, letterSpacing: '-0.5px' }}>
            PERSONAL HEALTH
          </div>
          <nav style={{ display: 'flex', gap: '32px', fontSize: '13px', fontWeight: 600 }}>
            <a href="#features" style={{ color: DARK, textDecoration: 'none' }}>Features</a>
            <a href="#how" style={{ color: DARK, textDecoration: 'none' }}>How It Works</a>
            <a href="#pricing" style={{ color: DARK, textDecoration: 'none' }}>Pricing</a>
            <a href="#faq" style={{ color: DARK, textDecoration: 'none' }}>FAQ</a>
          </nav>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Link to="/login" style={{
              padding: '8px 18px',
              background: 'transparent',
              border: `1px solid ${DARK}`,
              color: DARK,
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
            }}>
              Log In
            </Link>
            <Link to="/signup" style={{
              padding: '8px 18px',
              background: ORANGE,
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <section style={{
        padding: '80px 32px 60px',
        background: `linear-gradient(180deg, #fff 0%, ${LIGHT} 100%)`,
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '60px',
            alignItems: 'center',
          }}>
            <div>
              <div style={{
                display: 'inline-block',
                padding: '6px 14px',
                background: '#fff',
                border: `1px solid ${BORDER}`,
                borderRadius: '50px',
                fontSize: '11px',
                fontWeight: 700,
                color: ORANGE,
                marginBottom: '24px',
                letterSpacing: '0.5px',
              }}>
                ⚡ AI BIOMECHANICS · LAUNCHING TO 2,000 ATHLETES
              </div>
              <h1 style={{
                fontSize: 'clamp(48px, 6vw, 84px)',
                fontWeight: 800,
                margin: 0,
                lineHeight: 0.95,
                letterSpacing: '-3px',
                color: DARK,
              }}>
                Form scores<br />
                in <span style={{ color: ORANGE }}>real-time.</span><br />
                Improvement<br />
                instantly.
              </h1>
              <p style={{
                fontSize: '18px',
                color: GRAY,
                marginTop: '24px',
                maxWidth: '480px',
                lineHeight: 1.5,
              }}>
                Record your training with your phone camera. AI biomechanics grades every rep. Track form, heart rate, and progress — without a coach in the room.
              </p>
              <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
                <Link to="/signup" search={{ role: 'athlete' }} style={{
                  padding: '14px 28px',
                  background: ORANGE,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  Start Training Free →
                </Link>
                <Link to="/signup" search={{ role: 'coach' }} style={{
                  padding: '14px 28px',
                  background: 'transparent',
                  border: `1px solid ${DARK}`,
                  color: DARK,
                  borderRadius: '4px',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  I'm a Coach
                </Link>
              </div>

              {/* Social proof badges */}
              <div style={{ display: 'flex', gap: '32px', marginTop: '40px', paddingTop: '32px', borderTop: `1px solid ${BORDER}` }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: ORANGE }}>2,400+</div>
                  <div style={{ fontSize: '11px', color: GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>Athletes</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: ORANGE }}>25.3K</div>
                  <div style={{ fontSize: '11px', color: GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>Sessions</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: ORANGE }}>52%</div>
                  <div style={{ fontSize: '11px', color: GRAY, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px' }}>Avg Improvement</div>
                </div>
              </div>
            </div>

            {/* Hero visual: phone mockup with the app */}
            <HeroPhoneMockup />
          </div>
        </div>
      </section>

      {/* SECTION 2: PROBLEM STATEMENT */}
      <section style={{ padding: '80px 32px', background: DARK, color: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: ORANGE, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '20px' }}>
            The Problem
          </div>
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 800,
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '-1px',
          }}>
            99% of athletes train without a coach.<br />
            <span style={{ color: ORANGE }}>That's how injuries and bad habits begin.</span>
          </h2>
          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.7)', marginTop: '20px', lineHeight: 1.6 }}>
            Personal coaches and biomechanics labs cost $200+/session. Most athletes can't afford either. They train alone, plateau, or get hurt — and never know why.
          </p>
          <p style={{ fontSize: '17px', color: ORANGE, marginTop: '12px', fontWeight: 600 }}>
            We built Personal Health to fix that.
          </p>
        </div>
      </section>

      {/* FEATURE 01 — Form Score (the OUTPUT of recording, not the recording itself) */}
      <FeatureSection
        eyebrow="Feature · 01 · For Athletes"
        title="Form score 0–100 after every rep."
        description="MediaPipe pose detection grades 33 keypoints in real time. You see your score within a second of finishing a set — joint angles, symmetry, tempo, and where you broke down."
        bullets={['33-keypoint pose detection at 30 fps', 'Per-rep joint angle tracking', 'Form score 0–100 with grade letter', 'Works offline after first model download']}
        visual={<FormScoreVisual />}
        cta="See How Scoring Works"
        flip={false}
      />

      {/* FEATURE 02 — Heart Rate from camera (selfie-style visual) */}
      <FeatureSection
        eyebrow="Feature · 02 · For Athletes"
        title="Heart rate from your camera. No wearable."
        description="rPPG (remote photoplethysmography) reads micro skin-tone changes in your face during training. The same tech hospitals use — now running on your phone, no Apple Watch needed."
        bullets={['Face-based BPM tracking via camera', 'No Apple Watch, Garmin, or chest strap', 'Recovery tracking between reps', 'HRV trends across weeks']}
        visual={<HeartRateCameraVisual />}
        cta="See How rPPG Works"
        flip={true}
        bg={LIGHT}
      />

      {/* FEATURE 03 — Weak Joint analysis (the diagnostic) */}
      <FeatureSection
        eyebrow="Feature · 03 · For Athletes"
        title="Find the joint that's holding you back."
        description="Most plateaus aren't about strength — they're about the weakest link in the kinetic chain. We rank your joints from weakest to strongest, so you know exactly where to focus drills."
        bullets={['Per-joint form scoring (knee, shoulder, hip, ankle, spine)', 'Injury risk flags by joint', 'Targeted drill recommendations', 'Track joint improvement over weeks']}
        visual={<WeakJointVisual />}
        cta="See Weak Joint Analysis"
        flip={false}
      />

      {/* FEATURE 04 — Session Replay (post-session video review, NOT live record) */}
      <FeatureSection
        eyebrow="Feature · 04 · For Athletes"
        title="Watch the replay. See exactly what went wrong."
        description="Every session is saved as a scrub-able replay. Tap the worst rep to see the joint angle that failed. Compare today's bench press against your personal best, side by side."
        bullets={['Tap-to-scrub video player', 'Highlight reel of best & worst reps', 'Side-by-side vs personal best', 'Frame-by-frame joint angle export']}
        visual={<SessionReviewVisual />}
        cta="See Session Replay"
        flip={true}
        bg={LIGHT}
      />

      {/* FEATURE 05 — Nutrition (athlete feature, kept with athlete features) */}
      <FeatureSection
        eyebrow="Feature · 05 · For Athletes"
        title="Nutrition that fuels your form."
        description="Snap a photo of your meal. Our nutrition AI estimates macros, tracks calories vs sport-specific goals, and flags when fueling is off. Form gains are 50% training, 50% eating right."
        bullets={['Sport-specific goals (sprint = 2,600 kcal · strength = 2,800 kcal)', 'Photo-to-macros AI logging', 'Live protein / carb / fat tracking', 'Coach can see team nutrition compliance']}
        visual={<NutritionVisual />}
        cta="See Nutrition Tracker"
        flip={false}
      />

      {/* FEATURE 06 — Coach Dashboard (now grouped at the end as the coach-facing feature) */}
      <FeatureSection
        eyebrow="Feature · 06 · For Coaches"
        title="Coaches see every athlete from one screen."
        description="Run a roster of 30+ athletes. Live form scores, weak joints, injury flags, missed sessions. Send voice feedback or assign drills in one tap — no more flying blind between sessions."
        bullets={['Team roster with live form scores', 'At-risk athlete alerts (form drop, missed session)', 'Drill assignment system', 'Voice notes + text feedback']}
        visual={<CoachDashboardVisual />}
        cta="See Coach Dashboard"
        flip={true}
        bg={LIGHT}
      />

      {/* SECTION 8: HOW IT WORKS */}
      <section id="how" style={{ padding: '100px 32px', background: '#fff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: ORANGE, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px' }}>
              How It Works
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>
              Three steps. Zero equipment.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <StepCard num="01" title="Record" desc="Open the app. Point your phone. Start training. The AI watches every rep." />
            <StepCard num="02" title="Get Scored" desc="Form score after every set. Weak joints flagged. Heart rate logged. All in seconds." accent />
            <StepCard num="03" title="Improve" desc="Track form trends. Get drill recommendations. Watch yourself get measurably better." />
          </div>
        </div>
      </section>

      {/* SECTION 9: STATS / SOCIAL PROOF */}
      <section style={{ padding: '80px 32px', background: ORANGE, color: '#fff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>
              The Numbers
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 800, margin: 0, letterSpacing: '-0.8px' }}>
              Athletes who use Personal Health daily improve 52% faster.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', marginTop: '40px' }}>
            <BigStat value="2,400+" label="Athletes Training" />
            <BigStat value="25.3K" label="Sessions Logged" />
            <BigStat value="52.3%" label="Avg Improvement" />
            <BigStat value="<60s" label="Time to First Score" />
          </div>
        </div>
      </section>

      {/* SECTION 10: TESTIMONIALS */}
      <section style={{ padding: '100px 32px', background: '#fff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: ORANGE, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px' }}>
              From the Field
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>
              Built with athletes and coaches.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <Testimonial
              quote="I train alone four days a week. Personal Health is the closest thing I have to a coach watching me."
              name="Aryan S."
              role="Sprint athlete · Tier 3"
            />
            <Testimonial
              quote="Form score after every rep changes everything. My athletes finally see what I see."
              name="Coach Priya M."
              role="State-level athletics · 28 athletes"
            />
            <Testimonial
              quote="The heart rate from camera thing is wild. No watch, no chest strap, just my phone."
              name="Vikram T."
              role="Strength training · Tier 1"
            />
          </div>
        </div>
      </section>

      {/* SECTION 11: PRICING */}
      <section id="pricing" style={{ padding: '100px 32px', background: LIGHT }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: ORANGE, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px' }}>
              Pricing
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>
              Start free. Upgrade when you're hooked.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <PricingCard
              tier="Free"
              price="₹0"
              period=""
              features={['3 sessions/week', 'Form score basics', 'Personal best tracking', 'Limited history (30 days)']}
              cta="Start Free"
              ctaTo="/signup"
            />
            <PricingCard
              tier="Athlete Pro"
              price="₹199"
              period="/month"
              features={['Unlimited sessions', 'Heart rate via rPPG', 'Weak joint analysis', 'Drill library', 'Full history']}
              cta="Go Pro"
              ctaTo="/signup"
              featured
            />
            <PricingCard
              tier="Coach"
              price="₹999"
              period="/month"
              features={['Up to 30 athletes', 'Team dashboard', 'Drill assignment', 'Voice + text feedback', 'Injury alerts']}
              cta="Coach Plan"
              ctaTo="/signup"
            />
          </div>
        </div>
      </section>

      {/* SECTION 12: FEATURED PROGRAMS */}
      <section style={{ padding: '100px 32px', background: '#fff' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ marginBottom: '40px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: ORANGE, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px' }}>
              Programs
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>
              Built for every goal.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
            <ProgramCard name="Strength" sessions="32 sessions" emoji="💪" />
            <ProgramCard name="Athletic Drills" sessions="40 sessions" emoji="🏃" featured />
            <ProgramCard name="Mind & Body" sessions="18 sessions" emoji="🧘" />
            <ProgramCard name="Recovery" sessions="12 sessions" emoji="🌿" />
            <ProgramCard name="Sports-Specific" sessions="24 sessions" emoji="⚽" />
          </div>
        </div>
      </section>

      {/* SECTION 13: FAQ */}
      <section id="faq" style={{ padding: '100px 32px', background: LIGHT }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: ORANGE, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px' }}>
              FAQ
            </div>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>
              Got questions?
            </h2>
          </div>
          <FAQ q="Do I need any special equipment?" a="No. Just a phone with a camera and 6 feet of space. The AI runs on the phone — no internet required after the first model download." />
          <FAQ q="How accurate is the form score?" a="Our pose detection runs at 30fps with ±2° joint angle accuracy. Form scores correlate 0.84 with biomechanics lab measurements in our pilot studies." />
          <FAQ q="Will it drain my battery?" a="A 45-minute session uses about 8% battery on most phones. We optimize the model so it can run all day if needed." />
          <FAQ q="What sports does it support?" a="Strength training, sprint, jump, agility drills, and sport-specific motions for cricket, basketball, football, and athletics." />
          <FAQ q="Is my video stored anywhere?" a="By default no — frames are processed locally. If you upload session video for coach review, it stays on our servers and only your coach can see it." />
          <FAQ q="What if I don't have a coach?" a="That's exactly who we built this for. The app gives you AI-generated coaching notes after every session." />
        </div>
      </section>

      {/* SECTION 14: FINAL CTA */}
      <section style={{
        padding: '120px 32px',
        background: DARK,
        color: '#fff',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: ORANGE, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px' }}>
            Ready?
          </div>
          <h2 style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 800,
            margin: 0,
            lineHeight: 1.0,
            letterSpacing: '-2px',
          }}>
            Stop training blind.<br />
            <span style={{ color: ORANGE }}>Start training smarter.</span>
          </h2>
          <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.7)', marginTop: '24px', lineHeight: 1.6 }}>
            2,400 athletes already use Personal Health daily. Join them.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '40px', flexWrap: 'wrap' }}>
            <Link to="/signup" search={{ role: 'athlete' }} style={{
              padding: '16px 36px',
              background: ORANGE,
              color: '#fff',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 700,
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              I'm an Athlete →
            </Link>
            <Link to="/signup" search={{ role: 'coach' }} style={{
              padding: '16px 36px',
              background: 'transparent',
              border: `1px solid #fff`,
              color: '#fff',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 700,
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}>
              I'm a Coach →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#0a0a0a', color: '#fff', padding: '60px 32px 32px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '40px' }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: ORANGE, marginBottom: '12px' }}>
                PERSONAL HEALTH
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, maxWidth: '320px' }}>
                Phone-first AI biomechanics. Built for athletes who train without a coach.
              </p>
            </div>
            <FooterCol title="Product" links={['Features', 'Pricing', 'Programs', 'For Coaches']} />
            <FooterCol title="Company" links={['About', 'Research', 'Blog', 'Careers']} />
            <FooterCol title="Legal" links={['Privacy', 'Terms', 'Data', 'Contact']} />
          </div>
          <div style={{
            paddingTop: '24px',
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.4)',
          }}>
            <span>© 2026 Personal Health · AI biomechanics for every athlete</span>
            <span>Made for India 🇮🇳</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── COMPONENTS ─────────────────────────────────

function FeatureSection({ eyebrow, title, description, bullets, visual, cta, flip, bg }) {
  return (
    <section id="features" style={{ padding: '100px 32px', background: bg || '#fff' }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '60px',
        alignItems: 'center',
        direction: flip ? 'rtl' : 'ltr',
      }}>
        <div style={{ direction: 'ltr' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: ORANGE, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px' }}>
            {eyebrow}
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 800, margin: 0, lineHeight: 1.1, letterSpacing: '-1px' }}>
            {title}
          </h2>
          <p style={{ fontSize: '16px', color: GRAY, marginTop: '16px', lineHeight: 1.6 }}>
            {description}
          </p>
          <div style={{ marginTop: '24px' }}>
            {bullets.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px', fontSize: '14px' }}>
                <span style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: ORANGE,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 700,
                }}>
                  ✓
                </span>
                {b}
              </div>
            ))}
          </div>
          <button style={{
            marginTop: '24px',
            padding: '12px 24px',
            background: 'transparent',
            border: `1px solid ${DARK}`,
            color: DARK,
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {cta} →
          </button>
        </div>
        <div style={{
          direction: 'ltr',
          height: '480px',
          background: `linear-gradient(135deg, ${DARK} 0%, #3a3a40 100%)`,
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {visual}
        </div>
      </div>
    </section>
  )
}

function StepCard({ num, title, desc, accent }) {
  return (
    <div style={{
      padding: '40px',
      background: accent ? ORANGE : '#fff',
      color: accent ? '#fff' : DARK,
      border: accent ? 'none' : `1px solid ${BORDER}`,
      borderRadius: '8px',
      minHeight: '240px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      <div style={{ fontSize: '48px', fontWeight: 800, opacity: 0.2, letterSpacing: '-2px' }}>{num}</div>
      <div>
        <div style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px', letterSpacing: '-0.5px' }}>{title}</div>
        <div style={{ fontSize: '14px', lineHeight: 1.5, opacity: accent ? 0.9 : 0.7 }}>{desc}</div>
      </div>
    </div>
  )
}

function BigStat({ value, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, lineHeight: 1, letterSpacing: '-2px' }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '8px', opacity: 0.85, fontWeight: 700 }}>
        {label}
      </div>
    </div>
  )
}

function Testimonial({ quote, name, role }) {
  return (
    <div style={{
      padding: '32px',
      background: LIGHT,
      borderRadius: '8px',
      border: `1px solid ${BORDER}`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '240px',
    }}>
      <div style={{ fontSize: '40px', color: ORANGE, lineHeight: 1, marginBottom: '12px', fontWeight: 800 }}>"</div>
      <div style={{ fontSize: '15px', lineHeight: 1.5, color: DARK, fontWeight: 500 }}>
        {quote}
      </div>
      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: '13px', fontWeight: 700 }}>{name}</div>
        <div style={{ fontSize: '11px', color: GRAY, marginTop: '2px' }}>{role}</div>
      </div>
    </div>
  )
}

function PricingCard({ tier, price, period, features, cta, ctaTo, featured }) {
  return (
    <div style={{
      padding: '36px',
      background: featured ? DARK : '#fff',
      color: featured ? '#fff' : DARK,
      border: featured ? 'none' : `1px solid ${BORDER}`,
      borderRadius: '8px',
      position: 'relative',
    }}>
      {featured && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '36px',
          background: ORANGE,
          color: '#fff',
          padding: '4px 12px',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          borderRadius: '4px',
        }}>
          Most Popular
        </div>
      )}
      <div style={{ fontSize: '13px', fontWeight: 700, color: featured ? ORANGE : ORANGE, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {tier}
      </div>
      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
        <span style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-1.5px' }}>{price}</span>
        <span style={{ fontSize: '14px', opacity: 0.6 }}>{period}</span>
      </div>
      <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: `1px solid ${featured ? 'rgba(255,255,255,0.1)' : BORDER}` }}>
        {features.map((f, i) => (
          <div key={i} style={{ fontSize: '13px', marginBottom: '10px', display: 'flex', gap: '10px' }}>
            <span style={{ color: ORANGE, fontWeight: 700 }}>✓</span>
            {f}
          </div>
        ))}
      </div>
      <Link to={ctaTo} style={{
        display: 'block',
        marginTop: '24px',
        padding: '12px',
        background: featured ? ORANGE : DARK,
        color: '#fff',
        textAlign: 'center',
        borderRadius: '4px',
        fontSize: '12px',
        fontWeight: 700,
        textDecoration: 'none',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}>
        {cta} →
      </Link>
    </div>
  )
}

function ProgramCard({ name, sessions, emoji, featured }) {
  return (
    <div style={{
      padding: '24px',
      background: featured ? ORANGE : LIGHT,
      color: featured ? '#fff' : DARK,
      borderRadius: '8px',
      border: featured ? 'none' : `1px solid ${BORDER}`,
      cursor: 'pointer',
      transition: 'transform 0.2s',
    }}>
      <div style={{ fontSize: '36px', marginBottom: '16px' }}>{emoji}</div>
      <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '4px' }}>{name}</div>
      <div style={{ fontSize: '11px', opacity: 0.7 }}>{sessions}</div>
    </div>
  )
}

function FAQ({ q, a }) {
  return (
    <div style={{
      padding: '24px 0',
      borderBottom: `1px solid ${BORDER}`,
    }}>
      <div style={{ fontSize: '17px', fontWeight: 700, color: DARK, marginBottom: '8px' }}>
        {q}
      </div>
      <div style={{ fontSize: '14px', color: GRAY, lineHeight: 1.6 }}>
        {a}
      </div>
    </div>
  )
}

function FooterCol({ title, links }) {
  return (
    <div>
      <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>
        {title}
      </div>
      {links.map((l, i) => (
        <div key={i} style={{ fontSize: '13px', marginBottom: '8px', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
          {l}
        </div>
      ))}
    </div>
  )
}

// ─── HERO PHONE MOCKUP ─────────────────────────

function HeroPhoneMockup() {
  return (
    <div style={{
      position: 'relative',
      height: '600px',
      borderRadius: '16px',
      background: `linear-gradient(135deg, ${DARK} 0%, #3a3a40 50%, ${DARK} 100%)`,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Subtle radial glow */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '420px',
        height: '420px',
        background: `radial-gradient(circle, rgba(252, 76, 2, 0.25) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Phone frame */}
      <div style={{
        position: 'relative',
        width: '270px',
        height: '540px',
        borderRadius: '36px',
        background: '#000',
        padding: '12px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
      }}>
        <div style={{
          width: '100%',
          height: '100%',
          background: '#0a0a0c',
          borderRadius: '28px',
          color: '#fff',
          boxSizing: 'border-box',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Camera viewport — fills the whole phone screen like a real recording app */}
          <svg viewBox="0 0 270 540" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }}>
            {/* Subtle viewport vignette */}
            <defs>
              <radialGradient id="phone-vignette" cx="50%" cy="50%" r="70%">
                <stop offset="60%" stopColor="rgba(0,0,0,0)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
              </radialGradient>
            </defs>

            {/* Background grid (notebook-style) */}
            <pattern id="phone-grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
            </pattern>
            <rect width="270" height="540" fill="url(#phone-grid)" />

            {/* Camera framing brackets (corners — like a viewfinder) */}
            <g stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none">
              <path d="M 24 80 L 24 60 L 44 60" />
              <path d="M 246 80 L 246 60 L 226 60" />
              <path d="M 24 460 L 24 480 L 44 480" />
              <path d="M 246 460 L 246 480 L 226 480" />
            </g>

            {/* Pitch ground (raised so it sits above the bottom glass card) */}
            <line x1="20" y1="395" x2="250" y2="395" stroke="rgba(252,76,2,0.5)" strokeWidth="1.5" strokeDasharray="4 5" />

            {/* Wicket stumps behind batter (compact, fully visible) */}
            <g stroke="rgba(255,255,255,0.6)" strokeWidth="2">
              <line x1="58" y1="395" x2="58" y2="350" />
              <line x1="68" y1="395" x2="68" y2="350" />
              <line x1="78" y1="395" x2="78" y2="350" />
              <line x1="58" y1="353" x2="78" y2="353" />
            </g>

            {/* Cricket ball flying in (animated) — at chest height */}
            <g className="ph-cricket-ball">
              <circle cx="0" cy="265" r="6" fill={ORANGE} />
              <line x1="-15" y1="265" x2="-5" y2="265" stroke={ORANGE} strokeWidth="1.5" strokeDasharray="2 2" opacity="0.7" />
              <line x1="-25" y1="260" x2="-12" y2="263" stroke={ORANGE} strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
            </g>

            {/* CRICKET BATTER — sized to fit the visible viewport */}
            {/* Static body parts */}
            <g stroke={ORANGE} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              {/* Helmet (head top at y=152, well below the 110px overlay band) */}
              <circle cx="160" cy="170" r="18" />
              <path d="M 142 168 Q 160 158 178 168" />
              <line x1="146" y1="180" x2="174" y2="180" />
              {/* Body (shorter — head→hip = 90px) */}
              <line x1="160" y1="188" x2="158" y2="278" />
              {/* Front leg (hip→knee→foot) */}
              <line x1="158" y1="278" x2="130" y2="332" />
              <line x1="130" y1="332" x2="115" y2="385" />
              {/* Back leg */}
              <line x1="158" y1="278" x2="186" y2="332" />
              <line x1="186" y1="332" x2="195" y2="385" />
              {/* Pads (thicker, full leg length) */}
              <line x1="130" y1="328" x2="115" y2="385" strokeWidth="6" opacity="0.3" />
              <line x1="186" y1="328" x2="195" y2="385" strokeWidth="6" opacity="0.3" />
            </g>

            {/* ANIMATED ARMS + BAT (swinging — bat stays inside viewport) */}
            <g className="ph-cricket-swing" stroke={ORANGE} strokeWidth="2.5" fill="none" strokeLinecap="round">
              {/* Top arm (shoulder→elbow) */}
              <line x1="160" y1="208" x2="190" y2="225" />
              {/* Bottom arm (elbow→wrist) */}
              <line x1="190" y1="225" x2="212" y2="240" />
              {/* THE BAT (shorter, ends at y=170 not y=120) */}
              <line x1="212" y1="240" x2="238" y2="170" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
              <line x1="232" y1="175" x2="244" y2="165" stroke="#fff" strokeWidth="3" />
              {/* Handle grip detail */}
              <line x1="212" y1="240" x2="218" y2="234" stroke={ORANGE} strokeWidth="2" />
            </g>

            {/* Joint dots (skeleton overlay) */}
            <g fill={ORANGE}>
              <circle cx="160" cy="170" r="4" />
              <circle cx="160" cy="208" r="4" />
              <circle cx="158" cy="278" r="4" />
              <circle cx="130" cy="332" r="4" />
              <circle cx="186" cy="332" r="4" />
              <circle cx="115" cy="385" r="4" />
              <circle cx="195" cy="385" r="4" />
            </g>
            <g className="ph-cricket-swing" fill={ORANGE}>
              <circle cx="190" cy="225" r="4" />
              <circle cx="212" cy="240" r="4" />
            </g>

            {/* Angle annotations on knees (inside the visible band) */}
            <text x="98" y="332" fontSize="11" fontFamily="monospace" fill="#fff" opacity="0.85">87°</text>
            <text x="195" y="332" fontSize="11" fontFamily="monospace" fill="#fff" opacity="0.85">85°</text>

            {/* Vignette overlay last */}
            <rect width="270" height="540" fill="url(#phone-vignette)" pointerEvents="none" />
          </svg>

          {/* TOP STATUS BAR (overlay) */}
          <div style={{
            position: 'absolute',
            top: '14px',
            left: '20px',
            right: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '10px',
            opacity: 0.7,
            zIndex: 3,
          }}>
            <span>9:41</span>
            <span>● 87%</span>
          </div>

          {/* REC + sport label (overlay top) */}
          <div style={{
            position: 'absolute',
            top: '36px',
            left: '20px',
            right: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 3,
          }}>
            <span style={{ color: ORANGE, fontSize: '11px', fontWeight: 700, letterSpacing: '0.5px' }}>
              <span className="ph-rec-dot">●</span> REC · 02:14
            </span>
            <span style={{ color: '#fff', fontSize: '9px', opacity: 0.6, fontFamily: 'monospace' }}>
              FRAME 547
            </span>
          </div>

          {/* Sport tag */}
          <div style={{
            position: 'absolute',
            top: '60px',
            left: '20px',
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            color: '#fff',
            padding: '4px 10px',
            borderRadius: '50px',
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            zIndex: 3,
          }}>
            🏏 CRICKET · BAT SWING
          </div>

          {/* FORM SCORE FLOATING BIG (top of screen) */}
          <div style={{
            position: 'absolute',
            top: '92px',
            right: '20px',
            background: ORANGE,
            color: '#fff',
            borderRadius: '10px',
            padding: '10px 16px',
            boxShadow: '0 8px 24px rgba(252,76,2,0.4)',
            zIndex: 3,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '8px', opacity: 0.85, fontWeight: 700, letterSpacing: '0.5px' }}>FORM SCORE</div>
            <div style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1, marginTop: '2px' }}>87</div>
            <div style={{ fontSize: '8px', opacity: 0.9, fontWeight: 600, marginTop: '2px' }}>↑ +8</div>
          </div>

          {/* Bottom heart rate + reps card (overlay) */}
          <div style={{
            position: 'absolute',
            bottom: '16px',
            left: '20px',
            right: '20px',
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '12px',
            zIndex: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: '8px', opacity: 0.6, fontWeight: 700, letterSpacing: '0.3px' }}>
                HR · rPPG
              </div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: ORANGE, lineHeight: 1, marginTop: '2px' }} className="ph-heart-beat">
                142 <span style={{ fontSize: '9px', fontWeight: 600, color: '#fff', opacity: 0.6 }}>bpm</span>
              </div>
              <svg viewBox="0 0 80 16" style={{ width: '70px', height: '14px', marginTop: '2px' }}>
                <polyline className="ph-ecg-draw" points="0,8 12,8 16,2 20,14 24,8 36,8 40,1 44,15 48,8 60,8 64,3 68,13 72,8 80,8" stroke={ORANGE} strokeWidth="1.5" fill="none" />
              </svg>
            </div>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>12</div>
                <div style={{ fontSize: '8px', opacity: 0.5, fontWeight: 700 }}>REPS</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: 800 }}>3</div>
                <div style={{ fontSize: '8px', opacity: 0.5, fontWeight: 700 }}>SETS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Notch */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '90px',
          height: '24px',
          background: '#000',
          borderRadius: '0 0 14px 14px',
        }} />
      </div>

      {/* Floating PB badge */}
      <div style={{
        position: 'absolute',
        top: '60px',
        right: '40px',
        background: ORANGE,
        color: '#fff',
        padding: '12px 18px',
        borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        transform: 'rotate(6deg)',
      }}>
        <div style={{ fontSize: '9px', opacity: 0.85, fontWeight: 700, letterSpacing: '0.5px' }}>NEW PB!</div>
        <div style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1, marginTop: '2px' }}>87</div>
      </div>

      {/* Floating coach note */}
      <div style={{
        position: 'absolute',
        bottom: '60px',
        left: '40px',
        background: '#fff',
        color: DARK,
        padding: '14px 18px',
        borderRadius: '8px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        maxWidth: '200px',
        transform: 'rotate(-4deg)',
      }}>
        <div style={{ fontSize: '9px', color: GRAY, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
          ● Coach
        </div>
        <div style={{ fontSize: '12px', fontWeight: 600, lineHeight: 1.3 }}>
          Knee tracking improved a lot. Try the deadlift hinge next.
        </div>
      </div>
    </div>
  )
}

// ─── FEATURE VISUALS (no photos!) ───────────────

function PoseDetectionVisual() {
  return (
    <svg viewBox="0 0 400 400" style={{ width: '70%', maxWidth: '380px' }}>
      {/* Static torso/arms */}
      <g stroke={ORANGE} strokeWidth="3" fill="none" strokeLinecap="round">
        <circle cx="200" cy="80" r="24" />
        <line x1="200" y1="104" x2="200" y2="220" />
        <line x1="200" y1="140" x2="130" y2="170" />
        <line x1="130" y1="170" x2="100" y2="240" />
        <line x1="200" y1="140" x2="270" y2="170" />
        <line x1="270" y1="170" x2="300" y2="240" />
      </g>
      {/* Animated legs (squat cycle) */}
      <g className="ph-squat-legs" stroke={ORANGE} strokeWidth="3" fill="none" strokeLinecap="round">
        <line x1="200" y1="220" x2="160" y2="320" />
        <line x1="160" y1="320" x2="150" y2="380" />
        <line x1="200" y1="220" x2="240" y2="320" />
        <line x1="240" y1="320" x2="250" y2="380" />
      </g>
      <g fill={ORANGE}>
        <circle cx="200" cy="80" r="6" />
        <circle cx="200" cy="140" r="6" />
        <circle cx="130" cy="170" r="6" />
        <circle cx="270" cy="170" r="6" />
        <circle cx="100" cy="240" r="6" />
        <circle cx="300" cy="240" r="6" />
        <circle cx="200" cy="220" r="6" />
      </g>
      <g className="ph-squat-legs" fill={ORANGE}>
        <circle cx="160" cy="320" r="6" />
        <circle cx="240" cy="320" r="6" />
        <circle cx="150" cy="380" r="6" />
        <circle cx="250" cy="380" r="6" />
      </g>
      <text x="170" y="320" fontSize="13" fontFamily="monospace" fill="#fff" opacity="0.8" className="ph-squat-legs">87°</text>
      <text x="245" y="320" fontSize="13" fontFamily="monospace" fill="#fff" opacity="0.8" className="ph-squat-legs">85°</text>
      <text x="60" y="50" fontSize="11" fontFamily="monospace" fill="#fff" opacity="0.6">33 keypoints · 30 fps</text>
    </svg>
  )
}

function HeartRateVisual() {
  return (
    <div style={{ width: '80%', textAlign: 'center', color: '#fff' }}>
      <div style={{ fontSize: '11px', opacity: 0.6, letterSpacing: '0.5px', fontWeight: 700, marginBottom: '8px' }}>
        rPPG · CAMERA-BASED HEART RATE
      </div>
      <div className="ph-heart-beat" style={{ fontSize: '88px', fontWeight: 800, color: ORANGE, lineHeight: 1, letterSpacing: '-3px' }}>142</div>
      <div style={{ fontSize: '13px', opacity: 0.7, fontWeight: 600, marginBottom: '24px' }}>BPM · steady · resting zone</div>
      <svg viewBox="0 0 400 80" style={{ width: '100%', height: '80px' }}>
        <polyline
          className="ph-ecg-draw"
          points="0,40 50,40 60,15 70,65 80,40 130,40 140,10 150,70 160,40 210,40 220,5 230,75 240,40 290,40 300,15 310,65 320,40 400,40"
          stroke={ORANGE}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '10px', opacity: 0.6 }}>
        <span>Resting · 60</span>
        <span>Aerobic · 142</span>
        <span>Max · 190</span>
      </div>
    </div>
  )
}

function WeakJointVisual() {
  // Anatomical chart: body silhouette with each joint colored by its score.
  // Reads like a doctor's diagram — visceral and human, not AI-feeling bars.
  const joints = [
    { id: 'shoulderL', label: 'L Shoulder', score: 70, color: '#f97316', x: 158, y: 130 },
    { id: 'shoulderR', label: 'R Shoulder', score: 72, color: '#f97316', x: 242, y: 130 },
    { id: 'spine',     label: 'Spine',      score: 85, color: '#22c55e', x: 200, y: 175 },
    { id: 'hipL',      label: 'L Hip',      score: 76, color: ORANGE,    x: 175, y: 235 },
    { id: 'hipR',      label: 'R Hip',      score: 78, color: ORANGE,    x: 225, y: 235 },
    { id: 'kneeL',     label: 'L Knee',     score: 62, color: '#ef4444', x: 168, y: 320, alert: true },
    { id: 'kneeR',     label: 'R Knee',     score: 65, color: '#ef4444', x: 232, y: 320 },
    { id: 'ankleL',    label: 'L Ankle',    score: 81, color: '#22c55e', x: 162, y: 400 },
    { id: 'ankleR',    label: 'R Ankle',    score: 83, color: '#22c55e', x: 238, y: 400 },
  ]

  return (
    <div style={{ width: '90%', maxWidth: '440px', display: 'flex', gap: '20px', alignItems: 'center' }}>
      {/* Anatomical body chart */}
      <div style={{ flex: 1, position: 'relative' }}>
        <svg viewBox="0 0 400 470" style={{ width: '100%', height: 'auto', display: 'block' }}>
          {/* Body silhouette (subtle filled shape behind skeleton) */}
          <path
            d="M 200 50
               Q 175 50 165 75
               L 162 110
               L 145 130
               Q 130 145 130 165
               L 145 195
               L 165 200
               L 165 250
               Q 165 280 175 320
               L 168 380
               Q 165 410 165 430
               L 175 430
               L 178 405
               L 195 360
               L 205 360
               L 222 405
               L 225 430
               L 235 430
               Q 235 410 232 380
               L 225 320
               Q 235 280 235 250
               L 235 200
               L 255 195
               L 270 165
               Q 270 145 255 130
               L 238 110
               L 235 75
               Q 225 50 200 50 Z"
            fill="rgba(255, 255, 255, 0.04)"
            stroke="rgba(255, 255, 255, 0.18)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Head */}
          <circle cx="200" cy="60" r="22" fill="rgba(255,255,255,0.04)" stroke="rgba(255, 255, 255, 0.18)" strokeWidth="1.5" />

          {/* Skeleton lines connecting joints */}
          <g stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" strokeDasharray="3 4" fill="none">
            <line x1="158" y1="130" x2="200" y2="175" />
            <line x1="242" y1="130" x2="200" y2="175" />
            <line x1="200" y1="175" x2="175" y2="235" />
            <line x1="200" y1="175" x2="225" y2="235" />
            <line x1="175" y1="235" x2="168" y2="320" />
            <line x1="225" y1="235" x2="232" y2="320" />
            <line x1="168" y1="320" x2="162" y2="400" />
            <line x1="232" y1="320" x2="238" y2="400" />
          </g>

          {/* Joints */}
          {joints.map((j) => (
            <g key={j.id}>
              {/* Pulsing halo for the worst joint */}
              {j.alert && (
                <circle
                  cx={j.x} cy={j.y} r="20"
                  fill={j.color}
                  opacity="0.15"
                  className="ph-heart-beat"
                />
              )}
              {/* Joint dot */}
              <circle cx={j.x} cy={j.y} r="9" fill={j.color} />
              <circle cx={j.x} cy={j.y} r="9" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
              {/* Score next to joint */}
              <text
                x={j.x < 200 ? j.x - 18 : j.x + 18}
                y={j.y + 4}
                fontSize="11"
                fontFamily="-apple-system, system-ui, sans-serif"
                fontWeight="700"
                fill="#fff"
                textAnchor={j.x < 200 ? 'end' : 'start'}
              >
                {j.score}
              </text>
            </g>
          ))}

          {/* Annotation for the worst joint */}
          <g>
            <line x1="60" y1="320" x2="160" y2="320" stroke="#ef4444" strokeWidth="1" strokeDasharray="2 3" />
            <text x="56" y="316" fontSize="10" fontFamily="monospace" fill="#ef4444" textAnchor="end">
              ⚠ weakest
            </text>
            <text x="56" y="330" fontSize="9" fontFamily="monospace" fill="#ef4444" textAnchor="end" opacity="0.7">
              62/100
            </text>
          </g>
        </svg>
      </div>

      {/* Side panel: ranked list (clean, minimal — no AI-bar-chart vibe) */}
      <div style={{
        width: '180px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '8px',
        padding: '14px',
      }}>
        <div style={{
          fontSize: '10px',
          color: 'rgba(255,255,255,0.5)',
          fontWeight: 700,
          letterSpacing: '0.5px',
          marginBottom: '10px',
        }}>
          PRIORITY ORDER
        </div>
        {[...joints]
          .sort((a, b) => a.score - b.score)
          .slice(0, 5)
          .map((j, i) => (
            <div key={j.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 0',
              borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <span style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: j.color,
                flexShrink: 0,
              }} />
              <span style={{ fontSize: '11px', color: '#fff', fontWeight: 600, flex: 1 }}>
                {j.label}
              </span>
              <span style={{ fontSize: '11px', color: j.color, fontWeight: 800, fontFamily: 'monospace' }}>
                {j.score}
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}

function SessionReplayVisual() {
  return (
    <div style={{ width: '80%', maxWidth: '420px' }} className="ph-zoom-rec">
      <div style={{
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '8px',
        padding: '14px',
        border: `1px solid rgba(255,255,255,0.1)`,
        marginBottom: '16px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ color: ORANGE, fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px' }}>
            <span className="ph-rec-dot">●</span> REC · 02:14
          </span>
          <span style={{ color: '#fff', fontSize: '10px', opacity: 0.6 }}>FRAME 547 / 1024</span>
        </div>
        <PoseDetectionVisual />
      </div>
      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '6px', padding: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#fff', fontSize: '10px', opacity: 0.6, fontWeight: 700 }}>0:00</span>
          <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', position: 'relative' }}>
            <div className="ph-replay-progress" style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: ORANGE, borderRadius: '2px' }} />
            <div className="ph-replay-scrubber" style={{ position: 'absolute', top: '-3px', width: '10px', height: '10px', background: ORANGE, borderRadius: '50%', marginLeft: '-5px' }} />
          </div>
          <span style={{ color: '#fff', fontSize: '10px', opacity: 0.6, fontWeight: 700 }}>4:12</span>
        </div>
      </div>
    </div>
  )
}

function CoachDashboardVisual() {
  const athletes = [
    { name: 'Aryan K.', sport: 'Sprint', score: 82, status: 'ready' },
    { name: 'Priya S.', sport: 'Jump', score: 78, status: 'watch' },
    { name: 'Rohan P.', sport: 'Cricket', score: 65, status: 'high' },
    { name: 'Zara K.', sport: 'Football', score: 81, status: 'ready' },
  ]
  return (
    <div style={{
      width: '85%',
      maxWidth: '440px',
      background: '#fff',
      borderRadius: '8px',
      overflow: 'hidden',
      border: `1px solid ${BORDER}`,
    }}>
      <div style={{
        background: ORANGE,
        color: '#fff',
        padding: '12px 16px',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>★ Coach Roster · 4 Athletes</span>
        <span>● 1 LIVE</span>
      </div>
      {athletes.map((a, i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: '32px 1fr 60px 60px',
          padding: '12px 16px',
          borderBottom: i < athletes.length - 1 ? `1px solid ${LIGHT}` : 'none',
          gap: '12px',
          alignItems: 'center',
        }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: ORANGE,
            color: '#fff',
            fontSize: '11px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {a.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: DARK }}>{a.name}</div>
            <div style={{ fontSize: '10px', color: GRAY }}>{a.sport}</div>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: ORANGE, textAlign: 'right' }}>{a.score}</div>
          <span style={{
            fontSize: '8px',
            fontWeight: 700,
            padding: '3px 6px',
            borderRadius: '50px',
            textAlign: 'center',
            textTransform: 'uppercase',
            background: a.status === 'high' ? 'rgba(239,68,68,0.1)' : a.status === 'watch' ? 'rgba(249,115,22,0.1)' : 'rgba(34,197,94,0.1)',
            color: a.status === 'high' ? '#ef4444' : a.status === 'watch' ? '#f97316' : '#22c55e',
          }}>
            {a.status}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── NUTRITION VISUAL ─────────────────────────

function NutritionVisual() {
  return (
    <div style={{ width: '85%', maxWidth: '440px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ color: '#fff', fontSize: '11px', opacity: 0.6, fontWeight: 700, letterSpacing: '0.5px' }}>
        TODAY · DAILY MACROS
      </div>

      {/* Big calorie ring */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        border: `1px solid rgba(255,255,255,0.1)`,
        borderRadius: '8px',
        padding: '20px',
        display: 'flex',
        gap: '20px',
        alignItems: 'center',
      }}>
        <div style={{ position: 'relative', width: '110px', height: '110px', flexShrink: 0 }}>
          <svg viewBox="0 0 110 110" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="55" cy="55" r="46" stroke="rgba(255,255,255,0.1)" strokeWidth="11" fill="none" />
            <circle cx="55" cy="55" r="46" stroke={ORANGE} strokeWidth="11" strokeDasharray="195 290" fill="none" strokeLinecap="round" className="ph-calorie-ring" />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', color: '#fff',
          }}>
            <div style={{ fontSize: '9px', opacity: 0.6, fontWeight: 700, letterSpacing: '0.5px' }}>KCAL</div>
            <div style={{ fontSize: '24px', fontWeight: 800, lineHeight: 1 }}>1,620</div>
            <div style={{ fontSize: '9px', opacity: 0.6 }}>of 2,400</div>
          </div>
        </div>
        <div style={{ flex: 1, color: '#fff' }}>
          <NutMacro label="Protein" value="82g" target="120g" pct={68} color="#FC4C02" />
          <NutMacro label="Carbs" value="195g" target="300g" pct={65} color="#f97316" />
          <NutMacro label="Fat" value="48g" target="65g" pct={74} color="#fbbf24" />
        </div>
      </div>

      {/* Meal log entries */}
      <div style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid rgba(255,255,255,0.1)`, borderRadius: '8px', padding: '14px' }}>
        {[
          { meal: 'Breakfast', items: 'Oats + banana', kcal: 420 },
          { meal: 'Lunch', items: 'Rice + dal + chicken', kcal: 680 },
          { meal: 'Snack', items: 'Greek yogurt', kcal: 220 },
        ].map((m, i, arr) => (
          <div key={i} style={{
            padding: '8px 0',
            borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            display: 'flex',
            justifyContent: 'space-between',
            color: '#fff',
            fontSize: '12px',
          }}>
            <div>
              <div style={{ fontWeight: 700 }}>{m.meal}</div>
              <div style={{ fontSize: '10px', opacity: 0.6 }}>{m.items}</div>
            </div>
            <div style={{ fontWeight: 700, color: ORANGE }}>{m.kcal} kcal</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NutMacro({ label, value, target, pct, color }) {
  return (
    <div style={{ marginBottom: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', marginBottom: '4px' }}>
        <span style={{ fontWeight: 700, opacity: 0.85 }}>{label}</span>
        <span style={{ opacity: 0.6 }}>
          <span style={{ fontWeight: 700, opacity: 1 }}>{value}</span> / {target}
        </span>
      </div>
      <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width 0.6s ease' }} />
      </div>
    </div>
  )
}

// ─── FORM SCORE VISUAL (Feature 01) — shows the OUTPUT score with grade ───

function FormScoreVisual() {
  return (
    <div style={{ width: '85%', maxWidth: '440px', textAlign: 'center', color: '#fff' }}>
      <div style={{ fontSize: '11px', opacity: 0.6, fontWeight: 700, letterSpacing: '0.5px', marginBottom: '10px' }}>
        AFTER YOUR LAST REP
      </div>

      {/* Big score with grade */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
        <svg viewBox="0 0 200 200" style={{ width: '200px', height: '200px', transform: 'rotate(-90deg)' }}>
          <circle cx="100" cy="100" r="86" stroke="rgba(255,255,255,0.1)" strokeWidth="14" fill="none" />
          <circle cx="100" cy="100" r="86" stroke={ORANGE} strokeWidth="14" fill="none"
            strokeLinecap="round" strokeDasharray="470 540" />
        </svg>
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: '64px', fontWeight: 800, color: ORANGE, lineHeight: 1 }}>87</div>
          <div style={{ fontSize: '13px', opacity: 0.7, fontWeight: 700, letterSpacing: '0.5px', marginTop: '2px' }}>OUT OF 100</div>
        </div>
      </div>

      {/* Sub-scores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        <SubScore label="Joint Angles" value="92" color={ORANGE} />
        <SubScore label="Symmetry" value="84" color="#f97316" />
        <SubScore label="Tempo" value="86" color="#fbbf24" />
      </div>

      <div style={{ marginTop: '20px', fontSize: '12px', opacity: 0.6, fontStyle: 'italic' }}>
        Grade <span style={{ color: ORANGE, fontWeight: 800 }}>A−</span> · Personal best
      </div>
    </div>
  )
}

function SubScore({ label, value, color }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', padding: '12px 8px' }}>
      <div style={{ fontSize: '20px', fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '9px', opacity: 0.7, fontWeight: 700, letterSpacing: '0.3px', marginTop: '4px' }}>
        {label.toUpperCase()}
      </div>
    </div>
  )
}

// ─── HEART RATE CAMERA VISUAL (Feature 02) — shows face/skin context for rPPG ───

function HeartRateCameraVisual() {
  return (
    <div style={{ width: '80%', maxWidth: '420px' }}>
      {/* Phone-camera-pointing-at-face mockup */}
      <div style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '16px',
        marginBottom: '14px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ color: ORANGE, fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px' }}>
            <span className="ph-rec-dot">●</span> SCANNING SKIN
          </span>
          <span style={{ color: '#fff', fontSize: '10px', opacity: 0.6, fontFamily: 'monospace' }}>FACE LOCKED</span>
        </div>

        {/* SVG: athlete face with rPPG scanning regions */}
        <svg viewBox="0 0 280 200" style={{ width: '100%', height: '180px' }}>
          {/* Face outline (simplified) */}
          <ellipse cx="140" cy="105" rx="60" ry="78" stroke="#fff" strokeWidth="2" fill="rgba(252, 76, 2, 0.04)" strokeOpacity="0.4" />
          {/* Hair line */}
          <path d="M 80 80 Q 100 50 140 48 Q 180 50 200 80" stroke="#fff" strokeWidth="2" fill="none" strokeOpacity="0.4" />
          {/* Eyes */}
          <circle cx="120" cy="100" r="3" fill="#fff" opacity="0.5" />
          <circle cx="160" cy="100" r="3" fill="#fff" opacity="0.5" />
          {/* Nose */}
          <path d="M 140 110 L 138 125 L 142 130" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.4" />
          {/* Mouth */}
          <path d="M 128 145 Q 140 150 152 145" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.4" />
          {/* rPPG SCAN REGIONS — pulsing orange overlays on cheeks + forehead */}
          <ellipse cx="105" cy="115" rx="14" ry="10" fill={ORANGE} opacity="0.4" className="ph-heart-beat" />
          <ellipse cx="175" cy="115" rx="14" ry="10" fill={ORANGE} opacity="0.4" className="ph-heart-beat" />
          <ellipse cx="140" cy="75" rx="22" ry="8" fill={ORANGE} opacity="0.3" className="ph-heart-beat" />
          {/* Region labels */}
          <text x="78" y="110" fontSize="8" fontFamily="monospace" fill={ORANGE}>L cheek</text>
          <text x="195" y="110" fontSize="8" fontFamily="monospace" fill={ORANGE}>R cheek</text>
          <text x="115" y="68" fontSize="8" fontFamily="monospace" fill={ORANGE}>forehead</text>
          {/* Camera viewfinder corners */}
          <g stroke={ORANGE} strokeWidth="2" fill="none">
            <path d="M 20 30 L 20 14 L 36 14" />
            <path d="M 260 30 L 260 14 L 244 14" />
            <path d="M 20 170 L 20 186 L 36 186" />
            <path d="M 260 170 L 260 186 L 244 186" />
          </g>
        </svg>
      </div>

      {/* BPM readout */}
      <div style={{
        background: ORANGE,
        color: '#fff',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '11px', opacity: 0.85, fontWeight: 700, letterSpacing: '0.5px' }}>
          rPPG · CAMERA-BASED
        </div>
        <div className="ph-heart-beat" style={{ fontSize: '64px', fontWeight: 800, lineHeight: 1, marginTop: '4px' }}>
          142 <span style={{ fontSize: '20px', opacity: 0.85 }}>bpm</span>
        </div>
        <svg viewBox="0 0 400 50" style={{ width: '100%', height: '40px', marginTop: '8px' }}>
          <polyline className="ph-ecg-draw"
            points="0,25 50,25 60,8 70,42 80,25 130,25 140,3 150,47 160,25 210,25 220,5 230,45 240,25 290,25 300,8 310,42 320,25 400,25"
            stroke="#fff" strokeWidth="2.5" fill="none" />
        </svg>
      </div>
    </div>
  )
}

// ─── SESSION REVIEW VISUAL (Feature 04) — POST-SESSION video player, distinct from live recording ───

function SessionReviewVisual() {
  return (
    <div style={{ width: '85%', maxWidth: '460px' }}>
      {/* Video player frame (paused on a worst-rep moment) */}
      <div style={{
        background: '#000',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
      }}>
        {/* Top bar with rep + grade */}
        <div style={{
          background: 'rgba(0,0,0,0.7)',
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <span style={{ color: '#fff', fontSize: '10px', opacity: 0.6, fontWeight: 700, letterSpacing: '0.3px' }}>
              REP 7 OF 12 · WORST FORM
            </span>
          </div>
          <span style={{
            background: '#ef4444',
            color: '#fff',
            padding: '3px 10px',
            borderRadius: '50px',
            fontSize: '9px',
            fontWeight: 800,
            letterSpacing: '0.5px',
          }}>
            FORM 62
          </span>
        </div>

        {/* Paused frame area with skeleton overlay */}
        <div style={{
          height: '240px',
          background: 'linear-gradient(180deg, rgba(252, 76, 2, 0.08) 0%, rgba(0, 0, 0, 0.95) 100%)',
          position: 'relative',
        }}>
          <svg viewBox="0 0 400 240" style={{ width: '100%', height: '100%' }}>
            {/* Athlete silhouette (paused mid-rep) */}
            <g stroke={ORANGE} strokeWidth="2.5" fill="none" strokeLinecap="round">
              <circle cx="200" cy="40" r="14" />
              <line x1="200" y1="54" x2="200" y2="120" />
              <line x1="200" y1="80" x2="160" y2="100" />
              <line x1="160" y1="100" x2="135" y2="135" />
              <line x1="200" y1="80" x2="240" y2="100" />
              <line x1="240" y1="100" x2="265" y2="135" />
              {/* legs - knee buckled inward (bad form) */}
              <line x1="200" y1="120" x2="180" y2="170" stroke="#ef4444" strokeWidth="3" />
              <line x1="180" y1="170" x2="170" y2="220" stroke="#ef4444" strokeWidth="3" />
              <line x1="200" y1="120" x2="225" y2="175" />
              <line x1="225" y1="175" x2="230" y2="220" />
            </g>
            {/* Joint dots */}
            <g fill={ORANGE}>
              <circle cx="200" cy="40" r="4" />
              <circle cx="200" cy="80" r="4" />
              <circle cx="200" cy="120" r="4" />
              <circle cx="225" cy="175" r="4" />
            </g>
            <g fill="#ef4444">
              <circle cx="180" cy="170" r="6" />
            </g>
            {/* Red flag pointing to bad knee */}
            <line x1="180" y1="170" x2="100" y2="155" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="20" y="155" fontSize="11" fontFamily="monospace" fill="#ef4444">⚠ KNEE 62°</text>
          </svg>

          {/* Big play button overlay (paused state) */}
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: '#000',
              boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            }}>
              ▶
            </div>
          </div>
        </div>

        {/* Scrubber bar */}
        <div style={{ background: 'rgba(0,0,0,0.85)', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ color: '#fff', fontSize: '10px', opacity: 0.6, fontFamily: 'monospace' }}>02:14</span>
            <div style={{ flex: 1, height: '4px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', position: 'relative' }}>
              <div className="ph-replay-progress" style={{ position: 'absolute', left: 0, top: 0, height: '100%', background: ORANGE, borderRadius: '2px' }} />
              <div className="ph-replay-scrubber" style={{ position: 'absolute', top: '-3px', width: '10px', height: '10px', background: ORANGE, borderRadius: '50%', marginLeft: '-5px' }} />
            </div>
            <span style={{ color: '#fff', fontSize: '10px', opacity: 0.6, fontFamily: 'monospace' }}>04:12</span>
          </div>
          {/* Thumbnail strip — best/worst reps */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px' }}>
            {[
              { score: 88, ok: true },
              { score: 85, ok: true },
              { score: 79, ok: true },
              { score: 62, ok: false },  // worst — highlighted
              { score: 81, ok: true },
              { score: 87, ok: true },
            ].map((r, i) => (
              <div key={i} style={{
                aspectRatio: '1',
                background: r.ok ? 'rgba(255,255,255,0.05)' : 'rgba(239, 68, 68, 0.2)',
                border: r.ok ? '1px solid rgba(255,255,255,0.1)' : '2px solid #ef4444',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                fontWeight: 800,
                color: r.ok ? '#fff' : '#ef4444',
              }}>
                {r.score}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
