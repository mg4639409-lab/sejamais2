const DEFAULT_WHATSAPP_NUMBER = "5511918621312";
const WHATSAPP_MESSAGE =
  "Olá, vim através do site, gostaria de mais informações.";

const FloatingWhatsAppButton = () => {
  const encodedMessage = encodeURIComponent(WHATSAPP_MESSAGE);
  const sanitizedPhone = DEFAULT_WHATSAPP_NUMBER.replace(/\D/g, "");
  const whatsappLink = `https://wa.me/${sanitizedPhone}?text=${encodedMessage}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#25D366] to-[#1EBEA5] text-white shadow-[0_14px_40px_rgba(37,211,102,0.45)] transition-all duration-300 hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1DA851]"
      aria-label="Fale conosco no WhatsApp"
      title="Fale conosco no WhatsApp"
    >
      <span className="sr-only">Abrir conversa no WhatsApp</span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366] opacity-10 blur-md transition-all duration-300 group-hover:opacity-25 group-hover:blur-lg"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full border border-white/70 shadow-inner"
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-message-circle w-7 h-7 text-white"
      >
        <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"></path>
      </svg>
    </a>
  );
};

export default FloatingWhatsAppButton;
