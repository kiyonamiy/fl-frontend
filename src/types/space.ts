export interface MetricValue {
    id: number,
    vector: number[]
};

export interface Parallel {
    metrics: string[],
    value: MetricValue[]
};

export const DEFAULT_CONTRIBUTION_METRICS = ['Gradient-eu', 'Gradient-cos', 'Performance-accuracy', 'Performance-loss'];
export const DEFAULT_ANOMALY_METRICS = ['Krum', 'FoolsGold', 'Zeno', 'Auror', 'Sniper', 'Pca'];

export interface Position {
    x: number,
    y: number
};

export type Heatmap = MetricValue[];

export type Space = {
    clients: number[],
    anomaly: Parallel,
    contribution: Parallel,
    concat: MetricValue[]
};

export const DEFAULT_SPACE: Space = {
    clients: [],
    anomaly: {
        metrics: DEFAULT_ANOMALY_METRICS,
        value: []
    },
    contribution: {
        metrics: DEFAULT_CONTRIBUTION_METRICS,
        value: []
    },
    concat: []
};