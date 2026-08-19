import { siteConfig } from "../../config/site";

export function Footer() {
  return (
    <footer className="border-t border-line py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">
            Clases<span className="text-accent-soft italic font-serif">UY</span>
          </span>
        </div>
        <p className="text-xs text-gray-600 text-center max-w-sm">
          {siteConfig.legal.disclaimer}
        </p>
        <p className="text-xs text-gray-600">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
