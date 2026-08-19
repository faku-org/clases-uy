import { GraduationCap } from "lucide-react";
import { siteConfig } from "../../config/site";

export function Footer() {
  return (
    <footer className="border-t border-neutral-900 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#e06666] flex items-center justify-center">
            <GraduationCap size={15} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-white">
            Clases <span className="text-[#e06666]">ORT</span>
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
