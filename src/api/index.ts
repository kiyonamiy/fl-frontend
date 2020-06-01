import axios from 'axios';
import qs from 'qs';

export const getKrum = ({k=5, round=-1, layers=['dense']}) => {
    return axios.get('anomaly/krum/', {
        params: {
            k: k,
            round: round,
            layers: layers
        },
        paramsSerializer: params => {
            return qs.stringify(params)
          }
    })
};

export const getFoolsGold = ({k=5, round=-1, layers=['dense']}) => {
    return axios.get('anomaly/foolsgold/', {
        params: {
            k: k,
            round: round,
            layers: layers
        },
        paramsSerializer: params => {
            return qs.stringify(params)
          }
    })
};

export const getZeno = ({p=100, round=-1}) => {
    return axios.get('anomaly/zeno/', {
        params: {
            p: p,
            round: round,
        }
    })
};

export const getAuror = ({k=5, round=-1, layers=['dense']}) => {
    return axios.get('anomaly/auror/', {
        params: {
            k: k,
            round: round,
            layers: layers
        },
        paramsSerializer: params => {
            return qs.stringify(params)
          }
    })
};

export const getSniper = ({p=0.8, round=-1, layers=['dense']}) => {
    return axios.get('anomaly/sniper/', {
        params: {
            p: p,
            round: round,
            layers: layers
        },
        paramsSerializer: params => {
            return qs.stringify(params)
          }
    })
};

export const getPca = ({k=5, round=-1, layers=['dense']}) => {
    return axios.get('anomaly/pca/', {
        params: {
            k: k,
            round: round,
            layers: layers
        },
        paramsSerializer: params => {
            return qs.stringify(params)
          }
    })
};

export const getContributionGrad = ({round=-1, metric='eu', layers=['dense']}) => {
    return axios.get('contribution/grad_diff/', {
        params: {
            round: round,
            metric: metric,
            layers: layers
        },
        paramsSerializer: params => {
            return qs.stringify(params)
          }
    })
};

export const getContributionPerformance = ({round=-1, metric='accuracy', layers=['dense']}) => {
    return axios.get('contribution/perf_diff/', {
        params: {
            round: round,
            metric: metric,
            layers: layers
        },
        paramsSerializer: params => {
            return qs.stringify(params)
          }
    })
};

export const getGradient = ({round=-1, avg=false}) => {
    return axios.get(avg ? 'avg_grad' : 'client_grad/', {
        params: {
            round: round
        }
    });
}

export const getOneRoundMetrics = ({round=-1, layers=['dense']}) => {
    return axios.get('one_round_metrics/', {
        params: {
            round: round,
            layers: layers
        },
    })
};

export const getAllRoundMetrics = ({layers=['dense']}) => {
    return axios.get('all_round_metrics/', {
        params: {
            layers: layers
        },
    })
};