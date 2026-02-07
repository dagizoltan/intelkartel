export const aboutHandlerSeo = {
  getSeo: (t, lang) => {
    const aboutSchema = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "mainEntity": {
        "@type": "Restaurant",
        "@id": "https://zummogo.hu",
        "name": "Zümmögő"
      }
    };

    const jsonLd = t.jsonld ? { ...aboutSchema, ...t.jsonld } : aboutSchema;

    return {
      title: t.meta?.title || 'About - Zümmögő',
      description: t.meta?.description || 'Learn about Zümmögő',
      keywords: t.meta?.keywords,
      jsonLd: jsonLd,
      canonical: `https://zummogo.hu/${lang}/about`,
      type: 'website'
    };
  }
};
