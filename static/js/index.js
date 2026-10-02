// Estrutura de dados com suporte a Múltiplas Classes
let appState = {
    activeClassIndex: 0,
    classes: [
        {
            name: "Carro",
            attributes: [
                { name: "cor", val: "'vermelho'" },
                { name: "idade", val: "25" }
            ],
            methods: [
                { 
                    name: "acelerar", 
                    params: "velocidade", 
                    body: "print(f'O carro {self.cor} esta correndo acima de {velocidade} esta correndo muito')", 
                    args: "60", 
                    type: "normal" 
                }
            ]
        }
    ]
};

let editingAttrIndex = null;
let editingMethodIndex = null;

let scene, camera, renderer, nodesGroup;
let nodeLabels = [];

// 1. INICIALIZAÇÃO DO 3D
function init3D() {
    const container = document.getElementById('canvasContainer');
    const canvas = document.getElementById('canvas3d');
    
    if (!container || !canvas || typeof THREE === 'undefined') return;

    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 8);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    function animate() {
        requestAnimationFrame(animate);
        atualizarPosicaoRotulos();
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// 2. DESENHAR OS BLOCOS FIXOS
function renderizarBlocos3D() {
    if (!nodesGroup) return;

    while(nodesGroup.children.length > 0) { 
        nodesGroup.remove(nodesGroup.children[0]); 
    }
    const labelsOverlay = document.getElementById('labelsOverlay');
    if (labelsOverlay) labelsOverlay.innerHTML = '';
    nodeLabels = [];

    const currentClass = getCurrentClass();
    if (!currentClass) return;

    // Cubo Central (Classe)
    const mainGeo = new THREE.BoxGeometry(1.6, 1, 0.8);
    const mainMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.2 });
    const mainBlock = new THREE.Mesh(mainGeo, mainMat);
    nodesGroup.add(mainBlock);
    
    criarRotuloHTML(mainBlock, `Classe: ${currentClass.name}`, '#0284c7');

    const totalItems = currentClass.attributes.length + currentClass.methods.length;
    if (totalItems === 0) return;

    let index = 0;
    const radius = 2.8;

    // Cubos de Atributos (Verde)
    currentClass.attributes.forEach((attr) => {
        const angle = (index / totalItems) * Math.PI * 2;
        const block = criarNoConectado(angle, radius, 0x10b981, 0.6);
        criarRotuloHTML(block, `attr: ${attr.name} = ${attr.val}`, '#10b981');
        index++;
    });

    // Cubos de Métodos (Roxo)
    currentClass.methods.forEach((met) => {
        const angle = (index / totalItems) * Math.PI * 2;
        const block = criarNoConectado(angle, radius, 0x8b5cf6, 0.7);
        criarRotuloHTML(block, `def ${met.name}()`, '#8b5cf6');
        index++;
    });
}

function criarNoConectado(angle, radius, colorHex, size) {
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const geo = new THREE.BoxGeometry(size, size, size);
    const mat = new THREE.MeshStandardMaterial({ color: colorHex });
    const childBlock = new THREE.Mesh(geo, mat);
    childBlock.position.set(x, y, 0);
    nodesGroup.add(childBlock);

    const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, 0)];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const lineMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 });
    const line = new THREE.Line(lineGeo, lineMat);
    nodesGroup.add(line);

    return childBlock;
}

function criarRotuloHTML(mesh, texto, corBorda) {
    const labelsOverlay = document.getElementById('labelsOverlay');
    if (!labelsOverlay) return;

    const div = document.createElement('div');
    div.className = 'node-label';
    div.innerText = texto;
    if (corBorda) div.style.borderColor = corBorda;

    labelsOverlay.appendChild(div);
    nodeLabels.push({ mesh, element: div });
}

function atualizarPosicaoRotulos() {
    const container = document.getElementById('canvasContainer');
    if (!container || !camera) return;

    const widthHalf = container.clientWidth / 2;
    const heightHalf = container.clientHeight / 2;

    nodeLabels.forEach(item => {
        const tempV = new THREE.Vector3();
        item.mesh.getWorldPosition(tempV);
        tempV.project(camera);

        const x = (tempV.x * widthHalf) + widthHalf;
        const y = -(tempV.y * heightHalf) + heightHalf;

        item.element.style.left = `${x}px`;
        item.element.style.top = `${y}px`;
    });
}

function getCurrentClass() {
    return appState.classes[appState.activeClassIndex] || appState.classes[0];
}

