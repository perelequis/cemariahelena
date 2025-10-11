document.getElementById('currentYear').textContent = new Date().getFullYear();

function copyToClipboard(element, textToCopy) {
    navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = element.innerHTML;
        element.textContent = 'Copiado!';
        setTimeout(() => {
            element.innerHTML = originalText;
        }, 1500);
    }).catch(err => {
        console.error('Falha ao copiar texto: ', err);
    });
}