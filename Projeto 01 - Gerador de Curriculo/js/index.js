// Sequência de Etapas Estruturadas
const steps = [
    { key: "dados_pessoais", label: "Dados Pessoais e de Contato" },
    { key: "foto", label: "Foto de Perfil (Opcional)" },
    { key: "resumo", label: "Perfil Profissional" },
    { key: "experiencias", label: "Experiência Profissional (Uma por vez)" },
    { key: "formacoes", label: "Formação Acadêmica (Uma por vez)" },
    { key: "competencias", label: "Competências e Habilidades" },
    { key: "adicionais", label: "Informações Adicionais" },
];

let currentStep = -1;

let dataCollected = {
    nome: "",
    cargo: "",
    cpf: "",
    telefone: "",
    email: "",
    local: "",
    foto: "",
    resumo: "",
    experiencias: [],
    formacoes: [],
    competencias: [],
    idiomas: "",
    certificacoes: "",
    interesses: "",
};

window.onload = function () {
    const savedData = localStorage.getItem("curriculos1_cache_data");
    const savedStep = localStorage.getItem("curriculos1_cache_step");

    if (savedData) {
        dataCollected = JSON.parse(savedData);
    }

    if (savedStep !== null) {
        currentStep = parseInt(savedStep);
    }

    renderStep();
    updateLivePreview();
};

function saveStateToLocalStorage() {
    localStorage.setItem(
        "curriculos1_cache_data",
        JSON.stringify(dataCollected),
    );
    localStorage.setItem("curriculos1_cache_step", currentStep.toString());
}

