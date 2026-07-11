// ==========================================
// CONFIGURAÇÕES E ESTADO DA APLICAÇÃO
// ==========================================

const steps = [
    { key: "dados_pessoais", label: "Dados Pessoais e de Contato" },
    { key: "foto", label: "Foto de Perfil (Opcional)" },
    { key: "resumo", label: "Perfil Profissional" },
    { key: "experiencias", label: "Experiência Profissional" },
    { key: "formacoes", label: "Formação Acadêmica" },
    { key: "certificacoes", label: "Certificações e Cursos" },
    { key: "competencias", label: "Competências e Habilidades" },
    { key: "adicionais", label: "Informações Adicionais" },
    { key: "modelo", label: "Escolha o Design do seu Currículo" },
];

let currentStep = -1;
let editingExperienciaIndex = -1;
let editingFormacaoIndex = -1;
let editingCertificacaoIndex = -1;

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
    certificacoes: [],
    competencias: [],
    idiomas: "",
    interesses: "",
    modelo: "padrao",
};

window.onload = function () {
    const savedData = localStorage.getItem("cv_data");
    const savedStep = localStorage.getItem("curriculos1_cache_step");
    if (savedData) {
        dataCollected = JSON.parse(savedData);
        if (!dataCollected.modelo) dataCollected.modelo = "padrao";
        if (!dataCollected.certificacoes) dataCollected.certificacoes = [];
    }
    if (savedStep !== null) currentStep = parseInt(savedStep);
    renderStep();
    updateLivePreview();
    aplicarModelo(dataCollected.modelo);
};

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
            certificacoes: [],
            competencias: [],
            idiomas: "",
            interesses: "",
            modelo: "padrao",
        };
        localStorage.removeItem("cv_data");
    }
    currentStep = 0;
    saveStateToLocalStorage();
    renderStep();
    updateLivePreview();
}

function saveStateToLocalStorage() {
    localStorage.setItem("cv_data", JSON.stringify(dataCollected));
    localStorage.setItem("curriculos1_cache_step", currentStep.toString());
}

function executeResetApp() {
    localStorage.removeItem("cv_data");
    localStorage.removeItem("curriculos1_cache_step");
    location.reload();
}

function nextStep() {
    hideErrorBox();
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
    }
}

function backStep() {
    if (currentStep > -1) {
        currentStep--;
        saveStateToLocalStorage();
        renderStep();
    }
}

