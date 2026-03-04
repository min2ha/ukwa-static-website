export const languages = {
  en: {
    code: 'en',
    name: 'English',
    urlPrefix: '',
    siteTitle: 'UK Web Archive',
    siteSubtitle: 'National Digital Heritage Library',
    description: 'Preserving the digital heritage of the United Kingdom',
    menu: [
      { name: 'Home',           path: '/',             slug: '' },
      { name: 'Save a Website', path: '/save-website', slug: 'save-website' },
      { name: 'About',          path: '/about',        slug: 'about' },
      { name: 'Contact',        path: '/contact',      slug: 'contact' },
    ],
  },
  cy: {
    code: 'cy',
    name: 'Cymraeg',
    urlPrefix: '/cy',
    siteTitle: 'Archif We y DU',
    siteSubtitle: 'Llyfrgell Dreftadaeth Ddigidol Genedlaethol',
    description: 'Cadw treftadaeth ddigidol y Deyrnas Unedig',
    menu: [
      { name: 'Hafan',              path: '/cy',                  slug: '' },
      { name: 'Cadw Gwefan',        path: '/cy/save-website',     slug: 'save-website' },
      { name: 'Amdanom Ni',         path: '/cy/about',            slug: 'about' },
      { name: 'Cysylltwch â Ni',    path: '/cy/contact',          slug: 'contact' },
    ],
  },
  gd: {
    code: 'gd',
    name: 'Gàidhlig',
    urlPrefix: '/gd',
    siteTitle: 'Tasglann Lìn na RA',
    siteSubtitle: 'Leabharlann Dualchas Didseatach Nàiseanta',
    description: 'A\' gleidheadh dualchas didseatach na Rìoghachd Aonaichte',
    menu: [
      { name: 'Dachaigh',           path: '/gd',              slug: '' },
      { name: 'Sàbhail Làrach-lìn', path: '/gd/save-website', slug: 'save-website' },
      { name: 'Mu ar Deidhinn',     path: '/gd/about',        slug: 'about' },
      { name: 'Cuir Fios Thugainn', path: '/gd/contact',      slug: 'contact' },
    ],
  },
};

export const defaultLanguage = 'en';
export const languageOrder   = ['en', 'cy', 'gd'];
