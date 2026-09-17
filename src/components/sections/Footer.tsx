import { SITE } from "@/config/siteConfig";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-horizon" aria-hidden="true" />
      <p className="footer-mark" aria-hidden="true">
        NOCTIS
      </p>
      <p className="footer-line">{SITE.footerLine}</p>
      <nav className="footer-links" aria-label="NOCTIS em outros lugares">
        {SITE.social.map((s) => (
          <a key={s.label} href={s.href}>
            {s.label}
          </a>
        ))}
      </nav>
      <p className="footer-legal">
        NOCTIS é uma casa fictícia, criada como peça de portfólio de creative development. © {new Date().getFullYear()}
      </p>
    </footer>
  );
}
