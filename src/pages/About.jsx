import Breadcrumbs from '../components/Breadcrumbs';
import useScrollAnimation from '../hooks/useScrollAnimation';

const stats = [
  { value: '8+', label: 'лет на рынке' },
  { value: '150+', label: 'товаров в каталоге' },
  { value: '10 000+', label: 'клиентов' },
  { value: '100%', label: 'российское производство' },
];

const values = [
  {
    icon: '🎯',
    title: 'Качество',
    desc: 'Строгий контроль на каждом этапе — от выбора материалов до финальной упаковки. Только проверенные ткани и фурнитура.',
  },
  {
    icon: '🏭',
    title: 'Своё производство',
    desc: 'Полный цикл в Санкт-Петербурге. Конструкторы, технологи и практики работают вместе над каждым изделием.',
  },
  {
    icon: '🛡️',
    title: 'Надёжность',
    desc: 'Снаряжение для экстремальных условий. Каждый товар tested в полевых условиях перед запуском в продажу.',
  },
  {
    icon: '🤝',
    title: 'Доверие',
    desc: 'Более 10 000 клиентов — от профессионалов до энтузиастов. Гарантия 2 года на всю продукцию.',
  },
];

const timeline = [
  { year: '2018', title: 'Основание', desc: 'ANT ARM основан в Санкт-Петербурге. Первые образцы тактических разгрузок.' },
  { year: '2020', title: 'Расширение', desc: 'Запуск линейки бронежилетов. Выход на федеральный рынок.' },
  { year: '2022', title: 'Масштабирование', desc: 'Собственное производство. 150+ товаров в каталоге.' },
  { year: '2024', title: 'Признание', desc: '10 000+ клиентов. Партнёрство с профессиональными сообществами.' },
];

export default function About() {
  const [statsRef, statsVisible] = useScrollAnimation({ threshold: 0.2 });
  const [valuesRef, valuesVisible] = useScrollAnimation({ threshold: 0.1 });
  const [timelineRef, timelineVisible] = useScrollAnimation({ threshold: 0.1 });
  const [ctaRef, ctaVisible] = useScrollAnimation({ threshold: 0.2 });

  return (
    <div style={{
      background: '#2a2a2a',
      minHeight: '100vh',
      color: '#fff',
    }}>
      {/* Header */}
      <section style={{
        padding: '60px 0 40px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div className="container">
          <Breadcrumbs items={[{ label: 'О компании' }]} color="rgba(255,255,255,0.5)" activeColor="#fff" />
          <h1 style={{
            fontSize: 48,
            fontWeight: 700,
            marginBottom: 12,
            letterSpacing: '0.05em',
          }}>
            О компании ANT ARM
          </h1>
          <p style={{
            fontSize: 20,
            color: 'rgba(255,255,255,0.6)',
            maxWidth: 600,
          }}>
            Качественное тактическое снаряжение, произведённое в России
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div
            ref={statsRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 32,
            }}
          >
            {stats.map((stat, i) => (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                  padding: '32px 16px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  opacity: statsVisible ? 1 : 0,
                  transform: statsVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.5s ease ${i * 0.1}s`,
                }}
              >
                <div style={{
                  fontSize: 48,
                  fontWeight: 700,
                  color: '#fff',
                  marginBottom: 8,
                  fontFamily: 'var(--font-mono)',
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.5)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: '40px 0 60px' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center',
          }}>
            <div>
              <h2 style={{
                fontSize: 32,
                fontWeight: 700,
                marginBottom: 24,
                position: 'relative',
                paddingBottom: 16,
              }}>
                Наша история
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: 60,
                  height: 3,
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: 2,
                }} />
              </h2>
              <div style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.7)' }}>
                <p style={{ marginBottom: 16 }}>
                  ANT ARM — российский производитель тактического снаряжения, основанный в Санкт-Петербурге.
                  Мы специализируемся на разработке и производстве высококачественного снаряжения для
                  профессионалов и энтузиастов.
                </p>
                <p style={{ marginBottom: 16 }}>
                  Наша продукция проходит строгий контроль качества на каждом этапе производства — от выбора
                  материалов до финальной упаковки. Мы используем только проверенные ткани и фурнитуру от
                  ведущих мировых производителей.
                </p>
                <p>
                  Каждый товар ANT ARM — это результат совместной работы конструкторов, технологов и
                  практиков, которые знают, каким должно быть надёжное тактическое снаряжение.
                </p>
              </div>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              height: 400,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.3)',
              fontSize: 18,
            }}>
              [Фото производства]
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{
        padding: '60px 0',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div className="container">
          <h2 style={{
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 48,
            textAlign: 'center',
          }}>
            Наши ценности
          </h2>
          <div
            ref={valuesRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 24,
            }}
          >
            {values.map((val, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: 32,
                  opacity: valuesVisible ? 1 : 0,
                  transform: valuesVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.5s ease ${i * 0.1}s`,
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 16 }}>{val.icon}</div>
                <h3 style={{
                  fontSize: 20,
                  fontWeight: 600,
                  marginBottom: 12,
                  color: '#fff',
                }}>
                  {val.title}
                </h3>
                <p style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: 'rgba(255,255,255,0.6)',
                }}>
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{
        padding: '60px 0',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div className="container">
          <h2 style={{
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 48,
            textAlign: 'center',
          }}>
            Путь развития
          </h2>
          <div
            ref={timelineRef}
            style={{
              position: 'relative',
              maxWidth: 800,
              margin: '0 auto',
            }}
          >
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              left: 24,
              top: 0,
              bottom: 0,
              width: 2,
              background: 'rgba(255,255,255,0.1)',
            }} />

            {timeline.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: 32,
                  marginBottom: 40,
                  opacity: timelineVisible ? 1 : 0,
                  transform: timelineVisible ? 'translateX(0)' : 'translateX(-20px)',
                  transition: `all 0.5s ease ${i * 0.15}s`,
                }}
              >
                {/* Dot */}
                <div style={{
                  width: 50,
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                  <div style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.3)',
                    border: '2px solid rgba(255,255,255,0.5)',
                    marginTop: 6,
                  }} />
                </div>
                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.4)',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 4,
                  }}>
                    {item.year}
                  </div>
                  <h3 style={{
                    fontSize: 20,
                    fontWeight: 600,
                    marginBottom: 8,
                    color: '#fff',
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: 'rgba(255,255,255,0.6)',
                  }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '60px 0',
        borderTop: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div className="container">
          <div
            ref={ctaRef}
            style={{
              textAlign: 'center',
              padding: '48px 32px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              opacity: ctaVisible ? 1 : 0,
              transform: ctaVisible ? 'scale(1)' : 'scale(0.95)',
              transition: 'all 0.6s ease',
            }}
          >
            <h2 style={{
              fontSize: 28,
              fontWeight: 700,
              marginBottom: 16,
              color: '#fff',
            }}>
              Готовы к сотрудничеству?
            </h2>
            <p style={{
              fontSize: 16,
              color: 'rgba(255,255,255,0.6)',
              marginBottom: 32,
              maxWidth: 500,
              margin: '0 auto 32px',
            }}>
              Оптовые условия, индивидуальные заказы и партнёрские программы
            </p>
            <a
              href="/contacts"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 32px',
                background: '#fff',
                color: '#333',
                fontSize: 14,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderRadius: '8px',
                textDecoration: 'none',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Связаться с нами
              <span>→</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
