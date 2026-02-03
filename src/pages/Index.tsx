import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import ProblemaSection from "@/components/landing/ProblemaSection";
import ApresentacaoSection from "@/components/landing/ApresentacaoSection";
import BeneficiosSection from "@/components/landing/BeneficiosSection";
import DiferenciaisSection from "@/components/landing/DiferenciaisSection";
import DepoimentosSection from "@/components/landing/DepoimentosSection";
import OfertasSection from "@/components/landing/OfertasSection";
import GarantiaSection from "@/components/landing/GarantiaSection";
import FAQSection from "@/components/landing/FAQSection";
import CTAFinalSection from "@/components/landing/CTAFinalSection";
import Footer from "@/components/landing/Footer";
import { Helmet } from "react-helmet-async";

const Index = () => {
  // Schema.org structured data
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "EU+ Rejuvenecedor Celular",
    "description": "O único rejuvenecedor celular do mundo com 31 ativos ergogênicos que nutrem os 11 sistemas do corpo simultaneamente.",
    "brand": {
      "@type": "Brand",
      "name": "EU+"
    },
    "offers": {
      "@type": "AggregateOffer",
      "lowPrice": "197.00",
      "highPrice": "397.00",
      "priceCurrency": "BRL",
      "availability": "https://schema.org/InStock",
      "offerCount": "2"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1500",
      "bestRating": "5",
      "worstRating": "1"
    },
    "image": "https://sejaeumais.com/product-image.jpg",
    "url": "https://sejaeumais.com/",
    "sku": "EUPLUS-001",
    "mpn": "BR102024012316",
    "category": "Suplementos Alimentares"
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "EU+",
    "url": "https://sejaeumais.com",
    "logo": "https://sejaeumais.com/logo.png",
    "sameAs": [
      "https://www.instagram.com/sejaeumais"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "contato@sejaeumais.com",
      "contactType": "customer service",
      "availableLanguage": "Portuguese"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Posso tomar EU+ com outros medicamentos?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sim, o EU+ é natural e sinérgico, podendo ser consumido com outros medicamentos. Recomendamos consultar seu médico antes de iniciar qualquer suplementação."
        }
      },
      {
        "@type": "Question",
        "name": "O EU+ tem efeitos colaterais?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Não. O EU+ foi desenvolvido para biocompatibilidade máxima, utilizando dosagens terapêuticas seguras dentro dos parâmetros estabelecidos pela ANVISA."
        }
      },
      {
        "@type": "Question",
        "name": "Em quanto tempo verei resultados?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Em 30 dias você começa a sentir a energia. Em 60 dias, você vê a pele e cabelo transformados. Em 90 dias, você se sente rejuvenescido por dentro e por fora."
        }
      },
      {
        "@type": "Question",
        "name": "Por que o EU+ é em pó?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "A forma em pó oferece maior biodisponibilidade e absorção celular acelerada. O pó começa a ser absorvido imediatamente, garantindo eficácia máxima."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://sejaeumais.com/"
      }
    ]
  };

  return (
    <>
      <Helmet>
        {/* Primary Meta Tags - Optimized */}
        <title>EU+ Rejuvenecedor Celular | 31 Ativos para Longevidade</title>
        <meta 
          name="description" 
          content="EU+ é o único rejuvenecedor celular patenteado do mundo. 31 ativos ergogênicos que nutrem os 11 sistemas do corpo. Aprovado ANVISA. Garantia 90 dias." 
        />
        <meta 
          name="keywords" 
          content="EU+, suplemento rejuvenescedor, rejuvenescimento celular, nutrição integrada, longevidade, anti-envelhecimento, suplemento patenteado, ANVISA, 31 ativos" 
        />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://sejaeumais.com/" />
        <meta property="og:title" content="EU+ | O Único Rejuvenecedor Celular do Mundo" />
        <meta 
          property="og:description" 
          content="31 ativos ergogênicos que nutrem os 11 sistemas do corpo simultaneamente. Fórmula patenteada, aprovada pela ANVISA." 
        />
        <meta property="og:image" content="https://sejaeumais.com/og-image.jpg" />
        <meta property="og:site_name" content="EU+" />
        <meta property="og:locale" content="pt_BR" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://sejaeumais.com/" />
        <meta name="twitter:title" content="EU+ | Rejuvenecedor Celular Patenteado" />
        <meta 
          name="twitter:description" 
          content="31 ativos ergogênicos para rejuvenescimento celular. Patente própria. Aprovado ANVISA. Garantia 90 dias." 
        />
        <meta name="twitter:image" content="https://sejaeumais.com/og-image.jpg" />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <meta name="author" content="EU+" />
        <link rel="canonical" href="https://sejaeumais.com/" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {JSON.stringify(productSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen">
        <Header />
        <main id="main-content" role="main">
          <HeroSection />
          <ProblemaSection />
          <ApresentacaoSection />
          <BeneficiosSection />
          <DiferenciaisSection />
          <DepoimentosSection />
          <OfertasSection />
          <GarantiaSection />
          <FAQSection />
          <CTAFinalSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
