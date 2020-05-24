export interface ModelInformation {
    layers: string[],
    clientNum: number
};

export const DEFAULTE_MODEL_INFORMATION: ModelInformation = {
    layers: ['dense'],
    clientNum: 35
};
