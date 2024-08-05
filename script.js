document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    fetchFaqs();
});

function fetchCategories() {
    // Simulando a resposta do servidor com categorias
    const categories = ['ensalamentos', 'outraCategoria']; // Substitua isso com uma chamada fetch real para o servidor

    const categoryContainer = document.getElementById('category-container');
    categories.forEach(category => {
        const categoryItem = document.createElement('button');
        categoryItem.className = 'category-item';
        categoryItem.innerText = capitalizeFirstLetter(category);
        categoryItem.addEventListener('click', () => showCategory(category));
        categoryContainer.appendChild(categoryItem);
    });
}

function fetchFaqs() {
    const categories = ['ensalamentos', 'outraCategoria']; // Substitua isso com uma chamada fetch real para o servidor

    categories.forEach(category => {
        fetch(`faqs/${category}.md`)
            .then(response => response.text())
            .then(markdown => {
                const faqContent = document.getElementById('faq-content');
                faqContent.innerHTML += markdownToHtml(markdown, category);
                addSearchFunctionality();
            });
    });
}

function showCategory(category) {
    const faqItems = document.querySelectorAll('.faq-item');

    // Limpa o conteúdo atual
    const faqContent = document.getElementById('faq-content');
    faqContent.innerHTML = '';

    // Adiciona o título da categoria
    const categoryTitle = document.createElement('h2');
    categoryTitle.innerText = capitalizeFirstLetter(category);
    faqContent.appendChild(categoryTitle);

    // Mostra apenas os itens da categoria selecionada
    faqItems.forEach(item => {
        if (item.dataset.category === category) {
            faqContent.appendChild(item.cloneNode(true));
            item.style.display = 'block';
        }
    });
}

function markdownToHtml(markdown, category) {
    const lines = markdown.split('\n');
    let html = '';
    let inFaqItem = false;

    lines.forEach(line => {
        if (line.startsWith('## ')) {
            if (inFaqItem) {
                html += '</div>';
            }
            html += `<div class="faq-item" data-category="${category}" style="display: block;"><h3>${line.substring(3)}</h3>`;
            inFaqItem = true;
        } else if (line.trim() === '') {
            // Skip empty lines
        } else {
            html += `<p>${line}</p>`;
        }
    });

    if (inFaqItem) {
        html += '</div>';
    }

    return html;
}

function addSearchFunctionality() {
    const searchInput = document.getElementById('search');
    searchInput.addEventListener('keyup', function () {
        const input = normalizeText(searchInput.value.toLowerCase());
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const question = normalizeText(item.querySelector('h3').innerText.toLowerCase());
            const answer = normalizeText(item.querySelector('p').innerText.toLowerCase());
            if (question.includes(input) || answer.includes(input)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

function normalizeText(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
