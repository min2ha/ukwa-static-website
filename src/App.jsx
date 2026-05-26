import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import FooterLogos from './components/FooterLogos';
import FooterMenu from './components/FooterMenu';
import ScrollToTop from './components/ScrollToTop';
import MarkdownPage from './pages/MarkdownPage';
import InformationIndexPage from './pages/InformationIndexPage';
import CollectionsPage from './pages/CollectionsPage';
import SitemapPage from './pages/SitemapPage';
import { useTheme } from './hooks/useTheme';
import { languages } from './config/languages';

function infoCrumbs(lang) {
  return [
    { label: lang.homeLabel, path: lang.urlPrefix || '/' },
    { label: lang.information.label, path: lang.information.path },
  ];
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const en = languages.en;
  const cy = languages.cy;
  const gd = languages.gd;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-dark-950">
      <ScrollToTop />
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <div className="flex-1">
        <Routes>
          {/* English routes */}
          <Route path="/" element={<MarkdownPage lang="en" slug="" theme={theme} />} />
          <Route path="/themes" element={<MarkdownPage lang="en" slug="themes" theme={theme} />} />
          <Route path="/themes/collections" element={<CollectionsPage />} />
          <Route path="/save-website" element={<MarkdownPage lang="en" slug="save-website" theme={theme} />} />
          <Route path="/contact" element={<MarkdownPage lang="en" slug="contact" theme={theme} />} />

          {/* About Us — kept at /about, breadcrumb shows Home / Information / About Us */}
          <Route path="/about" element={<MarkdownPage lang="en" slug="about" theme={theme} parentBreadcrumbs={infoCrumbs(en)} />} />

          {/* Information section */}
          <Route path="/information" element={<InformationIndexPage langCode="en" />} />
          <Route path="/information/faq" element={<MarkdownPage lang="en" slug="information/faq" theme={theme} parentBreadcrumbs={infoCrumbs(en)} />} />
          <Route path="/information/accessibility" element={<MarkdownPage lang="en" slug="information/accessibility" theme={theme} parentBreadcrumbs={infoCrumbs(en)} />} />
          <Route path="/information/terms" element={<MarkdownPage lang="en" slug="information/terms" theme={theme} parentBreadcrumbs={infoCrumbs(en)} />} />
          <Route path="/information/technical-information" element={<MarkdownPage lang="en" slug="information/technical-information" theme={theme} parentBreadcrumbs={infoCrumbs(en)} />} />
          <Route path="/information/notice-and-takedown" element={<MarkdownPage lang="en" slug="information/notice-and-takedown" theme={theme} parentBreadcrumbs={infoCrumbs(en)} />} />
          <Route path="/information/sitemap" element={<SitemapPage langCode="en" />} />

          {/* Welsh routes */}
          <Route path="/cy" element={<MarkdownPage lang="cy" slug="" theme={theme} />} />
          <Route path="/cy/themes" element={<MarkdownPage lang="cy" slug="themes" theme={theme} />} />
          <Route path="/cy/save-website" element={<MarkdownPage lang="cy" slug="save-website" theme={theme} />} />
          <Route path="/cy/contact" element={<MarkdownPage lang="cy" slug="contact" theme={theme} />} />
          <Route path="/cy/about" element={<MarkdownPage lang="cy" slug="about" theme={theme} parentBreadcrumbs={infoCrumbs(cy)} />} />
          <Route path="/cy/information" element={<InformationIndexPage langCode="cy" />} />
          <Route path="/cy/information/faq" element={<MarkdownPage lang="cy" slug="information/faq" theme={theme} parentBreadcrumbs={infoCrumbs(cy)} />} />
          <Route path="/cy/information/accessibility" element={<MarkdownPage lang="cy" slug="information/accessibility" theme={theme} parentBreadcrumbs={infoCrumbs(cy)} />} />
          <Route path="/cy/information/terms" element={<MarkdownPage lang="cy" slug="information/terms" theme={theme} parentBreadcrumbs={infoCrumbs(cy)} />} />
          <Route path="/cy/information/technical-information" element={<MarkdownPage lang="cy" slug="information/technical-information" theme={theme} parentBreadcrumbs={infoCrumbs(cy)} />} />
          <Route path="/cy/information/notice-and-takedown" element={<MarkdownPage lang="cy" slug="information/notice-and-takedown" theme={theme} parentBreadcrumbs={infoCrumbs(cy)} />} />
          <Route path="/cy/information/sitemap" element={<SitemapPage langCode="cy" />} />

          {/* Gaelic routes */}
          <Route path="/gd" element={<MarkdownPage lang="gd" slug="" theme={theme} />} />
          <Route path="/gd/themes" element={<MarkdownPage lang="gd" slug="themes" theme={theme} />} />
          <Route path="/gd/save-website" element={<MarkdownPage lang="gd" slug="save-website" theme={theme} />} />
          <Route path="/gd/contact" element={<MarkdownPage lang="gd" slug="contact" theme={theme} />} />
          <Route path="/gd/about" element={<MarkdownPage lang="gd" slug="about" theme={theme} parentBreadcrumbs={infoCrumbs(gd)} />} />
          <Route path="/gd/information" element={<InformationIndexPage langCode="gd" />} />
          <Route path="/gd/information/faq" element={<MarkdownPage lang="gd" slug="information/faq" theme={theme} parentBreadcrumbs={infoCrumbs(gd)} />} />
          <Route path="/gd/information/accessibility" element={<MarkdownPage lang="gd" slug="information/accessibility" theme={theme} parentBreadcrumbs={infoCrumbs(gd)} />} />
          <Route path="/gd/information/terms" element={<MarkdownPage lang="gd" slug="information/terms" theme={theme} parentBreadcrumbs={infoCrumbs(gd)} />} />
          <Route path="/gd/information/technical-information" element={<MarkdownPage lang="gd" slug="information/technical-information" theme={theme} parentBreadcrumbs={infoCrumbs(gd)} />} />
          <Route path="/gd/information/notice-and-takedown" element={<MarkdownPage lang="gd" slug="information/notice-and-takedown" theme={theme} parentBreadcrumbs={infoCrumbs(gd)} />} />
          <Route path="/gd/information/sitemap" element={<SitemapPage langCode="gd" />} />

          {/* Fallback */}
          <Route path="*" element={<MarkdownPage lang="en" slug="" theme={theme} />} />
        </Routes>
      </div>

      <FooterMenu />
      <FooterLogos />
      <Footer />
    </div>
  );
}

export default App;
