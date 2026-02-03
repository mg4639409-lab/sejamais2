import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, Shield, Award, Truck } from "lucide-react";

const CTAFinalSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      className="section-padding bg-gradient-to-br from-teal-primary to-teal-dark" 
      ref={ref}
      aria-labelledby="cta-heading"
    >
      <div className="container-premium">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Content */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-block text-sm font-semibold uppercase tracking-widest text-pure-white/70 mb-6"
          >
            Sua Transformação Começa Agora
          </motion.span>

          <motion.h2
            id="cta-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-medium text-pure-white leading-tight mb-6"
          >
            Juventude funcional não é uma opção.{" "}
            <span className="italic">É uma decisão.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-pure-white/80 leading-relaxed mb-10 max-w-2xl mx-auto"
          >
            Aproveite. Esta é a única vez que você vai precisar comprar um
            suplemento. Porque o EU+ não suplementa — ele nutre, regenera e
            rejuvenesce.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <motion.a
              href="#ofertas"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 bg-pure-white text-teal-primary px-10 py-5 rounded-full font-semibold text-lg uppercase tracking-wide shadow-2xl hover:shadow-3xl transition-all duration-300 min-h-[56px]"
              aria-label="Ver ofertas do EU+ e começar minha transformação"
            >
              Sim, Quero Experimentar o EU+
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </motion.a>
          </motion.div>

          {/* Trust Badges */}
          <motion.ul
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-8"
            aria-label="Garantias e certificações"
          >
            <li className="flex items-center gap-2 text-pure-white/80">
              <Shield className="w-5 h-5" aria-hidden="true" />
              <span className="text-sm">Site Seguro</span>
            </li>
            <li className="flex items-center gap-2 text-pure-white/80">
              <Award className="w-5 h-5" aria-hidden="true" />
              <span className="text-sm">Patente INPI</span>
            </li>
            <li className="flex items-center gap-2 text-pure-white/80">
              <Shield className="w-5 h-5" aria-hidden="true" />
              <span className="text-sm">Aprovado ANVISA</span>
            </li>
            <li className="flex items-center gap-2 text-pure-white/80">
              <Truck className="w-5 h-5" aria-hidden="true" />
              <span className="text-sm">Entrega Rápida</span>
            </li>
          </motion.ul>
        </div>
      </div>
    </section>
  );
};

export default CTAFinalSection;
