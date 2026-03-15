// Инициализация AOS
AOS.init({
    duration: 800,
    once: true,
});

// Маска для телефона
$(document).ready(function(){
    $('#phone').mask("+7 (999) 999-99-99");
});

// --- Элементы калькулятора ---
const debtSlider = document.getElementById('debt');
const incomeSlider = document.getElementById('income');
const propertySlider = document.getElementById('property');
const creditorsInput = document.getElementById('creditors');
const overdueCheck = document.getElementById('overdue');
const alimonyCheck = document.getElementById('alimony');
const debtValue = document.getElementById('debtValue');
const incomeValue = document.getElementById('incomeValue');
const propertyValue = document.getElementById('propertyValue');
const resultDiv = document.getElementById('result');

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

function updateResult() {
    const debt = Number(debtSlider.value);
    const income = Number(incomeSlider.value);
    const property = Number(propertySlider.value);
    const creditors = Number(creditorsInput.value);
    const hasOverdue = overdueCheck.checked;
    const hasAlimony = alimonyCheck.checked;

    let message = '';
    let detail = '';

    if (!hasOverdue) {
        message = 'Просрочки менее 3 месяцев';
        detail = 'Для банкротства нужны просрочки более 3 месяцев. Рекомендуем консультацию, чтобы не допустить ухудшения ситуации.';
    } else if (hasAlimony) {
        message = 'Есть долги по алиментам/налогам';
        detail = 'Такие долги не списываются, но остальные могут быть списаны. Требуется юридический анализ.';
    } else if (debt < 50000) {
        message = 'Сумма долга небольшая';
        detail = 'Рекомендуем консультацию по досудебному урегулированию.';
    } else if (debt >= 50000 && debt <= 500000 && creditors >= 1) {
        message = 'Возможно внесудебное банкротство';
        detail = 'Через МФЦ, если долг от 50 тыс. до 500 тыс. рублей. Количество кредиторов не ограничено.';
    } else if (debt > 500000 && income < 50000 && property < 1000000) {
        message = 'Высокая вероятность судебного банкротства';
        detail = 'Ваша ситуация подходит под судебное банкротство. Обратитесь к нам.';
    } else {
        message = 'Требуется анализ юриста';
        detail = 'Оставьте заявку, мы проверим все нюансы бесплатно.';
    }

    resultDiv.innerHTML = `
        <p class="result-text">${message}</p>
        <p class="result-detail">${detail}</p>
    `;
}

debtSlider.addEventListener('input', function() {
    debtValue.textContent = formatNumber(this.value);
    updateResult();
});
incomeSlider.addEventListener('input', function() {
    incomeValue.textContent = formatNumber(this.value);
    updateResult();
});
propertySlider.addEventListener('input', function() {
    propertyValue.textContent = formatNumber(this.value);
    updateResult();
});
creditorsInput.addEventListener('input', updateResult);
overdueCheck.addEventListener('change', updateResult);
alimonyCheck.addEventListener('change', updateResult);

updateResult();

document.getElementById('consultBtn').addEventListener('click', function() {
    document.getElementById('requestSection').scrollIntoView({ behavior: 'smooth' });
});

// --- Совет дня ---
const tips = [
    "Перед банкротством не берите новые кредиты — это может усложнить процедуру.",
    "Не дарите и не продавайте имущество родственникам перед банкротством — суд может оспорить сделку.",
    "Сохраняйте все квитанции, чеки и договоры — они помогут подтвердить расходы.",
    "Коллекторы не имеют права угрожать вам — зафиксируйте звонки и обратитесь к юристу.",
    "Банкротство через МФЦ возможно только при долге от 50 до 500 тысяч рублей.",
    "После списания долгов вы не сможете брать кредиты в течение 5 лет, но это лучше, чем жить с долгами.",
    "Если у вас есть имущество, его могут продать, но единственное жильё не заберут.",
    "Алименты, штрафы и налоги не списываются при банкротстве.",
    "Бесплатная консультация юриста — первый шаг к решению проблемы."
];

function setRandomTip() {
    const tipElement = document.getElementById('dailyTip');
    const randomIndex = Math.floor(Math.random() * tips.length);
    tipElement.textContent = tips[randomIndex];
}
setRandomTip();

// --- Валидация формы (без fetch, только проверка перед отправкой) ---
const form = document.getElementById('requestForm');
const nameInput = document.getElementById('name');
const cityInput = document.getElementById('city');
const phoneInput = document.getElementById('phone');
const descriptionInput = document.getElementById('description');
const policyCheck = document.getElementById('policy');

function validatePhone(phone) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length === 10) return true;
    if (digits.length === 11 && (digits[0] === '7' || digits[0] === '8')) return true;
    return false;
}

function validateName(name) {
    return name.trim().length >= 3;
}

function validateCity(city) {
    if (city.trim() === '') return true;
    return city.trim().length >= 2;
}

function setError(input, errorElement, message) {
    errorElement.textContent = message;
    input.classList.add('input-error');
}

function clearError(input, errorElement) {
    errorElement.textContent = '';
    input.classList.remove('input-error');
}

function validateNameField() {
    const errorEl = document.getElementById('nameError');
    if (!validateName(nameInput.value)) {
        setError(nameInput, errorEl, 'Введите полное имя (не менее 3 символов)');
        return false;
    } else {
        clearError(nameInput, errorEl);
        return true;
    }
}

function validatePhoneField() {
    const errorEl = document.getElementById('phoneError');
    if (!validatePhone(phoneInput.value)) {
        setError(phoneInput, errorEl, 'Введите корректный российский номер (например, +79991234567)');
        return false;
    } else {
        clearError(phoneInput, errorEl);
        return true;
    }
}

function validateCityField() {
    const errorEl = document.getElementById('cityError');
    if (!validateCity(cityInput.value)) {
        setError(cityInput, errorEl, 'Город должен содержать не менее 2 символов');
        return false;
    } else {
        clearError(cityInput, errorEl);
        return true;
    }
}

function clearDescriptionError() {
    const errorEl = document.getElementById('descriptionError');
    errorEl.textContent = '';
    descriptionInput.classList.remove('input-error');
}

nameInput.addEventListener('blur', validateNameField);
nameInput.addEventListener('input', validateNameField);
phoneInput.addEventListener('blur', validatePhoneField);
phoneInput.addEventListener('input', validatePhoneField);
cityInput.addEventListener('blur', validateCityField);
cityInput.addEventListener('input', validateCityField);
descriptionInput.addEventListener('input', clearDescriptionError);

form.addEventListener('submit', function(e) {
    // Проверяем поля
    const isNameValid = validateNameField();
    const isPhoneValid = validatePhoneField();
    const isCityValid = validateCityField();
    clearDescriptionError();

    if (!policyCheck.checked) {
        e.preventDefault();
        showToast.warning('Необходимо согласие на обработку персональных данных', {
            position: 'top-center',
            duration: 4000
        });
        return;
    }

    if (!(isNameValid && isPhoneValid && isCityValid)) {
        e.preventDefault();
        showToast.warning('Пожалуйста, исправьте ошибки в форме', {
            position: 'top-center',
            duration: 4000
        });
        return;
    }

    // Если всё ок, форма отправится стандартно на Formspree
    // Показываем тост, что отправка началась (опционально)
    showToast.success('Отправка...', {
        position: 'top-center',
        duration: 2000
    });
});

// --- FAQ аккордеон ---
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
        faqItems.forEach(other => {
            if (other !== item && other.classList.contains('active')) {
                other.classList.remove('active');
            }
        });
        item.classList.toggle('active');
    });
});