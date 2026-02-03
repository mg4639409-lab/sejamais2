import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  FlaskConical,
  Award,
  Shield,
  Leaf,
  Droplets,
  CheckCircle2,
} from "lucide-react";

const diferenciais = [
  {
    icon: FlaskConical,
    title: "Fórmula Integrada",
    description: "Não trata sintomas, nutre a causa raiz do envelhecimento celular.",
  },
  {
    icon: Award,
    title: "Patente Própria",
    description: "Tecnologia brasileira registrada no INPI — única no mundo.",
  },
  {
    icon: Shield,
    title: "Aprovado ANVISA",
    description: "Conforme Portaria IN nº 28/2018, garantindo segurança e eficácia.",
  },
  {
    icon: Leaf,
    title: "Sem Contraindicações",
    description: "Desenvolvido para uso contínuo e seguro, sem efeitos colaterais.",
  },
  {
    icon: Droplets,
    title: "Em Pó, Alta Absorção",
    description: "Sem glúten, lactose ou açúcar — biodisponibilidade acelerada.",
  },
  {
    icon: CheckCircle2,
    title: "31 Ativos Sinérgicos",
    description: "Dosagens terapêuticas precisas que trabalham em perfeita harmonia.",
  },
];

const DiferenciaisSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section 
      id="diferenciais" 
      className="section-padding bg-pure-white" 
      ref={ref}
      aria-labelledby="diferenciais-heading"
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
            Exclusividade Global
          </motion.span>

          <motion.h2
            id="diferenciais-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="heading-section mb-6"
          >
            Por que o EU+ é{" "}
            <span className="italic text-gradient-primary">único no mundo?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-body-lg"
          >
            Desenvolvido com rigor científico e paixão pela longevidade, o EU+
            representa um marco na ciência da nutrição integrada.
          </motion.p>
        </header>

        {/* Diferenciais Grid */}
        <ul className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" role="list" aria-label="Diferenciais exclusivos do EU+">
          {diferenciais.map((item, index) => (
            <motion.li
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="group relative"
            >
              <article className="card-premium p-8 h-full">
                {/* Icon */}
                <div 
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-primary/10 to-teal-dark/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  aria-hidden="true"
                >
                  <item.icon className="w-7 h-7 text-teal-primary" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-medium text-charcoal mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-medium leading-relaxed">
                  {item.description}
                </p>

                {/* Hover Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-primary to-teal-dark rounded-b-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
              </article>
            </motion.li>
          ))}
        </ul>

        {/* Target Audience Block */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 bg-gradient-to-br from-charcoal to-gray-900 rounded-4xl p-10 md:p-16 text-center"
        >
          <h3 className="font-display text-2xl md:text-3xl font-medium text-pure-white mb-8">
            Para quem é o EU+?
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              "Para quem sente o peso da idade e quer reverter o cansaço",
              "Para quem já tentou de tudo para melhorar pele, cabelo e disposição",
              "Para quem busca prevenção real contra doenças degenerativas",
              "Para quem quer um único produto, sem tomar 10 comprimidos por dia",
              "Para quem acredita que juventude é um estado funcional",
              "Para quem não aceita envelhecer sem lutar",
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 1 + index * 0.1 }}
                className="flex items-start gap-3 text-left"
              >
                <CheckCircle2 className="w-5 h-5 text-teal-primary flex-shrink-0 mt-0.5" />
                <span className="text-sage-light">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DiferenciaisSection;
