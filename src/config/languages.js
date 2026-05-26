export const languages = {
  en: {
    code: 'en',
    name: 'English',
    urlPrefix: '',
    siteTitle: 'UK Web Archive',
    description: 'Preserving the UK Web for future generations',
    homeLabel: 'Home',
    menu: [
      { name: 'Home', path: '/', slug: '' },
      { name: 'Collections and Themes', path: '/themes/collections', slug: 'themes' },
      { name: 'Save a UK Website', path: '/save-website', slug: 'save-website' },
      { name: 'About Us', path: '/about', slug: 'about' },
      { name: 'Contact Us', path: '/contact', slug: 'contact' },
    ],
    information: {
      label: 'Information',
      path: '/information',
      pages: [
        { name: 'About Us', path: '/about', slug: 'about' },
        { name: 'FAQ', path: '/information/faq', slug: 'information/faq' },
        { name: 'Cookie Policy', path: 'https://join-britishlibrary.co.uk/cookie-policy/', isExternal: true },
        { name: 'Accessibility Statement', path: '/information/accessibility', slug: 'information/accessibility' },
        { name: 'Terms and Conditions', path: '/information/terms', slug: 'information/terms' },
        { name: 'Technical Information', path: '/information/technical-information', slug: 'information/technical-information' },
        { name: 'Notice and Takedown', path: '/information/notice-and-takedown', slug: 'information/notice-and-takedown' },
      ],
    },
  },
  cy: {
    code: 'cy',
    name: 'Cymraeg',
    urlPrefix: '/cy',
    siteTitle: 'Archif We y DU',
    description: "Cadw'r We yn y DU ar gyfer cenedlaethau'r dyfodol",
    homeLabel: 'Hafan',
    menu: [
      { name: 'Hafan', path: '/cy', slug: '' },
      { name: 'Them\u00e2u', path: '/cy/themes', slug: 'themes' },
      { name: 'Cadw Gwefan y DU', path: '/cy/save-website', slug: 'save-website' },
      { name: 'Amdanom Ni', path: '/cy/about', slug: 'about' },
      { name: 'Cysylltwch \u00e2 Ni', path: '/cy/contact', slug: 'contact' },
    ],
    information: {
      label: 'Gwybodaeth',
      path: '/cy/information',
      pages: [
        { name: 'Amdanom Ni', path: '/cy/about', slug: 'about' },
        { name: 'Cwestiynau Cyffredin', path: '/cy/information/faq', slug: 'information/faq' },
        { name: 'Polisi Cwcis', path: 'https://join-britishlibrary.co.uk/cookie-policy/', isExternal: true },
        { name: 'Datganiad Hygyrchedd', path: '/cy/information/accessibility', slug: 'information/accessibility' },
        { name: 'Telerau ac Amodau', path: '/cy/information/terms', slug: 'information/terms' },
        { name: 'Gwybodaeth Dechnegol', path: '/cy/information/technical-information', slug: 'information/technical-information' },
        { name: 'Hysbysiad a Dileu', path: '/cy/information/notice-and-takedown', slug: 'information/notice-and-takedown' },
      ],
    },
  },
  gd: {
    code: 'gd',
    name: 'G\u00e0idhlig',
    urlPrefix: '/gd',
    siteTitle: 'Tasglann L\u00ecn na RA',
    description: "A' gleidheadh L\u00econ na RA airson ginealaich ri teachd",
    homeLabel: 'Dachaigh',
    menu: [
      { name: 'Dachaigh', path: '/gd', slug: '' },
      { name: 'Cuspairean', path: '/gd/themes', slug: 'themes' },
      { name: 'S\u00e0bhail L\u00e0rach-l\u00ecn na RA', path: '/gd/save-website', slug: 'save-website' },
      { name: 'Mu ar Deidhinn', path: '/gd/about', slug: 'about' },
      { name: 'Cuir Fios Thugainn', path: '/gd/contact', slug: 'contact' },
    ],
    information: {
      label: 'Fiosrachadh',
      path: '/gd/information',
      pages: [
        { name: 'Mu ar Deidhinn', path: '/gd/about', slug: 'about' },
        { name: 'Ceistean Cumanta', path: '/gd/information/faq', slug: 'information/faq' },
        { name: 'Poileasaidh Briosgaidean', path: 'https://join-britishlibrary.co.uk/cookie-policy/', isExternal: true },
        { name: 'Aithris In-ruigsinneachd', path: '/gd/information/accessibility', slug: 'information/accessibility' },
        { name: 'Teirmichean is Cumhaichean', path: '/gd/information/terms', slug: 'information/terms' },
        { name: 'Fiosrachadh Teicnigeach', path: '/gd/information/technical-information', slug: 'information/technical-information' },
        { name: 'Fios is Toirt air Falbh', path: '/gd/information/notice-and-takedown', slug: 'information/notice-and-takedown' },
      ],
    },
  },
};

export const defaultLanguage = 'en';
export const languageOrder = ['en', 'cy', 'gd'];
