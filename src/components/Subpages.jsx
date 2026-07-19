import { ChevronLeft } from 'lucide-react';
import { ChunkyButton } from './UI';

export function PageContent({ pageId }) {
  switch(pageId) {
    case 'about':
      return (
        <div style={{ textAlign: 'left', color: '#ccc', lineHeight: 1.8, fontFamily: "'Nunito', sans-serif" }}>
          <h2 style={{ color: '#fff', marginBottom: '1rem', fontFamily: "'Bungee', sans-serif", fontSize: '1.5rem' }}>About QuizMania</h2>
          <p>Welcome to QuizMania! We are a dedicated platform for free, high-quality multiplayer team web games.</p>
          <p>Founded by passionate developers, our mission is to provide an accessible, cooperative, and entertaining trivia experience for players worldwide. Unlike standard competitive trivia games, QuizMania emphasizes teamwork: players discuss and vote on questions together, and the host locks in the final answer.</p>
          <h3 style={{ color: '#fff', marginTop: '1.5rem', fontFamily: "'Bungee', sans-serif', fontSize: '1.1rem" }}>Our Cooperative Vision</h3>
          <p>We believe in the power of gaming to bring people together. That's why all game modes on QuizMania are completely free-to-play, requiring no downloads or installations.</p>
          <p>If you have any questions or feedback, please feel free to reach out via our Contact Us page.</p>
        </div>
      );
    case 'privacy-policy':
      return (
        <div style={{ textAlign: 'left', color: '#ccc', lineHeight: 1.8, fontFamily: "'Nunito', sans-serif" }}>
          <h2 style={{ color: '#fff', marginBottom: '1rem', fontFamily: "'Bungee', sans-serif", fontSize: '1.5rem' }}>Privacy Policy</h2>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>Effective Date: {new Date().toLocaleDateString()}</p>
          <p>At QuizMania, we take your privacy seriously. This policy outlines how we collect, use, and protect your personal data when you use our services.</p>
          <h3 style={{ color: '#fff', marginTop: '1.5rem', fontFamily: "'Bungee', sans-serif", fontSize: '1.1rem' }}>1. Information We Collect</h3>
          <p>We may collect information such as your nickname (for game lobbies), IP address, browser type, and interactions with our games to improve your experience and manage game socket connections.</p>
          <h3 style={{ color: '#fff', marginTop: '1.5rem', fontFamily: "'Bungee', sans-serif", fontSize: '1.1rem' }}>2. Google AdSense & Third-Party Cookies</h3>
          <p>We use third-party advertising companies, including Google, to serve ads when you visit our website. Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites.</p>
          <p>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</p>
          <p>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noreferrer" style={{ color: '#4A9EFF', textDecoration: 'none' }}>Ads Settings</a> or by visiting <a href="http://www.aboutads.info" target="_blank" rel="noreferrer" style={{ color: '#4A9EFF', textDecoration: 'none' }}>www.aboutads.info</a>.</p>
          <h3 style={{ color: '#fff', marginTop: '1.5rem', fontFamily: "'Bungee', sans-serif", fontSize: '1.1rem' }}>3. How We Use Your Information</h3>
          <p>Your data is used to provide, maintain, and improve our games and services, and to ensure compliance with our terms.</p>
        </div>
      );
    case 'legal':
    case 'cookie-declaration':
      return (
        <div style={{ textAlign: 'left', color: '#ccc', lineHeight: 1.8, fontFamily: "'Nunito', sans-serif" }}>
          <h2 style={{ color: '#fff', marginBottom: '1rem', fontFamily: "'Bungee', sans-serif", fontSize: '1.5rem', textTransform: 'capitalize' }}>{pageId.replace(/-/g, ' ')}</h2>
          <p>QuizMania is an independent game development studio project.</p>
          <p>All content, including games, artwork, sound engines, and code, is the property of QuizMania unless otherwise stated.</p>
          <p>Disclaimer: Question databases and categories (e.g., Anime & Manga, Movies, Video Games) reference copyrighted titles for educational trivia purposes under fair use guidelines.</p>
        </div>
      );
    case 'contact-us':
      return (
        <div style={{ textAlign: 'left', color: '#ccc', width: '100%', maxWidth: '500px', fontFamily: "'Nunito', sans-serif" }}>
          <h2 style={{ color: '#fff', marginBottom: '1.5rem', textAlign: 'center', fontFamily: "'Bungee', sans-serif", fontSize: '1.5rem' }}>Contact Us</h2>
          <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Your Name" style={{ padding: '12px', background: '#161616', border: '1px solid #2a2a2a', color: '#fff', borderRadius: '8px', outline: 'none', fontFamily: 'inherit' }} />
            <input type="email" placeholder="Your Email" style={{ padding: '12px', background: '#161616', border: '1px solid #2a2a2a', color: '#fff', borderRadius: '8px', outline: 'none', fontFamily: 'inherit' }} />
            <textarea placeholder="Your Message" rows="5" style={{ padding: '12px', background: '#161616', border: '1px solid #2a2a2a', color: '#fff', borderRadius: '8px', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }}></textarea>
            <button style={{ width: '100%', padding: '12px', fontSize: '1rem', background: '#4A9EFF', border: 'none', color: '#000', fontWeight: 900, borderRadius: '8px', cursor: 'pointer', fontFamily: "'Bungee', sans-serif" }}>Send Message</button>
          </form>
        </div>
      );
    default:
      return (
        <div style={{ textAlign: 'center', fontFamily: "'Nunito', sans-serif" }}>
          <h2 style={{ color: '#fff', marginBottom: '1rem', textTransform: 'capitalize', fontFamily: "'Bungee', sans-serif", fontSize: '1.5rem' }}>{pageId.replace(/-/g, ' ')}</h2>
          <p style={{ color: '#aaa', fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6 }}>
            This section is currently under construction. Please check back later!
          </p>
        </div>
      );
  }
}

export default function Subpages({ pageId, onBack }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0d0d0d', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', color: '#e5e5e5' }}>
      <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', background: '#161616', padding: '3rem', borderRadius: '12px', border: '1px solid #222', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <PageContent pageId={pageId} />
        <ChunkyButton 
          color="#1a1a1a" 
          onClick={onBack}
          style={{ marginTop: '2.5rem', padding: '0.8rem 2rem', display: 'flex', gap: '8px', alignItems: 'center', border: '2px solid #333' }}
        >
          <ChevronLeft size={18} color="#fff" /> Back to Game
        </ChunkyButton>
      </div>
    </div>
  );
}
