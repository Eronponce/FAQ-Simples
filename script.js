document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    fetchFaqs();
});

function fetchCategories() {
    const categories = ['ensalamentos', 'outraCategoria']; // Substitua isso com uma chamada fetch real para o servidor

    const categoryContainer = document.getElementById('category-buttons');
    categories.forEach(category => {
        const categoryButton = document.createElement('button');
        categoryButton.className = 'button';
        categoryButton.innerText = capitalizeFirstLetter(category);
        categoryButton.addEventListener('click', () => fillSearchWithCategory(category));
        categoryContainer.appendChild(categoryButton);
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
function markdownToHtml(markdown, category) {
    const lines = markdown.split('\n');
    let html = '';
    let inFaqItem = false;

    lines.forEach(line => {
        if (line.startsWith('## ')) {
            if (inFaqItem) {
                html += '</div>';
            }
            html += `<div class="faq-item ${category}" style="display: block;"><h3>${line.substring(3)}</h3>`;
            inFaqItem = true;
        } else if (line.trim() === '') {
            // Skip empty lines
        } else if (line.startsWith('![')) {
            const match = line.match(/!\[(.*?)\]\((.*?)\)/);
            if (match) {
                const altText = match[1];
                const src = match[2];
                html += `<img src="${src}" alt="${altText}" />`;
            }
        } else if (line.startsWith('[')) {
            const match = line.match(/\[(.*?)\]\((.*?)\)/);
            if (match) {
                const linkText = match[1];
                const href = match[2];
                html += `<a href="${href}" target="_blank">${linkText}</a>`;
            }
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
        performSearch();
    });
}

function performSearch() {
    const searchInput = document.getElementById('search');
    const input = normalizeText(searchInput.value.toLowerCase());
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = normalizeText(item.querySelector('h3').innerText.toLowerCase());
        const answer = normalizeText(item.querySelector('p').innerText.toLowerCase());
        const className = normalizeText(item.className.toLowerCase());
        if (question.includes(input) || answer.includes(input) || className.includes(input)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function fillSearchWithCategory(category) {
    const searchInput = document.getElementById('search');
    searchInput.value = category;
    performSearch(); // Execute search to filter results immediately
}

function normalizeText(text) {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
