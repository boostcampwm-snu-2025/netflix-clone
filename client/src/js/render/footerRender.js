export async function footerRender() {
    const container = document.getElementById('footer-container');
    if (!container) return;

    const response = await fetch('./data/footerData.json');
    const footerData = await response.json();

    const socialLogosHtml = footerData.socialLogos.map(logo => `<a href="#"><img src="${logo.src}" alt="${logo.alt}"></a>`).join('');
    const linksHtml = footerData.links.map(link => `<a href="#">${link}</a>`).join('');
    const infoHtml = footerData.info.map(line => `<div>${line}</div>`).join('');

    container.innerHTML = `
        <div class="footer__logos">${socialLogosHtml}</div>
        <nav class="footer__nav">${linksHtml}</nav>
        <div class="footer__info">${infoHtml}</div>
    `;
}