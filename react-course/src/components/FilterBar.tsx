type Filter = "all" | "active" | "completed";

type FilterBarProps = {
    filter: Filter;
    onChange: (filter: Filter) => void;
}

export function FilterBar ({filter, onChange} : FilterBarProps) {

    return (
        <div>
            {
                filter === "all" && <button onClick={() => onChange("all")}>ALL</button>
                
            }
            {
                filter === "active" && <button onClick = {() => onChange("active")}>ACTIVE</button>
            }
                        {
                filter === "completed" && <button onClick = {() => onChange("completed")}>ACTIVE</button>
            }

        </div>
    );
}