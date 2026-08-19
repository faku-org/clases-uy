import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Check, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export type Option = { value: string; label: string };

type Props = {
  label?: string;
  error?: string;
  options: Option[];
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  /** A partir de cuántas opciones se muestra el buscador */
  searchThreshold?: number;
};

const hermit = { ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

export function Select({
  label,
  error,
  options,
  placeholder = "Seleccioná una opción",
  value,
  onChange,
  disabled = false,
  searchThreshold = 8,
}: Props) {
  const id = useId();
  const listId = `${id}-list`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const selected = options.find((o) => o.value === value) ?? null;
  const showSearch = options.length >= searchThreshold;

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const normalize = (s: string) =>
      s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
    const q = normalize(query);
    return options.filter((o) => normalize(o.label).includes(q));
  }, [options, query]);

  // Cerrar al hacer click afuera
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  // Al abrir: foco en el buscador y posicionarse en la opción elegida
  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const index = filtered.findIndex((o) => o.value === value);
    setActiveIndex(index >= 0 ? index : 0);
    if (showSearch) searchRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Mantener la opción activa visible
  useEffect(() => {
    if (!open) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const commit = (option: Option) => {
    onChange(option.value);
    setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!open) {
      if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Tab":
        setOpen(false);
        break;
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) =>
          filtered.length ? (i - 1 + filtered.length) % filtered.length : 0
        );
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(Math.max(filtered.length - 1, 0));
        break;
      case "Enter": {
        e.preventDefault();
        const option = filtered[activeIndex];
        if (option) commit(option);
        break;
      }
    }
  };

  return (
    <div className="flex flex-col gap-1.5" ref={rootRef}>
      {label && (
        <label id={`${id}-label`} className="text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listId : undefined}
          aria-labelledby={label ? `${id}-label` : undefined}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={onKeyDown}
          className={`
            w-full flex items-center gap-2 px-4 py-2.5 rounded-lg text-left text-sm
            bg-neutral-900 border text-white
            transition-colors duration-150
            focus:outline-none focus:ring-1
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : open
                  ? "border-accent ring-1 ring-accent/20"
                  : "border-neutral-700 hover:border-neutral-600 focus:border-accent focus:ring-accent/20"
            }
          `}
        >
          <span className={`flex-1 truncate ${selected ? "text-white" : "text-gray-500"}`}>
            {selected?.label ?? placeholder}
          </span>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.18, ...hermit }}
            className="text-gray-500 shrink-0"
          >
            <ChevronDown size={16} />
          </motion.span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.98 }}
              transition={{ duration: 0.15, ...hermit }}
              className="absolute z-50 mt-2 w-full origin-top rounded-xl border border-neutral-700 bg-neutral-900 shadow-xl shadow-black/40 overflow-hidden"
            >
              {showSearch && (
                <div className="flex items-center gap-2 px-3 py-2 border-b border-neutral-800">
                  <Search size={14} className="text-gray-500 shrink-0" />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setActiveIndex(0);
                    }}
                    onKeyDown={onKeyDown}
                    placeholder="Buscar..."
                    className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>
              )}

              <ul
                id={listId}
                role="listbox"
                aria-labelledby={label ? `${id}-label` : undefined}
                className="max-h-60 overflow-y-auto py-1"
              >
                {filtered.length === 0 && (
                  <li className="px-4 py-3 text-sm text-gray-500">Sin resultados</li>
                )}

                {filtered.map((option, i) => {
                  const isSelected = option.value === value;
                  const isActive = i === activeIndex;
                  return (
                    <li
                      key={option.value}
                      ref={(el) => {
                        optionRefs.current[i] = el;
                      }}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => commit(option)}
                      onPointerEnter={() => setActiveIndex(i)}
                      className={`
                        flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer transition-colors
                        ${isActive ? "bg-neutral-800 text-white" : "text-gray-300"}
                        ${isSelected ? "font-medium" : ""}
                      `}
                    >
                      <span className="flex-1 truncate">{option.label}</span>
                      {isSelected && <Check size={15} className="text-accent-soft shrink-0" />}
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