// 3. ATUALIZAR INTERFACE E ABAS
function atualizarInterface() {
    renderClassTabs();

    const currentClass = getCurrentClass();
    if (!currentClass) return;

    const viewTitle = document.getElementById('viewTitle');
    if (viewTitle) viewTitle.innerText = `Classe Ativa: ${currentClass.name}`;

    // Atualiza Lista de Atributos
    const listAttrEl = document.getElementById('listAttributes');
    if (listAttrEl) {
        listAttrEl.innerHTML = currentClass.attributes.map((attr, i) => `
            <div class="item-card">
                <span><strong>self.${attr.name}</strong> = ${attr.val}</span>
                <div>
                    <button class="btn-sm-action" onclick="carregarParaEdicaoAttr(${i})">✏️</button>
                    <button class="btn-del" onclick="removerAtributo(${i})">✕</button>
                </div>
            </div>
        `).join('');
    }

    // Atualiza Lista de Métodos
    const listFuncEl = document.getElementById('listMethods');
    if (listFuncEl) {
        listFuncEl.innerHTML = currentClass.methods.map((met, i) => `
            <div class="item-card">
                <span><strong>${met.name}(${met.params || ''})</strong></span>
                <div>
                    <button class="btn-sm-action" onclick="carregarParaEdicaoMetodo(${i})">✏️</button>
                    <button class="btn-del" onclick="removerMetodo(${i})">✕</button>
                </div>
            </div>
        `).join('');
    }

    renderizarBlocos3D();
    gerarCodigoPython();
    simularSaidaTerminal();
}

function renderClassTabs() {
    const tabsContainer = document.getElementById('classTabs');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = appState.classes.map((cls, idx) => `
        <button class="class-tab ${idx === appState.activeClassIndex ? 'active' : ''}" onclick="selecionarClasse(${idx})">
            ${cls.name}
        </button>
    `).join('');
}

function selecionarClasse(idx) {
    appState.activeClassIndex = idx;
    editingAttrIndex = null;
    editingMethodIndex = null;
    atualizarInterface();
}

// 4. EDIÇÃO DE ATRIBUTOS E MÉTODOS
function carregarParaEdicaoAttr(idx) {
    const cls = getCurrentClass();
    const attr = cls.attributes[idx];
    document.getElementById('attrName').value = attr.name;
    document.getElementById('attrVal').value = attr.val;
    editingAttrIndex = idx;
    document.getElementById('btnAddAttr').innerText = "💾 Salvar Alteração";
}

function carregarParaEdicaoMetodo(idx) {
    const cls = getCurrentClass();
    const met = cls.methods[idx];
    document.getElementById('funcName').value = met.name;
    document.getElementById('funcParams').value = met.params || '';
    document.getElementById('funcBody').value = met.body || '';
    document.getElementById('funcArgs').value = met.args || '';
    editingMethodIndex = idx;
    document.getElementById('btnAddFunc').innerText = "💾 Salvar Alteração";
}

// 5. GERADOR DE CÓDIGO PYTHON
function gerarCodigoPython() {
    let code = `# --- CÓDIGO PYTHON GERADO ---\n\n`;

    appState.classes.forEach(cls => {
        code += `class ${cls.name}:\n`;
        
        if (cls.attributes.length > 0) {
            const params = cls.attributes.map(a => a.name).join(', ');
            code += `    def __init__(self${params ? ', ' + params : ''}):\n`;
            cls.attributes.forEach(a => {
                code += `        self.${a.name} = ${a.name}\n`;
            });
        } else {
            code += `    def __init__(self):\n        pass\n`;
        }

        if (cls.methods.length === 0) {
            code += `    pass\n`;
        } else {
            cls.methods.forEach(m => {
                const pList = ['self'];
                if (m.params) pList.push(m.params);
                code += `\n    def ${m.name}(${pList.join(', ')}):\n`;

                if (m.body && m.body.trim()) {
                    m.body.split('\n').forEach(line => {
                        code += `        ${line}\n`;
                    });
                } else {
                    code += `        pass\n`;
                }
            });
        }
        code += `\n` + `-`.repeat(40) + `\n\n`;
    });

    const currentClass = getCurrentClass();
    if (currentClass) {
        code += `# --- EXECUÇÃO DA CLASSE ATIVA (${currentClass.name}) ---\n`;
        const args = currentClass.attributes.map(a => a.val).join(', ');
        const instName = currentClass.name.toLowerCase() + "1";
        code += `${instName} = ${currentClass.name}(${args})\n`;

        currentClass.methods.forEach(m => {
            code += `${instName}.${m.name}(${m.args || ''})\n`;
        });
    }

    const pyEl = document.getElementById('pythonCode');
    if (pyEl) pyEl.innerText = code;
}

