import * as React from "react";
export interface ProcessCardProps {
    process: {
        id: string;
        name: string;
        description?: string;
        type: 'FLOW' | 'SIPOC' | 'BPMN';
        level: 1 | 2 | 3;
        status: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'PUBLISHED' | 'ARCHIVED';
        priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
        authorName?: string;
        updatedAt?: string;
        estimatedDuration?: number;
        tags?: string[];
    };
    onClick?: () => void;
    onEdit?: () => void;
    onView?: () => void;
    isSelected?: boolean;
    className?: string;
}
export declare const ProcessCard: React.ForwardRefExoticComponent<ProcessCardProps & React.RefAttributes<HTMLDivElement>>;
export interface ProcessGridProps {
    processes: ProcessCardProps['process'][];
    selectedProcessId?: string;
    onProcessSelect?: (processId: string) => void;
    onProcessEdit?: (processId: string) => void;
    onProcessView?: (processId: string) => void;
    className?: string;
}
export declare const ProcessGrid: React.ForwardRefExoticComponent<ProcessGridProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=process-card.d.ts.map