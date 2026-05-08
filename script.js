document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let products = [];
    const STORAGE_KEY = 'aesthetic_products_v1';

    // --- DOM Elements ---
    const form = document.getElementById('product-form');
    const nameInput = document.getElementById('product-name');
    const urlInput = document.getElementById('image-url');
    const linkInput = document.getElementById('product-link');
    const grid = document.getElementById('product-grid');
    const emptyState = document.getElementById('empty-state');

    // NEW: Counter Element
    const counterText = document.getElementById('counter-text');

    // --- Initialization ---
    function init() {
        loadProducts();
        renderProducts();
    }

    // --- Local Storage ---
    function loadProducts() {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (stored) {
            try {
                products = JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse stored products", e);
                products = [];
            }
        }
    }

    function saveProducts() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }

    // --- Rendering ---
    function renderProducts() {

        // Clear current grid
        grid.innerHTML = '';

        // NEW: Update Counter
        counterText.textContent = `✨ ${products.length} Products Added`;

        if (products.length === 0) {

            emptyState.style.display = 'block';

        } else {

            emptyState.style.display = 'none';

            // Create and append cards
            products.forEach(product => {
                const card = createProductCard(product);
                grid.appendChild(card);
            });
        }
    }

    function createProductCard(product) {

        const card = document.createElement('div');
        card.className = 'card glass-panel';
        card.dataset.id = product.id;

        // X Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.innerHTML = '❌';

        deleteBtn.setAttribute('aria-label', 'Delete product');

        deleteBtn.onclick = () => deleteProduct(product.id);

        // Image Container
        const imageContainer = document.createElement('div');
        imageContainer.className = 'card-image-container';

        const img = document.createElement('img');

        img.src = product.imageUrl;
        img.alt = product.name;

        // Fallback for broken images
        img.onerror = () => {
            img.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
        };

        imageContainer.appendChild(img);

        // Title
        const title = document.createElement('h3');
        title.className = 'card-title';
        title.textContent = product.name;

        // Actions Container
        const actions = document.createElement('div');
        actions.className = 'card-actions';

        // View Link
        const viewLink = document.createElement('a');

        viewLink.className = 'btn-view';
        viewLink.href = product.productLink;
        viewLink.target = '_blank';
        viewLink.rel = 'noopener noreferrer';
        viewLink.textContent = 'View Product';

        // Copy Caption Button
        const copyBtn = document.createElement('button');

        copyBtn.className = 'btn-copy';
        copyBtn.textContent = 'Copy Caption';

        copyBtn.onclick = (e) =>
            copyCaption(product.name, product.productLink, e.target);

        actions.appendChild(viewLink);
        actions.appendChild(copyBtn);

        // Assemble Card
        card.appendChild(deleteBtn);
        card.appendChild(imageContainer);
        card.appendChild(title);
        card.appendChild(actions);

        return card;
    }

    // --- Actions ---
    function addProduct(e) {

        e.preventDefault();

        const name = nameInput.value.trim();
        const imageUrl = urlInput.value.trim();
        const productLink = linkInput.value.trim();

        if (!name || !imageUrl || !productLink) {

            alert('Please fill in all fields.');
            return;
        }

        const newProduct = {
            id: Date.now().toString(),
            name,
            imageUrl,
            productLink
        };

        products.push(newProduct);

        saveProducts();
        renderProducts();

        // Clear form
        form.reset();
        nameInput.focus();
    }

    function deleteProduct(id) {

        if (confirm("Are you sure you want to delete this product?")) {

            products = products.filter(p => p.id !== id);

            saveProducts();
            renderProducts();
        }
    }

    async function copyCaption(name, link, btnElement) {

        const caption =
            `✨ Check out this amazing product: ${name} 💖 Buy here: ${link}`;

        try {

            await navigator.clipboard.writeText(caption);

            // Visual feedback
            const originalText = btnElement.textContent;

            btnElement.textContent = 'Copied! ✨';

            btnElement.style.backgroundColor =
                'rgba(16, 185, 129, 0.2)';

            btnElement.style.borderColor = '#10b981';
            btnElement.style.color = '#10b981';

            setTimeout(() => {

                btnElement.textContent = originalText;

                btnElement.style.backgroundColor = '';
                btnElement.style.borderColor = '';
                btnElement.style.color = '';

            }, 2000);

        } catch (err) {

            console.error('Failed to copy text: ', err);

            alert('Failed to copy caption. Please try again.');
        }
    }

    // --- Event Listeners ---
    form.addEventListener('submit', addProduct);

    // Run init
    init();
});