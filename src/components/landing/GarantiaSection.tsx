import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, RefreshCcw, Award, Lock, CheckCircle2 } from "lucide-react";

const guarantees = [
  {
    icon: RefreshCcw,
    title: "Garantia de 90 Dias",
    description:
      "Se em 90 dias você não perceber mais disposição, pele mais firme, sono mais profundo, mente mais clara e digestão melhor — devolvemos 100% do seu investimento.",
  },
  {
    icon: Award,
    title: "Fórmula Patenteada",
    description:
      "Você estará utilizando uma fórmula patenteada (INPI BR 10 2024 012316 6), com atestado de inovação e eficácia reconhecida.",
  },
  {
    icon: Shield,
    title: "Aprovado pela ANVISA",
    description:
      "Conforme Portaria IN nº 28/2018, garantindo total segurança para consumo contínuo sem efeitos colaterais.",
  },
  {
    icon: Lock,
    title: "Compra 100% Segura",
    description:
      "Seus dados estão protegidos com criptografia SSL. Aceitamos todos os cartões, PIX e boleto bancário.",
  },
];

const GarantiaSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      className="section-padding bg-charcoal" 
      ref={ref}
      aria-labelledby="garantia-heading"
    >
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.article
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-teal-primary mb-4">
              Sua Segurança
            </span>

            <h2 id="garantia-heading" className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-pure-white leading-tight mb-6">
              Garantia{" "}
              <span className="italic text-teal-primary">incondicional</span> de
              satisfação
            </h2>

            <p className="text-lg text-sage-light/80 leading-relaxed mb-8">
              Acreditamos tanto no EU+ que oferecemos uma garantia que nenhum outro
              suplemento oferece. Se você não ficar satisfeito, devolvemos cada
              centavo.
            </p>

            {/* Promise List */}
            <ul className="space-y-4" aria-label="Benefícios garantidos">
              {[
                "Mais disposição e energia",
                "Pele mais firme e viçosa",
                "Sono mais profundo e reparador",
                "Mente mais clara e focada",
                "Digestão mais leve e regular",
              ].map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-teal-primary flex-shrink-0" aria-hidden="true" />
                  <span className="text-sage-light">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.article>

          {/* Right - Guarantee Cards */}
          <ul className="grid sm:grid-cols-2 gap-6" role="list" aria-label="Garantias e certificações">
            {guarantees.map((guarantee, index) => (
              <motion.li
                key={guarantee.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <article className="bg-pure-white/5 backdrop-blur-sm border border-pure-white/10 rounded-2xl p-6 hover:bg-pure-white/10 transition-colors duration-300 h-full">
                  <div 
                    className="w-12 h-12 rounded-xl bg-teal-primary/20 flex items-center justify-center mb-4"
                    aria-hidden="true"
                  >
                    <guarantee.icon className="w-6 h-6 text-teal-primary" />
                  </div>
                  <h3 className="font-display text-lg font-medium text-pure-white mb-2">
                    {guarantee.title}
                  </h3>
                  <p className="text-sm text-sage-light/70 leading-relaxed">
                    {guarantee.description}
                  </p>
                </article>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default GarantiaSection;
