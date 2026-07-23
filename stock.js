// ==========================================
// أولاً: تفعيل آلية التنقل بين الأقسام الجانبية (Navigation)
// ==========================================
const sidebarButtons = document.querySelectorAll('.sidebar-btn');
const pageSections = document.querySelectorAll('.page-section');

sidebarButtons.forEach(button => {
    button.addEventListener('click', function() {
        // 1. إزالة التحديد الأصفر (active) من كافة الأزرار
        sidebarButtons.forEach(btn => btn.classList.remove('active'));
        
        // 2. إضافة اللون الأصفر للزر الذي تم الضغط عليه حالياً
        this.classList.add('active');
        
        // 3. إخفاء جميع الأقسام والصفحات في اليسار
        pageSections.forEach(section => section.style.display = 'none');
        
        // 4. إظهار القسم المطلوب فقط المرتبط بالزر المكبوس
        const targetId = this.getAttribute('data-target');
        document.getElementById(targetId).style.display = 'block';
    });
});


// ==========================================
// ثانياً: تشغيل الحسابات داخل قسم "إنشاء الفاتورة"
// ==========================================
const productSelect = document.getElementById('productSelect');
const unitPriceInput = document.getElementById('unitPrice');
const quantityInput = document.getElementById('quantity');
const addBtn = document.getElementById('addBtn');
const invoiceItems = document.getElementById('invoiceItems');
const grandTotalDisplay = document.getElementById('grandTotalDisplay');
const saveBtn = document.getElementById('saveBtn');

let totalGlobal = 0;
let itemCount = 0;

// تحديث السعر الفردي تلقائياً عند تغيير نوع السلعة
productSelect.addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    const price = selectedOption.getAttribute('data-price');
    unitPriceInput.value = price ? price : '';
});

// إضافة منتج جديد للجدول
addBtn.addEventListener('click', function() {
    const productName = productSelect.value;
    const price = parseFloat(unitPriceInput.value);
    const qty = parseInt(quantityInput.value);

    if (!productName || isNaN(price) || isNaN(qty) || qty <= 0) {
        alert('Veuillez sélectionner un produit et entrer une quantité valide.');
        return;
    }

    itemCount++;
    const reference = 'REF-' + String(itemCount).padStart(4, '0');
    const totalLine = price * qty;
    totalGlobal += totalLine;

    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${reference}</td>
        <td>${productName}</td>
        <td>${price.toFixed(2)} DA</td>
        <td>${qty}</td>
        <td>${totalLine.toFixed(2)} DA</td>
    `;
    invoiceItems.appendChild(row);

    grandTotalDisplay.innerText = `Montant Total Global : ${totalGlobal.toFixed(2)} DA`;

    productSelect.value = '';
    unitPriceInput.value = '';
    quantityInput.value = '1';
});

// حفظ الفاتورة بالكامل
saveBtn.addEventListener('click', function() {
    if (totalGlobal === 0) {
        alert('La facture est vide. Ajoutez des articles avant de sauvegarder.');
        return;
    }
    alert('Facture enregistrée avec succès et transférée au stock !');
    invoiceItems.innerHTML = '';
    totalGlobal = 0;
    grandTotalDisplay.innerText = 'Montant Total Global : 0.00 DA';
});