// 6. TERMINAL COM SUBSTITUIÇÃO DE VARIÁVEIS E PARÂMETROS
function simularSaidaTerminal() {
    const termEl = document.getElementById('terminalOutput');
    if (!termEl) return;

    let output = `<span class="terminal-prompt">$ python main.py</span>\n`;
    const cls = getCurrentClass();

    if (!cls || (cls.attributes.length === 0 && cls.methods.length === 0)) {
        output += `Classe '${cls ? cls.name : ''}' criada. Adicione atributos ou métodos.`;
        termEl.innerHTML = output;
        return;
    }

    const attrValues = {};
    cls.attributes.forEach(a => {
        attrValues[a.name] = a.val.replace(/['"]/g, '');
    });

    const instName = cls.name.toLowerCase() + "1";
    output += `[Objeto Criado]: ${instName} = ${cls.name}(${cls.attributes.map(a => a.val).join(', ')})\n\n`;

    cls.methods.forEach(m => {
        output += `> ${instName}.${m.name}(${m.args || ''}):\n`;

        if (m.body && m.body.trim()) {
            const lines = m.body.split('\n');
            let encontrouPrint = false;

            lines.forEach(line => {
                const match = line.match(/print\s*\(\s*f?["'](.*?)["']\s*\)/);
                if (match) {
                    encontrouPrint = true;
                    let printContent = match[1];

                    // Substitui cada {self.atributo} pelo valor do atributo
                    cls.attributes.forEach(a => {
                        const regSelf = new RegExp(`{\\s*self\\.${a.name}\\s*}`, 'g');
                        printContent = printContent.replace(regSelf, attrValues[a.name] || '');
                    });

                    // Substitui parâmetros passados no método (suporta {param} e {self.param})
                    if (m.params && m.args) {
                        const paramName = m.params.trim();
                        const argVal = m.args.trim();
                        
                        const regParamDirect = new RegExp(`{\\s*${paramName}\\s*}`, 'g');
                        const regParamSelf = new RegExp(`{\\s*self\\.${paramName}\\s*}`, 'g');

                        printContent = printContent.replace(regParamDirect, argVal);
                        printContent = printContent.replace(regParamSelf, argVal);
                    }

                    output += `  ⇒ "${printContent}"\n`;
                }
            });

            if (!encontrouPrint) {
                output += `  ⇒ (Método executado)\n`;
            }
        }
    });

    termEl.innerHTML = output;
}

function removerAtributo(idx) {
    getCurrentClass().attributes.splice(idx, 1);
    atualizarInterface();
}

function removerMetodo(idx) {
    getCurrentClass().methods.splice(idx, 1);
    atualizarInterface();
}

// EVENT LISTENERS COM VALIDAÇÃO DE NOME DE CLASSE
document.addEventListener('DOMContentLoaded', () => {
    init3D();

    document.getElementById('btnCreateClass').addEventListener('click', () => {
        const input = document.getElementById('newClassName');
        const name = input.value.trim();

        if (!name) {
            alert("Por favor, introduza o nome da classe.");
            return;
        }

        // RESTRIÇÃO: A primeira letra deve ser Maiúscula (Convenção PascalCase / Python)
        const primeiraLetra = name.charAt(0);
        if (primeiraLetra !== primeiraLetra.toUpperCase() || !isNaN(primeiraLetra)) {
            alert("⚠️ Erro: O nome da Classe deve começar com uma letra MAIÚSCULA (ex: Carro, Pessoa, Veiculo) seguindo as convenções do Python.");
            return;
        }

        appState.classes.push({
            name: name,
            attributes: [],
            methods: []
        });
        appState.activeClassIndex = appState.classes.length - 1;
        input.value = '';
        atualizarInterface();
    });

    document.getElementById('btnAddAttr').addEventListener('click', () => {
        const nameEl = document.getElementById('attrName');
        const valEl = document.getElementById('attrVal');
        const name = nameEl.value.trim();
        const val = valEl.value.trim() || '"Valor"';

        if (name) {
            const cls = getCurrentClass();
            if (editingAttrIndex !== null) {
                cls.attributes[editingAttrIndex] = { name, val };
                editingAttrIndex = null;
                document.getElementById('btnAddAttr').innerText = "+ Adicionar / Salvar Atributo";
            } else {
                cls.attributes.push({ name, val });
            }
            nameEl.value = '';
            valEl.value = '';
            atualizarInterface();
        }
    });

    document.getElementById('btnAddFunc').addEventListener('click', () => {
        const funcNameEl = document.getElementById('funcName');
        const funcParamsEl = document.getElementById('funcParams');
        const funcBodyEl = document.getElementById('funcBody');
        const funcArgsEl = document.getElementById('funcArgs');

        const name = funcNameEl.value.trim();
        const params = funcParamsEl.value.trim();
        const body = funcBodyEl.value;
        const args = funcArgsEl.value.trim();

        if (name) {
            const cls = getCurrentClass();
            if (editingMethodIndex !== null) {
                cls.methods[editingMethodIndex] = { name, params, body, args, type: 'normal' };
                editingMethodIndex = null;
                document.getElementById('btnAddFunc').innerText = "+ Adicionar / Salvar Método";
            } else {
                cls.methods.push({ name, params, body, args, type: 'normal' });
            }
            funcNameEl.value = '';
            funcParamsEl.value = '';
            funcBodyEl.value = '';
            funcArgsEl.value = '';
            atualizarInterface();
        }
    });

    atualizarInterface();
});