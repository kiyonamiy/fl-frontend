export interface Weight {
    id: number,
    vector: number[]
};

export type Gradient = {
    curRound: Weight[],
    preRound: Weight[],
    avgRound: number[],
    layersNum: number[]
}

export const DEFAULT_GRADIENT: Gradient = {
    curRound: [],
    preRound: [],
    avgRound: [],
    layersNum: []
};
