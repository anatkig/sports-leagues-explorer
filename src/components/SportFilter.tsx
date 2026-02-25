interface SportFilterProps {
  sports: string[];
  selected: string;
  onChange: (value: string) => void;
}

export function SportFilter({ sports, selected, onChange }: SportFilterProps) {
  return (
    <div className="sport-filter">
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filter by sport type"
      >
        <option value="">All Sports</option>
        {sports.map((sport) => (
          <option key={sport} value={sport}>
            {sport}
          </option>
        ))}
      </select>
    </div>
  );
}
