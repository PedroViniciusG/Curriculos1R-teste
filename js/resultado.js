window.onload = function () {
    renderFinalDocument();
};

function renderFinalDocument() {
    const rawData = localStorage.getItem("cv_data");
    const workspace = document.getElementById("document-workspace");
    const errorScreen = document.getElementById("error-screen");

    // Validação nativa interna (substitui window.alert)
    if (!rawData) {
        if (workspace) workspace.style.display = "none";
        if (errorScreen) errorScreen.style.display = "flex";
        return;
    }

    const data = JSON.parse(rawData);

    // 1. Cabeçalho Principal
    document.getElementById("cv-nome").innerText =
        data.nome || "Nome Não Informado";
    document.getElementById("cv-cargo").innerText = data.cargo || "";

    // 2. Coluna Lateral: Contato (Inclui CPF condicionalmente de forma estruturada)
    const contatoLista = document.getElementById("cv-contato-lista");
    let contatoHTML = ``;
    if (data.telefone) contatoHTML += `<li>${data.telefone}</li>`;
    if (data.email) contatoHTML += `<li>${data.email}</li>`;
    if (data.cpf) contatoHTML += `<li>CPF: ${data.cpf}</li>`;
    if (data.local) contatoHTML += `<li>${data.local}</li>`;
    contatoLista.innerHTML = contatoHTML;

    // 3. Coluna Lateral: Foto Profissional
    const photoBucket = document.getElementById("preview-photo-bucket");
    if (data.foto) {
        document.getElementById("preview-photo").src = data.foto;
        photoBucket.style.display = "block";
    } else {
        photoBucket.style.display = "none";
    }

    // 4. Coluna Lateral: Competências
    const compBox = document.getElementById("cv-competencias-box");
    if (data.competencias && data.competencias.length > 0) {
        document.getElementById("cv-competencias-lista").innerHTML =
            data.competencias
                .map(
                    (item) => `
            <li>${item}</li>
        `,
                )
                .join("");
        compBox.style.display = "block";
    } else {
        compBox.style.display = "none";
    }

    // 5. Coluna Lateral: Idiomas
    const idiBox = document.getElementById("cv-idiomas-box");
    if (data.idiomas && data.idiomas.trim()) {
        document.getElementById("cv-idiomas").innerText = data.idiomas;
        idiBox.style.display = "block";
    } else {
        idiBox.style.display = "none";
    }

    // 6. Coluna Principal: Perfil Profissional
    const resumoBox = document.getElementById("cv-resumo-box");
    if (data.resumo && data.resumo.trim()) {
        document.getElementById("cv-resumo").innerText = data.resumo;
        resumoBox.style.display = "block";
    } else {
        resumoBox.style.display = "none";
    }

    // 7. Coluna Principal: Experiências
    const xpBox = document.getElementById("cv-experiencias-box");
    const xpContainer = document.getElementById("cv-experiencias-container");
    if (data.experiencias && data.experiencias.length > 0) {
        xpContainer.innerHTML = data.experiencias
            .map(
                (item) => `
            <div class="cv-item-render">
                <div class="cv-item-meta"><span>${item.cargo}</span><span>${item.periodo}</span></div>
                <div class="cv-item-institution">${item.empresa}</div>
                ${item.descricao ? `<div class="cv-item-description" style="white-space: pre-line;">${item.descricao}</div>` : ""}
            </div>
        `,
            )
            .join("");
        xpBox.style.display = "block";
    } else {
        xpBox.style.display = "none";
    }

    // 8. Coluna Principal: Formações Acadêmicas
    const eduBox = document.getElementById("cv-formacoes-box");
    const eduContainer = document.getElementById("cv-formacoes-container");
    if (data.formacoes && data.formacoes.length > 0) {
        eduContainer.innerHTML = data.formacoes
            .map(
                (item) => `
            <div class="cv-item-render">
                <div class="cv-item-meta"><span>${item.curso}</span><span>${item.periodo}</span></div>
                <div class="cv-item-institution">${item.instituicao}</div>
            </div>
        `,
            )
            .join("");
        eduBox.style.display = "block";
    } else {
        eduBox.style.display = "none";
    }

    // 9. Coluna Principal: Certificações
    const certBox = document.getElementById("cv-certificacoes-box");
    if (data.certificacoes && data.certificacoes.trim()) {
        document.getElementById("cv-certificacoes").innerText =
            data.certificacoes;
        certBox.style.display = "block";
    } else {
        certBox.style.display = "none";
    }

    // 10. Coluna Principal: Áreas de Interesse
    const intBox = document.getElementById("cv-interesses-box");
    if (data.interesses && data.interesses.trim()) {
        document.getElementById("cv-interesses").innerText = data.interesses;
        intBox.style.display = "block";
    } else {
        intBox.style.display = "none";
    }
}

// Retorna ao construtor preservando a etapa e os dados salvos no index
function backToEditor() {
    window.location.href = "../index.html";
}

// Abre a janela nativa do sistema operacional para impressão ou salvar como PDF
function triggerPrint() {
    window.print();
}
