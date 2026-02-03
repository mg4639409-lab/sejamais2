import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { href: "#beneficios", label: "Benefícios" },
  { href: "#diferenciais", label: "Diferenciais" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#ofertas", label: "Ofertas" },
  { href: "#faq", label: "FAQ" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-pure-white/95 backdrop-blur-md shadow-soft py-4"
          : "bg-transparent py-6"
      }`}
      role="banner"
    >
      <div className="container-premium flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 min-h-[44px] min-w-[44px]"
          aria-label="EU+ - Voltar ao início"
        >
          <span className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-charcoal">
            EU<span className="text-teal-primary">+</span>
          </span>
        </motion.a>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center gap-10"
          role="navigation"
          aria-label="Menu principal"
        >
          {navLinks.map((link, index) => (
            <motion.a
              key={link.href}
              href={link.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="font-body text-sm font-medium tracking-wide text-gray-medium hover:text-teal-primary transition-colors duration-300 relative group min-h-[44px] flex items-center"
            >
              {link.label}
              <span
                className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-primary transition-all duration-300 group-hover:w-full"
                aria-hidden="true"
              />
            </motion.a>
          ))}
        </nav>

        {/* CTA Button - Desktop */}
        <motion.a
          href="#ofertas"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden lg:flex btn-outline-premium min-h-[44px] items-center"
          aria-label="Ir para seção de ofertas e comprar EU+"
        >
          Comprar Agora
        </motion.a>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-charcoal min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? (
            <X size={24} aria-hidden="true" />
          ) : (
            <Menu size={24} aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-pure-white border-t border-sage-light"
            role="navigation"
            aria-label="Menu mobile"
          >
            <nav className="container-premium py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-body text-base font-medium text-charcoal hover:text-teal-primary transition-colors py-2 min-h-[44px] flex items-center"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#ofertas"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-hero text-center mt-4 min-h-[48px] flex items-center justify-center"
                aria-label="Ir para seção de ofertas e comprar EU+"
              >
                Comprar Agora
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
