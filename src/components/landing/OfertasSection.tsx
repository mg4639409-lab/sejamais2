import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { createCheckout } from "@/lib/checkout";
import { toast } from "@/hooks/use-toast";
import {
  Check,
  Truck,
  BookOpen,
  Users,
  Shield,
  Star,
  Sparkles,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

type Plan = {
  id: string;
  name: string;
  subtitle?: string;
  originalPrice?: string | null;
  price?: string | null;
  installments?: string | null;
  features?: string[];
  featured?: boolean;
  cta?: string;
  badge?: string | null;
  hrefButton?: string | null;
  amount?: number;
};

const legacyPlans = [
  {
    id: "experience",
    hrefButton:
      "https://payment-link-v3.pagar.me/pl_pg04ke1QGO2R8XDLIou18PK7DqJ6M3wj",
    name: "1 unidade",
    subtitle: "Primeira compra",
    originalPrice: "R$ 499,99",
    price: "R$ 399,99",
    installments: "ou 6x de R$ 66,67",
    features: [
      "1 pote EU+ (30 porções)",
      "Frete Grátis — Sedex",
      "Garantia de 90 dias",
      "Acesso ao grupo VIP",
    ],
    featured: false,
    cta: "Comprar 1 unidade",
    badge: "1ª compra",
  },
  {
    id: "transformation",
    hrefButton:
      "https://payment-link-v3.pagar.me/pl_WeM5d2G7bQrk4Y5ImQir8vYXxEoVKg3P",
    name: "2 unidades",
    subtitle: "Maior economia",
    originalPrice: "R$ 999,98",
    price: "R$ 759,98 (R$ 379,99/unidade)",
    installments: "ou 6x de R$ 126,66",
    features: [
      "2 potes EU+ (60 porções)",
      "Frete Grátis — Sedex",
      "Garantia 90 dias",
      "E-book: Guia da Juventude Funcional",
      "Acesso ao grupo VIP",
    ],
    featured: true,
    cta: "Comprar 2 unidades",
    badge: "Mais Vendido",
  },
  {
    id: "last_option",
    hrefButton:
      "https://payment-link-v3.pagar.me/pl_WeM5d2G7bQrk4Y5ImQir8vYXxEoVKg3P",
    name: "3 unidades",
    subtitle: "Melhor custo",
    originalPrice: "R$ 1.499,97",
    price: "R$ 1.079,97 (R$ 359,99/unidade)",
    installments: "ou 6x de R$ 180,00",
    features: [
      "3 potes EU+ (90 porções)",
      "Frete Grátis — Sedex",
      "Garantia 90 dias",
    ],
    featured: false,
    cta: "Comprar 3 unidades",
  },
];

const OfertasSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/plans");
        const json = await res.json().catch(() => null);
        const data = json?.plans ?? [];
        if (mounted) setPlans(data);
      } catch (err) {
        console.error("Erro ao carregar planos:", err);
      } finally {
        if (mounted) setPlansLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleCheckout = useCallback(async (planId: string | null) => {
    if (!planId) return;
    setLoadingPlan(planId);
    try {
      const res = await createCheckout(planId);
      if (res?.ok && res.url) {
        toast({
          title: "Envio",
          description: `Envio por ${res.shippingCarrier ?? "Sedex"} — Frete Grátis de 3 a 7 dias!`,
        });
        window.open(res.url, "_blank", "noopener");
      } else if (res?.url) {
        // fallback link available
        toast({
          title: "Checkout",
          description: `Abrindo link de pagamento — envio por ${res.shippingCarrier ?? "Sedex — Frete Grátis de 3 a 7 dias"}`,
        });
        window.open(res.url, "_blank", "noopener");
      } else {
        toast({
          title: "Erro",
          description: res?.message || "Não foi possível iniciar o checkout.",
        });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Erro", description: "Erro ao iniciar checkout." });
    } finally {
      setLoadingPlan(null);
    }
  }, []);

  const openConfirm = (planId: string) => {
    setSelectedPlan(planId);
    setConfirmOpen(true);
  };

  const confirmAndProceed = async () => {
    setConfirmOpen(false);
    await handleCheckout(selectedPlan);
    setSelectedPlan(null);
  };

  const getEstimatedArrival = useCallback(() => {
    const now = new Date();
    const arrival = new Date(now);
    arrival.setDate(now.getDate() + 7);
    const weekday = new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
    }).format(arrival);
    const date = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }).format(arrival);
    return `${weekday} ${date}`;
  }, []);

  return (
    <section
      id="ofertas"
      className="section-padding bg-pure-white"
      ref={ref}
      aria-labelledby="ofertas-heading"
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
            Oferta Especial
          </motion.span>

          <motion.h2
            id="ofertas-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="heading-section mb-6"
          >
            Escolha seu{" "}
            <span className="italic text-gradient-primary">
              caminho de transformação
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-body-lg"
          >
            Esta é a única vez que você vai precisar comprar um suplemento.
            Porque o EU+ não suplementa — ele nutre, regenera e rejuvenesce.
          </motion.p>
        </header>

        {/* Pricing Cards */}
        <div
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
          role="list"
          aria-label="Planos disponíveis"
        >
          {(plans.length ? plans : legacyPlans).map((plan, index) => (
            <motion.article
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
              className={`pricing-card relative ${plan.featured ? "featured" : ""}`}
              aria-label={`Plano ${plan.name}`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-teal-primary to-teal-dark text-pure-white text-xs font-bold uppercase tracking-widest px-6 py-2 rounded-full flex items-center gap-2">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {plan.badge}
                  </div>
                </div>
              )}

              {/* Header */}
              <div className="text-center mb-8">
                <span className="text-sm font-semibold uppercase tracking-widest text-teal-primary">
                  {plan.subtitle}
                </span>
                <h3 className="font-display text-2xl font-medium text-charcoal mt-2">
                  {plan.name}
                </h3>
              </div>

              {/* Pricing */}
              <div className="text-center mb-8">
                <div className="text-gray-medium line-through text-sm mb-1">
                  {plan.originalPrice}
                </div>
                <div className="text-4xl font-display font-semibold text-charcoal mb-1">
                  {plan.price}
                </div>
                <div className="text-sm text-gray-medium">
                  {plan.installments}
                </div>
                <div className="text-sm text-teal-primary mt-2 font-semibold">
                  Envio: Sedex — Frete Grátis
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-teal-primary flex-shrink-0 mt-0.5" />
                    <span className="text-gray-medium">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <motion.button
                type="button"
                onClick={() => openConfirm(plan.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`block w-full text-center py-4 rounded-full font-medium transition-all duration-300 min-h-[48px] flex items-center justify-center ${
                  plan.featured ? "btn-hero" : "btn-outline-premium"
                }`}
                aria-label={`${plan.cta} - ${plan.name} por ${plan.price}`}
                disabled={loadingPlan === plan.id}
              >
                {loadingPlan === plan.id ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="31.4 31.4"
                      />
                    </svg>
                    Acessando...
                  </>
                ) : (
                  plan.cta
                )}
              </motion.button>
            </motion.article>
          ))}
        </div>

        {/* Trust Icons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-8 mt-16 pt-12 border-t border-sage-light"
        >
          <div className="flex items-center gap-3 text-gray-medium">
            <Truck className="w-6 h-6 text-teal-primary" />
            <span className="text-sm">Frete Grátis — Sedex</span>
          </div>
          <div className="flex items-center gap-3 text-gray-medium">
            <Shield className="w-6 h-6 text-teal-primary" />
            <span className="text-sm">Garantia 90 dias</span>
          </div>
          <div className="flex items-center gap-3 text-gray-medium">
            <BookOpen className="w-6 h-6 text-teal-primary" />
            <span className="text-sm">E-book Exclusivo</span>
          </div>
          <div className="flex items-center gap-3 text-gray-medium">
            <Users className="w-6 h-6 text-teal-primary" />
            <span className="text-sm">Grupo VIP</span>
          </div>
        </motion.div>

        {/* Confirmation dialog: mostra claramente que o envio é via Sedex */}
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar compra</DialogTitle>
              <DialogDescription>
                Envio por <strong>Sedex</strong> — Frete Grátis. <br /> <br />{" "}
                Você será redirecionado para o checkout seguro do Pagar.me para
                concluir o pagamento.
              </DialogDescription>
              <DialogDescription className="flex items-center justify-between p-10">
                <div className="flex flex-col">
                  <h3>Sedex</h3>
                  <p className="font-bold">
                    Entrega de 3 a 7 dias - chegará até {getEstimatedArrival()}
                  </p>
                </div>
                <div className="relative rounded-full p-5 bg-transparent-600 border border-teal-primary">
                  <Truck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-teal-primary" />
                </div>
              </DialogDescription>
            </DialogHeader>

            <div>
              <div className="text-sm text-muted-foreground">Produto</div>
              <div className="flex items-center justify-between mt-2">
                <div className="font-medium">
                  {
                    (plans.length ? plans : legacyPlans).find(
                      (p) => p.id === selectedPlan,
                    )?.name
                  }
                </div>
                <div className="font-medium text-charcoal">
                  {
                    (plans.length ? plans : legacyPlans).find(
                      (p) => p.id === selectedPlan,
                    )?.price
                  }
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <button
                type="button"
                className="btn-outline-premium"
                onClick={() => setConfirmOpen(false)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn-hero"
                onClick={confirmAndProceed}
                disabled={!selectedPlan || loadingPlan === selectedPlan}
              >
                {loadingPlan === selectedPlan ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin mr-2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeDasharray="31.4 31.4"
                      />
                    </svg>
                    Acessando...
                  </>
                ) : (
                  "Confirmar e ir ao checkout"
                )}
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default OfertasSection;