function resetAppData() {
    hideErrorBox();
    document.getElementById("reset-confirm-box").style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function closeResetConfirmation() {
    document.getElementById("reset-confirm-box").style.display = "none";
}

function filtrarApenasNumeros(valor) {
    return valor.replace(/\D/g, "");
}

function aplicarMascaraTelefone(elemento) {
    let num = filtrarApenasNumeros(elemento.value);
    if (num.length > 11) num = num.substring(0, 11);

    if (num.length > 6) {
        elemento.value = `(${num.slice(0, 2)}) ${num.slice(2, 7)}-${num.slice(7)}`;
    } else if (num.length > 2) {
        elemento.value = `(${num.slice(0, 2)}) ${num.slice(2)}`;
    } else if (num.length > 0) {
        elemento.value = `(${num}`;
    } else {
        elemento.value = "";
    }
    updateField("telefone", elemento.value);
}

function aplicarMascaraCPF(elemento) {
    let num = filtrarApenasNumeros(elemento.value);
    if (num.length > 11) num = num.substring(0, 11);

    if (num.length > 9) {
        elemento.value = `${num.slice(0, 3)}.${num.slice(3, 6)}.${num.slice(6, 9)}-${num.slice(9)}`;
    } else if (num.length > 6) {
        elemento.value = `${num.slice(0, 3)}.${num.slice(3, 6)}.${num.slice(6)}`;
    } else if (num.length > 3) {
        elemento.value = `${num.slice(0, 3)}.${num.slice(3)}`;
    } else {
        elemento.value = num;
    }
    updateField("cpf", elemento.value);
}

function aplicarMascaraDataCustom(elemento) {
    let num = filtrarApenasNumeros(elemento.value);
    if (num.length > 6) num = num.substring(0, 6);

    if (num.length > 2) {
        elemento.value = `${num.slice(0, 2)}/${num.slice(2)}`;
    } else {
        elemento.value = num;
    }
}

function toggleDataFim(checkbox, inputId) {
    const inputFim = document.getElementById(inputId);
    if (checkbox.checked) {
        inputFim.value = "";
        inputFim.disabled = true;
    } else {
        inputFim.disabled = false;
    }
}

function showNoticeError(message) {
    document.getElementById("error-message-box").style.display = "block";
    document.getElementById("error-message-text").innerText = message;
}

function renderStep() {
    const contentContainer = document.getElementById("interactive-content");
    const header = document.getElementById("app-header");
    const footer = document.getElementById("app-footer");
    const adTop = document.getElementById("ad-top-box");
    const fieldLabel = document.getElementById("field-label");
    const boxModelos = document.getElementById("box-escolha-modelo");

    hideErrorBox();
    closeResetConfirmation();

    if (currentStep === -1) {
        if (header) header.style.display = "none";
        if (footer) footer.style.display = "none";
        if (adTop) adTop.style.display = "none";
        if (fieldLabel) fieldLabel.style.display = "none";
        if (boxModelos) boxModelos.style.display = "none";

        const hasCache = localStorage.getItem("cv_data") !== null;
        contentContainer.innerHTML = `
            <div class="welcome-screen">
                <h2>Crie seu Currículo Profissional</h2>
                <p>Monte um currículo moderno e otimizado de forma simples, direta e em poucos passos.</p>
                <div class="welcome-action-box">
                    <button class="btn-primary-lg" onclick="startApp(false)">Criar Novo Currículo</button>
                    ${hasCache ? `<button class="btn-secondary-lg" onclick="startApp(true)">Continuar Rascunho</button>` : ""}
                </div>
            </div>
        `;
        return;
    }

    if (header) header.style.display = "block";
    if (footer) footer.style.display = "block";
    if (adTop) adTop.style.display = "block";

    document.getElementById("step-indicator").innerText =
        `Etapa ${currentStep + 1} de ${steps.length}`;
    const percent = ((currentStep + 1) / steps.length) * 100;
    document.getElementById("progress").style.width = `${percent}%`;

    const step = steps[currentStep];

    if (currentStep === steps.length - 1) {
        if (fieldLabel) fieldLabel.style.display = "none";
        contentContainer.innerHTML = "";
        if (boxModelos) boxModelos.style.display = "block";
        if (footer) footer.style.display = "block";
        document.getElementById("btn-advance").style.display = "none";
        return;
    } else {
        if (boxModelos) boxModelos.style.display = "none";
        document.getElementById("btn-advance").style.display = "block";
    }

    if (fieldLabel) {
        fieldLabel.style.display = "block";
        fieldLabel.innerText = step.label;
    }

    if (step.key === "dados_pessoais") {
        contentContainer.innerHTML = `
            <div class="input-sub-group">
                <label>Nome Completo</label>
                <input type="text" value="${dataCollected.nome}" oninput="updateField('nome', this.value)">
            </div>
            <div class="input-sub-group">
                <label>Cargo / Profissão</label>
                <input type="text" value="${dataCollected.cargo}" oninput="updateField('cargo', this.value)">
            </div>
            <div class="input-sub-group">
                <label>E-mail</label>
                <input type="text" value="${dataCollected.email}" oninput="updateField('email', this.value)">
            </div>
            <div class="input-sub-group">
                <label>Telefone</label>
                <input type="text" value="${dataCollected.telefone}" oninput="aplicarMascaraTelefone(this)">
            </div>
            <div class="input-sub-group">
                <label>Cidade / Estado</label>
                <input type="text" value="${dataCollected.local}" oninput="updateField('local', this.value)">
            </div>
            <div class="input-sub-group">
                <label>CPF (Opcional)</label>
                <input type="text" value="${dataCollected.cpf}" oninput="aplicarMascaraCPF(this)">
            </div>
        `;
    } else if (step.key === "foto") {
        contentContainer.innerHTML = `
            <div class="file-input-wrapper">
                <p style="font-size:12px; font-weight:700; color:var(--text-muted); text-transform:uppercase;">Clique para carregar uma imagem</p>
                <input type="file" accept="image/*" onchange="uploadPhotoHandler(this)">
            </div>
            ${
                dataCollected.foto
                    ? `
                <div style="text-align:center; margin-top:15px;">
                    <button class="btn-secundario" onclick="removePhotoHandler()">Remover Foto Atual</button>
                </div>
            `
                    : ""
            }
        `;
    } else if (step.key === "resumo") {
        contentContainer.innerHTML = `
            <div class="input-sub-group">
                <textarea oninput="updateField('resumo', this.value)">${dataCollected.resumo}</textarea>
            </div>
        `;
    } else if (step.key === "experiencias") {
        renderExperienciasSubForm(contentContainer);
    } else if (step.key === "formacoes") {
        renderFormacoesSubForm(contentContainer);
    } else if (step.key === "certificacoes") {
        renderCertificacoesSubForm(contentContainer);
    } else if (step.key === "competencias") {
        contentContainer.innerHTML = `
            <div class="input-sub-group">
                <label>Adicionar Competência (Ex: Liderança, Excel)</label>
                <input type="text" id="input-competencia-tag">
            </div>
            <button class="btn-add-item" onclick="addCompetenciaTag()">Inserir Habilidade</button>
            <div class="added-items-list" id="lista-competencias-tags"></div>
        `;
        renderCompetenciasList();
    } else if (step.key === "adicionais") {
        contentContainer.innerHTML = `
            <div class="input-sub-group">
                <label>Idiomas</label>
                <textarea style="height:70px;" oninput="updateField('idiomas', this.value)">${dataCollected.idiomas}</textarea>
            </div>
            <div class="input-sub-group">
                <label>Outras Informações de Interesse</label>
                <textarea style="height:70px;" oninput="updateField('interesses', this.value)">${dataCollected.interesses}</textarea>
            </div>
        `;
    }
}

function updateField(key, value) {
    dataCollected[key] = value;
    saveStateToLocalStorage();
    updateLivePreview();
}

function uploadPhotoHandler(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            updateField("foto", e.target.result);
            renderStep();
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function removePhotoHandler() {
    updateField("foto", "");
    renderStep();
}

function hideErrorBox() {
    const errBox = document.getElementById("error-message-box");
    if (errBox) errBox.style.display = "none";
}

function renderExperienciasSubForm(container) {
    container.innerHTML = `
        <div class="input-sub-group">
            <label>Empresa</label>
            <input type="text" id="exp-empresa">
        </div>
        <div class="input-sub-group">
            <label>Cargo</label>
            <input type="text" id="exp-cargo">
        </div>
        <div class="input-sub-group">
            <label>Início</label>
            <input type="text" id="exp-inicio" oninput="aplicarMascaraDataCustom(this)">
        </div>
        <div class="input-sub-group">
            <label>Término</label>
            <input type="text" id="exp-fim" oninput="aplicarMascaraDataCustom(this)">
        </div>
        <div class="checkbox-inline-group">
            <input type="checkbox" id="exp-atual" onchange="toggleDataFim(this, 'exp-fim')">
            <span class="checkmark"></span>
            <label for="exp-atual">Atualmente trabalho aqui</label>
        </div>
        <div class="input-sub-group" style="margin-top:15px;">
            <label>Descrição das Atividades</label>
            <textarea id="exp-desc"></textarea>
        </div>
        <button class="btn-add-item" onclick="saveExperienciaItem()">Salvar Experiência</button>
        <div class="added-items-list" id="render-lista-experiencias"></div>
    `;
    renderExperienciasList();
}

function saveExperienciaItem() {
    const empresa = document.getElementById("exp-empresa").value.trim();
    const cargo = document.getElementById("exp-cargo").value.trim();
    const inicio = document.getElementById("exp-inicio").value.trim();
    const fim = document.getElementById("exp-fim").value.trim();
    const atual = document.getElementById("exp-atual").checked;
    const desc = document.getElementById("exp-desc").value.trim();

    if (!empresa || !cargo) {
        alert("Por favor, preencha Empresa e Cargo.");
        return;
    }

    const item = {
        empresa,
        cargo,
        inicio,
        fim: atual ? "Atual" : fim,
        atual,
        desc,
    };

    if (editingExperienciaIndex > -1) {
        dataCollected.experiencias[editingExperienciaIndex] = item;
        editingExperienciaIndex = -1;
    } else {
        dataCollected.experiencias.push(item);
    }

    saveStateToLocalStorage();
    renderStep();
    updateLivePreview();
}

function renderExperienciasList() {
    const container = document.getElementById("render-lista-experiencias");
    if (!container) return;
    container.innerHTML = "";
    dataCollected.experiencias.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "added-item-row";
        row.innerHTML = `
            <span><strong>${item.cargo}</strong> em ${item.empresa}</span>
            <div class="item-actions-group">
                <button class="btn-edit-item" onclick="editExperienciaItem(${index})">Editar</button>
                <button class="btn-remove-item" onclick="removeExperienciaItem(${index})">Remover</button>
            </div>
        `;
        container.appendChild(row);
    });
}

