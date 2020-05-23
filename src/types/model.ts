export interface ModelInformation {
    layers: string[],
    clientNum: number
};

export const DEFAULTE_MODEL_INFORMATION: ModelInformation = {
    layers: ['conv1', 'conv2'],
    clientNum: 35
};
