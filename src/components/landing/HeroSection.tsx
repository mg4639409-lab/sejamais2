import { motion } from "framer-motion";
import { useEffect } from "react";
import { ArrowDown, Shield, Award, FlaskConical } from "lucide-react";
// import productImage from "@/assets/product.jpg"; // Comentado - substituído por vídeo

const HeroSection = () => {
  // Carregar o script do ConverteAI SmartPlayer
  useEffect(() => {
    const existingScript = document.querySelector(
      'script[src="https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js"]',
    );

    if (!existingScript) {
      const script = document.createElement("script");
      script.src =
        "https://scripts.converteai.net/lib/js/smartplayer-wc/v4/sdk.js";
      script.async = true;
      document.head.appendChild(script);
    }

    // adicionar links de preload / dns-prefetch e script de timing
    const resources = [
      { rel: "preload", href: "https://scripts.converteai.net/ce246ce3-bcb0-4846-87d1-6fd1c81eefd1/players/69811001a3ae121d902236bc/v4/embed.html" },
      { rel: "preload", href: "https://scripts.converteai.net/ce246ce3-bcb0-4846-87d1-6fd1c81eefd1/players/69811001a3ae121d902236bc/v4/player.js", as: "script" },
      { rel: "preload", href: "https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js", as: "script" },
      { rel: "preload", href: "https://cdn.converteai.net/ce246ce3-bcb0-4846-87d1-6fd1c81eefd1/69810f3812b542adc950b38a/main.m3u8", as: "fetch" },
      { rel: "dns-prefetch", href: "https://cdn.converteai.net" },
      { rel: "dns-prefetch", href: "https://scripts.converteai.net" },
      { rel: "dns-prefetch", href: "https://images.converteai.net" },
      { rel: "dns-prefetch", href: "https://api.vturb.com.br" },
    ];
    resources.forEach(({rel, href, as}) => {
      const link = document.createElement("link");
      link.rel = rel;
      link.href = href;
      if (as) link.as = as;
      document.head.appendChild(link);
    });

    const timing = document.createElement("script");
    timing.innerHTML =
      '!function(i,n){i._plt=i._plt||(n&&n.timeOrigin?n.timeOrigin+n.now():Date.now())}(window,performance);';
    document.head.appendChild(timing);
  }, []);

  return (
    <section
      className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-subtle"
      aria-labelledby="hero-heading"
    >
      {/* Background Decorative Elements */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-teal-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sage-light/50 rounded-full blur-3xl" />
      </div>

      {/* ==================== DESKTOP: Vídeo em tela cheia ==================== */}
      <div className="hidden lg:flex relative z-10 flex-1 items-center justify-center w-full h-screen">
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          <div
            id="ifr_698129690d9bb07e86a71dbd_wrapper"
            style={{ margin: "0 auto", width: "100%" }}
          >
            <div
              style={{
                position: "relative",
                padding: "56.20608899297424% 0 0 0",
              }}
              id="ifr_698129690d9bb07e86a71dbd_aspect"
            >
              <iframe
                frameBorder="0"
                allowFullScreen
                src="https://scripts.converteai.net/ce246ce3-bcb0-4846-87d1-6fd1c81eefd1/players/69811001a3ae121d902236bc/v4/embed.html"
                id="ifr_698129690d9bb07e86a71dbd"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                referrerPolicy="origin"
                title="EU+ Suplemento Rejuvenecedor Celular - Vídeo de Apresentação"
              />
            </div>
          </div>
          {/* Overlay para suavizar bordas */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent pointer-events-none" />
        </div>

        {/* Scroll Indicator - Desktop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <motion.a
            href="#problema"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-gray-medium hover:text-teal-primary transition-colors min-h-[48px] min-w-[48px] justify-center"
            aria-label="Rolar para seção sobre o problema do envelhecimento"
          >
            <span className="text-xs uppercase tracking-widest mb-2">
              Descubra Mais
            </span>
            <ArrowDown className="w-5 h-5" aria-hidden="true" />
          </motion.a>
        </motion.div>
      </div>

      {/* ==================== MOBILE: Vídeo + Conteúdo abaixo ==================== */}
      <div className="lg:hidden relative z-10 pt-24 pb-20">
        {/* Vídeo Mobile */}
        <div className="w-full px-4 mb-8">
          <div
            id="ifr_698129690d9bb07e86a71dbd_wrapper_mobile"
            style={{ margin: "0 auto", width: "100%" }}
          >
            <div
              style={{
                position: "relative",
                padding: "56.20608899297424% 0 0 0",
              }}
              id="ifr_698129690d9bb07e86a71dbd_aspect_mobile"
              className="rounded-3xl shadow-elevated overflow-hidden"
            >
              <iframe
                frameBorder="0"
                allowFullScreen
                src="https://scripts.converteai.net/ce246ce3-bcb0-4846-87d1-6fd1c81eefd1/players/69811001a3ae121d902236bc/v4/embed.html"
                id="ifr_698129690d9bb07e86a71dbd_mobile"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                referrerPolicy="origin"
                title="EU+ Suplemento Rejuvenecedor Celular - Vídeo de Apresentação"
              />
            </div>
          </div>
        </div>

        {/* Conteúdo Mobile - Texto e Botões */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="container-premium text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="badge-premium mb-6 mx-auto inline-flex"
            role="status"
          >
            <FlaskConical className="w-4 h-4" aria-hidden="true" />
            <span>Patente INPI BR 10 2024 012316 6</span>
          </motion.div>

          {/* Headline - H1 único na página */}
          <h1
            id="hero-heading"
            className="heading-hero mb-4 text-3xl md:text-4xl"
          >
            O Único{" "}
            <span className="text-gradient-primary italic">
              Rejuvenecedor Celular
            </span>{" "}
            do Mundo
          </h1>

          {/* Subheadline */}
          <p className="text-body-lg mb-6 max-w-xl mx-auto text-base">
            Acabou a era dos suplementos fracionados. Chegou a era da{" "}
            <strong className="text-charcoal">nutrição integrada</strong> — 31
            ativos que nutrem os 11 sistemas do corpo simultaneamente.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
            <motion.a
              href="#ofertas"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-hero text-center min-h-[48px] min-w-[48px] flex items-center justify-center"
              aria-label="Ver ofertas e comprar EU+"
            >
              Quero Rejuvenescer Agora
            </motion.a>
            <motion.a
              href="#beneficios"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-outline-premium text-center min-h-[48px] min-w-[48px] flex items-center justify-center"
              aria-label="Conhecer os benefícios do EU+"
            >
              Conhecer Benefícios
            </motion.a>
          </div>

          {/* Trust Badges */}
          <ul
            className="flex flex-wrap gap-4 justify-center"
            aria-label="Selos de confiança"
          >
            <li className="flex items-center gap-2">
              <Shield
                className="w-5 h-5 text-teal-primary"
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-gray-medium">
                Aprovado ANVISA
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-primary" aria-hidden="true" />
              <span className="text-sm font-medium text-gray-medium">
                Patente Própria
              </span>
            </li>
            <li className="flex items-center gap-2">
              <FlaskConical
                className="w-5 h-5 text-teal-primary"
                aria-hidden="true"
              />
              <span className="text-sm font-medium text-gray-medium">
                31 Ativos Ergogênicos
              </span>
            </li>
          </ul>
        </motion.div>

        {/* Scroll Indicator - Mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8 flex justify-center"
        >
          <motion.a
            href="#problema"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-gray-medium hover:text-teal-primary transition-colors min-h-[48px] min-w-[48px] justify-center"
            aria-label="Rolar para seção sobre o problema do envelhecimento"
          >
            <span className="text-xs uppercase tracking-widest mb-2">
              Descubra Mais
            </span>
            <ArrowDown className="w-5 h-5" aria-hidden="true" />
          </motion.a>
        </motion.div>
      </div>

      {/* 
      ========================================
      CÓDIGO ORIGINAL COMPLETO - COMENTADO
      ========================================
      
      <div className="container-premium relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="badge-premium mb-8"
              role="status"
            >
              <FlaskConical className="w-4 h-4" aria-hidden="true" />
              <span>Patente INPI BR 10 2024 012316 6</span>
            </motion.div>

            <h1 id="hero-heading" className="heading-hero mb-6">
              O Único{" "}
              <span className="text-gradient-primary italic">
                Rejuvenecedor Celular
              </span>{" "}
              do Mundo
            </h1>

            <p className="text-body-lg mb-8 max-w-xl">
              Acabou a era dos suplementos fracionados. Chegou a era da{" "}
              <strong className="text-charcoal">nutrição integrada</strong> — 31
              ativos que nutrem os 11 sistemas do corpo simultaneamente.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <motion.a
                href="#ofertas"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-hero text-center min-h-[48px] min-w-[48px] flex items-center justify-center"
                aria-label="Ver ofertas e comprar EU+"
              >
                Quero Rejuvenescer Agora
              </motion.a>
              <motion.a
                href="#beneficios"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-outline-premium text-center min-h-[48px] min-w-[48px] flex items-center justify-center"
                aria-label="Conhecer os benefícios do EU+"
              >
                Conhecer Benefícios
              </motion.a>
            </div>

            <ul
              className="flex flex-wrap gap-6"
              aria-label="Selos de confiança"
            >
              <li className="flex items-center gap-2">
                <Shield
                  className="w-5 h-5 text-teal-primary"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-gray-medium">
                  Aprovado ANVISA
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Award
                  className="w-5 h-5 text-teal-primary"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-gray-medium">
                  Patente Própria
                </span>
              </li>
              <li className="flex items-center gap-2">
                <FlaskConical
                  className="w-5 h-5 text-teal-primary"
                  aria-hidden="true"
                />
                <span className="text-sm font-medium text-gray-medium">
                  31 Ativos Ergogênicos
                </span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="relative">
              <div
                className="absolute inset-0 bg-teal-primary/10 blur-3xl rounded-full scale-75"
                aria-hidden="true"
              />

              <img
                src={productImage}
                alt="EU+ Suplemento Rejuvenecedor Celular em pó - Embalagem premium com 31 ativos ergogênicos para nutrição integrada dos 11 sistemas do corpo"
                className="relative w-1/2 max-w-lg mx-auto rounded-3xl shadow-elevated"
                loading="eager"
                width="512"
                height="512"
                fetchPriority="high"
              />

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="absolute -right-4 md:right-0 top-1/4 bg-pure-white rounded-2xl p-4 shadow-medium"
                aria-label="11 sistemas do corpo nutridos"
              >
                <div className="text-center">
                  <span
                    className="block text-3xl font-display font-semibold text-teal-primary"
                    aria-hidden="true"
                  >
                    11
                  </span>
                  <span className="text-xs text-gray-medium">
                    Sistemas Nutridos
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute -left-4 md:left-0 bottom-1/4 bg-pure-white rounded-2xl p-4 shadow-medium"
                aria-label="Mais de 300 reações bioquímicas estudadas"
              >
                <div className="text-center">
                  <span
                    className="block text-3xl font-display font-semibold text-teal-primary"
                    aria-hidden="true"
                  >
                    300+
                  </span>
                  <span className="text-xs text-gray-medium">
                    Reações Bioquímicas
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.a
            href="#problema"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center text-gray-medium hover:text-teal-primary transition-colors min-h-[48px] min-w-[48px] justify-center"
            aria-label="Rolar para seção sobre o problema do envelhecimento"
          >
            <span className="text-xs uppercase tracking-widest mb-2">
              Descubra Mais
            </span>
            <ArrowDown className="w-5 h-5" aria-hidden="true" />
          </motion.a>
        </motion.div>
      </div>
      
      ========================================
      */}
    </section>
  );
};

export default HeroSection;
