import { Helmet } from 'react-helmet';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export function SEOHead({
  title = 'CreatorAIDE - AI-Powered TikTok Content Optimization Platform',
  description = 'Optimize your TikTok content strategy with AI-powered analytics, virality predictions, and content creation tools',
  keywords = 'TikTok, Content Creation, Creator Tools, Social Media Analytics, Virality Predictor',
  ogImage = '/og-image.jpg',
  ogType = 'website',
  canonicalUrl,
  noIndex = false
}: SEOHeadProps) {
  const siteName = 'CreatorAIDE';
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={siteName} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      
      {/* Twitter card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* No index directive if needed */}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
}