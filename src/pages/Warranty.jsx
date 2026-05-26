import Breadcrumbs from '../components/Breadcrumbs';
import useScrollAnimation from '../hooks/useScrollAnimation';

const warrantyCards = [
  {
    icon: '🛡️',
    title: 'Гарантия 2 года',
    desc: 'На всю продукцию ANT ARM действует гарантия 24 месяца с момента покупки. Гарантийный талон прилагается к каждому товару.',
  },
  {
    icon: '🔧',
    title: 'Бесплатный ремонт',
    desc: 'В течение гарантийного срока мы бесплатно ремонтируем или заменяем дефектные изделия. Обращайтесь в наш сервисный центр.',
  },
  {
    icon: '📦',
    title: 'Возврат 14 дней',
    desc: 'Если товар не подошёл, вы можете вернуть его в течение 14 дней с момента получения. Товар должен сохранить товарный вид.',
  },
  {
    icon: '✅',
    title: 'Проверка качества',
    desc: 'Каждое изделие проходит контроль качества перед отправкой. Мы гарантируем отсутствие производственных дефектов.',
  },
];

const warrantySteps = [
  {
    step: '01',
    title: 'Обратитесь в поддержку',
    desc: 'Напишите нам на info@antarm.ru или позвоните 8 (800) 250-87-23. Опишите проблему и приложите фото.',
  },
  {
    step: '02',
    title: 'Получите инструкцию',
    desc: 'Мы оценим ситуацию и сообщим, можно ли решить проблему дистанционно или нужна отправка товара.',
  },
  {
    step: '03',
    title: 'Отправьте товар',
    desc: 'Если требуется ремонт, отправьте товар за наш счёт. Мы предоставим адрес и трек-номер.',
  },
  {
    step: '04',
    title: 'Получите результат',
    desc: 'После ремонта или замены мы вернём товар вам в кратчайшие сроки.',
  },
];

export default function Warranty() {
  const [headerRef, headerVisible] = useScrollAnimation({ threshold: 0.1 });
  const [cardsRef, cardsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [stepsRef, stepsVisible] = useScrollAnimation({ threshold: 0.1 });
  const [faqRef, faqVisible] = useScrollAnimation({ threshold: 0.1 });

  return (
    <div style={{ background: '#2a2a2a', minHeight: '100vh', color: '#fff' }}>
      {/* Header */}
      <section style={{ padding: '40px 0', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container">
          <div
            ref={headerRef}
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease',
            }}
          >
            <Breadcrumbs items={[{ label: 'Гарантии' }]} color="rgba(255,255,255,0.5)" activeColor="#fff" />
            <h1 style={{ fontSize: 48, fontWeight: 700, marginBottom: 12, letterSpacing: '0.05em' }}>
              Гарантии
            </h1>
            <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)', maxWidth: 600 }}>
              Мы уверены в качестве нашей продукции и предоставляем расширенные гарантии
            </p>
          </div>
        </div>
      </section>

      {/* Warranty Cards */}
      <section style={{ padding: '60px 0' }}>
        <div className="container">
          <div
            ref={cardsRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 24,
            }}
          >
            {warrantyCards.map((card, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '16px',
                  padding: 40,
                  opacity: cardsVisible ? 1 : 0,
                  transform: cardsVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.5s ease ${i * 0.1}s`,
                }}
              >
                <div style={{ fontSize: 48, marginBottom: 20 }}>{card.icon}</div>
                <h3 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: '#fff' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)' }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section style={{ padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container">
          <h2 style={{
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 48,
            textAlign: 'center',
          }}>
            Как оформить гарантию
          </h2>
          <div
            ref={stepsRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 24,
            }}
          >
            {warrantySteps.map((item, i) => (
              <div
                key={i}
                style={{
                  position: 'relative',
                  padding: '32px 24px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '12px',
                  opacity: stepsVisible ? 1 : 0,
                  transform: stepsVisible ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all 0.5s ease ${i * 0.15}s`,
                }}
              >
                <div style={{
                  fontSize: 48,
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.08)',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: 16,
                }}>
                  {item.step}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: '#fff' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'rgba(255,255,255,0.5)' }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container">
          <div
            ref={faqRef}
            style={{
              maxWidth: 800,
              margin: '0 auto',
              opacity: faqVisible ? 1 : 0,
              transform: faqVisible ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s ease',
            }}
          >
            <h2 style={{
              fontSize: 32,
              fontWeight: 700,
              marginBottom: 32,
              textAlign: 'center',
            }}>
              Частые вопросы
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { q: 'Что не покрывается гарантией?', a: 'Гарантия не распространяется на повреждения, вызванные неправильной эксплуатацией, механическими повреждениями, естественным износом или modificациями изделия.' },
                { q: 'Как долго длится ремонт?', a: 'Стандартный срок ремонта — 14 рабочих дней. В сложных случаях мы сообщим о дополнительных сроках.' },
                { q: 'Кто оплачивает доставку при возврате?', a: 'При гарантийном случае доставку оплачивает ANT ARM. При возврате без причины — покупатель.' },
                { q: 'Нужен ли чек для гарантии?', a: 'Да, желательно сохранить чек или подтверждение заказа. Также принимаем выписки из банка.' },
              ].map((faq, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '24px 32px',
                  }}
                >
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: '#fff' }}>
                    {faq.q}
                  </h3>
                  <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)' }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container">
          <div style={{
            textAlign: 'center',
            padding: '48px 32px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
          }}>
            <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#fff' }}>
              Остались вопросы?
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 32 }}>
              Свяжитесь с нами — мы поможем разобраться в гарантийных условиях
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
              }}
            >
              Написать в поддержку →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
