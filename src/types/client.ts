// 具体一轮额训练/测试结果
export interface ModelRes {
  accuracy: number;
  loss: number;
}

// 一个客户端某一轮的结果
export interface ClientRes {
  train: ModelRes;
  test: ModelRes;
  id: number;
  round: number;
}

// 某一轮所有客户端的结果
export interface RoundRes {
  round: number;
  clients: ClientRes[];
}

export type Performance = RoundRes[];

export type Client = {
  fetched: boolean;
  performance: Performance;
  test: any;
  error: object;
};

export const DEFAULT_CLIENTS: Client = {
  fetched: false,
  performance: [],
  test: {},
  error: {}
};
