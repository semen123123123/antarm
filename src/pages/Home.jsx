import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { parentCategories } from '../data/products';
import useScrollAnimation from '../hooks/useScrollAnimation';
import { api } from '../utils/api';

export default function Home() {
  const [catRef, catVisible] = useScrollAnimation({ threshold: 0.1 });
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [currentNews, setCurrentNews] = useState(0);
  const [activeVideo, setActiveVideo] = useState(null);
  const [newsItems, setNewsItems] = useState([]);
  const [videoReviews, setVideoReviews] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingVideos, setLoadingVideos] = useState(true);

  useEffect(() => {
    api.get('/news').then(data => {
      setNewsItems(Array.isArray(data) ? data.filter(n => n.published) : []);
    }).catch(() => {}).finally(() => setLoadingNews(false));
  }, []);

  useEffect(() => {
    api.get('/video-reviews').then(data => {
      setVideoReviews(Array.isArray(data) ? data.filter(v => v.is_active) : []);
    }).catch(() => {}).finally(() => setLoadingVideos(false));
  }, []);

  const heroSlides = [
    '/img/photo1.jpg',
    '/img/photo2.jpg',
    '/img/photo3.jpg',
  ];

  // Auto-slide hero background
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide(prev => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Auto-slide news
  useEffect(() => {
    if (newsItems.length === 0) return;
    const timer = setInterval(() => {
      setCurrentNews(prev => (prev + 1) % newsItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [newsItems.length]);

  // Hero entrance animation
  const [heroLoaded, setHeroLoaded] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setHeroLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Hero Banner */}
      <section style={{
        padding: '120px 0',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Hero background slideshow */}
        {heroSlides.map((slide, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${slide})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat',
              opacity: currentHeroSlide === i ? 1 : 0,
              transition: 'opacity 1.5s ease',
              zIndex: 0,
            }}
          />
        ))}
        {/* Dark overlay for readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1,
        }} />
        <div className="container" style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div className="hero-card" style={{
            textAlign: 'center',
            width: '100%',
            padding: '64px 40px',
            opacity: heroLoaded ? 1 : 0,
            transform: heroLoaded ? 'translateY(0)' : 'translateY(40px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            {/* Logo */}
            <img
              src="/img/logo.png"
              alt="AntArm"
              style={{
                maxWidth: 400,
                width: '100%',
                height: 'auto',
                marginBottom: 32,
                display: 'block',
                marginLeft: 'auto',
                marginRight: 'auto',
                opacity: heroLoaded ? 1 : 0,
                transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
              }}
            />
            <p style={{
              fontSize: 20,
              color: 'rgba(255,255,255,0.9)',
              marginBottom: 40,
              lineHeight: 1.6,
              maxWidth: 700,
              margin: '0 auto 40px',
              opacity: heroLoaded ? 1 : 0,
              transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.4s',
            }}>
              Тактическое снаряжение ручной работы<br />
              Сделано в России 🇷🇺
            </p>
            <div style={{
              display: 'flex',
              gap: 16,
              justifyContent: 'center',
              flexWrap: 'wrap',
              opacity: heroLoaded ? 1 : 0,
              transform: heroLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.6s',
            }}>
              <Link to="/catalog" style={{
                fontSize: 16,
                padding: '14px 32px',
                background: 'transparent',
                color: '#fff',
                border: '2px solid #fff',
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#333'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#fff'; }}
              >
                Перейти в каталог
              </Link>
              <Link to="/contacts" style={{
                fontSize: 16,
                padding: '14px 32px',
                background: '#fff',
                color: '#333',
                border: '2px solid #fff',
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
              >
                Связаться с нами
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{
        background: '#1A1A1A',
        padding: '60px 0',
      }}>
        <div className="container">
          <div className="features-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 20,
          }}>
            {[
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M20 5L25 15L35 17L27 24L29 35L20 29L11 35L13 24L5 17L15 15L20 5Z" fill="none" stroke="#fff" strokeWidth="2"/>
                  </svg>
                ),
                title: 'Индивидуальный подход',
                text: 'Ваше снаряжение собирается вручную, с вниманием к каждой детали и пожеланиям.',
              },
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M10 20L18 28L32 12" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="20" cy="20" r="15" stroke="#fff" strokeWidth="2" fill="none"/>
                  </svg>
                ),
                title: 'Гарантия качества',
                text: 'Используем только проверенные материалы и фурнитуру, прошедшие испытания.',
              },
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M20 5V20L28 28" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                    <circle cx="20" cy="20" r="15" stroke="#fff" strokeWidth="2" fill="none"/>
                  </svg>
                ),
                title: 'Быстрая доставка',
                text: 'Отправляем заказы в кратчайшие сроки по всей России.',
              },
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M12 28H8C6.89543 28 6 27.1046 6 26V10C6 8.89543 6.89543 8 8 8H28C29.1046 8 30 8.89543 30 10V12" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                    <rect x="12" y="16" width="22" height="16" rx="2" stroke="#fff" strokeWidth="2" fill="none"/>
                    <circle cx="20" cy="24" r="2" fill="#fff"/>
                    <path d="M28 24H30" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Доступные цены',
                text: 'Прямые поставки и собственное производство без посредников.',
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                  padding: '30px 20px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.03)',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(255,255,255,0.1)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  {item.icon}
                </div>
                <h3 style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#fff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 12,
                }}>
                  {item.title}
                </h3>
                <p style={{
                  fontSize: 14,
                  color: '#CCCCCC',
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{
        padding: '130px 0',
        background: '#f5f5f5',
      }}>
        <div className="container">
          <h2 style={{
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 48,
            color: '#333',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            opacity: catVisible ? 1 : 0,
            transform: catVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}>
            Каталог
          </h2>
          <div
            ref={catRef}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 24,
            }}
          >
            {(() => {
              const categoryData = {
                'takticheskoe-snaryazhenie': { label: 'Тактическое снаряжение', image: '/img/bronya.jpg' },
                'ohota-rybalka-turizm':      { label: 'Охота — рыбалка, туризм', image: '/img/ohota.jpg' },
                'zootovary':                 { label: 'Зоотовары', image: '/img/osheinik.jpg' },
                'odezhda':                   { label: 'Одежда', image: '/img/clothes.jpg' },
              };
              const slugOrder = ['takticheskoe-snaryazhenie', 'ohota-rybalka-turizm', 'zootovary', 'odezhda'];
              return slugOrder.map((slug, i) => {
                const cat = categoryData[slug];
                const delay = `${i * 0.1}s`;
                return (
                  <Link
                    key={slug}
                    to={`/category/${slug}`}
                    style={{
                      textDecoration: 'none',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      background: '#fff',
                      border: '1px solid #e0e0e0',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      opacity: catVisible ? 1 : 0,
                      transform: catVisible ? 'translateY(0)' : 'translateY(30px)',
                      transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}`,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                    }}
                  >
                    <div style={{
                      padding: '20px 16px 0',
                      display: 'flex',
                      justifyContent: 'center',
                    }}>
                      <img
                        src={cat.image}
                        alt={cat.label}
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: '12px',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </div>
                    <div style={{
                      padding: '12px 12px 16px',
                      textAlign: 'center',
                    }}>
                      <h3 style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: '#333',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        margin: 0,
                        lineHeight: 1.3,
                      }}>
                        {cat.label}
                      </h3>
                    </div>
                  </Link>
                );
              });
            })()}
          </div>
        </div>
      </section>

      {/* Constructor Banner */}
      <section style={{
        padding: '80px 0',
        background: '#fafafa',
      }}>
        <div className="container">
          <h2 style={{
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 32,
            color: '#000',
            textAlign: 'left',
          }}>
            Конструктор
          </h2>
          <Link to="/constructor" style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{
              position: 'relative',
              borderRadius: 20,
              overflow: 'hidden',
              background: '#f0f0f0',
              maxWidth: '75%',
              margin: '0 auto',
              transition: 'box-shadow 0.3s ease, transform 0.3s ease',
              boxShadow: '0 0 0px rgba(255,255,255,0.3)',
              cursor: 'pointer',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(255,255,255,0.4), 0 0 60px rgba(200,200,200,0.2)';
                e.currentTarget.style.transform = 'scale(1.01)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 0 0px rgba(255,255,255,0.3)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <img
                src="/img/kons.png"
                alt="Конструктор экипировки"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
              {/* Text content */}
              <div style={{
                position: 'absolute',
                right: '6%',
                top: '50%',
                transform: 'translateY(-50%)',
                textAlign: 'left',
                maxWidth: '45%',
              }}>
                <div style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: 'rgba(0,0,0,0.08)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '20px',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#333',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: 16,
                }}>
                  Онлайн-конфигуратор
                </div>
                <h3 style={{
                  fontSize: 30,
                  fontWeight: 800,
                  color: '#222',
                  marginBottom: 10,
                  lineHeight: 1.2,
                }}>
                  Собери свой<br />комплект
                </h3>
                <p style={{
                  fontSize: 14,
                  color: '#555',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  marginBottom: 24,
                }}>
                  Подбери снаряжение под свои задачи —<br />бронежилет, разгрузка, рюкзак и всё необходимое
                </p>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '12px 28px',
                  background: '#222',
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  borderRadius: '10px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                  transition: 'all 0.2s',
                }}>
                  Начать сборку
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section style={{
        padding: '100px 0',
        position: 'relative',
        backgroundImage: 'url(/img/bg3.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}>
        {/* Dark overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
        }} />
        <div className="container" style={{ maxWidth: 800, position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: 32,
            fontWeight: 700,
            marginBottom: 24,
            color: '#fff',
            textAlign: 'center',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            О компании
          </h2>
          <div style={{
            fontSize: 16,
            color: 'rgba(255,255,255,0.9)',
            lineHeight: 1.8,
            textAlign: 'justify',
          }}>
            <p>
              Ant Arm — это молодая, амбициозная команда, объединённая общей целью: создавать качественное тактическое снаряжение, доступное каждому. Мы не просто производитель. Мы — пользователи своей продукции. Именно поэтому мы точно знаем, что нужно тем, кто выбирает активный образ жизни, защиту и надёжность. Профессиональное тактическое снаряжение для военных, страйкбола и активных задач. Надёжная экипировка, проверенные материалы, быстрая доставка. Наша главная цель — доступные цены без компромисса с качеством. Немного о себе: меня зовут Игорь, более полутора лет сам шил тактическое снаряжение на разных предприятиях и более полугода был руководителем швейной фабрики по пошиву снаряжения. Есть две основные проблемы, которые побудили сделать свой продукт: 1. Необоснованно завышенный ценник. 2. Mass-маркет — разгон предприятий до таких объёмов, что качество уходит на второй план. Мы в начале пути, но у нас за плечами серьёзный опыт. Мы благодарны за обратную связь — она помогает нам становиться лучше, модернизировать изделия и создавать снаряжение, которому доверяют.
            </p>
          </div>
        </div>
      </section>

      {/* News Slider */}
      {!loadingNews && newsItems.length > 0 && (
        <section style={{
          padding: '80px 0',
          background: '#fff',
        }}>
          <div className="container" style={{ position: 'relative' }}>
            <h2 style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#000',
              textAlign: 'left',
              marginBottom: 32,
            }}>
              Новости
            </h2>
            {(() => {
              const prev = () => setCurrentNews(p => (p - 1 + newsItems.length) % newsItems.length);
              const next = () => setCurrentNews(p => (p + 1) % newsItems.length);

              return (
                <div style={{ position: 'relative' }}>
                  {/* Slide */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    height: 500,
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: '#f0f0f0',
                  }}>
                    {newsItems.map((item, i) => (
                      <div
                        key={item.id || i}
                        style={{
                          position: 'absolute',
                          inset: 0,
                          backgroundImage: `url(${item.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          opacity: currentNews === i ? 1 : 0,
                          transition: 'opacity 0.6s ease',
                        }}
                      >
                        {/* Dark gradient overlay for text readability */}
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: '60px 40px 40px',
                          background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                        }}>
                          <p style={{
                            fontSize: 18,
                            color: '#fff',
                            lineHeight: 1.6,
                            margin: 0,
                            textShadow: '0 2px 6px rgba(0,0,0,0.5)',
                          }}>
                            {item.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Left arrow */}
                  <button
                    onClick={prev}
                    style={{
                      position: 'absolute',
                      left: -20,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '50%',
                      color: '#333',
                      fontSize: 20,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      zIndex: 10,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    ←
                  </button>

                  {/* Right arrow */}
                  <button
                    onClick={next}
                    style={{
                      position: 'absolute',
                      right: -20,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 48,
                      height: 48,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '50%',
                      color: '#333',
                      fontSize: 20,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      zIndex: 10,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f5f5f5'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                  >
                    →
                  </button>
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* Video Reviews Section */}
      {!loadingVideos && videoReviews.length > 0 && (
        <section style={{
          padding: '80px 0',
          background: '#f5f5f5',
        }}>
          <div className="container">
            <h2 style={{
              fontSize: 32,
              fontWeight: 700,
              color: '#000',
              textAlign: 'left',
              marginBottom: 32,
            }}>
              Обзоры
            </h2>
            <div style={{
              display: 'flex',
              gap: 5,
              width: '100%',
            }}>
              {videoReviews.map((item) => (
                <div
                  key={item.id}
                  style={{
                    flex: 1,
                    position: 'relative',
                    borderRadius: 12,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    height: 400,
                    background: '#e0e0e0',
                  }}
                  onClick={() => setActiveVideo(activeVideo === item.id ? null : item.id)}
                >
                  {activeVideo === item.id ? (
                    <video
                      src={item.video_url}
                      controls
                      autoPlay
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                      onEnded={() => setActiveVideo(null)}
                    />
                  ) : (
                    <>
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `url(${item.preview_url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        transition: 'transform 0.3s ease',
                      }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      />
                      {/* Play button overlay */}
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(0,0,0,0.2)',
                        transition: 'background 0.3s ease',
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.4)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
                      >
                        <div style={{
                          width: 64,
                          height: 64,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.9)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 28,
                          color: '#333',
                        }}>
                          ▶
                        </div>
                      </div>
                      {/* Text label */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '40px 24px 20px',
                        background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                      }}>
                        <span style={{
                          fontSize: 16,
                          fontWeight: 600,
                          color: '#fff',
                          textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                        }}>
                          {item.title || 'Смотреть обзор'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }} />
    </div>
  );
}
