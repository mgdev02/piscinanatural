interface LayoutIconProps {
    columns: number;
    rows: number;
    active?: boolean;
    totalPools?: number;
}

export const LayoutIcon = ({ columns, rows, active = false, totalPools }: LayoutIconProps) => {
    const totalCells = columns * rows;
    const poolsToShow = totalPools ? Math.min(totalPools, totalCells) : totalCells;

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
                gap: '2px',
                width: '100%',
                height: '100%',
                padding: '2px'
            }}
        >
            {Array.from({ length: totalCells }).map((_, index) => (
                <div
                    key={index}
                    style={{
                        backgroundColor: index < poolsToShow
                            ? (active ? '#00bcd4' : '#4dd0e1')
                            : 'transparent',
                        border: `1px solid ${active ? '#00bcd4' : '#b0bec5'}`,
                        borderRadius: '2px',
                        transition: 'all 0.2s'
                    }}
                />
            ))}
        </div>
    );
};
