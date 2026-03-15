// Инициализация AOS
AOS.init({
    duration: 800,
    once: true, // анимация только один раз
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

debtSlider.addEventListener('input', function () {
    debtValue.textContent = formatNumber(this.value);
    updateResult();
});
incomeSlider.addEventListener('input', function () {
    incomeValue.textContent = formatNumber(this.value);
    updateResult();
});
propertySlider.addEventListener('input', function () {
    propertyValue.textContent = formatNumber(this.value);
    updateResult();
});
creditorsInput.addEventListener('input', updateResult);
overdueCheck.addEventListener('change', updateResult);
alimonyCheck.addEventListener('change', updateResult);

updateResult();

document.getElementById('consultBtn').addEventListener('click', function () {
    document.getElementById('requestSection').scrollIntoView({ behavior: 'smooth' });
});

// --- Совет дня (массив полезных советов) ---
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

// --- Валидация формы и отправка через AJAX (PHP) ---
const form = document.getElementById('requestForm');
const nameInput = document.getElementById('name');
const cityInput = document.getElementById('city');
const phoneInput = document.getElementById('phone');
const descriptionInput = document.getElementById('description');
const policyCheck = document.getElementById('policy');
const formMessage = document.getElementById('formMessage');

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

form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Проверяем поля
    const isNameValid = validateNameField();
    const isPhoneValid = validatePhoneField();
    const isCityValid = validateCityField();
    clearDescriptionError();

    // Проверка чекбокса политики
    if (!policyCheck.checked) {
        alert('Необходимо согласие на обработку персональных данных');
        return;
    }

    if (isNameValid && isPhoneValid && isCityValid) {
        // Собираем данные формы
        const formData = new FormData(form);

        // Отправляем на send.php через fetch
        fetch('send.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Показываем сообщение об успехе
                    formMessage.style.display = 'block';
                    formMessage.textContent = 'Ваше обращение отправлено, ты уже сделал половину пути, у тебя все получится, ожидайте и с вами обязательно свяжется Юр лицо.';

                    // Очищаем поля
                    nameInput.value = '';
                    cityInput.value = '';
                    phoneInput.value = '';
                    descriptionInput.value = '';
                    policyCheck.checked = false;

                    // Убираем ошибки
                    [nameInput, cityInput, phoneInput, descriptionInput].forEach(input => {
                        input.classList.remove('input-error');
                    });
                    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');

                    // Скрываем сообщение через 5 секунд
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 5000);
                } else {
                    alert('Ошибка при отправке. Попробуйте позже или свяжитесь по телефону.');
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                alert('Ошибка соединения. Попробуйте позже.');
            });
    } else {
        alert('Пожалуйста, исправьте ошибки в форме');
    }
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

//  маска для телефона //
phoneInput.addEventListener('input', function (e) {
    let value = this.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    let formatted = '';
    if (value.length > 0) {
        if (value[0] === '7' || value[0] === '8') {
            formatted = '+' + value[0];
            if (value.length > 1) formatted += ' (' + value.slice(1, 4);
            if (value.length > 4) formatted += ') ' + value.slice(4, 7);
            if (value.length > 7) formatted += '-' + value.slice(7, 9);
            if (value.length > 9) formatted += '-' + value.slice(9, 11);
        } else {
            formatted = value;
        }
    }
    this.value = formatted;
});