function editExperienciaItem(index) {
    const item = dataCollected.experiencias[index];
    editingExperienciaIndex = index;
    document.getElementById("exp-empresa").value = item.empresa;
    document.getElementById("exp-cargo").value = item.cargo;
    document.getElementById("exp-inicio").value = item.inicio;
    document.getElementById("exp-fim").value = item.atual ? "" : item.fim;
    document.getElementById("exp-atual").checked = item.atual;
    document.getElementById("exp-desc").value = item.desc;
    toggleDataFim(document.getElementById("exp-atual"), "exp-fim");
}

function removeExperienciaItem(index) {
    dataCollected.experiencias.splice(index, 1);
    saveStateToLocalStorage();
    renderStep();
    updateLivePreview();
}

function renderFormacoesSubForm(container) {
    container.innerHTML = `
        <div class="input-sub-group">
            <label>Curso / Graduação</label>
            <input type="text" id="form-curso">
        </div>
        <div class="input-sub-group">
            <label>Instituição</label>
            <input type="text" id="form-inst">
        </div>
        <div class="input-sub-group">
            <label>Início</label>
            <input type="text" id="form-inicio" oninput="aplicarMascaraDataCustom(this)">
        </div>
        <div class="input-sub-group">
            <label>Término</label>
            <input type="text" id="form-fim" oninput="aplicarMascaraDataCustom(this)">
        </div>
        <div class="checkbox-inline-group">
            <input type="checkbox" id="form-atual" onchange="toggleDataFim(this, 'form-fim')">
            <span class="checkmark"></span>
            <label for="form-atual">Em andamento</label>
        </div>
        <button class="btn-add-item" style="margin-top:20px;" onclick="saveFormacaoItem()">Salvar Formação</button>
        <div class="added-items-list" id="render-lista-formacoes"></div>
    `;
    renderFormacoesList();
}

