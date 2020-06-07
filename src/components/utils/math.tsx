export function sum(a: number[]): number {
    return a.reduce((prev, cur) => prev + cur, 0);
}

export function sumBoolean(a: boolean[]): number {
    return a.reduce((prev: number, cur) => prev +((cur === true) ? 1 : 0), 0);
}

export function sampleToFix(larger: number, sample: number, fix?: number): number[] {
    const res = [];
    if (larger <= sample) {
        for (let index = 0; index < larger; index++) 
            res.push(index);
        return res;
    }

    const p = sample / larger;
    const mark = new Array(larger).fill(true);
    if (fix) {
        res.push(fix);
        mark[fix] = false;
    }
    
    while (res.length < sample) {
        for (let index = 0; index < larger; index++) 
            if (mark[index] && Math.random() <= p) {
                res.push(index);
                mark[index] = false;
                if (res.length == sample)
                    break;
            }
    }
    res.sort((a, b) => a - b);
    return res;
}