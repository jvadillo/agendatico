import { cn } from '@/lib/utils';

interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
    color: string;
}

interface CategoryChipProps {
    category: Category;
    isActive?: boolean;
    onClick?: () => void;
}

export function CategoryChip({ category, isActive, onClick }: CategoryChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'chip category-chip',
                isActive && 'active'
            )}
            style={isActive ? { 
                backgroundColor: category.color,
                borderColor: category.color 
            } : undefined}
        >
            <i className={category.icon}></i>
            <span>{category.name}</span>
        </button>
    );
}

interface ChipProps {
    children: React.ReactNode;
    isActive?: boolean;
    onClick?: () => void;
    icon?: React.ReactNode;
}

export function Chip({ children, isActive, onClick, icon }: ChipProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn('chip', isActive && 'active')}
        >
            {icon}
            <span>{children}</span>
        </button>
    );
}
