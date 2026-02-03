import { Instagram, Mail, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal py-16" role="contentinfo">
      <div className="container-premium">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a 
              href="#" 
              className="inline-block mb-6 min-h-[44px]"
              aria-label="EU+ - Voltar ao início"
            >
              <span className="font-display text-3xl font-semibold text-pure-white">
                EU<span className="text-teal-primary">+</span>
              </span>
            </a>
            <p className="text-sage-light/70 leading-relaxed mb-6 max-w-md">
              O único rejuvenecedor celular do mundo. Uma fórmula patenteada que
              nutre os 11 sistemas do corpo simultaneamente para uma vida mais
              longa, saudável e plena.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/sejaeumais"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-pure-white/10 flex items-center justify-center text-sage-light hover:bg-teal-primary hover:text-pure-white transition-all duration-300 min-h-[44px] min-w-[44px]"
                aria-label="Seguir EU+ no Instagram (abre em nova aba)"
              >
                <Instagram className="w-5 h-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Links Column */}
          <nav aria-label="Links rápidos">
            <h2 className="font-display text-lg font-medium text-pure-white mb-6">
              Links Rápidos
            </h2>
            <ul className="space-y-3">
              {[
                { label: "Benefícios", href: "#beneficios" },
                { label: "Diferenciais", href: "#diferenciais" },
                { label: "Depoimentos", href: "#depoimentos" },
                { label: "Ofertas", href: "#ofertas" },
                { label: "FAQ", href: "#faq" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sage-light/70 hover:text-teal-primary transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact Column */}
          <div>
            <h2 className="font-display text-lg font-medium text-pure-white mb-6">
              Contato
            </h2>
            <address className="not-italic">
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-teal-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <a
                    href="mailto:contato@sejaeumais.com"
                    className="text-sage-light/70 hover:text-teal-primary transition-colors duration-300"
                  >
                    contato@sejaeumais.com
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Instagram className="w-5 h-5 text-teal-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <a
                    href="https://www.instagram.com/sejaeumais"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sage-light/70 hover:text-teal-primary transition-colors duration-300"
                  >
                    @sejaeumais
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-teal-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-sage-light/70">
                    Brasil
                  </span>
                </li>
              </ul>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-pure-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-sage-light/50 text-center md:text-left">
              © {currentYear} EU+ • Suplemento Alimentar em Pó • Patente
              PCT/BR2024/012316
            </p>
            <p className="text-xs text-sage-light/40 text-center md:text-right max-w-md">
              Este produto não é um medicamento. Pessoas com condições
              específicas, gestantes e lactantes devem consultar um profissional
              de saúde.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
