export interface MetricValue {
    id: number,
    vector: number[]
};

export interface Parallel {
    metrics: string[],
    value: MetricValue[]
};

export interface Position {
    x: number,
    y: number
};

export type Heatmap = MetricValue[];

export type Space = {
    clients: number[]
};

export const DEFAULTE_SPACE = {
    clients: []
};