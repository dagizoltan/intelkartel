export const contactHandlerSeo = {
  getSeo: (t, lang) => {
    const contactPoint = {
      "@type": "ContactPoint",
      "telephone": "+36308125425",
      "contactType": "reservations",
      "areaServed": "HU",
      "availableLanguage": ["en", "hu"]
    };

    const restaurantSchema = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": "Zümmögő",
      "image": "https://zummogo.hu/static/img/image_67534337.webp",
      "@id": "https://zummogo.hu",
      "url": `https://zummogo.hu/${lang}`,
      "telephone": "+36308125425",
      "priceRange": "$$",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "07:00",
          "closes": "19:00"
        }
      ],
      "sameAs": [
        "https://facebook.com/zummogocake",
        "https://instagram.com/zummogocake"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "HU"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 47.4979,
        "longitude": 19.0402
      },
      "contactPoint": contactPoint
    };

    const jsonLd = t.jsonld ? { ...restaurantSchema, ...t.jsonld } : restaurantSchema;

    return {
      title: t.meta?.title || 'Contact - Zümmögő',
      description: t.meta?.description || 'Get in touch with us',
      keywords: t.meta?.keywords,
      jsonLd: jsonLd,
      canonical: `https://zummogo.hu/${lang}/contact`,
      type: 'website'
    };
  }
};
