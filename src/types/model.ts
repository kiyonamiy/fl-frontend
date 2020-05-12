export interface ModelInformation {
    layers: string[]
};

export const DEFAULTE_MODEL_INFORMATION: ModelInformation = {
    layers: ['conv1', 'conv2', 'dense']
};
