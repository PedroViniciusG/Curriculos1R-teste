window.onload = function () {
    renderFinalDocument();
};

function renderFinalDocument() {
    const rawData = localStorage.getItem("cv_data");
    const workspace = document.getElementById("document-workspace");
    const errorScreen = document.getElementById("error-screen");
    const sheetElement = document.getElementById("cv-render-sheet");

    if (sheetElement) {
        // Garantimos que a classe base 'a4-sheet' exista sempre
        sheetElement.className = "a4-sheet";

        // Adicionamos o modelo apenas se não for 'padrao'
        if (data.modelo && data.modelo !== "padrao") {
            sheetElement.classList.add(data.modelo);
        }
    }

    if (!rawData) {
        if (workspace) workspace.style.display = "none";
        if (errorScreen) errorScreen.style.display = "flex";
        return;
    }

    const data = JSON.parse(rawData);

    if (sheetElement) {
        sheetElement.classList.remove("modelo-moderno", "modelo-minimalista");
        if (data.modelo && data.modelo !== "padrao") {
            sheetElement.classList.add(data.modelo);
        }
    }

    // 1. Cabeçalho Principal
    document.getElementById("cv-nome").innerText =
        data.nome || "Nome Não Informado";
    document.getElementById("cv-cargo").innerText = data.cargo || "";

    // 2. Resumo Profissional
    if (data.resumo && data.resumo.trim()) {
        document.getElementById("cv-resumo").innerText = data.resumo;
        document.getElementById("cv-resumo-box").style.display = "block";
    } else {
        document.getElementById("cv-resumo-box").style.display = "none";
    }

    // 3. Coluna Lateral: Contato
    const contatoLista = document.getElementById("cv-contato-lista");
    if (contatoLista) {
        contatoLista.innerHTML = `
            ${data.telefone ? `<li><strong>Tel:</strong> ${data.telefone}</li>` : ""}
            ${data.email ? `<li><strong>E-mail:</strong> ${data.email}</li>` : ""}
            ${data.local ? `<li><strong>Local:</strong> ${data.local}</li>` : ""}
            ${data.cpf ? `<li><strong>CPF:</strong> ${data.cpf}</li>` : ""}
        `;
    }

    // 4. Foto de Perfil
    const photoBucket = document.getElementById("preview-photo-bucket");
    const photoImg = document.getElementById("preview-photo");
    if (photoBucket && photoImg) {
        if (data.foto) {
            photoImg.src = data.foto;
            photoBucket.style.display = "block";
        } else {
            photoBucket.style.display = "none";
        }
    }

    // 5. Coluna Lateral: Competências
    const compLista = document.getElementById("cv-competencias-lista");
    if (compLista) {
        compLista.innerHTML = "";
        if (data.competencias && data.competencias.length > 0) {
            data.competencias.forEach((c) => {
                const li = document.createElement("li");
                li.innerText = c;
                compLista.appendChild(li);
            });
        } else {
            compLista.innerHTML = "<li>Não informadas</li>";
        }
    }

    // 6. Coluna Lateral: Idiomas
    const idiomasBox = document.getElementById("cv-idiomas-box");
    const idiomasTxt = document.getElementById("cv-idiomas");
    if (idiomasBox && idiomasTxt) {
        if (data.idiomas && data.idiomas.trim()) {
            idiomasTxt.innerText = data.idiomas;
            idiomasBox.style.display = "block";
        } else {
            idiomasBox.style.display = "none";
        }
    }

    // 7. Coluna Principal: Experiências
    const expBox = document.getElementById("cv-experiencias-box");
    const expContainer = document.getElementById("cv-experiencias-container");
    if (data.experiencias && data.experiencias.length > 0) {
        expContainer.innerHTML = data.experiencias
            .map(
                (item) => `
                <div class="cv-item-render">
                    <div class="cv-item-meta">
                        <span><strong>${item.cargo}</strong></span>
                        <span>${item.inicio} - ${item.fim}</span>
                </div>
            `,
            )
            .join("");
        expBox.style.display = "block";
    } else {
        expBox.style.display = "none";
    }

    // 8. Coluna Principal: Formações
    const eduBox = document.getElementById("cv-formacoes-box");
    const eduContainer = document.getElementById("cv-formacoes-container");
    if (data.formacoes && data.formacoes.length > 0) {
        eduContainer.innerHTML = data.formacoes
            .map(
                (item) => `
                <div class="cv-item-render">
                    <div class="cv-item-meta">
                        <span><strong>${item.curso}</strong></span>
                        <span>${item.inicio} - ${item.fim}</span>
                    </div>
                    <div class="cv-item-institution">${item.inst}</div>
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
    const certContainer = document.getElementById("cv-certificacoes-container");
    if (data.certificacoes && data.certificacoes.length > 0) {
        certContainer.innerHTML = data.certificacoes
            .map(
                (item) => `
                <div class="cv-item-render">
                    <div class="cv-item-meta">
                        <span><strong>${item.nome}</strong></span>
                        <span>${item.data}</span>
                    </div>
                    ${item.inst ? `<div class="cv-item-institution">${item.inst}</div>` : ""}
                </div>
            `,
            )
            .join("");
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

// CONTROLES DO MODAL E SIMULAÇÃO DE PAGAMENTO
function openPaymentModal() {
    document.getElementById("payment-modal").style.display = "flex";
}

function closePaymentModal() {
    document.getElementById("payment-modal").style.display = "none";
}

function copyPixCode() {
    const copyText = document.getElementById("pix-string-input");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    alert("Código Pix Copiado com sucesso!");
}

function confirmPaymentSimulation() {
    alert("Pagamento processado com sucesso! Download do PDF liberado.");
    document.getElementById("payment-modal").style.display = "none";

    // Altera a interface para disponibilizar a impressão real
    document.getElementById("btn-pay-trigger").style.display = "none";
    document.getElementById("btn-print-real").style.display = "block";
}

function triggerPrint() {
    window.print();
}

function backToEditor() {
    window.location.href = "../index.html";
}
