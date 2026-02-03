import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rodrigo Macellaio",
    role: "Chef de Cozinha",
    content:
      "Desde que comecei a usar EU+ minha saúde e qualidade de vida melhoraram muito. Em 12 meses perdi 14 kgs, o produto me trouxe muita disposição para atividades físicas, aumento da massa muscular e sem fadiga, e também o aumento da minha imunidade. Na minha profissão onde o desgaste físico é muito grande o EU+ foi um divisor de águas.",
    highlight: "Perdi 14kg em 12 meses",
  },
  {
    id: 2,
    name: "Linda Bessa",
    role: "Empresária • Grupo Belcor Seguros",
    content:
      "Já faço reposição há 10 anos e procuro ter uma boa rotina de alimentação e treino. Já tomo o Eu+ há mais de um ano e ao iniciar deixei de lado todas as fórmulas que tomava. Me sinto mais enxuta e disposta, meu percentual de gordura baixou de 25 para 19, me sinto mais forte, minha musculatura apareceu e ficou mais firme.",
    highlight: "Gordura corporal de 25% para 19%",
  },
  {
    id: 3,
    name: "Alessandra",
    role: "Engenheira Agrônoma",
    content:
      "EU+ tem atuado muito bem no meu organismo, intestino reloginho, energia quando precisa de energia (excelente pré-treino) e no fim do dia dá uma relaxada. Percebi redução de gordura e melhor ganho de massa magra. Senti melhora no sono, concentração e mais disposição! Pele, cabelo e unha também. Suplemento completo!",
    highlight: "Suplemento completo, não precisa de mais nada",
  },
  {
    id: 4,
    name: "Dr. Danilo Di Rezende",
    role: "Advogado",
    content:
      "Comecei a usar o produto há quatro meses e já estou colhendo os frutos. Desde que comecei a incluí-lo na minha rotina, notei um aumento significativo na minha imunidade, além de uma maior concentração e disposição ao longo do dia. O Eu+ realmente se destacou pela sua facilidade de uso e eficácia.",
    highlight: "Mais imunidade e concentração",
  },
  {
    id: 5,
    name: "Milton Fernandes",
    role: "Empresário • 76 anos",
    content:
      "O EU+ na minha vida é rotina há mais de 30 anos sempre fiz uso desses ativos só que manipulados e já não aguentava mais tomar tantas cápsulas que já me provocavam problemas digestivos. Tenho 76 anos e sem nenhuma doença e sem tomar nenhum remédio, tenho saúde excelente e vivo com vida de 40 anos em todos os sentidos!",
    highlight: "76 anos sem nenhuma doença",
  },
  {
    id: 6,
    name: "Alcides Jr.",
    role: "Empresário",
    content:
      "Minha experiência com EU+ foi transformadora em todos sentidos... me sinto com mais disposição, cérebro mais conectivo além do intestino estar um relógio suíço! Parei de tomar 10 suplementos... este é um TUDO!",
    highlight: "Substituiu 10 suplementos",
  },
];

const DepoimentosSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section
      id="depoimentos"
      className="section-padding bg-gradient-to-br from-sage-light/30 to-beige-warm/30"
      ref={ref}
      aria-labelledby="depoimentos-heading"
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
            Prova Social
          </motion.span>

          <motion.h2
            id="depoimentos-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="heading-section mb-6"
          >
            Histórias de{" "}
            <span className="italic text-gradient-primary">transformação</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-body-lg"
          >
            Milhares de pessoas já transformaram suas vidas com EU+. Conheça
            algumas dessas histórias reais.
          </motion.p>
        </header>

        {/* Featured Testimonial - Desktop */}
        <div className="hidden lg:block">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="testimonial-card max-w-4xl mx-auto mb-12"
          >
            <div className="relative z-10">
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-teal-primary fill-teal-primary"
                  />
                ))}
              </div>

              {/* Highlight Badge */}
              <div className="inline-block bg-teal-primary/10 text-teal-primary text-sm font-semibold px-4 py-2 rounded-full mb-6">
                {testimonials[currentIndex].highlight}
              </div>

              {/* Quote */}
              <p className="text-xl md:text-2xl text-charcoal leading-relaxed mb-8 font-display">
                "{testimonials[currentIndex].content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-primary to-teal-dark flex items-center justify-center text-pure-white font-display text-xl">
                  {testimonials[currentIndex].name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-display text-lg font-medium text-charcoal">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-gray-medium">
                    {testimonials[currentIndex].role}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation */}
          <nav className="flex items-center justify-center gap-4" aria-label="Navegação de depoimentos">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border border-sage-light flex items-center justify-center text-gray-medium hover:bg-teal-primary hover:text-pure-white hover:border-teal-primary transition-all duration-300 min-h-[48px] min-w-[48px]"
              aria-label="Depoimento anterior"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>

            <div className="flex gap-2" role="tablist" aria-label="Selecionar depoimento">
              {testimonials.map((testimonial, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  role="tab"
                  aria-selected={index === currentIndex}
                  aria-label={`Depoimento de ${testimonial.name}`}
                  className={`h-2.5 rounded-full transition-all duration-300 min-h-[10px] ${
                    index === currentIndex
                      ? "bg-teal-primary w-8"
                      : "bg-sage-light hover:bg-teal-primary/50 w-2.5"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full border border-sage-light flex items-center justify-center text-gray-medium hover:bg-teal-primary hover:text-pure-white hover:border-teal-primary transition-all duration-300 min-h-[48px] min-w-[48px]"
              aria-label="Próximo depoimento"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </nav>
        </div>

        {/* Testimonials Grid - Mobile */}
        <div className="lg:hidden grid gap-6">
          {testimonials.slice(0, 4).map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
              className="testimonial-card"
            >
              <div className="relative z-10">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-teal-primary fill-teal-primary"
                    />
                  ))}
                </div>

                <div className="inline-block bg-teal-primary/10 text-teal-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">
                  {testimonial.highlight}
                </div>

                <p className="text-charcoal leading-relaxed mb-6 line-clamp-4">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-primary to-teal-dark flex items-center justify-center text-pure-white font-display">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-display font-medium text-charcoal">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-medium">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DepoimentosSection;
