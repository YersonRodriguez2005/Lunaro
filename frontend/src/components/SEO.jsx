import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, image, url }) {
  const siteName = "Lunaro";
  const defaultTitle = "Lunaro | Tu tienda de ropa y moda en Neiva";
  const defaultDescription = "Descubre las últimas tendencias en ropa y moda. Calidad garantizada, envíos a toda Colombia y domicilios locales rápidos en Neiva, Huila.";
  const defaultImage = "https://tu-dominio.com/banner-neiva.jpg"; // Reemplazar con una imagen real cuando despliegues
  
  const finalTitle = title ? `${title} | ${siteName}` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalImage = image || defaultImage;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      {/* Etiquetas Estándar */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />

      {/* Open Graph (Facebook, WhatsApp, LinkedIn) */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={finalImage} />

      {/* Etiquetas Geo-espaciales (SEO Local para Neiva) */}
      <meta name="geo.region" content="CO-HUI" />
      <meta name="geo.placename" content="Neiva" />
      <meta name="geo.position" content="2.9273;-75.28189" /> {/* Coordenadas aprox de Neiva */}
      <meta name="ICBM" content="2.9273, -75.28189" />
    </Helmet>
  );
}