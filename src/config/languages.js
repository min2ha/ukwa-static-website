export const languages = {
  en: {
    code: 'en',
    name: 'English',
    urlPrefix: '',
    siteTitle: 'UK Web Archive',
    description: 'Preserving the UK Web for future generations',
    menu: [
      { name: 'Home', path: '/', slug: '' },
      { name: 'Save a UK Website', path: '/save-website', slug: 'save-website' },
      { name: 'About Us', path: '/about', slug: 'about' },
      { name: 'Contact Us', path: '/contact', slug: 'contact' },
    ],
  },
  cy: {
    code: 'cy',
    name: 'Cymraeg',
    urlPrefix: '/cy',
    siteTitle: 'Archif We y DU',
    description: "Cadw'r We yn y DU ar gyfer cenedlaethau'r dyfodol",
    menu: [
      { name: 'Hafan', path: '/cy', slug: '' },
      { name: 'Cadw Gwefan y DU', path: '/cy/save-website', slug: 'save-website' },
      { name: 'Amdanom Ni', path: '/cy/about', slug: 'about' },
      { name: 'Cysylltwch \u00e2 Ni', path: '/cy/contact', slug: 'contact' },
    ],
  },
  gd: {
    code: 'gd',
    name: 'G\u00e0idhlig',
    urlPrefix: '/gd',
    siteTitle: 'Tasglann L\u00ecn na RA',
    description: "A' gleidheadh L\u00econ na RA airson ginealaich ri teachd",
    menu: [
      { name: 'Dachaigh', path: '/gd', slug: '' },
      { name: 'S\u00e0bhail L\u00e0rach-l\u00ecn na RA', path: '/gd/save-website', slug: 'save-website' },
      { name: 'Mu ar Deidhinn', path: '/gd/about', slug: 'about' },
      { name: 'Cuir Fios Thugainn', path: '/gd/contact', slug: 'contact' },
    ],
  },
};

export const defaultLanguage = 'en';
export const languageOrder = ['en', 'cy', 'gd'];
