import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { AlertCircle, Brain, Heart, Sparkles, Zap } from "lucide-react";

const problems = [
  {
    icon: Brain,
    title: "Clareza Mental",
    description: "O cérebro perde foco e a memória falha progressivamente",
  },
  {
    icon: Heart,
    title: "Saúde Cardíaca",
    description: "O coração fica vulnerável a pressão e problemas vasculares",
  },
  {
    icon: Sparkles,
    title: "Pele e Cabelo",
    description: "A pele perde viço, surgem rugas, o cabelo enfraquece",
  },
  {
    icon: Zap,
    title: "Energia Vital",
    description: "A disposição desaparece e o cansaço se torna constante",
  },
];

const ProblemaSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      id="problema" 
      className="section-padding bg-pure-white" 
      ref={ref}
      aria-labelledby="problema-heading"
    >
      <div className="container-premium">
        <header className="max-w-4xl mx-auto text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <AlertCircle className="w-5 h-5 text-teal-primary" aria-hidden="true" />
            <span className="text-sm font-semibold uppercase tracking-widest text-teal-primary">
              O Problema
            </span>
          </motion.div>

          <motion.h2
            id="problema-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="heading-section mb-6"
          >
            Você já se perguntou{" "}
            <span className="italic text-gradient-primary">por que envelhece?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-body-lg"
          >
            Não é apenas a idade. É a{" "}
            <strong className="text-charcoal">subnutrição celular progressiva</strong>.
            Cada órgão do seu corpo pede nutrientes específicos, mas a alimentação
            moderna, o estresse e os hábitos desequilibrados deixam seus sistemas em
            déficit.
          </motion.p>
        </header>

        {/* Problem Cards */}
        <ul className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16" role="list" aria-label="Problemas do envelhecimento celular">
          {problems.map((problem, index) => (
            <motion.li
              key={problem.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
            >
              <article className="card-premium p-6 text-center group h-full">
                <div 
                  className="w-14 h-14 mx-auto mb-4 rounded-full bg-sage-light/50 flex items-center justify-center group-hover:bg-teal-primary/10 transition-colors duration-300"
                  aria-hidden="true"
                >
                  <problem.icon className="w-7 h-7 text-teal-primary" />
                </div>
                <h3 className="font-display text-lg font-medium text-charcoal mb-2">
                  {problem.title}
                </h3>
                <p className="text-sm text-gray-medium leading-relaxed">
                  {problem.description}
                </p>
              </article>
            </motion.li>
          ))}
        </ul>

        {/* Statement Block */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="bg-gradient-to-br from-sage-light/30 to-beige-warm/30 rounded-3xl p-8 md:p-12 border border-sage-light/50">
            <p className="text-lg md:text-xl text-gray-medium leading-relaxed mb-4">
              A indústria vende cápsulas para o fígado, pós para os músculos, gotas
              para o cérebro — mas{" "}
              <strong className="text-charcoal">
                nenhum deles nutre o corpo como um todo
              </strong>.
            </p>
            <p className="text-2xl md:text-3xl font-display font-medium text-teal-primary">
              Até hoje.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemaSection;
