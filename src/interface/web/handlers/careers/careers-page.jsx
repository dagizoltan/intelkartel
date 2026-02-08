export const CareersPage = ({ jobs }) => (
  <div class="container">
    <h1>Job Openings</h1>
    <div class="careers-intro" style="margin-bottom: 2rem;">
      <p>CURRENT JOB OPENINGS ARE AS SUCH:</p>
      <p>YOU PICK ONE PROFESSION FOR THE “ROLE PLAYING GAME” FILL THIS OUT WITH BLUE BALL POINT PEN AND WE WILL GET IN KONTAKT.</p>
    </div>
    <div class="jobs-list">
      <ul style="list-style-type: none; padding: 0;">
        {jobs && jobs.map((job, index) => (
          <li key={index} style={{
            borderBottom: '1px solid var(--border-color)',
            padding: '1rem 0',
            color: 'var(--text-color)',
            fontFamily: "'Courier New', monospace",
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ marginRight: '1rem' }}>{String(index + 1).padStart(3, '0')}</span>
            <strong>{job}</strong>
          </li>
        ))}
      </ul>
    </div>
  </div>
);