function saveFormacaoItem() {
    const curso = document.getElementById("form-curso").value.trim();
    const inst = document.getElementById("form-inst").value.trim();
    const inicio = document.getElementById("form-inicio").value.trim();
    const fim = document.getElementById("form-fim").value.trim();
    const aktual = document.getElementById("form-atual").checked;

    if (!curso || !inst) {
        alert("Por favor, preencha o Curso e a Instituição.");
        return;
    }

    const item = {
        curso,
        inst,
        inicio,
        fim: aktual ? "Em Andamento" : fim,
        atual: aktual,
    };

    if (editingFormacaoIndex > -1) {
        dataCollected.formacoes[editingFormacaoIndex] = item;
        editingFormacaoIndex = -1;
    } else {
        dataCollected.formacoes.push(item);
    }

    saveStateToLocalStorage();
    renderStep();
    updateLivePreview();
}

function renderFormacoesList() {
    const container = document.getElementById("render-lista-formacoes");
    if (!container) return;
    container.innerHTML = "";
    dataCollected.formacoes.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "added-item-row";
        row.innerHTML = `
            <span><strong>${item.curso}</strong> - ${item.inst}</span>
            <div class="item-actions-group">
                <button class="btn-edit-item" onclick="editFormacaoItem(${index})">Editar</button>
                <button class="btn-remove-item" onclick="removeFormacaoItem(${index})">Remover</button>
            </div>
        `;
        container.appendChild(row);
    });
}

function editFormacaoItem(index) {
    const item = dataCollected.formacoes[index];
    editingFormacaoIndex = index;
    document.getElementById("form-curso").value = item.curso;
    document.getElementById("form-inst").value = item.inst;
    document.getElementById("form-inicio").value = item.inicio;
    document.getElementById("form-fim").value = item.atual ? "" : item.fim;
    document.getElementById("form-atual").checked = item.atual;
    toggleDataFim(document.getElementById("form-atual"), "form-fim");
}

function removeFormacaoItem(index) {
    dataCollected.formacoes.splice(index, 1);
    saveStateToLocalStorage();
    renderStep();
    updateLivePreview();
}