function resetAppData() {
    hideErrorBox();
    document.getElementById("reset-confirm-box").style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeResetConfirmation() {
    document.getElementById("reset-confirm-box").style.display = "none";
}

function executeResetApp() {
    localStorage.removeItem("curriculos1_cache_data");
    localStorage.removeItem("curriculos1_cache_step");
    location.reload();
}

// Renderizador da Interface Esquerda com limites de caracteres estritos
function renderStep() {
    const contentContainer = document.getElementById("interactive-content");
    const header = document.getElementById("app-header");
    const footer = document.getElementById("app-footer");
    const adTop = document.getElementById("ad-top-box");
    const fieldLabel = document.getElementById("field-label");

    hideErrorBox();
    closeResetConfirmation();

    if (currentStep === -1) {
        header.style.display = "none";
        footer.style.display = "none";
        adTop.style.display = "none";
        if (fieldLabel) fieldLabel.style.display = "none";

        const hasDraft =
            dataCollected.nome || dataCollected.experiencias.length > 0;

        contentContainer.innerHTML = `
            <div class="welcome-screen">
                <span class="brand-logo" style="margin-bottom:25px; display:block;">Curriculos <span>1R$</span></span>
                <h2>Crie curriculos com design de alto impacto.</h2>
                <p>Uma ferramenta cirúrgica feita para profissionais. Preencha seus blocos de forma organizada e veja o resultado em tempo real.</p>
                
                <div class="welcome-action-box">
                    <button class="btn-primary-lg" onclick="startApp(false)">Começar Novo Currículo</button>
                    ${hasDraft ? `<button class="btn-secondary-lg" onclick="startApp(true)">Continuar Rascunho Salvo</button>` : ""}
                </div>
            </div>
        `;
        return;
    }

    header.style.display = "block";
    footer.style.display = "block";
    adTop.style.display = "block";

    const step = steps[currentStep];

    if (fieldLabel) {
        fieldLabel.innerText = step.label;
        fieldLabel.style.display = "block";
    }

    document.getElementById("step-indicator").innerText =
        `Etapa ${currentStep + 1} de ${steps.length}`;
    document.getElementById("progress").style.width =
        `${(currentStep / (steps.length - 1)) * 100}%`;

    if (step.key === "dados_pessoais") {
        contentContainer.innerHTML = `
            <div class="input-sub-group"><label>Nome Completo *</label><input type="text" id="in-nome" value="${dataCollected.nome}" maxlength="65" placeholder="Ex: Rafael Melo Pinto" oninput="captureData()"></div>
            <div class="input-sub-group"><label>Cargo / Profissão Pretendida</label><input type="text" id="in-cargo" value="${dataCollected.cargo}" maxlength="50" placeholder="Ex: Desenvolvedor Front-End" oninput="captureData()"></div>
            <div class="input-sub-group"><label>CPF</label><input type="text" id="in-cpf" inputmode="numeric" value="${dataCollected.cpf}" maxlength="14" placeholder="000.000.000-00" oninput="maskCPF(this)"></div>
            <div class="input-sub-group"><label>Telefone / WhatsApp</label><input type="text" id="in-telefone" inputmode="numeric" value="${dataCollected.telefone}" maxlength="15" placeholder="(11) 99999-9999" oninput="maskPhone(this)"></div>
            <div class="input-sub-group"><label>E-mail *</label><input type="text" id="in-email" value="${dataCollected.email}" maxlength="65" placeholder="Ex: seuemail@dominio.com" oninput="captureData()"></div>
            <div class="input-sub-group"><label>Cidade e Estado</label><input type="text" id="in-local" value="${dataCollected.local}" maxlength="50" placeholder="Ex: São Paulo - SP" oninput="captureData()"></div>
        `;
    } else if (step.key === "foto") {
        contentContainer.innerHTML = `
            <div class="file-input-wrapper">
                <span id="file-status-text">${dataCollected.foto ? "Foto carregada com sucesso" : "Clique para selecionar sua foto profissional"}</span>
                <input type="file" id="in-foto" accept="image/*" onchange="handlePhotoUpload(this)">
            </div>
            <p style="font-size:11px; color:var(--text-muted); margin-top:10px; text-align:center;">Deixe em branco para gerar o documento sem imagem.</p>
        `;
    } else if (step.key === "resumo") {
        contentContainer.innerHTML = `
            <div class="input-sub-group">
                <label>Resumo de suas qualificações</label>
                <textarea id="in-resumo" rows="6" maxlength="500" placeholder="Escreva de 3 a 4 linhas focando em suas principais competências técnicas..." oninput="captureData()">${dataCollected.resumo}</textarea>
            </div>
        `;
    } else if (step.key === "experiencias") {
        contentContainer.innerHTML = `
            <div id="xp-fields">
                <div class="input-sub-group"><label>Nome da Empresa</label><input type="text" id="xp-empresa" maxlength="60" placeholder="Ex: Tech Soluções"></div>
                <div class="input-sub-group"><label>Cargo Ocupado</label><input type="text" id="xp-cargo" maxlength="50" placeholder="Ex: Analista de Suporte"></div>
                <div class="input-sub-group"><label>Período de Atuação</label><input type="text" id="xp-periodo" maxlength="30" placeholder="Ex: Setembro 2024 - Presente"></div>
                <div class="input-sub-group"><label>Atividades e Conquistas (Item por linha)</label><textarea id="xp-descricao" rows="4" maxlength="400" placeholder="Ex: Atuação no gerenciamento de redes de computadores.&#10;Otimização de processos operacionais internos."></textarea></div>
                <button class="btn-add-item" onclick="addExperiencia()">Adicionar esta Experiência</button>
            </div>
            <div class="added-items-list" id="xp-list"></div>
        `;
        renderInternalList("experiencias");
    } else if (step.key === "formacoes") {
        contentContainer.innerHTML = `
            <div id="edu-fields">
                <div class="input-sub-group"><label>Nome do Curso</label><input type="text" id="edu-curso" maxlength="60" placeholder="Ex: Técnico em Informática"></div>
                <div class="input-sub-group"><label>Instituição de Ensino</label><input type="text" id="edu-institicao" maxlength="60" placeholder="Ex: Escola Técnica de São Paulo"></div>
                <div class="input-sub-group"><label>Período</label><input type="text" id="edu-periodo" maxlength="30" placeholder="Ex: 2022 - 2024"></div>
                <button class="btn-add-item" onclick="addFormacao()">Adicionar esta Formação</button>
            </div>
            <div class="added-items-list" id="edu-list"></div>
        `;
        renderInternalList("formacoes");
    } else if (step.key === "competencias") {
        contentContainer.innerHTML = `
            <div class="input-sub-group">
                <label>Insira uma habilidade</label>
                <input type="text" id="comp-item" maxlength="35" placeholder="Ex: Manutenção de Hardware, JavaScript">
            </div>
            <button class="btn-add-item" onclick="addCompetencia()">Adicionar Habilidade</button>
            <div class="added-items-list" id="comp-list"></div>
        `;
        renderInternalList("competencias");
    } else if (step.key === "adicionais") {
        contentContainer.innerHTML = `
            <div class="input-sub-group"><label>Idiomas</label><textarea id="in-idiomas" rows="2" maxlength="150" placeholder="Ex: Inglês (Intermediário)&#10;Espanhol (Básico)" oninput="captureData()">${dataCollected.idiomas}</textarea></div>
            <div class="input-sub-group"><label>Certificações</label><textarea id="in-certificacoes" rows="2" maxlength="200" placeholder="Ex: Certificação ITIL Foundation, 2026" oninput="captureData()">${dataCollected.certificacoes}</textarea></div>
            <div class="input-sub-group"><label>Áreas de Interesse</label><textarea id="in-interesses" rows="2" maxlength="150" placeholder="Ex: Infraestrutura Open-Source, Automação Residencial" oninput="captureData()">${dataCollected.interesses}</textarea></div>
        `;
    }
}

function startApp(continueDraft) {
    if (!continueDraft) {
        dataCollected = {
            nome: "",
            cargo: "",
            cpf: "",
            telefone: "",
            email: "",
            local: "",
            foto: "",
            resumo: "",
            experiencias: [],
            formacoes: [],
            competencias: [],
            idiomas: "",
            certificacoes: "",
            interesses: "",
        };
        localStorage.removeItem("curriculos1_cache_data");
    }
    currentStep = 0;
    saveStateToLocalStorage();
    renderStep();
    updateLivePreview();
}

// Filtra apenas números e aplica máscara de Telefone
function maskPhone(input) {
    let value = input.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 6) {
        input.value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
        input.value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
        input.value = `(${value}`;
    }
    captureData();
}

