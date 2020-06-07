export interface MetricValue {
    id: number,
    vector: number[]
};

export enum SpaceType {
    Anomaly = 0,
    Contribution
};
export interface ClientValue {
    id: number,
    value: number
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

export interface HeatmapMetrics {
    id: number,
    anomaly: number[][],
    contribution: number[][]
};
export type Heatmap = HeatmapMetrics[];

export type Space = {
    round: number,
    K: number,
    clients: number[],
    savedClients: number[],
    anomaly: Parallel,
    contribution: Parallel,
    concat: MetricValue[],
    anomalyFilter: boolean[],
    contributionFilter: boolean[],
    heatmap: Heatmap,
};

export const DEFAULT_SPACE: Space = {
    round: -1,
    K: 5,
    clients: [],
    savedClients: [],
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
    concat: [],
    anomalyFilter: [true, true, true, true, true, true],
    contributionFilter: [true, true, true, true],
    heatmap: []
};