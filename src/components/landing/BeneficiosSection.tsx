import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  Brain,
  Heart,
  Sparkles,
  Leaf,
  Bone,
  HeartPulse,
  Shield,
  ChevronRight,
} from "lucide-react";

const benefits = [
  {
    id: "cerebro",
    icon: Brain,
    title: "Cérebro",
    subtitle: "Neuroproteção & Cognição",
    description:
      "Vitamina C, D, E, complexo B, L-Triptofano, Magnésio e Colina atuam na proteção neuronal, produção de neurotransmissores e melhora da função cognitiva.",
    result:
      "Mais foco, memória afiada, equilíbrio emocional e proteção contra degeneração.",
  },
  {
    id: "coracao",
    icon: Heart,
    title: "Coração",
    subtitle: "Saúde Cardiovascular",
    description:
      "Vitamina K2 MK7 redireciona o cálcio das artérias para os ossos. Potássio, Resveratrol, L-Arginina e Coenzima Q10 fortalecem o músculo cardíaco.",
    result:
      "Pressão regulada, artérias limpas, risco cardiovascular reduzido.",
  },
  {
    id: "pele",
    icon: Sparkles,
    title: "Pele & Cabelo",
    subtitle: "Rejuvenescimento Estético",
    description:
      "Vitamina C, A, E, Zinco, L-Treonina e L-Lisina estimulam a produção de colágeno, hidratação profunda e regeneração celular.",
    result:
      "Pele firme, viçosa, sem rugas; cabelo forte, com crescimento acelerado e brilho natural.",
  },
  {
    id: "digestivo",
    icon: Leaf,
    title: "Fígado & Intestino",
    subtitle: "Detox & Absorção",
    description:
      "L-Glutamina, L-Metionina, Colina, Cúrcuma e Zinco desintoxicam, regeneram a mucosa intestinal e melhoram a absorção de nutrientes.",
    result:
      "Digestão leve, barriga desinchada, pele sem acne, energia constante.",
  },
  {
    id: "musculos",
    icon: Bone,
    title: "Músculos & Ossos",
    subtitle: "Força & Mobilidade",
    description:
      "Os 8 aminoácidos essenciais (BCAAs), Cálcio, Magnésio, Vitamina D, K2 e Creatina promovem síntese proteica, densidade óssea e lubrificação articular.",
    result: "Mais força, menos dores, recuperação rápida, postura firme.",
  },
  {
    id: "reprodutor",
    icon: HeartPulse,
    title: "Sistema Reprodutor",
    subtitle: "Vitalidade & Libido",
    description:
      "Zinco, Feno Grego, L-Arginina e vitaminas do complexo B equilibram hormônios, aumentam a libido e a vitalidade sexual em homens e mulheres.",
    result: "Desejo renovado, performance e confiança.",
  },
  {
    id: "imunologico",
    icon: Shield,
    title: "Sistema Imunológico",
    subtitle: "Proteção Total",
    description:
      "Os 31 ativos em sinergia criam uma barreira antioxidante, anti-inflamatória e imunoestimulante para seu organismo.",
    result:
      "Você resiste a infecções, gripes, inflamações e envelhece com saúde.",
  },
];

const BeneficiosSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section
      id="beneficios"
      className="section-padding bg-gradient-subtle"
      ref={ref}
      aria-labelledby="beneficios-heading"
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
            Benefícios por Sistema
          </motion.span>

          <motion.h2
            id="beneficios-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="heading-section mb-6"
          >
            O que o EU+ faz{" "}
            <span className="italic text-gradient-primary">por você?</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="divider-elegant"
            aria-hidden="true"
          />
        </header>

        {/* Benefits Grid - Desktop */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8" role="tablist" aria-label="Benefícios por sistema do corpo">
          {/* Tabs Navigation */}
          <nav className="col-span-4 space-y-2" aria-label="Navegação de benefícios">
            {benefits.map((benefit, index) => (
              <motion.button
                key={benefit.id}
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                onClick={() => setActiveIndex(index)}
                role="tab"
                aria-selected={activeIndex === index}
                aria-controls={`panel-${benefit.id}`}
                id={`tab-${benefit.id}`}
                className={`w-full text-left p-5 rounded-2xl transition-all duration-300 flex items-center gap-4 group min-h-[72px] ${
                  activeIndex === index
                    ? "bg-pure-white shadow-medium"
                    : "hover:bg-pure-white/50"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                    activeIndex === index
                      ? "bg-teal-primary text-pure-white"
                      : "bg-sage-light text-teal-primary group-hover:bg-teal-primary/10"
                  }`}
                  aria-hidden="true"
                >
                  <benefit.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-medium text-charcoal">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-medium">{benefit.subtitle}</p>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-teal-primary transition-transform duration-300 ${
                    activeIndex === index ? "rotate-90" : ""
                  }`}
                  aria-hidden="true"
                />
              </motion.button>
            ))}
          </nav>

          {/* Content Display */}
          <motion.article
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="col-span-8 bg-pure-white rounded-3xl p-10 shadow-elevated"
            role="tabpanel"
            id={`panel-${benefits[activeIndex].id}`}
            aria-labelledby={`tab-${benefits[activeIndex].id}`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-teal-primary/10 flex items-center justify-center" aria-hidden="true">
                {(() => {
                  const Icon = benefits[activeIndex].icon;
                  return <Icon className="w-8 h-8 text-teal-primary" />;
                })()}
              </div>
              <div>
                <h3 className="font-display text-2xl font-medium text-charcoal">
                  {benefits[activeIndex].title}
                </h3>
                <p className="text-teal-primary font-medium">
                  {benefits[activeIndex].subtitle}
                </p>
              </div>
            </div>

            <p className="text-lg text-gray-medium leading-relaxed mb-8">
              {benefits[activeIndex].description}
            </p>

            <div className="bg-gradient-to-r from-teal-primary/5 to-teal-dark/5 rounded-2xl p-6 border-l-4 border-teal-primary">
              <span className="text-sm font-semibold uppercase tracking-widest text-teal-primary block mb-2">
                Resultado
              </span>
              <p className="text-lg font-medium text-charcoal">
                {benefits[activeIndex].result}
              </p>
            </div>
          </motion.article>
        </div>

        {/* Benefits Cards - Mobile */}
        <div className="lg:hidden grid gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
              className="bg-pure-white rounded-2xl p-6 shadow-soft"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-teal-primary/10 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-teal-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-medium text-charcoal">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-teal-primary">{benefit.subtitle}</p>
                </div>
              </div>

              <p className="text-gray-medium mb-4 leading-relaxed">
                {benefit.description}
              </p>

              <div className="bg-sage-light/30 rounded-xl p-4">
                <span className="text-xs font-semibold uppercase tracking-widest text-teal-primary block mb-1">
                  Resultado
                </span>
                <p className="text-sm font-medium text-charcoal">
                  {benefit.result}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeneficiosSection;