function renderCertificacoesSubForm(container) {
    container.innerHTML = `
        <div class="input-sub-group">
            <label>Certificação / Curso</label>
            <input type="text" id="cert-nome">
        </div>
        <div class="input-sub-group">
            <label>Instituição Emissora</label>
            <input type="text" id="cert-inst">
        </div>
        <div class="input-sub-group">
            <label>Data de Emissão</label>
            <input type="text" id="cert-data" oninput="aplicarMascaraDataCustom(this)">
        </div>
        <button class="btn-add-item" onclick="saveCertificacaoItem()">Salvar Certificação</button>
        <div class="added-items-list" id="render-lista-certificacoes"></div>
    `;
    renderCertificacoesList();
}

function saveCertificacaoItem() {
    const nome = document.getElementById("cert-nome").value.trim();
    const inst = document.getElementById("cert-inst").value.trim();
    const data = document.getElementById("cert-data").value.trim();

    if (!nome) {
        alert("Por favor, informe ao menos o nome do curso/certificação.");
        return;
    }

    const item = { nome, inst, data };

    if (editingCertificacaoIndex > -1) {
        dataCollected.certificacoes[editingCertificacaoIndex] = item;
        editingCertificacaoIndex = -1;
    } else {
        dataCollected.certificacoes.push(item);
    }

    saveStateToLocalStorage();
    renderStep();
    updateLivePreview();
}

function renderCertificacoesList() {
    const container = document.getElementById("render-lista-certificacoes");
    if (!container) return;
    container.innerHTML = "";
    dataCollected.certificacoes.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "added-item-row";
        row.innerHTML = `
            <span><strong>${item.nome}</strong></span>
            <div class="item-actions-group">
                <button class="btn-edit-item" onclick="editCertificacaoItem(${index})">Editar</button>
                <button class="btn-remove-item" onclick="removeCertificacaoItem(${index})">Remover</button>
            </div>
        `;
        container.appendChild(row);
    });
}

function editCertificacaoItem(index) {
    const item = dataCollected.certificacoes[index];
    editingCertificacaoIndex = index;
    document.getElementById("cert-nome").value = item.nome;
    document.getElementById("cert-inst").value = item.inst;
    document.getElementById("cert-data").value = item.data;
}

function removeCertificacaoItem(index) {
    dataCollected.certificacoes.splice(index, 1);
    saveStateToLocalStorage();
    renderStep();
    updateLivePreview();
}

function addCompetenciaTag() {
    const input = document.getElementById("input-competencia-tag");
    if (!input) return;
    const value = input.value.trim();
    if (value && !dataCollected.competencias.includes(value)) {
        dataCollected.competencias.push(value);
        saveStateToLocalStorage();
        input.value = "";
        renderCompetenciasList();
        updateLivePreview();
    }
}

function renderCompetenciasList() {
    const container = document.getElementById("lista-competencias-tags");
    if (!container) return;
    container.innerHTML = "";
    dataCollected.competencias.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "added-item-row";
        row.innerHTML = `
            <span>${item}</span>
            <button class="btn-remove-item" onclick="removeCompetenciaTag(${index})">Remover</button>
        `;
        container.appendChild(row);
    });
}

function removeCompetenciaTag(index) {
    dataCollected.competencias.splice(index, 1);
    saveStateToLocalStorage();
    renderCompetenciasList();
    updateLivePreview();
}

