export function SchoolSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://alihsan.sch.ng";

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOrganization",
        "@id": `${baseUrl}/#organization`,
        "name": "Al-Ihsan International Islamic School",
        "alternateName": ["Al-Ihsan Islamic School Maiduguri", "مدرسة الإحسان الإسلامية"],
        "url": baseUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${baseUrl}/logo.png`,
          "caption": "Al-Ihsan International Islamic School Logo"
        },
        "description": "Premier Islamic educational institution in Maiduguri offering Conventional academic disciplines alongside comprehensive Tahfeez (Quran memorization) across six modern campuses.",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Maiduguri",
          "addressRegion": "Borno State",
          "addressCountry": "NG"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "11.8333",
          "longitude": "13.1500"
        },
        "telephone": "+2348000000000",
        "email": "admissions@alihsan.sch.ng",
        "sameAs": [],
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Academic & Tahfeez Programs",
          "itemListElement": [
            {
              "@type": "Course",
              "name": "Conventional Nursery & Primary Education",
              "description": "Standard national basic curriculum with integrated Islamic morals and Arabic literacy."
            },
            {
              "@type": "Course",
              "name": "Conventional Junior & Senior Secondary (JSS/SSS)",
              "description": "Science, Arts, and Commercial secondary curricula preparing students for WAEC, NECO, and UTME/JAMB."
            },
            {
              "@type": "Course",
              "name": "Full-Time Tahfeez al-Quran",
              "description": "Intensive Quran memorization with certified Tajweed instruction, Muraja'ah revision, and Arabic grammar."
            }
          ]
        }
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": baseUrl,
        "name": "Al-Ihsan International Islamic School",
        "publisher": {
          "@id": `${baseUrl}/#organization`
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}