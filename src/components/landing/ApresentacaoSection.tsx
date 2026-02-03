import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import productResult from "@/assets/product-result.jpg";

const ApresentacaoSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      className="section-padding bg-charcoal overflow-hidden"
      ref={ref}
      aria-labelledby="apresentacao-heading"
    >
      <div className="container-premium">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image Side */}
          <motion.figure
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div
              className="absolute inset-0 bg-teal-primary/20 blur-3xl rounded-full"
              aria-hidden="true"
            />
            <img
              src={productResult}
              alt="Visualização científica do rejuvenescimento celular mostrando nutrientes sendo absorvidos pelas células do corpo"
              className="relative w-1/2 max-w-md mx-auto rounded-3xl shadow-2xl"
              loading="lazy"
              width="400"
              height="400"
            />
          </motion.figure>

          {/* Content Side */}
          <motion.article
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block text-sm font-semibold uppercase tracking-widest text-teal-primary mb-4">
              Inovação Científica
            </span>

            <h2
              id="apresentacao-heading"
              className="font-display text-3xl md:text-4xl lg:text-5xl font-medium text-pure-white leading-tight mb-6"
            >
              A primeira fórmula do mundo que nutre os{" "}
              <span className="italic text-teal-primary">
                11 sistemas do corpo
              </span>{" "}
              simultaneamente
            </h2>

            <p className="text-lg text-sage-light/80 leading-relaxed mb-8">
              O EU+ não é um suplemento. É um{" "}
              <strong className="text-pure-white">
                sistema de rejuvenescimento celular
              </strong>
              . Patenteado no INPI, desenvolvido com base em mais de 300 reações
              bioquímicas, respaldado por pesquisas da PubMed, NIH, OMS e livros
              como Bioquímica de Lehninger e Nutrição Humana de Mahan.
            </p>

            {/* Features List */}
            <ul className="space-y-4 mb-10" aria-label="Características do EU+">
              {[
                "31 ativos ergogênicos em sinergia perfeita",
                "Dosagens terapêuticas precisas, sem toxicidade",
                "Tecnologia brasileira patenteada",
                "Aprovado pela ANVISA",
              ].map((feature, index) => (
                <motion.li
                  key={feature}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-2 h-2 rounded-full bg-teal-primary flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-sage-light">{feature}</span>
                </motion.li>
              ))}
            </ul>

            {/* Quote Block */}
            <motion.blockquote
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="border-l-4 border-teal-primary pl-6 py-2"
            >
              <p className="font-display text-xl italic text-pure-white">
                "E se um único produto nutrisse cada órgão, na dosagem certa, na
                sinergia perfeita?"
              </p>
              <cite className="text-sm text-sage-light/60 mt-2 block not-italic">
                — Pergunta que originou o EU+
              </cite>
            </motion.blockquote>
          </motion.article>
        </div>
      </div>
    </section>
  );
};

export default ApresentacaoSection;
