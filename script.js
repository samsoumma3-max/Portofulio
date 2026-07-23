// دالة لتهيئة البيانات الافتراضية إذا كانت قاعدة البيانات فارغة تماماً
if (!localStorage.getItem('products')) {
    const defaultProducts = [
        { id: "PRD001", name: "Ciment (Sac 50kg)", pAchat: 600, pVente: 800, stock: 100 },
        { id: "PRD002", name: "Briques (Unité)", pAchat: 30, pVente: 45, stock: 5000 }
    ];
    localStorage.setItem('products', JSON.stringify(defaultProducts));
}
if (!localStorage.getItem('clients')) {
    const defaultClients = [{ name: "Ahmed Benali", phone: "0550000000", address: "Alger" }];
    localStorage.setItem('clients', JSON.stringify(defaultClients));
}
if (!localStorage.getItem('invoices')) {
    localStorage.setItem('invoices', JSON.stringify([]));
}

// كود خاص بصفحة الفاتورة الرئيسية index.html
if (document.getElementById('productSelect')) {
    const productSelect = document.getElementById('productSelect');
    const clientSelect = document.getElementById('clientSelect');
    const unitPriceInput = document.getElementById('unitPrice');
    const stockAvailable = document.getElementById('stockAvailable');
    const quantityInput = document.getElementById('quantity');
    const addBtn = document.getElementById('addBtn');
    const invoiceItems = document.getElementById('invoiceItems');
    const grandTotalDisplay = document.getElementById('grandTotalDisplay');
    const saveBtn = document.getElementById('saveBtn');
    const invoiceNumInput = document.getElementById('invoiceNum');

    let products = JSON.parse(localStorage.getItem('products'));
    let clients = JSON.parse(localStorage.getItem('clients'));
    let invoices = JSON.parse(localStorage.getItem('invoices'));

    // توليد رقم فاتورة تلقائي
    invoiceNumInput.value = 'V' + String(invoices.length + 10).padStart(5, '0');
    document.getElementById('invoiceDate').valueAsDate = new Date();

    // تعبئة قائمة المنتجات وقائمة العملاء
    products.forEach(p => {
        let opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = p.name;
        productSelect.appendChild(opt);
    });

    clients.forEach(c => {
        let opt = document.createElement('option');
        opt.value = c.name;
        opt.textContent = c.name;
        clientSelect.appendChild(opt);
    });

    // تحديث السعر والمخزن المتاح عند اختيار المنتج
    productSelect.addEventListener('change', function() {
        const prod = products.find(p => p.id === this.value);
        if (prod) {
            unitPriceInput.value = prod.pVente;
            stockAvailable.value = prod.stock;
        } else {
            unitPriceInput.value = '';
            stockAvailable.value = '';
        }
    });

    let currentItems = [];
    let totalGlobal = 0;

    // إضافة منتج للفاتورة المؤقتة
    addBtn.addEventListener('click', function() {
        const prodId = productSelect.value;
        const qty = parseInt(quantityInput.value);
        const prod = products.find(p => p.id === prodId);

        if (!prod || isNaN(qty) || qty <= 0) {
            alert('Veuillez choisir un produit et une quantité valide.');
            return;
        }

        if (qty > prod.stock) {
            alert('Quantité insuffisante en stock! Il reste seulement: ' + prod.stock);
            return;
        }

        const totalLine = prod.pVente * qty;
        totalGlobal += totalLine;

        currentItems.push({ id: prod.id, name: prod.name, price: prod.pVente, qty: qty, total: totalLine });

        const row = document.createElement('tr');
        row.innerHTML = `<td>${prod.id}</td><td>${prod.name}</td><td>${prod.pVente.toFixed(2)} DA</td><td>${qty}</td><td>${totalLine.toFixed(2)} DA</td>`;
        invoiceItems.appendChild(row);

        grandTotalDisplay.innerText = `Montant Total Global : ${totalGlobal.toFixed(2)} DA`;

        // خصم مؤقت من الواجهة وتصفير الحقول
        prod.stock -= qty;
        stockAvailable.value = prod.stock;
        productSelect.value = '';
        unitPriceInput.value = '';
    });

    // حفظ الفاتورة بشكل نهائي وتحديث الـ LocalStorage للمخزن والإيرادات
    saveBtn.addEventListener('click', function() {
        if (currentItems.length === 0 || !clientSelect.value) {
            alert('Veuillez choisir un client et ajouter des articles.');
            return;
        }

        const newInvoice = {
            num: invoiceNumInput.value,
            date: document.getElementById('invoiceDate').value,
            client: clientSelect.value,
            total: totalGlobal,
            items: currentItems
        };

        invoices.push(newInvoice);
        localStorage.setItem('invoices', JSON.stringify(invoices));
        localStorage.setItem('products', JSON.stringify(products)); // حفظ الكميات الجديدة بالمخزن

        alert('Facture enregistrée avec succès! Le stock a été mis à jour.');
        window.location.reload();
    });
}
