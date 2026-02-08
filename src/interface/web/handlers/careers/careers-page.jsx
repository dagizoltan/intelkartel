import { Hero } from "../../components/Hero.jsx";

export const CareersPage = ({ jobs, t }) => (
  <>
    <Hero
        title={t?.hero?.title}
        subtitle={t?.hero?.subtitle}
        short_summary={t?.hero?.short_summary}
        summary={t?.hero?.summary}
        buttons={t?.hero?.buttons}
    />
    <section>
      <div class="container">
        <div class="careers-intro" style="margin-bottom: 2rem;">
          <p>CURRENT OPERATIONAL VACANCIES:</p>
        </div>
        <div class="jobs-list" id="jobs">
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
    </section>

    {t.cta_section && (
      <section class="cta-section">
        <div class="container">
          <h2>{t.cta_section.title}</h2>
          <p>{t.cta_section.text}</p>
          <div class="btn-group">
            {t.cta_section.buttons ? t.cta_section.buttons.map(btn => (
              <a href={btn.link} class={`btn ${btn.type === 'secondary' ? 'secondary' : ''}`}>{btn.text}</a>
            )) : ''}
          </div>
        </div>
      </section>
    )}
  </>
);
