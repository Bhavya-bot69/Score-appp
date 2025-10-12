
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/LandingPage.css";

function HowItWorksPage() {
  const navigate = useNavigate();
  const { themeName, toggleTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`landing-page ${themeName}`}>
      <nav className="landing-nav">
        <div className="nav-container">
          <div className="logo" onClick={() => navigate("/")} style={{ cursor: 'pointer' }}>
            <h2>Score App</h2>
          </div>

          <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
            <li><a href="/">Home</a></li>
            <li><a href="/how-it-works">How It Works</a></li>
            <li><a href="/features">Features</a></li>
            <li><a href="/algorithm">Algorithm</a></li>
          </ul>
          <div className="nav-actions">
            <div className="theme-toggles">
              <button className={`theme-btn ${themeName === 'light' ? 'active' : ''}`} onClick={() => toggleTheme("light")}>Light</button>
              <button className={`theme-btn ${themeName === 'dark' ? 'active' : ''}`} onClick={() => toggleTheme("dark")}>Dark</button>
              <button className={`theme-btn ${themeName === 'event' ? 'active' : ''}`} onClick={() => toggleTheme("event")}>Event</button>
            </div>
            <button className="login-btn" onClick={() => navigate("/login")}>Login</button>
          </div>
          <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>
        </div>
      </nav>

      <section className="page-hero">
        <div className="page-hero-content">
          <h1>How It Works</h1>
          <p>A simple, powerful workflow designed for event organizers and judges</p>
        </div>
      </section>

      <section className="page-content-section">
        <div className="section-container-full">
          <div className="workflow-steps">
            <div className="workflow-card">
              <div className="workflow-number">1</div>
              <div className="workflow-content">
                <h3>Create Your Event</h3>
                <p>Set up your competition in minutes. Configure the number of teams, judges, scoring categories, and evaluation criteria.</p>
                <ul className="workflow-checklist">
                  <li><span className="check">✓</span> Define team names and participants</li>
                  <li><span className="check">✓</span> Assign judges to specific rounds or venues</li>
                  <li><span className="check">✓</span> Set scoring criteria and weights</li>
                  <li><span className="check">✓</span> Configure promotion rules</li>
                </ul>
              </div>
            </div>

            <div className="workflow-card">
              <div className="workflow-number">2</div>
              <div className="workflow-content">
                <h3>Judges Evaluate</h3>
                <p>Judges receive secure links to access their evaluation dashboard. They can score teams from any device.</p>
                <ul className="workflow-checklist">
                  <li><span className="check">✓</span> Mobile-friendly judging interface</li>
                  <li><span className="check">✓</span> Real-time score submission</li>
                  <li><span className="check">✓</span> Offline mode with sync capability</li>
                  <li><span className="check">✓</span> Progress tracking per judge</li>
                </ul>
              </div>
            </div>

            <div className="workflow-card">
              <div className="workflow-number">3</div>
              <div className="workflow-content">
                <h3>Automatic Normalization</h3>
                <p>Our Z-score algorithm automatically corrects for judge bias, ensuring fair comparisons across all evaluations.</p>
                <ul className="workflow-checklist">
                  <li><span className="check">✓</span> Statistical bias correction</li>
                  <li><span className="check">✓</span> Percentile ranking calculation</li>
                  <li><span className="check">✓</span> Cross-judge score normalization</li>
                  <li><span className="check">✓</span> Transparent methodology</li>
                </ul>
              </div>
            </div>

            <div className="workflow-card">
              <div className="workflow-number">4</div>
              <div className="workflow-content">
                <h3>View & Export Results</h3>
                <p>Access comprehensive dashboards with analytics, rankings, and detailed breakdowns. Export in multiple formats.</p>
                <ul className="workflow-checklist">
                  <li><span className="check">✓</span> Live results dashboard</li>
                  <li><span className="check">✓</span> CSV and PDF exports</li>
                  <li><span className="check">✓</span> Public result sharing links</li>
                  <li><span className="check">✓</span> Historical audit trail</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="user-workflows">
            <h2 className="workflows-title">User Workflows</h2>
            <div className="user-workflows-grid">
              <div className="user-workflow-card">
                <h3>Admin</h3>
                <ul className="user-workflow-list">
                  <li>Create event and configure settings</li>
                  <li>Add teams, judges, and categories</li>
                  <li>Assign judges to evaluation rounds</li>
                  <li>Monitor scoring progress in real-time</li>
                  <li>Review and approve final results</li>
                  <li>Export results for distribution</li>
                </ul>
              </div>
              <div className="user-workflow-card">
                <h3>Judge</h3>
                <ul className="user-workflow-list">
                  <li>Access event via secure token link</li>
                  <li>View assigned teams and criteria</li>
                  <li>Submit scores for each category</li>
                  <li>Add optional comments and feedback</li>
                  <li>Review submission history</li>
                  <li>Track evaluation progress</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="section-cta">
            <h2>Ready to Get Started?</h2>
            <p>Try Score App for your next event</p>
            <button className="cta-large" onClick={() => navigate("/login")}>Start Free Demo</button>
          </div>
          
        </div>
      </section>
    </div>
  );
}

export default HowItWorksPage;