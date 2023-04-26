class SampleData {

    #data = new Map();

    constructor() {
        const processes = this.#data;
        processes.set(1, {site: 1, waitFor: [2, 3]});
        processes.set(2, {site: 1, waitFor: [5]});
        processes.set(3, {site: 2, waitFor: [4]});
        processes.set(4, {site: 3, waitFor: []});
        processes.set(7, {site: 4, waitFor: [1]});
        processes.set(5, {site: 4, waitFor: [7]});
        processes.set(6, {site: 4, waitFor: [5]});
    }

    loadSites() {
        const sites = [];
        const map = new Map();
        for(const procEntry of this.#data.entries()) {
            const site = procEntry[1].site;
            const procs = map.get(site);
            if(procs === undefined)
                map.set(site, [procEntry[0]]);
            else
                procs.push(procEntry[0]);
        }
        for(const siteEntry of map.entries())
            sites.push([siteEntry[0], siteEntry[1]]);
        return sites;
    }

    loadProcesses() {
        const processes = [];
        for(const procEntry of this.#data.entries()) 
            processes.push([procEntry[0], procEntry[1].site]);
        return processes;
    }

    loadWaitFor() {
        const waitFor = [];
        for(const procEntry of this.#data.entries()) 
            for(const proc of procEntry[1].waitFor)
                waitFor.push([procEntry[0], proc]);
        return waitFor;
    }

}

sampleData = {
    sites: [
        { name: 1, processes: [ { name: 1 }, { name: 2 } ] },
        { name: 2, processes: [ { name: 3 } ] },
        { name: 3, processes: [ { name: 4 } ] },
        { name: 4, processes: [ { name: 7 }, { name: 5 }, { name: 6 } ] },
    ],
    processes: [ 
        { name: 1, site: 1 }, 
        { name: 2, site: 1 },
        { name: 3, site: 2 },
        { name: 4, site: 3 }, 
        { name: 7, site: 4 },
        { name: 5, site: 4 }, 
        { name: 6, site: 4 }, 
    ],
    waitFor: [
        { source: 1, target: 2 },
        { source: 1, target: 3 },
        { source: 2, target: 5 },
        { source: 3, target: 4 },
        { source: 5, target: 7 },
        { source: 6, target: 5 },
        { source: 7, target: 1 },
    ]
};