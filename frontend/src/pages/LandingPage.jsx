import './LandingPage.css'
import {
  ShieldCheck,
  Server,
  Activity,
  Lock,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Shield,
  Globe,
} from 'lucide-react'

export default function LandingPage({ onOpenLogin, onOpenRegister }) {
  return (
    <div className="landing-shell">
      {/* NAVIGATION */}
      <header className="landing-nav">
        <a className="landing-brand" href="/" aria-label="NetScope home">
          <div className="landing-brand-icon">
            <Shield size={20} />
          </div>
          <span>NETSCOPE</span>
        </a>

        <nav className="landing-nav-links" aria-label="Main navigation">
          <a className="landing-nav-link" href="#capabilities">Capabilities</a>
          <a className="landing-nav-link" href="#authorization">Physical Proof</a>
          <a className="landing-nav-link" href="#workflow">Workflow</a>
          <a className="landing-nav-link" href="#metrics">Platform Stats</a>
        </nav>

        <div className="landing-nav-actions">
          <button
            className="landing-btn-secondary"
            type="button"
            style={{ padding: '8px 18px', fontSize: '0.86rem' }}
            onClick={onOpenLogin}
          >
            Sign In
          </button>
          <button
            className="landing-btn-primary"
            type="button"
            style={{ padding: '8px 20px', fontSize: '0.86rem' }}
            onClick={onOpenRegister}
          >
            Get Started
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-badge">
            <span className="landing-badge-dot" />
            <span>Zero-Trust Network Perimeter & Security Auditing</span>
          </div>

          <h1>
            Continuous Reconnaissance with <span className="landing-gradient-text">Physical Ownership Verification</span>
          </h1>

          <p>
            NetScope enables infrastructure teams to inventory assets, detect vulnerabilities,
            and enforce cryptographically verified physical possession before auditing private internal systems.
          </p>

          <div className="landing-cta-group">
            <button className="landing-btn-primary" type="button" onClick={onOpenRegister}>
              Start Monitoring Free <ArrowRight size={17} />
            </button>
            <button className="landing-btn-secondary" type="button" onClick={onOpenLogin}>
              Access Console
            </button>
          </div>

          <div className="landing-hero-points">
            <span><CheckCircle2 size={15} style={{ color: 'var(--green)' }} /> Zero-Trust Access Control</span>
            <span><CheckCircle2 size={15} style={{ color: 'var(--green)' }} /> Strict Physical Proof Gates</span>
            <span><CheckCircle2 size={15} style={{ color: 'var(--green)' }} /> Automated Vulnerability Telemetry</span>
          </div>
        </div>

        {/* HERO TERMINAL CARD PREVIEW */}
        <div className="landing-preview-card">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="terminal-dot dot-red" />
              <span className="terminal-dot dot-yellow" />
              <span className="terminal-dot dot-green" />
            </div>
            <span className="terminal-title">netscope-audit-daemon v2.4</span>
            <Terminal size={15} style={{ color: 'var(--text-muted)' }} />
          </div>

          <div className="terminal-body">
            <div className="terminal-row">
              <span className="terminal-label">Target Perimeter:</span>
              <span className="terminal-val">https://internal.datacenter-alpha.net</span>
            </div>

            <div className="terminal-row">
              <span className="terminal-label">Asset Classification:</span>
              <span className="terminal-val" style={{ color: 'var(--yellow)' }}>🔒 Private Web Gateway</span>
            </div>

            <div className="terminal-row">
              <span className="terminal-label">Physical Possession Proof:</span>
              <span className="terminal-val" style={{ color: 'var(--green)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <ShieldCheck size={14} /> Verified by Admin
              </span>
            </div>

            <div className="terminal-row">
              <span className="terminal-label">Audit Engine Status:</span>
              <span className="terminal-val" style={{ color: 'var(--blue-hover)' }}>Scan Execution Completed</span>
            </div>

            <div className="terminal-log-stream">
              <div className="terminal-log-line">
                <span className="log-time">21:30:14</span>
                <span className="log-tag tag-lock">GATE</span>
                <span>Physical lease & hardware access proof verified.</span>
              </div>
              <div className="terminal-log-line">
                <span className="log-time">21:30:15</span>
                <span className="log-tag tag-auth">PERMIT</span>
                <span>Authorization granted by sec-admin@netscope.io.</span>
              </div>
              <div className="terminal-log-line">
                <span className="log-time">21:30:18</span>
                <span className="log-tag tag-scan">AUDIT</span>
                <span>Port 443 (TLS 1.3 OK), Port 80 (Redirected 301). Latency 18ms.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS COUNTER STRIP */}
      <section className="landing-stats-strip" id="metrics">
        <div className="landing-stats-grid">
          <div className="landing-stat-item">
            <span className="landing-stat-number">100%</span>
            <span className="landing-stat-label">Physical Proof Enforcement</span>
          </div>
          <div className="landing-stat-item">
            <span className="landing-stat-number">&lt; 20ms</span>
            <span className="landing-stat-label">Average Port Probing Latency</span>
          </div>
          <div className="landing-stat-item">
            <span className="landing-stat-number">Zero</span>
            <span className="landing-stat-label">Unauthorized Private Scans Permitted</span>
          </div>
          <div className="landing-stat-item">
            <span className="landing-stat-number">24 / 7</span>
            <span className="landing-stat-label">Autonomous Network Health Monitoring</span>
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES */}
      <section className="landing-section" id="capabilities">
        <div className="landing-section-header">
          <span className="landing-badge">Engineered for Security</span>
          <h2>Enterprise Capabilities Without Complexity</h2>
          <p>
            NetScope bridges external attack surface discovery with strict physical proof verification,
            ensuring your team scans only the assets you truly own and control.
          </p>
        </div>

        <div className="landing-features-grid">
          <article className="landing-feature-card">
            <div className="feature-icon-wrapper feature-icon-yellow">
              <ShieldCheck size={22} />
            </div>
            <h3>Physical Ownership Gates</h3>
            <p>
              Private intranet portals and confidential gateways are locked by default. Scanning requires submitting tangible physical possession proof approved by an administrator.
            </p>
          </article>

          <article className="landing-feature-card">
            <div className="feature-icon-wrapper">
              <Server size={22} />
            </div>
            <h3>Multi-Asset Inventory</h3>
            <p>
              Catalog public endpoints, internal servers, network appliances, and workstations in a unified management dashboard with instant ownership assignments.
            </p>
          </article>

          <article className="landing-feature-card">
            <div className="feature-icon-wrapper feature-icon-green">
              <Activity size={22} />
            </div>
            <h3>Live Vulnerability Audits</h3>
            <p>
              Trigger instant reconnaissance scans across open ports, TLS configurations, and response latencies with granular JSON log outputs.
            </p>
          </article>

          <article className="landing-feature-card">
            <div className="feature-icon-wrapper">
              <Lock size={22} />
            </div>
            <h3>Dual-Tier Governance</h3>
            <p>
              Complete separation of privileges between administrators who review proof documents and standard users who audit their assigned infrastructure.
            </p>
          </article>
        </div>
      </section>

      {/* WORKFLOW PIPELINE */}
      <section className="landing-section" id="workflow" style={{ paddingTop: '20px' }}>
        <div className="landing-section-header">
          <span className="landing-badge">Seamless Protocol</span>
          <h2>How Verification Works in 3 Steps</h2>
          <p>
            From asset registration to verifiable scanning, our protocol protects against rogue targeting while enabling authorized diagnostics.
          </p>
        </div>

        <div className="landing-workflow-grid">
          <div className="workflow-card">
            <span className="workflow-number">STEP 01</span>
            <h3>Register Your Target</h3>
            <p>
              Add public domains, servers, or private internal pages to your workspace inventory. Mark confidential assets as private targets.
            </p>
          </div>

          <div className="workflow-card">
            <span className="workflow-number">STEP 02</span>
            <h3>Submit Physical Proof</h3>
            <p>
              For private pages, attach proof of physical possession (server rack verification, hardware invoice, or site lease). Private scans remain locked until approval.
            </p>
          </div>

          <div className="workflow-card">
            <span className="workflow-number">STEP 03</span>
            <h3>Admin Approval & Auditing</h3>
            <p>
              Administrators review and accept verification documents. Once approved, run deep security assessments and inspect telemetry directly in your console.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION BANNER */}
      <section className="landing-cta-banner">
        <div className="landing-cta-banner-text">
          <h2>Ready to Audit Your Perimeter with NetScope?</h2>
          <p>
            Experience precision reconnaissance, strict verification gates, and full visibility across your infrastructure.
          </p>
        </div>
        <button className="landing-btn-primary" type="button" onClick={onOpenRegister}>
          Create Free Account <ArrowRight size={17} />
        </button>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="landing-brand-icon" style={{ width: '28px', height: '28px' }}>
              <Shield size={16} />
            </div>
            <span style={{ fontWeight: 700, letterSpacing: '0.5px' }}>NETSCOPE SECURITY</span>
          </div>

          <p>&copy; {new Date().getFullYear()} NetScope Network Intelligence Platform. All rights reserved.</p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Globe size={14} /> Zero-Trust Verified
            </span>
            <button
              type="button"
              onClick={onOpenLogin}
              style={{ background: 'transparent', border: 'none', color: 'var(--blue-hover)', cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline' }}
            >
              Sign In
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
