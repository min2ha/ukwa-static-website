import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FooterLogos from './components/FooterLogos';
import MarkdownPage from './pages/MarkdownPage';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen overflow-hidden bg-mist-50 text-ink-900 transition-colors duration-500 dark:bg-ink-950 dark:text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-10rem] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl dark:bg-brand-400/12" />
        <div className="absolute right-[-8rem] top-24 h-[28rem] w-[28rem] rounded-full bg-copper-300/35 blur-3xl dark:bg-copper-400/10" />
        <div className="absolute left-[-10rem] bottom-[-8rem] h-[24rem] w-[24rem] rounded-full bg-brand-200/50 blur-3xl dark:bg-brand-300/8" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.7),transparent_22%,transparent_78%,rgba(8,16,23,0.06))] dark:bg-[linear-gradient(180deg,rgba(2,8,12,0.2),transparent_20%,transparent_75%,rgba(2,8,12,0.55))]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col scheme-light dark:scheme-dark">
        <Header theme={theme} onToggleTheme={toggleTheme} />

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<MarkdownPage lang="en" slug="" />} />
            <Route path="/about" element={<MarkdownPage lang="en" slug="about" />} />
            <Route path="/contact" element={<MarkdownPage lang="en" slug="contact" />} />
            <Route path="/save-website" element={<MarkdownPage lang="en" slug="save-website" />} />

            <Route path="/cy" element={<MarkdownPage lang="cy" slug="" />} />
            <Route path="/cy/about" element={<MarkdownPage lang="cy" slug="about" />} />
            <Route path="/cy/contact" element={<MarkdownPage lang="cy" slug="contact" />} />
            <Route path="/cy/save-website" element={<MarkdownPage lang="cy" slug="save-website" />} />

            <Route path="/gd" element={<MarkdownPage lang="gd" slug="" />} />
            <Route path="/gd/about" element={<MarkdownPage lang="gd" slug="about" />} />
            <Route path="/gd/contact" element={<MarkdownPage lang="gd" slug="contact" />} />
            <Route path="/gd/save-website" element={<MarkdownPage lang="gd" slug="save-website" />} />

            <Route path="*" element={<MarkdownPage lang="en" slug="" />} />
          </Routes>
        </div>

        <FooterLogos />
        <Footer />
      </div>
    </div>
  );
}

export default App;
