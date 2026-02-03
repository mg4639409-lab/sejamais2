import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  Check,
  Truck,
  BookOpen,
  Users,
  Shield,
  Star,
  Sparkles,
} from "lucide-react";

const plans = [
  {
    id: "experience",
    name: "Kit 1 Mês",
    subtitle: "Experiência",
    originalPrice: "R$ 495,00",
    price: "R$ 299,00",
    installments: "ou 6x de R$ 54,82",
    features: [
      "1 pote EU+ (30 porções)",
      "Frete Grátis",
      "Garantia de 90 dias",
      "Acesso ao grupo VIP",
    ],
    featured: false,
    cta: "Começar Agora",
  },
  {
    id: "transformation",
    name: "Kit 3 Meses",
    subtitle: "Transformação Completa",
    originalPrice: "R$ 897,00",
    price: "R$ 837,00",
    installments: "ou 6x de R$ 153,45",
    features: [
      "3 potes EU+ (90 porções)",
      "Frete Grátis",
      "Garantia de 90 dias",
      "E-book: Guia da Juventude Funcional",
      "Acesso ao grupo VIP",
      "Suporte de nutricionistas",
    ],
    featured: true,
    cta: "Escolher Kit Completo",
    badge: "Mais Vendido",
  },
];

const OfertasSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="ofertas"
      className="section-padding bg-pure-white"
      ref={ref}
      aria-labelledby="ofertas-heading"
    >
      <div className="container-premium">
        {/* Header */}
        <header className="text-center max-w-3xl mx-auto mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-teal-primary mb-4"
          >
            Oferta Especial
          </motion.span>

          <motion.h2
            id="ofertas-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="heading-section mb-6"
          >
            Escolha seu{" "}
            <span className="italic text-gradient-primary">
              caminho de transformação
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-body-lg"
          >
            Esta é a única vez que você vai precisar comprar um suplemento.
            Porque o EU+ não suplementa — ele nutre, regenera e rejuvenesce.
          </motion.p>
        </header>

        {/* Pricing Cards */}
        <div
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          role="list"
          aria-label="Planos disponíveis"
        >
          {plans.map((plan, index) => (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
              className={`pricing-card relative ${plan.featured ? "featured" : ""}`}
              aria-label={`Plano ${plan.name}`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-teal-primary to-teal-dark text-pure-white text-xs font-bold uppercase tracking-widest px-6 py-2 rounded-full flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-8">
                <span className="text-sm font-semibold uppercase tracking-widest text-teal-primary">
                  {plan.subtitle}
                </span>
                <h3 className="font-display text-2xl font-medium text-charcoal mt-2">
                  {plan.name}
                </h3>
              </div>

              {/* Pricing */}
              <div className="text-center mb-8">
                <div className="text-gray-medium line-through text-sm mb-1">
                  {plan.originalPrice}
                </div>
                <div className="text-4xl font-display font-semibold text-charcoal mb-1">
                  {plan.price}
                </div>
                <div className="text-sm text-gray-medium">
                  {plan.installments}
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-teal-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <motion.a
                href="#"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`block w-full text-center py-4 rounded-full font-medium transition-all duration-300 min-h-[48px] flex items-center justify-center ${
                  plan.featured ? "btn-hero" : "btn-outline-premium"
                }`}
                aria-label={`${plan.cta} - ${plan.name} por ${plan.price}`}
              >
                {plan.cta}
              </motion.a>
            </motion.article>
          ))}
        </div>

        {/* Trust Icons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-8 mt-16 pt-12 border-t border-sage-light"
        >
          <div className="flex items-center gap-3 text-gray-medium">
            <Truck className="w-6 h-6 text-teal-primary" />
            <span className="text-sm">Frete Grátis Brasil</span>
          </div>
          <div className="flex items-center gap-3 text-gray-medium">
            <Shield className="w-6 h-6 text-teal-primary" />
            <span className="text-sm">Garantia 90 dias</span>
          </div>
          <div className="flex items-center gap-3 text-gray-medium">
            <BookOpen className="w-6 h-6 text-teal-primary" />
            <span className="text-sm">E-book Exclusivo</span>
          </div>
          <div className="flex items-center gap-3 text-gray-medium">
            <Users className="w-6 h-6 text-teal-primary" />
            <span className="text-sm">Grupo VIP</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OfertasSection;
