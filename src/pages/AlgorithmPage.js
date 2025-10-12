
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/LandingPage.css";

function AlgorithmPage() {
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
          <h1>Our Scoring Algorithm</h1>
          <p>Understanding Z-Score Normalization for Fair Judge Comparisons</p>
        </div>
      </section>

      <section className="page-content-section">
        <div className="section-container-full">
          <div className="algorithm-card">
            <h3 className="algorithm-card-title">The Problem: Judge Bias</h3>
            <p className="algorithm-card-text">
              Different judges naturally have different scoring tendencies. Some judges may be generous and give high scores, while others may be stricter and give lower scores. This creates unfairness when comparing teams evaluated by different judges.
            </p>
            <div className="algorithm-example-box">
              <h4>Example Problem:</h4>
              <p>Judge A rates Team X: 85/100 (Judge A is strict, rarely gives above 85)</p>
              <p>Judge B rates Team Y: 85/100 (Judge B is generous, frequently gives 90+)</p>
              <p className="highlight-text">Who performed better? Raw scores say they're equal, but context suggests Team X performed better!</p>
            </div>
          </div>

          <div className="algorithm-card">
            <h3 className="algorithm-card-title">The Solution: Z-Score Normalization</h3>
            <p className="algorithm-card-text">
              Z-score normalization adjusts scores based on each judge's scoring pattern. It answers the question: "How does this team's score compare to the judge's average scoring behavior?"
            </p>
            <div className="algorithm-formula-box">
              <h4>The Formula:</h4>
              <p className="algorithm-card-text" style={{ fontStyle: 'italic', marginBottom: '24px' }}>
                The Z-score is calculated based on the mean and standard deviation of all scores given by a specific judge, not across all teams. This normalizes each score relative to that judge's own scoring history.
              </p>
              <div className="formula-display" style={{ textAlign: 'center', fontSize: '18px', padding: '20px' }}>
                Z = (Team's Raw Score - Judge's Mean Score) / Judge's Standard Deviation
              </div>
            </div>
          </div>

          <div className="algorithm-card">
            <h3 className="algorithm-card-title">How It Works Step-by-Step</h3>
            <ol className="algorithm-steps-list">
              <li><strong>Collect All Scores for a Judge:</strong> Gather every single score that a particular judge has given across all teams and criteria.</li>
              <li><strong>Calculate Judge's Mean (μ):</strong> Find the average score for that specific judge. This establishes their personal baseline.</li>
              <li><strong>Calculate Judge's Standard Deviation (σ):</strong> Measure the typical spread or variation in that judge's scores. A low σ means they are consistent; a high σ means their scores vary a lot.</li>
              <li><strong>Compute Z-Score for Each Evaluation:</strong> For every score a judge gives to a team, apply the Z-score formula using that judge's personal μ and σ.</li>
              <li><strong>Aggregate and Compare:</strong> A team's final normalized score is the average of the Z-scores they received from all their judges. Teams can now be ranked fairly.</li>
            </ol>
          </div>

          <div className="algorithm-card">
            <h3 className="algorithm-card-title">Worked Example</h3>
            <p className="algorithm-card-text">Consider two judges with different tendencies evaluating two different teams:</p>
            <div className="example-table-container">
              <table className="example-table">
                <thead>
                  <tr>
                    <th>Judge Stats</th>
                    <th>Mean Score (μ)</th>
                    <th>Std. Dev. (σ)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Judge 1 (Strict)</td>
                    <td>75</td>
                    <td>5</td>
                  </tr>
                  <tr>
                    <td>Judge 2 (Generous)</td>
                    <td>90</td>
                    <td>4</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="example-table-container">
              <table className="example-table">
                <thead>
                  <tr>
                    <th>Team Evaluation</th>
                    <th>Raw Score</th>
                    <th>Calculation</th>
                    <th>Z-SCORE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Team A (by Judge 1)</td>
                    <td>85</td>
                    <td>(85 - 75) / 5</td>
                    <td style={{ fontWeight: 'bold' }}>+2.0</td>
                  </tr>
                  <tr>
                    <td>Team B (by Judge 2)</td>
                    <td>92</td>
                    <td>(92 - 90) / 4</td>
                    <td style={{ fontWeight: 'bold' }}>+0.5</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="algorithm-example-box">
              <h4>Interpreting the Result:</h4>
              <p>Even though Team B had a higher raw score (92 vs 85), Team A's Z-score is much higher (+2.0 vs +0.5).</p>
              <p className="highlight-text">This means Team A's performance was exceptionally good relative to their strict judge, while Team B's performance was only slightly above average for their generous judge. Team A is the clear winner.</p>
            </div>
          </div>

          <div className="benefits-section">
            <h3 className="section-title-small">Benefits of Our Approach</h3>
            <div className="benefits-grid">
              <div className="benefit-card">
                <h4>Fair Comparisons</h4>
                <p>Teams can be compared fairly, regardless of which judges evaluated them.</p>
              </div>
              <div className="benefit-card">
                <h4>Bias Correction</h4>
                <p>Automatically adjusts for harsh or lenient scoring patterns.</p>
              </div>
              <div className="benefit-card">
                <h4>Statistical Rigor</h4>
                <p>Based on a proven statistical method used widely in research and data analysis.</p>
              </div>
              <div className="benefit-card">
                <h4>Transparency</h4>
                <p>The methodology is clear, documented, and auditable for all participants.</p>
              </div>
            </div>
          </div>

          <div className="algorithm-cta">
            <h2>See It In Action</h2>
            <p>Experience fair scoring with Score App</p>
            <button className="cta-large" onClick={() => navigate("/login")}>Try Demo Now</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AlgorithmPage;