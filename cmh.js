class CMH {

    // graph: Map<Process, Set<Process>>, initiator: Process
    detectDeadLockAND = (graph, initiator) => {
        let probes = [];
        let deadlock = undefined;
        if(initiator)
            deadlock = this.#detectCycle(initiator, graph, probes);
        else for(const procEntry of graph.entries()) {
            if(procEntry[1].length !== 0) {
                probes.push('');
                deadlock = this.#detectCycle(procEntry[0], graph, probes);
                if(deadlock)
                    break;
            }
        }
        const result = {deadlock, probes};
        console.log(result);
        return result;
    }

    #detectCycle = (initiator, graph, probes) => {
        const q = [];
        q.push(initiator);
        const sent = new Map();
        while(q.length !== 0) {
            const proc = q.shift();
            const procs = graph.get(proc);
            for(const p of procs) {
                q.push(p);
                const probe = [initiator, proc, p];
                const probeString = '('+probe.toString()+')';
                // visited is not part of the CMH algorithm, additionally maintained just to avoid infinite loops
                const visited = sent.has(probeString);
                if(!visited) {
                    sent.set(probeString, null);
                    probes.push(probeString);
                    if(graph.get(p).length === 0)
                        probes.push('P'+p+': discard' + probeString);
                }
                if(initiator === p) 
                    return true;
                if(visited)
                    return undefined;
            }
        }
        return false;
    }

}