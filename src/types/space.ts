export interface MetricValue {
    id: number,
    vector: number[]
};

export interface Parallel {
    metrics: string[],
    scale: number[][],
    value: MetricValue[]
};

export const DEFAULT_CONTRIBUTION_METRICS = ['Gradient-eu', 'Gradient-cos', 'Performance-accuracy', 'Performance-loss'];
export const DEFAULT_ANOMALY_METRICS = ['Krum', 'FoolsGold', 'Zeno', 'Auror', 'Sniper', 'Pca'];

export const DEFAULT_CONTRIBUTION_SCALE = [[0, 1], [0, 1], [-1 , 1], [-1 ,1]];
export const DEFAULT_ANOMALY_SCALE = [[0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1]];

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
        scale: DEFAULT_ANOMALY_SCALE,
        value: []
    },
    contribution: {
        metrics: DEFAULT_CONTRIBUTION_METRICS,
        scale: DEFAULT_CONTRIBUTION_SCALE,
        value: []
    },
    concat: []
};