interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="search-bar">
      <svg
        className="search-icon"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        type="text"
        placeholder="Search leagues..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search leagues by name"
      />
      {value && (
        <button
          className="clear-btn"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          &times;
        </button>
      )}
    </div>
  );
}
