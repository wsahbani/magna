import * as React from "react";
export interface ReactFlowNodeProps {
    id: string;
    data: {
        label: string;
        description?: string;
        type: string;
        icon?: string;
        backgroundColor?: string;
        borderColor?: string;
        fontColor?: string;
        isSelected?: boolean;
        isError?: boolean;
        isConnectable?: boolean;
    };
    selected?: boolean;
}
export declare const ProcessNode: React.NamedExoticComponent<ReactFlowNodeProps>;
export declare const StartEventNode: React.NamedExoticComponent<ReactFlowNodeProps>;
export declare const EndEventNode: React.NamedExoticComponent<ReactFlowNodeProps>;
export declare const GatewayNode: React.NamedExoticComponent<ReactFlowNodeProps>;
export declare const nodeTypes: {
    processNode: React.NamedExoticComponent<ReactFlowNodeProps>;
    startEvent: React.NamedExoticComponent<ReactFlowNodeProps>;
    endEvent: React.NamedExoticComponent<ReactFlowNodeProps>;
    gateway: React.NamedExoticComponent<ReactFlowNodeProps>;
};
//# sourceMappingURL=reactflow-nodes.d.ts.map