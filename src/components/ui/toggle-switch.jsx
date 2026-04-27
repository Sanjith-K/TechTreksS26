export default function ToggleSwitch({ checked, onChange, label }) {
    return (
        <label className="inline-flex cursor-pointer items-center gap-3 text-white">
            <span className="relative inline-block h-7 w-12 shrink-0">
                <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <span className="block h-7 w-12 rounded-full bg-slate-600 ring-offset-1 transition duration-200 peer-checked:bg-indigo-600 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-500" />
                <span className="absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition-transform duration-200 ease-in-out peer-checked:translate-x-5" />
            </span>
            {label && <span className="text-sm">{label}</span>}
        </label>
    );
}
