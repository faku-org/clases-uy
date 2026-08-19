import { useState } from "react";
import { GraduationCap, ShieldCheck, Copy, Check } from "lucide-react";
import { DEMO_ACCOUNTS, type DemoAccount } from "../../shared/demoAccounts";

const SHOW_DEMO = import.meta.env.VITE_SHOW_DEMO_CREDENTIALS !== "false";

type Props = {
  onUse?: (account: DemoAccount) => void;
};

export function DemoCredentials({ onUse }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

  if (!SHOW_DEMO) return null;

  const copy = async (account: DemoAccount) => {
    await navigator.clipboard.writeText(`${account.email} / ${account.password}`);
    setCopied(account.email);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="mt-5 rounded-2xl border border-dashed border-neutral-700 bg-neutral-900/60 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-accent-soft">
          Cuentas de prueba
        </span>
        <span className="h-px flex-1 bg-neutral-800" />
      </div>

      <div className="flex flex-col gap-2">
        {DEMO_ACCOUNTS.map((account) => {
          const Icon = account.role === "admin" ? ShieldCheck : GraduationCap;
          return (
            <div
              key={account.email}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-3"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={15} className="text-accent-soft shrink-0" />
                <span className="text-sm font-medium text-white">{account.label}</span>
              </div>

              <p className="text-xs text-gray-500 mb-2.5">{account.description}</p>

              <div className="flex flex-col gap-0.5 font-mono text-xs text-gray-300 mb-2.5">
                <span>{account.email}</span>
                <span>{account.password}</span>
              </div>

              <div className="flex items-center gap-2">
                {onUse && (
                  <button
                    type="button"
                    onClick={() => onUse(account)}
                    className="flex-1 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent-hover"
                  >
                    Usar estas credenciales
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => copy(account)}
                  aria-label={`Copiar credenciales de ${account.label}`}
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-700 px-3 py-1.5 text-xs text-gray-400 transition-colors hover:border-neutral-600 hover:text-gray-200"
                >
                  {copied === account.email ? <Check size={13} /> : <Copy size={13} />}
                  {copied === account.email ? "Copiado" : "Copiar"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