function updateLivePreview() {
    document.getElementById("cv-nome").innerText =
        dataCollected.nome || "Seu Nome Completo";
    document.getElementById("cv-cargo").innerText =
        dataCollected.cargo || "Seu Cargo ou Profissão";
    document.getElementById("cv-resumo").innerText =
        dataCollected.resumo ||
        "Breve resumo de suas qualificações e objetivos de carreira.";

    const contatoLista = document.getElementById("cv-contato-lista");
    if (contatoLista) {
        contatoLista.innerHTML = `
            ${dataCollected.telefone ? `<li><strong>Tel:</strong> ${dataCollected.telefone}</li>` : ""}
            ${dataCollected.email ? `<li><strong>E-mail:</strong> ${dataCollected.email}</li>` : ""}
            ${dataCollected.local ? `<li><strong>Local:</strong> ${dataCollected.local}</li>` : ""}
            ${dataCollected.cpf ? `<li><strong>CPF:</strong> ${dataCollected.cpf}</li>` : ""}
        `;
        if (
            !dataCollected.telefone &&
            !dataCollected.email &&
            !dataCollected.local &&
            !dataCollected.cpf
        ) {
            contatoLista.innerHTML =
                "<li>Telefone</li><li>E-mail</li><li>Localização</li>";
        }
    }

    const photoBucket = document.getElementById("preview-photo-bucket");
    const photoImg = document.getElementById("preview-photo");
    if (photoBucket && photoImg) {
        if (dataCollected.foto) {
            photoImg.src = dataCollected.foto;
            photoBucket.style.display = "block";
        } else {
            photoBucket.style.display = "none";
            photoImg.src = "";
        }
    }

    const compLista = document.getElementById("cv-competencias-lista");
    if (compLista) {
        compLista.innerHTML = "";
        dataCollected.competencias.forEach((c) => {
            const li = document.createElement("li");
            li.innerText = c;
            compLista.appendChild(li);
        });
    }

    const idiomasBox = document.getElementById("cv-idiomas-box");
    const idiomasTxt = document.getElementById("cv-idiomas");
    if (idiomasBox && idiomasTxt) {
        if (dataCollected.idiomas && dataCollected.idiomas.trim()) {
            idiomasTxt.innerText = dataCollected.idiomas;
            idiomasBox.style.display = "block";
        } else {
            idiomasBox.style.display = "none";
        }
    }

    const interessesBox = document.getElementById("cv-interesses-box");
    const interessesTxt = document.getElementById("cv-interesses");
    if (interessesBox && interessesTxt) {
        if (dataCollected.interesses && dataCollected.interesses.trim()) {
            interessesTxt.innerText = dataCollected.interesses;
            interessesBox.style.display = "block";
        } else {
            interessesBox.style.display = "none";
        }
    }

    const expContainer = document.getElementById("cv-experiencias-container");
    if (expContainer) {
        expContainer.innerHTML = "";
        if (
            !dataCollected.experiencias ||
            dataCollected.experiencias.length === 0
        ) {
            expContainer.innerHTML =
                "<p style='color:#777; font-style:italic;'>Nenhuma experiência registrada.</p>";
        } else {
            dataCollected.experiencias.forEach((item) => {
                const block = document.createElement("div");
                block.className = "cv-item-render";
                block.innerHTML = `
                    <div class="cv-item-meta">
                        <span>${item.cargo}</span>
                        <span>${item.inicio} - ${item.fim}</span>
                    </div>
                    <div class="cv-item-institution">${item.empresa}</div>
                    ${item.desc ? `<div class="cv-item-description">${item.desc.replace(/\n/g, "<br>")}</div>` : ""}
                `;
                expContainer.appendChild(block);
            });
        }
    }

    const formContainer = document.getElementById("cv-formacoes-container");
    if (formContainer) {
        formContainer.innerHTML = "";
        if (!dataCollected.formacoes || dataCollected.formacoes.length === 0) {
            formContainer.innerHTML =
                "<p style='color:#777; font-style:italic;'>Nenhuma formação registrada.</p>";
        } else {
            dataCollected.formacoes.forEach((item) => {
                const block = document.createElement("div");
                block.className = "cv-item-render";
                block.innerHTML = `
                    <div class="cv-item-meta">
                        <span>${item.curso}</span>
                        <span>${item.inicio} - ${item.fim}</span>
                    </div>
                    <div class="cv-item-institution">${item.inst}</div>
                `;
                formContainer.appendChild(block);
            });
        }
    }

    const certBox = document.getElementById("cv-certificacoes-box");
    const certContainer = document.getElementById("cv-certificacoes-container");
    if (certBox && certContainer) {
        certContainer.innerHTML = "";
        if (
            !dataCollected.certificacoes ||
            dataCollected.certificacoes.length === 0
        ) {
            certBox.style.display = "none";
        } else {
            certBox.style.display = "block";
            dataCollected.certificacoes.forEach((item) => {
                const block = document.createElement("div");
                block.className = "cv-item-render";
                block.innerHTML = `
                    <div class="cv-item-meta">
                        <span>${item.nome}</span>
                        <span>${item.data}</span>
                    </div>
                    ${item.inst ? `<div class="cv-item-institution">${item.inst}</div>` : ""}
                `;
                certContainer.appendChild(block);
            });
        }
    }
}

function aplicarModelo(nomeModelo) {
    const previewElement = document.getElementById("cv-preview");
    if (!previewElement) return;

    previewElement.className = "a4-sheet";

    if (nomeModelo !== "padrao") {
        previewElement.classList.add(nomeModelo);
    }

    dataCollected.modelo = nomeModelo;
    saveStateToLocalStorage();
}

function finalizarEIrParaResultado() {
    saveStateToLocalStorage();
    window.location.href = "/pages/resultado.html";
}
