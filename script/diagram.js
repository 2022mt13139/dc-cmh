class Diagram {

    #cy;

    #cyConfig = {
        container: document.getElementById('diagram'),
        boxSelectionEnabled: false,
        style: [
            {
                selector: 'node',
                css: {
                    'content': 'data(id)',
                    'text-valign': 'center',
                    'text-halign': 'center'
                }
            },
            {
                selector: ':parent',
                css: {
                    'text-valign': 'top',
                    'text-halign': 'center',
                }
            },
            {
                selector: 'edge',
                css: {
                    'curve-style': 'bezier',
                    'target-arrow-shape': 'triangle'
                }
            }
        ],
        layout: {
            name: 'preset',
            padding: 5
        },
        elements: {
            nodes: [],
            edges: []
        }
    };

    render = (data) => {
        const nodes = data.nodes;
        const edges = data.edges;
        this.#cyConfig.elements.nodes = nodes;
        this.#cyConfig.elements.edges = edges;
        this.#cy = cytoscape(this.#cyConfig);
    }

    clear = () => {
        this.#cy.unmount();
    }

    nodes = [
        { data: { id: 'S1'} },
        { data: { id: 'P1', parent: 'S1' }, position: { x: -169, y: -169 } },
        { data: { id: 'P2', parent: 'S1' }, position: { x: -112, y: -112 } },
        { data: { id: 'S2'} },
        { data: { id: 'P3', parent: 'S2' }, position: { x: 112, y: -169 } },
        { data: { id: 'S3'} },
        { data: { id: 'P4', parent: 'S3' }, position: { x: 112, y: 112 } },
        { data: { id: 'S4'} },
        { data: { id: 'P7', parent: 'S4' }, position: { x: -169, y: 112 } },
        { data: { id: 'P5', parent: 'S4' }, position: { x: -102, y: 130 } },
        { data: { id: 'P6', parent: 'S4' }, position: { x: -151, y: 179 } },
    ]

    edges = [   
        { data: { id: '1_2', source: 'P1', target: 'P2' } },
        { data: { id: '1_3', source: 'P1', target: 'P3' } },
        { data: { id: '2_5', source: 'P2', target: 'P5' } },
        { data: { id: '3_4', source: 'P3', target: 'P5' } },
        { data: { id: '7_1', source: 'P7', target: 'P1' } },
        { data: { id: '5_7', source: 'P5', target: 'P7' } },
        { data: { id: '6_5', source: 'P6', target: 'P5' } },
    ];

}