export default function FooterLogos({ theme }) {
  return (
    <section className="bg-white dark:bg-dark-900/50 py-10 mt-16 border-t border-gray-200 dark:border-dark-700">
      <div className="max-w-7xl mx-auto px-6">
        {theme === 'dark' ? (
          <div className="bg-white rounded-xl p-6 md:p-8 max-w-4xl mx-auto">
            <img
              src="/images/footer/about-logos.png"
              alt="Partner Logos"
              className="max-w-full h-auto mx-auto block"
            />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <img
              src="/images/footer/about-logos.png"
              alt="Partner Logos"
              className="max-w-full h-auto mx-auto block"
            />
          </div>
        )}
      </div>
    </section>
  );
}
