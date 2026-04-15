// 1. Рақамларни форматлаш (12 831 000)
function formatNumberInput(input) {
    let value = input.value.replace(/\D/g, '');
    input.value = new Intl.NumberFormat('ru-RU').format(value).replace(/,/g, ' ');
}

// 2. Қарз суммасида Enter босилганда САНАГА ўтиш
function handleTotalDebtEnter(event) {
    if (event.key === "Enter") {
        document.getElementById('pDate').focus();
        document.getElementById('pDate').select();
    }
}

// 3. Санани тўлдириш ва СУММАГА ўтиш
function handleDateEnter(event, input) {
    if (event.key === "Enter") {
        let val = input.value.trim().replace(/\D/g, ''); 
        
        // Жорий сана маълумотларини оламиз
        let now = new Date();
        let currentMonth = (now.getMonth() + 1).toString().padStart(2, '0');
        let currentYear = now.getFullYear().toString();

        let day = "";
        let month = currentMonth; // Энди доим шу ойни олади
        let year = currentYear;  // Энди доим шу йилни олади

        if (val.length > 0) {
            if (val.length <= 2) {
                day = val.padStart(2, '0');
            } 
            else if (val.length <= 4) {
                day = val.substring(0, 2).padStart(2, '0');
                month = val.substring(2, 4).padStart(2, '0');
            } 
            else if (val.length > 4) {
                day = val.substring(0, 2).padStart(2, '0');
                month = val.substring(2, 4).padStart(2, '0');
                year = val.substring(4, 8);
            }

            if (parseInt(month) > 12) month = "12";
            if (parseInt(day) > 31) day = "31";

            input.value = `${day}.${month}.${year}`;
        }
        
        document.getElementById('pAmount').focus();
        document.getElementById('pAmount').select();
    }
}

// 4. Тўланган суммада Enter босилганда ҳисоблаш
function handleAmountEnter(event, input) {
    if (event.key === "Enter") {
        calculate();
    }
}

// 5. Асосий ҳисоблаш функцияси
function calculate() {
    const resultDiv = document.getElementById('result');
    const totalDebtInput = document.getElementById('totalDebt');
    const totalDebtRaw = totalDebtInput.value.replace(/\s/g, '');
    const amountInputRaw = document.querySelector('.p-amount').value.replace(/\s/g, '');
    const dateInput = document.querySelector('.p-date').value;

    if (!totalDebtRaw || !dateInput || !amountInputRaw) {
        alert("Маълумотларни тўлиқ киритинг!");
        return;
    }

    resultDiv.style.opacity = '0.3';

    setTimeout(() => {
        const totalDebt = parseFloat(totalDebtRaw);
        const amountInput = parseFloat(amountInputRaw);

        resultDiv.innerHTML = '';

        const shareOfDebt = (amountInput / totalDebt) * 100;
        let available20Percents = Math.floor(shareOfDebt / 20); 

        let startDate = parseDate(dateInput);
        let today = new Date(); 
        today.setHours(0, 0, 0, 0);

        // МАНА ШУ ҚАТОРНИ ТЕКШИРИНГ:
        let tempDate = new Date(startDate); 

        let lastActionWas20Percent = false; 

        while (tempDate <= today) {
            let dateStr = formatDate(tempDate);
            let statusText = "";
            let isGreen = false;

            if (tempDate.getTime() === startDate.getTime()) {
                if (available20Percents > 0) {
                    statusText = `${dateStr} - 20%`;
                    isGreen = true;
                    available20Percents--;
                    lastActionWas20Percent = true;
                } else {
                    statusText = `${dateStr} - (Етарли эмас)`;
                    isGreen = false;
                    lastActionWas20Percent = false;
                }
            } 
            else if (lastActionWas20Percent) {
                statusText = `${dateStr} - Кунора`;
                isGreen = true;
                lastActionWas20Percent = false;
            }
            else if (available20Percents > 0) {
                statusText = `${dateStr} - 20%`;
                isGreen = true;
                available20Percents--;
                lastActionWas20Percent = true;
            }
            else {
                statusText = `${dateStr}`;
                isGreen = false;
                lastActionWas20Percent = false;
            }

            const resItem = document.createElement('div');
            resItem.className = `res-item ${isGreen ? 'green' : 'red'}`;
            resItem.innerText = statusText;
            resultDiv.appendChild(resItem);

            tempDate.setDate(tempDate.getDate() + 1);
        }
        
        resultDiv.style.transition = 'opacity 0.2s';
        resultDiv.style.opacity = '1';

        totalDebtInput.focus();
        totalDebtInput.select();

    }, 150);
}

function parseDate(str) {
    const parts = str.split('.');
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

function formatDate(date) {
    return date.getDate().toString().padStart(2, '0') + '.' + 
           (date.getMonth() + 1).toString().padStart(2, '0') + '.' + 
           date.getFullYear();
}

function toggleTheme() {
    const checkbox = document.getElementById('checkbox');
    if (checkbox.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
    }
}

const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        document.getElementById('checkbox').checked = true;
    }
}