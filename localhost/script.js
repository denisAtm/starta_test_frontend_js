// Обработчик событий для маскирования телефонного номера
function mask(event) {
    if (event && event.type === "input" && event.inputType === "insertFromPaste") {
        setTimeout(() => processInput.call(this), 0);
    } else {
        processInput.call(this);
    }
}

// Обработка введенных данных
function processInput() {
    const pos = this.selectionStart;
    if (pos < 3 && event.key !== 'Backspace') {
        event.preventDefault();
    }

    const matrix = "+7 (___) ___ ____";
    const def = matrix.replace(/\D/g, "");
    const val = this.value.replace(/\D/g, "");

    let i = 0;
    let new_value = matrix.replace(/[_\d]/g, a => {
        return i < val.length ? val.charAt(i++) || def.charAt(i) : a;
    });

    i = new_value.indexOf("_");
    if (i !== -1) {
        i < 5 && (i = 3);
        new_value = new_value.slice(0, i);
    }

    const reg = matrix
        .substr(0, this.value.length)
        .replace(/_+/g, a => `\\d{1,${a.length}}`)
        .replace(/[+()]/g, "\\$&");
    const regExp = new RegExp(`^${reg}$`);

    if (!regExp.test(this.value) || this.value.length < 5 || (event.keyCode > 47 && event.keyCode < 58)) {
        this.value = new_value;
    }

    const invalidFeedbackDiv = this.nextElementSibling;
    if (event && event.type === "blur" && this.value.replace(/\D/g, "").length < 11) {
        invalidFeedbackDiv?.classList.add("d-block");
    } else {
        invalidFeedbackDiv?.classList.remove("d-block");
    }

    if (this.value.startsWith("8")) {
        this.value = this.value.replace("8", "+7");
    }
}

// Обработчик события вставки
function handlePaste(event) {
    event.preventDefault();
    const pastedText = (event.clipboardData || window.clipboardData).getData('text');
    const formattedText = pastedText.replace(/\D/g, '').replace(/^[87]/, '');
    document.execCommand("insertText", false, formattedText);
    processInput.call(this);
}

// Получаем все элементы input с типом "tel" и добавляем к ним обработчик
document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false);
    input.addEventListener("paste", handlePaste, false);
});
