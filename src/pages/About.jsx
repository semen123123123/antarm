import Breadcrumbs from '../components/Breadcrumbs';

export default function About() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Header */}
      <section style={{ padding: '60px 0 40px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="container">
          <Breadcrumbs items={[{ label: 'О компании' }]} color="#999" activeColor="#333" />
          <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12, letterSpacing: '0.02em', color: '#222' }}>
            О компании ANT ARM
          </h1>
          <p style={{ fontSize: 16, color: '#777', maxWidth: 600, lineHeight: 1.6 }}>
            Производитель тактического снаряжения
          </p>
        </div>
      </section>

      {/* История */}
      <section id="history" style={{ padding: '60px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, color: '#222' }}>История</h2>
          <div style={{ maxWidth: 800, fontSize: 15, color: '#555', lineHeight: 1.8 }}>
            <p style={{ marginBottom: 16 }}>
              ANT ARM — российский производитель тактического снаряжения. Компания основана в Ставропольском крае, г. Михайловск, и занимается разработкой и производством качественной продукции для активного отдыха, охоты, страйкбола и военно-тактических задач.
            </p>
            <p>
              За время работы компания зарекомендовала себя как надёжный поставщик снаряжения, используя только проверенные материалы и современные технологии производства.
            </p>
          </div>
        </div>
      </section>

      {/* Производство */}
      <section id="production" style={{ padding: '60px 0', background: '#f5f5f5' }}>
        <div className="container">
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, color: '#222' }}>Производство</h2>
          <div style={{ maxWidth: 800, fontSize: 15, color: '#555', lineHeight: 1.8 }}>
            <p>
              Производство находится по адресу: Ставропольский край, город Михайловск, улица Октябрьская 327/1.
            </p>
          </div>
        </div>
      </section>

      {/* Контакты */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div style={{
            background: '#f5f5f5',
            borderRadius: 16,
            padding: '40px',
            textAlign: 'center',
          }}>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#222' }}>
              Свяжитесь с нами
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
              <a href="tel:+79966309090" style={{ fontSize: 16, fontWeight: 600, color: '#222', textDecoration: 'none' }}>
                +7 (996) 630-90-90
              </a>
              <a href="mailto:Ant.arm@internet.ru" style={{ fontSize: 16, fontWeight: 600, color: '#222', textDecoration: 'none' }}>
                Ant.arm@internet.ru
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
