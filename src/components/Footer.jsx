export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 dark:bg-dark-900 border-t border-blue-800 dark:border-dark-700 py-8">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-blue-100 dark:text-dark-400 text-sm">
          &copy; {year} UK Web Archive. All rights reserved. Preserving the UK Web for future generations.
        </p>
      </div>
    </footer>
  );
}
