import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown, Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "Posso tomar com outros medicamentos?",
    answer:
      "Sim, o EU+ é natural e sinérgico, podendo ser consumido com outros medicamentos. No entanto, recomendamos sempre consultar seu médico antes de iniciar qualquer suplementação, especialmente se você faz uso contínuo de medicamentos controlados.",
  },
  {
    question: "Tem efeitos colaterais?",
    answer:
      "Não. O EU+ foi desenvolvido para biocompatibilidade máxima, utilizando dosagens terapêuticas seguras dentro dos parâmetros estabelecidos pela ANVISA. A fórmula não contém glúten, lactose, açúcar ou ingredientes alergênicos comuns.",
  },
  {
    question: "Quando chega meu pedido?",
    answer:
      "O prazo de entrega é de 5 a 10 dias úteis para todo o Brasil. Oferecemos frete grátis em todos os kits. Você receberá o código de rastreamento por e-mail assim que seu pedido for despachado.",
  },
  {
    question: "Por que em pó e não em cápsula?",
    answer:
      "A forma em pó oferece maior biodisponibilidade e absorção celular acelerada. Enquanto cápsulas podem levar horas para se dissolver e liberar os ativos, o pó começa a ser absorvido imediatamente, garantindo eficácia máxima.",
  },
  {
    question: "Como devo tomar o EU+?",
    answer:
      "Dissolva 2 medidores (10g) em 200ml de água, uma vez ao dia, preferencialmente pela manhã. O sabor é suave e pode ser misturado com sucos ou vitaminas de sua preferência.",
  },
  {
    question: "Em quanto tempo verei resultados?",
    answer:
      "Em 30 dias você começa a sentir a energia. Em 60 dias, você vê a pele e cabelo transformados. Em 90 dias, você se sente rejuvenescido por dentro e por fora. Os resultados são progressivos e se amplificam com o uso contínuo.",
  },
  {
    question: "A garantia é real? Como funciona?",
    answer:
      "Sim, 100% real. Se em 90 dias você não perceber os benefícios prometidos, basta entrar em contato conosco que devolvemos integralmente o valor investido, sem perguntas ou burocracia.",
  },
  {
    question: "Grávidas e lactantes podem tomar?",
    answer:
      "Recomendamos que gestantes e lactantes consultem seu médico ou nutricionista antes de iniciar o uso do EU+. Apesar de ser um produto natural e seguro, é importante ter acompanhamento profissional nestes períodos especiais.",
  },
];

const FAQSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      id="faq" 
      className="section-padding bg-gradient-subtle" 
      ref={ref}
      aria-labelledby="faq-heading"
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
            Dúvidas Frequentes
          </motion.span>

          <motion.h2
            id="faq-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="heading-section mb-6"
          >
            Perguntas{" "}
            <span className="italic text-gradient-primary">frequentes</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-body-lg"
          >
            Tire suas dúvidas sobre o EU+ e comece sua jornada de transformação
            com confiança total.
          </motion.p>
        </header>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto" role="list" aria-label="Perguntas frequentes">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
              className="faq-item"
              role="listitem"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between py-6 text-left group min-h-[72px]"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                <span className="font-display text-lg font-medium text-charcoal pr-4 group-hover:text-teal-primary transition-colors duration-300">
                  {faq.question}
                </span>
                <div
                  className={`w-10 h-10 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300 min-h-[40px] min-w-[40px] ${
                    openIndex === index
                      ? "bg-teal-primary border-teal-primary text-pure-white"
                      : "border-sage-light text-gray-medium group-hover:border-teal-primary group-hover:text-teal-primary"
                  }`}
                  aria-hidden="true"
                >
                  {openIndex === index ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
              </button>

              <motion.div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                initial={false}
                animate={{
                  height: openIndex === index ? "auto" : 0,
                  opacity: openIndex === index ? 1 : 0,
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="text-gray-medium leading-relaxed pb-6">
                  {faq.answer}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
