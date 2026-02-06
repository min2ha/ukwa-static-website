import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FooterLogos from './components/FooterLogos';
import MarkdownPage from './pages/MarkdownPage';
import { useTheme } from './hooks/useTheme';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-950">
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <div className="flex-1">
        <Routes>
          {/* English routes */}
          <Route path="/" element={<MarkdownPage lang="en" slug="" theme={theme} />} />
          <Route path="/about" element={<MarkdownPage lang="en" slug="about" theme={theme} />} />
          <Route path="/contact" element={<MarkdownPage lang="en" slug="contact" theme={theme} />} />
          <Route path="/save-website" element={<MarkdownPage lang="en" slug="save-website" theme={theme} />} />

          {/* Welsh routes */}
          <Route path="/cy" element={<MarkdownPage lang="cy" slug="" theme={theme} />} />
          <Route path="/cy/about" element={<MarkdownPage lang="cy" slug="about" theme={theme} />} />
          <Route path="/cy/contact" element={<MarkdownPage lang="cy" slug="contact" theme={theme} />} />
          <Route path="/cy/save-website" element={<MarkdownPage lang="cy" slug="save-website" theme={theme} />} />

          {/* Gaelic routes */}
          <Route path="/gd" element={<MarkdownPage lang="gd" slug="" theme={theme} />} />
          <Route path="/gd/about" element={<MarkdownPage lang="gd" slug="about" theme={theme} />} />
          <Route path="/gd/contact" element={<MarkdownPage lang="gd" slug="contact" theme={theme} />} />
          <Route path="/gd/save-website" element={<MarkdownPage lang="gd" slug="save-website" theme={theme} />} />

          {/* Fallback */}
          <Route path="*" element={<MarkdownPage lang="en" slug="" theme={theme} />} />
        </Routes>
      </div>

      <FooterLogos theme={theme} />
      <Footer />
    </div>
  );
}

export default App;
