import { useState } from 'react';
import { Link } from 'react-router-dom';

const columns = [
  {
    title: 'О компании',
    links: [
      { label: 'О нас', to: '/about' },
      { label: 'Контакты', to: '/contacts' },
      { label: 'Реквизиты', to: '/about' },
    ],
  },
  {
    title: 'Покупателям',
    links: [
      { label: 'Гарантии', to: '/about' },
      { label: 'Доставка', to: '/contacts' },
      { label: 'Возврат товара', to: '/contacts' },
      { label: 'Способы оплаты', to: '/contacts' },
    ],
  },
  {
    title: 'Каталог',
    links: [
      { label: 'Бронежилеты', to: '/category/bronezhilety' },
      { label: 'Разгрузки', to: '/category/razgruzochnye-sistemy' },
      { label: 'Подсумки', to: '/category/podsumki' },
      { label: 'Рюкзаки', to: '/category/ryukzaki-i-sumki' },
    ],
  },
  {
    title: 'Контакты',
    links: [
      { label: '+7 (996) 630-90-90', to: 'tel:+79966309090' },
      { label: 'Ant.arm@internet.ru', to: 'mailto:Ant.arm@internet.ru' },
      { label: 'Михайловск', to: '/contacts' },
    ],
  },
];

export default function Footer() {
  const [policyOpen, setPolicyOpen] = useState(false);
  const [cookieOpen, setCookieOpen] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);

  return (
    <>
      {/* Privacy Policy Modal */}
      {policyOpen && (
        <div
          onClick={() => setPolicyOpen(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              color: '#333',
              borderRadius: 16,
              width: '90%',
              maxWidth: 800,
              maxHeight: '85vh',
              overflow: 'auto',
              padding: '40px 48px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              position: 'relative',
              lineHeight: 1.7,
              fontSize: 14,
            }}
          >
            <button
              onClick={() => setPolicyOpen(false)}
              style={{
                position: 'sticky',
                top: 0,
                float: 'right',
                background: '#f0f0f0',
                border: 'none',
                borderRadius: 8,
                width: 32, height: 32,
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                zIndex: 1,
              }}
            >✕</button>

            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: '#111' }}>
              ПОЛИТИКА ОБРАБОТКИ ПЕРСОНАЛЬНЫХ ДАННЫХ
            </h2>
            <p style={{ fontSize: 13, color: '#999', marginBottom: 24 }}>
              Дата публикации: 17.02.2026 г.
            </p>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 24, marginBottom: 8, color: '#111' }}>
              1. Общие положения
            </h3>
            <p style={{ marginBottom: 12 }}>
              Настоящая Политика обработки персональных данных (далее — Политика) составлена в соответствии с Федеральным законом №152-ФЗ «О персональных данных» и определяет порядок обработки персональных данных пользователей сайта.
            </p>
            <p style={{ marginBottom: 12 }}>
              <strong>Оператор персональных данных:</strong><br />
              Индивидуальный предприниматель Валиулова Юлия Артуровна<br />
              ИНН: 262102500715<br />
              ОГРНИП: 323265100011653<br />
              Юридический адрес: Ставропольский край, Труновский район, село Донское, улица Валькова, дом 11, кв. 1<br />
              Email для обращений: Ant.arm@internet.ru
            </p>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 24, marginBottom: 8, color: '#111' }}>
              2. Персональные данные, которые могут обрабатываться
            </h3>
            <p style={{ marginBottom: 12 }}>
              Оператор может обрабатывать следующие данные пользователей:
            </p>
            <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
              <li>технические данные (IP-адрес, файлы cookies, данные браузера и устройства);</li>
              <li>сведения, передаваемые пользователем при обращении через Telegram или электронную почту (имя, username, адрес электронной почты, содержание сообщения);</li>
              <li>обезличенные данные о действиях пользователей на сайте.</li>
            </ul>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 24, marginBottom: 8, color: '#111' }}>
              3. Цели обработки персональных данных
            </h3>
            <p style={{ marginBottom: 12 }}>
              Персональные данные обрабатываются в следующих целях:
            </p>
            <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
              <li>обеспечение обратной связи с пользователями;</li>
              <li>предоставление консультаций и ответов на обращения;</li>
              <li>анализ посещаемости сайта и улучшение его работы;</li>
              <li>соблюдение требований законодательства Российской Федерации.</li>
            </ul>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 24, marginBottom: 8, color: '#111' }}>
              4. Правовые основания обработки
            </h3>
            <p style={{ marginBottom: 12 }}>
              Обработка персональных данных осуществляется на основании:
            </p>
            <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
              <li>согласия пользователя на обработку персональных данных;</li>
              <li>необходимости обработки для осуществления законных интересов оператора;</li>
              <li>исполнения требований законодательства Российской Федерации.</li>
            </ul>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 24, marginBottom: 8, color: '#111' }}>
              5. Использование файлов cookies и сервисов аналитики
            </h3>
            <p style={{ marginBottom: 12 }}>
              На сайте используется сервис веб-аналитики Яндекс Метрика, который собирает обезличенную информацию о действиях пользователей с использованием файлов cookies.
            </p>
            <p style={{ marginBottom: 12 }}>
              Пользователь может отключить использование cookies в настройках своего браузера.
            </p>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 24, marginBottom: 8, color: '#111' }}>
              6. Передача персональных данных третьим лицам
            </h3>
            <p style={{ marginBottom: 12 }}>
              Оператор не передает персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством Российской Федерации.
            </p>
            <p style={{ marginBottom: 12 }}>
              Оплата товаров и услуг осуществляется через сторонний платежный сервис — ЮKassa. Оператор не получает и не обрабатывает данные банковских карт пользователей. Обработка платежных данных осуществляется указанным сервисом самостоятельно в соответствии с его собственной политикой конфиденциальности.
            </p>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 24, marginBottom: 8, color: '#111' }}>
              7. Меры по защите персональных данных
            </h3>
            <p style={{ marginBottom: 12 }}>
              Оператор принимает необходимые организационные и технические меры для защиты персональных данных пользователей от неправомерного доступа, изменения, распространения или уничтожения.
            </p>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 24, marginBottom: 8, color: '#111' }}>
              8. Права пользователя
            </h3>
            <p style={{ marginBottom: 12 }}>
              Пользователь имеет право:
            </p>
            <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
              <li>получать информацию об обработке своих персональных данных;</li>
              <li>требовать уточнения, блокирования или удаления персональных данных;</li>
              <li>отозвать согласие на обработку персональных данных;</li>
              <li>обращаться в Роскомнадзор или в суд для защиты своих прав.</li>
            </ul>
            <p style={{ marginBottom: 12 }}>
              Запросы направляются по электронной почте: Ant.arm@internet.ru.
            </p>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 24, marginBottom: 8, color: '#111' }}>
              9. Сроки обработки и хранения данных
            </h3>
            <p style={{ marginBottom: 12 }}>
              Персональные данные обрабатываются и хранятся не дольше, чем этого требуют цели обработки, либо сроки, установленные законодательством Российской Федерации.
            </p>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 24, marginBottom: 8, color: '#111' }}>
              10. Заключительные положения
            </h3>
            <p style={{ marginBottom: 12 }}>
              Актуальная версия настоящей Политики размещается в свободном доступе на сайте — AntArm.ru
            </p>
            <p style={{ marginBottom: 12 }}>
              Оператор вправе вносить изменения в настоящую Политику. Новая редакция вступает в силу с момента её размещения на сайте.
            </p>
          </div>
        </div>
      )}

      {/* Cookie Policy Modal */}
      {cookieOpen && (
        <div
          onClick={() => setCookieOpen(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              color: '#333',
              borderRadius: 16,
              width: '90%',
              maxWidth: 800,
              maxHeight: '85vh',
              overflow: 'auto',
              padding: '40px 48px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              position: 'relative',
              lineHeight: 1.7,
              fontSize: 14,
            }}
          >
            <button
              onClick={() => setCookieOpen(false)}
              style={{
                position: 'sticky',
                top: 0,
                float: 'right',
                background: '#f0f0f0',
                border: 'none',
                borderRadius: 8,
                width: 32, height: 32,
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                zIndex: 1,
              }}
            >✕</button>

            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#111' }}>
              ПОЛИТИКА ИСПОЛЬЗОВАНИЯ COOKIE-ФАЙЛОВ
            </h2>
            <p style={{ marginBottom: 12 }}>
              В соответствии с требованиями статьи 9 Федерального закона от 27.07.2006 г. № 152-ФЗ «О персональных данных», свободно, своей волей и в своем интересе даю ИП Валиуловой Юлии Артуровне (ИНН: 262102500715, ОГРНИП: 323265100011653), адрес регистрации: 356170, Ставропольский край, Труновский район, село Донское, улица Валькова, дом 11, кв. 1 (далее — Оператор), согласие на обработку, а именно, любое действие (операцию) или совокупность действий (операций), совершаемых с использованием средств автоматизации или без использования таких средств, включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу (предоставление, доступ), блокирование, удаление, уничтожение) моих персональных данных, указанных мною в формах сбора данных на веб-сайте https://www.antarm.ru/
            </p>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 20, marginBottom: 8, color: '#111' }}>
              1. Условия обработки персональных данных
            </h3>
            <p style={{ marginBottom: 12 }}>
              Обработка персональных данных осуществляется с соблюдением принципов и условий, предусмотренных Политикой в отношении обработки и защиты персональных данных, Политикой использования cookie-файлов, и законодательством Российской Федерации.
            </p>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 20, marginBottom: 8, color: '#111' }}>
              2. Категории обрабатываемых персональных данных
            </h3>
            <p style={{ marginBottom: 8, fontWeight: 600 }}>
              2.1. С целью информирования Пользователя об услугах и условиях их предоставления посредством отправки электронных писем:
            </p>
            <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
              <li>фамилия, имя, отчество;</li>
              <li>адрес электронного почтового ящика.</li>
            </ul>
            <p style={{ marginBottom: 8, fontWeight: 600 }}>
              2.2. С целью предоставления доступа Пользователю к сервисам, информации и/или материалам, содержащимся на веб-сайте:
            </p>
            <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
              <li>фамилия, имя, отчество;</li>
              <li>адрес электронного почтового ящика;</li>
              <li>контактный номер телефона;</li>
              <li>сведения, собираемые посредством метрических программ (IP-адрес, файлы cookies, тип и версия браузера, операционная система и её версия, разрешение экрана, геолокация, данные аналитики).</li>
            </ul>
            <p style={{ marginBottom: 8, fontWeight: 600 }}>
              2.3. С целью информирования Пользователя об услугах и условиях их предоставления посредством сообщений в мессенджерах и звонков по номеру мобильного телефона:
            </p>
            <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
              <li>фамилия, имя, отчество;</li>
              <li>контактный номер телефона.</li>
            </ul>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 20, marginBottom: 8, color: '#111' }}>
              3. Правовые основания для обработки
            </h3>
            <p style={{ marginBottom: 12 }}>
              Правовыми основаниями для обработки выше указанных персональных данных служат:
            </p>
            <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
              <li>Политика Оператора в отношении обработки и защиты персональных данных;</li>
              <li>согласие субъекта на обработку его персональных данных, которое выражено в виде проставления «галочки»-согласия в чек-боксе формы заявки на веб-сайте;</li>
              <li>Политика использования cookie-файлов.</li>
            </ul>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 20, marginBottom: 8, color: '#111' }}>
              4. Подтверждение достоверности данных
            </h3>
            <p style={{ marginBottom: 12 }}>
              Пользователь подтверждает, что все указанные им в формах сбора данных на веб-сайте данные принадлежат лично ему и что в случае указания Пользователем сведений об иных лицах, он подтверждает, что передает персональные данные с согласия этих лиц Оператору на основании ч. 8 ст. 9, Федерального закона от 27.07.2006 г. № 152-ФЗ «О персональных данных». Оператор не проверяет достоверность персональных данных, предоставляемых Пользователем, а получает персональные данные, непосредственно предоставленные Пользователем.
            </p>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 20, marginBottom: 8, color: '#111' }}>
              5. Срок действия и отзыв согласия
            </h3>
            <p style={{ marginBottom: 12 }}>
              Настоящее согласие действует до достижения целей обработки или до отзыва согласия Пользователем. Отзыв согласия возможен путём направления письменного запроса на адрес ant.arm@internet.ru. Отзыв согласия может ограничить доступ к некоторым функциям веб-сайта.
            </p>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 20, marginBottom: 8, color: '#111' }}>
              6. Доступ к персональным данным
            </h3>
            <p style={{ marginBottom: 12 }}>
              Доступ к персональным данным вправе иметь работники, партнеры и иные контрагенты Оператора, которым такой доступ необходим в связи с исполнением ими должностных и/или договорных обязанностей, как с Пользователем непосредственно, так и с Оператором.
            </p>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 20, marginBottom: 8, color: '#111' }}>
              7. Безопасность персональных данных
            </h3>
            <p style={{ marginBottom: 12 }}>
              Безопасность персональных данных, которые обрабатываются Оператором, обеспечивается путем реализации правовых, организационных и технических мер, необходимых для выполнения в полном объеме требований действующего законодательства в области защиты персональных данных.
            </p>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 20, marginBottom: 8, color: '#111' }}>
              8. Вступление в силу
            </h3>
            <p style={{ marginBottom: 12 }}>
              Настоящее согласие вступает в силу с момента выражения Пользователем согласия на обработку персональных данных путем проставления признака согласия «галочки» в чек-боксе формы сбора данных на веб-сайте.
            </p>
          </div>
        </div>
      )}

      {/* Consent Modal */}
      {consentOpen && (
        <div
          onClick={() => setConsentOpen(false)}
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(4px)',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              color: '#333',
              borderRadius: 16,
              width: '90%',
              maxWidth: 800,
              maxHeight: '85vh',
              overflow: 'auto',
              padding: '40px 48px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              position: 'relative',
              lineHeight: 1.7,
              fontSize: 14,
            }}
          >
            <button
              onClick={() => setConsentOpen(false)}
              style={{
                position: 'sticky',
                top: 0,
                float: 'right',
                background: '#f0f0f0',
                border: 'none',
                borderRadius: 8,
                width: 32, height: 32,
                fontSize: 18,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                zIndex: 1,
              }}
            >✕</button>

            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#111' }}>
              СОГЛАСИЕ НА ОБРАБОТКУ ПЕРСОНАЛЬНЫХ ДАННЫХ
            </h2>
            <p style={{ marginBottom: 12 }}>
              В соответствии с требованиями статьи 9 Федерального закона от 27.07.2006 г. № 152-ФЗ «О персональных данных», свободно, своей волей и в своем интересе даю ИП Валиуловой Юлии Артуровне (ИНН: 262102500715, ОГРНИП: 323265100011653), адрес регистрации: 356170, Ставропольский край, Труновский район, село Донское, улица Валькова, дом 11, кв. 1 (далее — Оператор), согласие на обработку, а именно, любое действие (операцию) или совокупность действий (операций), совершаемых с использованием средств автоматизации или без использования таких средств, включая сбор, запись, систематизацию, накопление, хранение, уточнение (обновление, изменение), извлечение, использование, передачу (предоставление, доступ), блокирование, удаление, уничтожение) моих персональных данных, указанных мною в формах сбора данных на веб-сайте https://www.antarm.ru/
            </p>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 20, marginBottom: 8, color: '#111' }}>
              1. Условия обработки персональных данных
            </h3>
            <p style={{ marginBottom: 12 }}>
              Обработка персональных данных осуществляется с соблюдением принципов и условий, предусмотренных Политикой в отношении обработки и защиты персональных данных, Политикой использования cookie-файлов, и законодательством Российской Федерации.
            </p>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 20, marginBottom: 8, color: '#111' }}>
              2. Категории обрабатываемых персональных данных
            </h3>
            <p style={{ marginBottom: 8, fontWeight: 600 }}>
              2.1 С целью информирования Пользователя об услугах и условиях их предоставления посредством отправки электронных писем:
            </p>
            <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
              <li>фамилия, имя, отчество;</li>
              <li>адрес электронного почтового ящика.</li>
            </ul>
            <p style={{ marginBottom: 8, fontWeight: 600 }}>
              2.2. С целью предоставления доступа Пользователю к сервисам, информации и/или материалам, содержащимся на веб-сайте:
            </p>
            <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
              <li>фамилия, имя, отчество;</li>
              <li>адрес электронного почтового ящика;</li>
              <li>контактный номер телефона;</li>
              <li>сведения, собираемые посредством метрических программ (IP-адрес, файлы cookies, тип и версия браузера, операционная система и её версия, разрешение экрана, геолокация, данные аналитики).</li>
            </ul>
            <p style={{ marginBottom: 8, fontWeight: 600 }}>
              2.3. С целью информирования Пользователя об услугах и условиях их предоставления посредством сообщений в мессенджерах и звонков по номеру мобильного телефона:
            </p>
            <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
              <li>фамилия, имя, отчество;</li>
              <li>контактный номер телефона.</li>
            </ul>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 20, marginBottom: 8, color: '#111' }}>
              3. Правовые основания для обработки
            </h3>
            <p style={{ marginBottom: 12 }}>
              Правовыми основаниями для обработки выше указанных персональных данных служат:
            </p>
            <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
              <li>Политика Оператора в отношении обработки и защиты персональных данных;</li>
              <li>согласие субъекта на обработку его персональных данных, которое выражено в виде проставления «галочки»-согласия в чек-боксе формы заявки на веб-сайте;</li>
              <li>Политика использования cookie-файлов.</li>
            </ul>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 20, marginBottom: 8, color: '#111' }}>
              4. Подтверждение достоверности данных
            </h3>
            <p style={{ marginBottom: 12 }}>
              Пользователь подтверждает, что все указанные им в формах сбора данных на веб-сайте данные принадлежат лично ему и что в случае указания Пользователем сведений об иных лицах, он подтверждает, что передает персональные данные с согласия этих лиц Оператору на основании ч. 8 ст. 9, Федерального закона от 27.07.2006 г. № 152-ФЗ «О персональных данных». Оператор не проверяет достоверность персональных данных, предоставляемых Пользователем, а получает персональные данные, непосредственно предоставленные Пользователем.
            </p>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 20, marginBottom: 8, color: '#111' }}>
              5. Срок действия и отзыв согласия
            </h3>
            <p style={{ marginBottom: 12 }}>
              Настоящее согласие действует до достижения целей обработки или до отзыва согласия Пользователем. Отзыв согласия возможен путём направления письменного запроса на адрес ant.arm@internet.ru. Отзыв согласия может ограничить доступ к некоторым функциям веб-сайта.
            </p>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 20, marginBottom: 8, color: '#111' }}>
              6. Доступ к персональным данным
            </h3>
            <p style={{ marginBottom: 12 }}>
              Доступ к персональным данным вправе иметь работники, партнеры и иные контрагенты Оператора, которым такой доступ необходим в связи с исполнением ими должностных и/или договорных обязанностей, как с Пользователем непосредственно, так и с Оператором.
            </p>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 20, marginBottom: 8, color: '#111' }}>
              7. Безопасность персональных данных
            </h3>
            <p style={{ marginBottom: 12 }}>
              Безопасность персональных данных, которые обрабатываются Оператором, обеспечивается путем реализации правовых, организационных и технических мер, необходимых для выполнения в полном объеме требований действующего законодательства в области защиты персональных данных.
            </p>

            <h3 style={{ fontSize: 15, fontWeight: 700, marginTop: 20, marginBottom: 8, color: '#111' }}>
              8. Вступление в силу
            </h3>
            <p style={{ marginBottom: 12 }}>
              Настоящее согласие вступает в силу с момента выражения Пользователем согласия на обработку персональных данных путем проставления признака согласия «галочки» в чек-боксе формы сбора данных на веб-сайте.
            </p>
          </div>
        </div>
      )}

    <footer style={{
      background: 'var(--header-bg)',
      color: 'rgba(255,255,255,0.7)',
      padding: '48px 0 24px',
    }}>
      <div className="container">
        {/* Logo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: 32,
        }}>
          <img src="/img/logo.png" alt="ANT ARM" style={{ height: 48 }} />
        </div>

        <div className="footer-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 32,
          marginBottom: 40,
        }}>
          {columns.map(col => (
            <div key={col.title}>
              <h3 style={{
                fontSize: 14,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: 16,
                color: '#fff',
              }}>
                {col.title}
              </h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link to={link.to} style={{
                      fontSize: 14,
                      color: 'rgba(255,255,255,0.6)',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright */}
        <div className="footer-copyright" style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: 24,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              © 2024 ANT ARM. Все права защищены.
            </p>
            <button
              id="btn-policy"
              onClick={() => setPolicyOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: 13,
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                textAlign: 'left',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(255,255,255,0.2)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
            >
              Политика обработки персональных данных
            </button>
            <button
              id="btn-cookie"
              onClick={() => setCookieOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: 13,
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                textAlign: 'left',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(255,255,255,0.2)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
            >
              Политика использования cookie-файлов
            </button>
            <button
              id="btn-consent"
              onClick={() => setConsentOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: 13,
                color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                textAlign: 'left',
                textDecoration: 'underline',
                textDecorationColor: 'rgba(255,255,255,0.2)',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.4)'}
            >
              Согласие на обработку персональных данных
            </button>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            Тактическое снаряжение российского производства
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}
