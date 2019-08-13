export default () => {
    self.addEventListener('message', e => { // eslint-disable-line no-restricted-globals
        if (!e) return;
        switch (e.data.type) {
            case 'init':
            default:
                postMessage(initCells(e.data.size))
                break;
            case 'live':
                postMessage(lifeCycle(e.data))
                break;
        }
    })

    const lifeCycle = ({cells}) => {
        const current = cells.map(i => i.slice(0));
        const xl = current.length;
        const yl = current[0].length;
        return current.map((it, i, air) =>
            it.map((jt, j) => {
                let result = 0;
                const vs = [
                    ((i - 1 >= 0) && (j - 1 >= 0)) ? air[i - 1][j - 1] : 0,
                    ((i - 1) >= 0) ? air[i - 1][j] : 0,
                    ((i - 1 >= 0) && (j + 1 < yl)) ? air[i - 1][j + 1] : 0,
                    (j - 1 >= 0) ? air[i][j - 1] : 0,
                    (j + 1 < yl) ? air[i][j + 1] : 0,
                    ((i + 1 < xl) && (j - 1 >= 0)) ? air[i + 1][j - 1] : 0,
                    (i + 1 < xl) ? air[i + 1][j] : 0,
                    ((i + 1 < xl) && (j + 1 < yl)) ? air[i + 1][j + 1] : 0];
                let status = vs.reduce((ac, ii) => ac + ii, 0);
                if (jt === 1) {
                    if ((status >= 2) && (status <= 3)) result = 1;
                } else {
                    if (status === 3) result = 1;
                }
                return result;
            }));
    }

    const initCells = (size) =>
        Array(size).fill(Array(size).fill(0)).map(l=>l.map(()=>Math.round(Math.abs(Math.random()*2-0.5))))

}



