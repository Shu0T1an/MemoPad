import "./FilterBar.css";

interface FilterBarProps {
  filters: { key: string; label: string }[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function FilterBar({
  filters,
  activeFilter,
  onFilterChange,
}: FilterBarProps) {
  return (
    <div className="filter-bar">
      {filters.map((filter) => (
        <div
          key={filter.key}
          className={`filter-chip ${activeFilter === filter.key ? "active" : ""}`}
          onClick={() => onFilterChange(filter.key)}
        >
          {filter.label}
        </div>
      ))}
    </div>
  );
}
