// 1. Add 'useState' to the import list from 'react'
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  const { themeName, toggleTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`landing-page ${themeName}`}>
      <nav className="landing-nav">
        <div className="nav-container-wide">
          <div className="logo">
            <h2>Score App</h2>
          </div>
          <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
            <li><a href="/how-it-works">How It Works</a></li>
            <li><a href="/features">Features</a></li>
            <li><a href="/algorithm">Algorithm</a></li>
            <li><a href="#contact">Contact</a></li>
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

      <section className="hero-section-large">
        <div className="hero-content-wide">
          <h1>Fair, Accurate Event Judging Software</h1>
          <p className="hero-subtitle-large">
            Transform your hackathons, competitions, and events with real-time scoring,
            percentile ranking, and advanced judge bias correction
          </p>
          <div className="hero-cta">
            <button className="cta-primary" onClick={() => navigate("/login")}>Get Started</button>
            <button className="cta-secondary" onClick={() => navigate("/how-it-works")}>Learn More</button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <h3>100%</h3>
              <p>Fair Scoring</p>
            </div>
            <div className="stat-item">
              <h3>Real-time</h3>
              <p>Results</p>
            </div>
            <div className="stat-item">
              <h3>Zero</h3>
              <p>Bias</p>
            </div>
          </div>
        </div>
      </section>

      <section className="home-preview-section">
        <div className="preview-container-wide">
          <h2 className="preview-title">How It Works</h2>
          <p className="preview-subtitle">Simple workflow for fair event judging</p>
          <div className="preview-grid">
            <div className="preview-card">
              <div className="preview-number">1</div>
              <h3>Create Event</h3>
              <p>Set up your competition in minutes</p>
            </div>
            <div className="preview-card">
              <div className="preview-number">2</div>
              <h3>Judges Evaluate</h3>
              <p>Real-time scoring from any device</p>
            </div>
            <div className="preview-card">
              <div className="preview-number">3</div>
              <h3>Auto Normalize</h3>
              <p>Fair comparison across all judges</p>
            </div>
            <div className="preview-card">
              <div className="preview-number">4</div>
              <h3>Export Results</h3>
              <p>Comprehensive analytics and reports</p>
            </div>
          </div>
          <button className="learn-more-btn" onClick={() => navigate("/how-it-works")}>Learn More</button>
        </div>
      </section>

      <section className="home-preview-section-alt">
        <div className="preview-container-wide">
          <h2 className="preview-title">Complete Feature Set</h2>
          <p className="preview-subtitle">Everything you need for professional event judging</p>
          <div className="preview-features-grid">
            <div className="preview-feature">
              <h4>Real-Time Scoring</h4>
              <p>Instant score submission and updates</p>
            </div>
            <div className="preview-feature">
              <h4>Z-Score Normalization</h4>
              <p>Automatic bias correction</p>
            </div>
            <div className="preview-feature">
              <h4>Multi-Judge Support</h4>
              <p>Flexible assignment and tracking</p>
            </div>
            <div className="preview-feature">
              <h4>Export & Reports</h4>
              <p>CSV, PDF, and analytics</p>
            </div>
            <div className="preview-feature">
              <h4>Audit Trail</h4>
              <p>Complete transparency</p>
            </div>
            <div className="preview-feature">
              <h4>Mobile Friendly</h4>
              <p>Works on all devices</p>
            </div>
          </div>
          <button className="learn-more-btn" onClick={() => navigate("/features")}>Learn More</button>
        </div>
      </section>

      <section className="home-preview-section">
        <div className="preview-container-wide">
          <h2 className="preview-title">Our Scoring Algorithm</h2>
          <p className="preview-subtitle">Fair comparisons through Z-Score normalization</p>
          <div className="algorithm-preview">
            <div className="algorithm-preview-content">
              <h3>Why Z-Score?</h3>
              <p>Different judges have different scoring patterns. Our algorithm corrects for judge bias by standardizing scores based on each judge's mean and standard deviation.</p>
              <div className="algorithm-benefits-preview">
                <div className="benefit-preview">Eliminates judge bias</div>
                <div className="benefit-preview">Statistically validated</div>
                <div className="benefit-preview">Transparent methodology</div>
              </div>
            </div>
          </div>
          <button className="learn-more-btn" onClick={() => navigate("/algorithm")}>Learn More</button>
        </div>
      </section>

      <section className="use-cases-section-home">
        <div className="preview-container-wide">
          <h2 className="preview-title">Perfect for All Types of Events</h2>
          <div className="use-cases-grid-home">
            <div className="use-case-card-home">
              <h3>Hackathons</h3>
              <p>Tech competitions with multiple judges and categories</p>
            </div>
            <div className="use-case-card-home">
              <h3>School Competitions</h3>
              <p>Science fairs and academic challenges</p>
            </div>
            <div className="use-case-card-home">
              <h3>Startup Pitches</h3>
              <p>Investor competitions with panel judging</p>
            </div>
            <div className="use-case-card-home">
              <h3>Corporate Innovation</h3>
              <p>Internal challenges and employee competitions</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="cta-section-home">
        <div className="cta-content-home">
          <h2>Ready to Transform Your Events?</h2>
          <p>Join event organizers who trust Score App for fair, accurate, and professional judging</p>
          <button className="cta-large" onClick={() => navigate("/login")}>Get Started Now</button>
          <p className="cta-note">No credit card required • Setup in minutes</p>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-container-wide">
          <div className="footer-column">
            <h4>Score App</h4>
            <p>Fair, accurate event judging software for hackathons, competitions, and educational events.</p>
          </div>

          <div className="footer-column">
            <h4>Product</h4>
            <ul>
              <li><a href="/features">Features</a></li>
              <li><a href="/how-it-works">How It Works</a></li>
              <li><a href="/algorithm">Algorithm</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#contact">Documentation</a></li>
              <li><a href="#contact">Support</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Contact</h4>
            <p>Email: info@scoreapp.com</p>
            <p>For demos and inquiries</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 Score App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;