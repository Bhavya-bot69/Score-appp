import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/LandingPage.css";

function FeaturesPage() {
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
          <h1>Complete Feature Set</h1>
          <p>Everything you need to run fair, transparent, and professional event judging</p>
        </div>
      </section>

      <section className="page-content-section">
        <div className="section-container-full">
          <div className="features-category">
            <h3 className="category-title">Scoring & Evaluation</h3>
            <div className="features-grid-compact">
              <div className="feature-card-compact">
                <h4>Multi-Category Scoring</h4>
                <p>Define custom scoring categories with individual weights and criteria.</p>
              </div>
              <div className="feature-card-compact">
                <h4>Real-Time Updates</h4>
                <p>Scores sync instantly across all devices as judges submit evaluations.</p>
              </div>
              <div className="feature-card-compact">
                <h4>Offline Mode</h4>
                <p>Judges can score offline and sync when connection is restored.</p>
              </div>
              <div className="feature-card-compact">
                <h4>Score Validation</h4>
                <p>Automatic validation prevents invalid entries and ensures data quality.</p>
              </div>
            </div>
          </div>

          <div className="features-category">
            <h3 className="category-title">Fairness & Transparency</h3>
            <div className="features-grid-compact">
              <div className="feature-card-compact">
                <h4>Z-Score Normalization</h4>
                <p>Statistical algorithm corrects for judge bias and scoring patterns.</p>
              </div>
              <div className="feature-card-compact">
                <h4>Percentile Rankings</h4>
                <p>Shows how each team performs relative to all other participants.</p>
              </div>
              <div className="feature-card-compact">
                <h4>Audit Trail</h4>
                <p>Complete history of all actions with timestamps and user tracking.</p>
              </div>
              <div className="feature-card-compact">
                <h4>Manual Override Controls</h4>
                <p>Admins can adjust scores with full documentation of changes.</p>
              </div>
            </div>
          </div>

          <div className="features-category">
            <h3 className="category-title">Judge Management</h3>
            <div className="features-grid-compact">
              <div className="feature-card-compact">
                <h4>Secure Token Links</h4>
                <p>Unique access tokens for each judge without password requirements.</p>
              </div>
              <div className="feature-card-compact">
                <h4>Round-Based Assignment</h4>
                <p>Assign judges to specific rounds, venues, or team categories.</p>
              </div>
              <div className="feature-card-compact">
                <h4>Progress Tracking</h4>
                <p>Monitor which judges have completed their evaluations in real-time.</p>
              </div>
              <div className="feature-card-compact">
                <h4>Judge Analytics</h4>
                <p>View judge scoring patterns and consistency metrics.</p>
              </div>
            </div>
          </div>

          <div className="features-category">
            <h3 className="category-title">Results & Reporting</h3>
            <div className="features-grid-compact">
              <div className="feature-card-compact">
                <h4>Live Dashboard</h4>
                <p>Real-time leaderboard with filtering and search capabilities.</p>
              </div>
              <div className="feature-card-compact">
                <h4>CSV Export</h4>
                <p>Download complete results data for further analysis.</p>
              </div>
              <div className="feature-card-compact">
                <h4>PDF Reports</h4>
                <p>Generate professional result documents with branding.</p>
              </div>
              <div className="feature-card-compact">
                <h4>Public Result Links</h4>
                <p>Share results via secure links with customizable visibility.</p>
              </div>
            </div>
          </div>

          <div className="features-category">
            <h3 className="category-title">Event Configuration</h3>
            <div className="features-grid-compact">
              <div className="feature-card-compact">
                <h4>Multiple Rounds</h4>
                <p>Support for preliminary, semifinal, and final round structures.</p>
              </div>
              <div className="feature-card-compact">
                <h4>Team Promotion Logic</h4>
                <p>Automatically advance top N teams to next round based on scores.</p>
              </div>
              <div className="feature-card-compact">
                <h4>Venue Management</h4>
                <p>Organize teams and judges across multiple physical or virtual venues.</p>
              </div>
              <div className="feature-card-compact">
                <h4>Custom Categories</h4>
                <p>Create unlimited custom scoring categories with descriptions.</p>
              </div>
            </div>
          </div>

          <div className="features-category">
            <h3 className="category-title">Analytics & Insights</h3>
            <div className="features-grid-compact">
              <div className="feature-card-compact">
                <h4>Score Distribution Charts</h4>
                <p>Visualize score patterns across teams and Z-score zones.</p>
              </div>
              <div className="feature-card-compact">
                <h4>Statistical Metrics</h4>
                <p>Mean, median, standard deviation, and Z-score calculations.</p>
              </div>
              <div className="feature-card-compact">
                <h4>Judge Comparison</h4>
                <p>Compare scoring patterns between different judges.</p>
              </div>
              <div className="feature-card-compact">
                <h4>Historical Data</h4>
                <p>Access past event data for trend analysis and insights.</p>
              </div>
            </div>
          </div>

          <div className="features-cta">
            <h2>Experience All Features</h2>
            <p>Try Score App with your event today</p>
            <div className="features-buttons">
              <button className="cta-large" onClick={() => navigate("/login")}>Start Demo</button>
              <button className="cta-secondary-large" onClick={() => navigate("/algorithm")}>Learn About Our Algorithm</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FeaturesPage;
