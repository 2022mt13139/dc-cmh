class InputData {

    constructor($scope) {
        this.$scope =$scope;
    }

    sites = [];
    processes = [];
    waitFor = [];
    #diagram;
    result = {deadlock: undefined, probes: []};

    loadSample = () => {
        const sampleData = new SampleData();
        this.sites = sampleData.loadSites();
        this.processes = sampleData.loadProcesses();
        this.waitFor = sampleData.loadWaitFor();
        if(this.isValidPreview())
            this.preview();
    }

    clearAll = () => {
        this.sites = [];
        this.processes = [];
        this.waitFor = [];
        this.#diagram.clear();
    }

    isValidSite = () => {
        return this.newSite > 0 &&
        this.sites.findIndex(site => site[0] === this.newSite) === -1;
    }

    addSite = () => {
        this.sites.push([this.newSite, []]);
        this.newSite = undefined;
        if(this.isValidPreview())
            this.preview();
    };

    isValidProcess = (siteIndex) => {
        const site = this.sites[siteIndex];
        return site.newProcess > 0 && 
        this.processes.findIndex(proc => proc[0] === site.newProcess) === -1;
    }

    addProcess = (siteIndex) => {
        const site = this.sites[siteIndex];
        site[1].push(site.newProcess);
        this.processes.push([site.newProcess, site[0]]);
        site.newProcess = undefined;
        if(this.isValidPreview())
            this.preview();
    };

    deleteProcess = (siteIndex, processIndex) => {
        const site = this.sites[siteIndex];
        const proc = site[1][processIndex];
        site[1].splice(processIndex, 1);
        this.#cascadeDelete(proc);
        if(this.isValidPreview())
            this.preview();
    }

    deleteSite = (siteIndex) => {
        const procs = this.sites[siteIndex][1];
        this.sites.splice(siteIndex, 1);
        procs.map(proc => this.#cascadeDelete(proc));
        if(this.isValidPreview())
            this.preview();
    }

    #cascadeDelete = (proc) => {
        const idx = this.processes.findIndex(p => p[0] === proc);
        this.processes.splice(idx, 1);
        this.waitFor = this.waitFor.filter(wait => wait[0] !== proc && wait[1] !=proc);
    }

    isValidWait = () => {
        return this.newWaitSource > 0 && this.newWaitTarget > 0 &&
        this.newWaitSource !== this.newWaitTarget &&
        this.waitFor.findIndex(wait => {
            return wait[0] === Number(this.newWaitSource) && wait[1] === Number(this.newWaitTarget)
        }) === -1;
    }

    addWait = () => {
        this.waitFor.push([Number(this.newWaitSource), Number(this.newWaitTarget)]);
        this.newWaitSource = undefined;
        this.newWaitTarget = undefined;
        if(this.isValidPreview())
            this.preview();
    };

    deleteWait = (waitIndex) => {
        this.waitFor.splice(waitIndex, 1);
        if(this.isValidPreview())
            this.preview();
    }

    isValidPreview = () => {
        /*for(const site of this.sites)
            if(site[1].length === 0)
                return false;*/
        return this.sites.length !==0;
    }

    preview = () => {
        const nodes = this.#calcSitesPosition();
        const edges = [];
        this.waitFor.map(wait => edges.push({ 
            data: {
                id: wait[0]+'_'+wait[1],
                source: 'P'+wait[0],
                target: 'P'+wait[1]
            }
        }));
        this.edited = false;
        this.#diagram = new Diagram();
        this.#diagram.render({nodes, edges});
    }

    #calcSitesPosition = () => {
        const R = 200;
        const n = this.sites.length;
        const theta = 2 * Math.PI / n;
        const offset = 3 * Math.PI / 4;
        let nodes = [];
        this.sites.forEach((site, idx) => {
            const x = R * Math.cos(idx * theta - offset);
            const y = R * Math.sin(idx * theta - offset);
            const position = {x: Math.trunc(x), y: Math.trunc(y)};
            nodes.push({ data: { id: 'S'+site[0] } });
            const procNodes = this.#calcProcessPosition(site, position);
            nodes = nodes.concat(procNodes);
        });
        return nodes;
    }

    #calcProcessPosition = (site, pos) => {
        const R = 40;
        const n = site[1].length;
        const theta = 2 * Math.PI / n;
        const offset = 3 * Math.PI / 4;
        const nodes = [];
        site[1].map((proc, idx) => {
            const x = R * Math.cos(idx * theta - offset) + pos.x;
            const y = R * Math.sin(idx * theta - offset) + pos.y;
            const position = {x: Math.trunc(x), y: Math.trunc(y)};
            nodes.push({ data: { id: 'P'+proc, parent: 'S'+site[0] }, position })
        });

        if(site[1].length === 0) 
            nodes.push({ data: { id: '‎'.repeat(site[0]), parent: 'S'+site[0] }, position: pos })
        return nodes;
    }

    andDeadlockDetect = () => {
        const graph = new Map();
        this.processes.forEach(proc => {
            const targets = this.waitFor
                .filter(wait => wait[0] === proc[0])
                .map(wait => wait[1]);
            graph.set(proc[0], targets);
        })
        const cmh = new CMH();
        this.result = this.initiator ? 
            cmh.detectDeadLockAND(graph, Number(this.initiator)) : 
            cmh.detectDeadLockAND(graph);
    }

};