// Filtra apenas números e aplica máscara de CPF
function maskCPF(input) {
    let value = input.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 9) {
        input.value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9)}`;
    } else if (value.length > 6) {
        input.value = `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6)}`;
    } else if (value.length > 3) {
        input.value = `${value.slice(0, 3)}.${value.slice(3)}`;
    } else {
        input.value = value;
    }
    captureData();
}

function captureData() {
    const stepKey = steps[currentStep].key;
    if (stepKey === "dados_pessoais") {
        dataCollected.nome = document.getElementById("in-nome").value;
        dataCollected.cargo = document.getElementById("in-cargo").value;
        dataCollected.cpf = document.getElementById("in-cpf").value;
        dataCollected.telefone = document.getElementById("in-telefone").value;
        dataCollected.email = document.getElementById("in-email").value;
        dataCollected.local = document.getElementById("in-local").value;
    } else if (stepKey === "resumo") {
        dataCollected.resumo = document.getElementById("in-resumo").value;
    } else if (stepKey === "adicionais") {
        dataCollected.idiomas = document.getElementById("in-idiomas").value;
        dataCollected.certificacoes =
            document.getElementById("in-certificacoes").value;
        dataCollected.interesses =
            document.getElementById("in-interesses").value;
    }
    saveStateToLocalStorage();
    updateLivePreview();
}

function showNoticeError(message) {
    const box = document.getElementById("error-message-box");
    document.getElementById("error-message-text").innerText = message;
    box.style.display = "block";
}

function hideErrorBox() {
    const box = document.getElementById("error-message-box");
    if (box) box.style.display = "none";
}

function addExperiencia() {
    hideErrorBox();
    const empresa = document.getElementById("xp-empresa").value.trim();
    const cargo = document.getElementById("xp-cargo").value.trim();
    const periodo = document.getElementById("xp-periodo").value.trim();
    const descricao = document.getElementById("xp-descricao").value.trim();

    if (!empresa || !cargo || !periodo) {
        showNoticeError(
            "Preencha os campos obrigatórios: Empresa, Cargo e Período.",
        );
        return;
    }

    dataCollected.experiencias.push({ empresa, cargo, periodo, descricao });
    saveStateToLocalStorage();
    renderInternalList("experiencias");
    updateLivePreview();

    document.getElementById("xp-empresa").value = "";
    document.getElementById("xp-cargo").value = "";
    document.getElementById("xp-periodo").value = "";
    document.getElementById("xp-descricao").value = "";
}

function addFormacao() {
    hideErrorBox();
    const curso = document.getElementById("edu-curso").value.trim();
    const iest = document.getElementById("edu-institicao").value.trim();
    const periodo = document.getElementById("edu-periodo").value.trim();

    if (!curso || !iest || !periodo) {
        showNoticeError("Por favor, informe Curso, Instituição e o Período.");
        return;
    }

    dataCollected.formacoes.push({ curso, instituicao: iest, periodo });
    saveStateToLocalStorage();
    renderInternalList("formacoes");
    updateLivePreview();

    document.getElementById("edu-curso").value = "";
    document.getElementById("edu-institicao").value = "";
    document.getElementById("edu-periodo").value = "";
}

function addCompetencia() {
    const item = document.getElementById("comp-item").value.trim();
    if (!item) return;

    dataCollected.competencias.push(item);
    saveStateToLocalStorage();
    document.getElementById("comp-item").value = "";
    renderInternalList("competencias");
    updateLivePreview();
}

function renderInternalList(type) {
    if (type === "experiencias") {
        document.getElementById("xp-list").innerHTML =
            dataCollected.experiencias
                .map(
                    (item, i) => `
            <div class="added-item-row"><span><strong>${item.cargo}</strong> em ${item.empresa}</span><button class="btn-remove-item" onclick="removeItem('experiencias', ${i})">Remover</button></div>
        `,
                )
                .join("");
    } else if (type === "formacoes") {
        document.getElementById("edu-list").innerHTML = dataCollected.formacoes
            .map(
                (item, i) => `
            <div class="added-item-row"><span><strong>${item.curso}</strong></span><button class="btn-remove-item" onclick="removeItem('formacoes', ${i})">Remover</button></div>
        `,
            )
            .join("");
    } else if (type === "competencias") {
        document.getElementById("comp-list").innerHTML =
            dataCollected.competencias
                .map(
                    (item, i) => `
            <div class="added-item-row"><span>${item}</span><button class="btn-remove-item" onclick="removeItem('competencias', ${i})">Remover</button></div>
        `,
                )
                .join("");
    }
}

function removeItem(type, index) {
    dataCollected[type].splice(index, 1);
    saveStateToLocalStorage();
    renderInternalList(type);
    updateLivePreview();
}

function handlePhotoUpload(input) {
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            dataCollected.foto = e.target.result;
            saveStateToLocalStorage();
            document.getElementById("file-status-text").innerText =
                "Foto carregada com sucesso";
            updateLivePreview();
        };
        reader.readAsDataURL(file);
    }
}

function updateLivePreview() {
    document.getElementById("cv-nome").innerText =
        dataCollected.nome || "Seu Nome Completo";
    document.getElementById("cv-cargo").innerText =
        dataCollected.cargo || "Seu Cargo ou Profissão";

    // Atualiza a lista lateral incluindo CPF de forma estruturada caso preenchido
    document.getElementById("cv-contato-lista").innerHTML = `
        <li>${dataCollected.telefone || "Telefone"}</li>
        <li>${dataCollected.email || "E-mail"}</li>
        ${dataCollected.cpf ? `<li>CPF: ${dataCollected.cpf}</li>` : ""}
        <li>${dataCollected.local || "Cidade - Estado"}</li>
    `;

    const photoBucket = document.getElementById("preview-photo-bucket");
    if (dataCollected.foto) {
        document.getElementById("preview-photo").src = dataCollected.foto;
        photoBucket.style.display = "block";
    } else {
        photoBucket.style.display = "none";
    }

    document.getElementById("cv-resumo").innerText =
        dataCollected.resumo ||
        "Breve resumo de suas qualificações e objetivos de carreira.";

    const xpContainer = document.getElementById("cv-experiencias-container");
    if (dataCollected.experiencias.length === 0) {
        xpContainer.innerHTML =
            "<p style='color:#888; font-style:italic;'>Nenhuma experiência adicionada ainda.</p>";
    } else {
        xpContainer.innerHTML = dataCollected.experiencias
            .map(
                (item) => `
            <div class="cv-item-render">
                <div class="cv-item-meta"><span>${item.cargo}</span><span>${item.periodo}</span></div>
                <div class="cv-item-institution">${item.empresa}</div>
                <div class="cv-item-description" style="white-space: pre-line;">${item.descricao}</div>
            </div>
        `,
            )
            .join("");
    }

    const eduContainer = document.getElementById("cv-formacoes-container");
    if (dataCollected.formacoes.length === 0) {
        eduContainer.innerHTML =
            "<p style='color:#888; font-style:italic;'>Nenhuma formação adicionada ainda.</p>";
    } else {
        eduContainer.innerHTML = dataCollected.formacoes
            .map(
                (item) => `
            <div class="cv-item-render">
                <div class="cv-item-meta"><span>${item.curso}</span><span>${item.periodo}</span></div>
                <div class="cv-item-institution">${item.instituicao}</div>
            </div>
        `,
            )
            .join("");
    }

    document.getElementById("cv-competencias-lista").innerHTML =
        dataCollected.competencias.map((item) => `<li>${item}</li>`).join("");

    const idiBox = document.getElementById("cv-idiomas-box");
    if (dataCollected.idiomas.trim()) {
        document.getElementById("cv-idiomas").innerText = dataCollected.idiomas;
        idiBox.style.display = "block";
    } else {
        idiBox.style.display = "none";
    }

    const certBox = document.getElementById("cv-certificacoes-box");
    if (dataCollected.certificacoes.trim()) {
        document.getElementById("cv-certificacoes").innerText =
            dataCollected.certificacoes;
        certBox.style.display = "block";
    } else {
        certBox.style.display = "none";
    }

    const intBox = document.getElementById("cv-interesses-box");
    if (dataCollected.interesses.trim()) {
        document.getElementById("cv-interesses").innerText =
            dataCollected.interesses;
        intBox.style.display = "block";
    } else {
        intBox.style.display = "none";
    }
}

function nextStep() {
    hideErrorBox();
    closeResetConfirmation();

    if (currentStep === 0) {
        if (!dataCollected.nome.trim() || !dataCollected.email.trim()) {
            showNoticeError(
                "O preenchimento do Nome e do E-mail é obrigatório.",
            );
            return;
        }
    }

    if (currentStep < steps.length - 1) {
        currentStep++;
        saveStateToLocalStorage();
        renderStep();
    } else {
        localStorage.setItem("cv_data", JSON.stringify(dataCollected));
        window.location.href = "pages/resultado.html";
    }
}

function backStep() {
    if (currentStep > -1) {
        currentStep--;
        saveStateToLocalStorage();
        renderStep();
    }
}
