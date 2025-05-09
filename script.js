const wordsAndImages = [
    // آرایه‌ای از کلمات و تصاویر مربوطه برای بازی
    {word: "سیرابی", image: "pic/01.png"},
    {word: "لیوان", image: "pic/02.png"},
    {word: "گل آبی", image: "pic/03.png"},
    {word: "رنگین کمان", image: "pic/04.png"},
    {word: "راهپیمایی", image: "pic/05.png"},
    {word: "روزنامه", image: "pic/06.png"},
    {word: "هواکش", image: "pic/07.png"},
    {word: "قفسه", image: "pic/08.png"},
    {word: "تابلو", image: "pic/09.png"},
    {word: "ابرقهرمان", image: "pic/10.png"},
    {word: "سلول", image: "pic/11.png"},
    {word: "باب اسفنجی", image: "pic/12.png"},
    {word: "جاذبه", image: "pic/13.png"},
    {word: "سرمایه", image: "pic/14.png"},
    {word: "ایستگاه", image: "pic/15.png"},
    {word: "زردآلو", image: "pic/16.png"},
    {word: "تعادل", image: "pic/17.png"},
    {word: "کمربند", image: "pic/18.png"},
    {word: "خرکیف", image: "pic/19.png"},
    {word: "شیرمال", image: "pic/20.png"},
    {word: "تخته سیاه", image: "pic/21.png"},
    // ... می‌توان کلمات و تصاویر بیشتری اضافه کرد
];

let currentLevel = 0; // سطح کنونی بازی
let selectedWord, correctGuesses, wrongGuesses, remainingAttempts; // کلمه انتخاب‌شده، حدس‌های درست، حدس‌های اشتباه، و تعداد تلاش‌های باقی‌مانده
let coins = 0; // تعداد سکه‌های بازیکن

const music = document.getElementById('background-music');

// تابع شروع بازی
function initializeGame() {
    music.play();
    if (currentLevel < wordsAndImages.length) {
        selectedWord = wordsAndImages[currentLevel].word; // انتخاب کلمه از آرایه بر اساس سطح
        document.getElementById("gameImage").src = wordsAndImages[currentLevel].image; // نمایش تصویر مربوط به کلمه
        correctGuesses = Array(selectedWord.length).fill("_"); // نمایش کلمه به صورت خط زیر
        for (let i = 0; i < selectedWord.length; i++) {
            if (selectedWord[i] === " ") {
                correctGuesses[i] = " "; // فاصله‌ها را نمایش می‌دهد
            }
        }
        wrongGuesses = []; // پاک‌سازی حدس‌های اشتباه
        remainingAttempts = 6; // تعیین تعداد تلاش‌های باقی‌مانده
        displayWord(); // نمایش کلمه
        document.getElementById("message").innerText = ""; // پاک‌سازی پیام‌ها
        enableButtons(); // فعال‌سازی دکمه‌ها
        updateCoinCount(); // بروزرسانی تعداد سکه‌ها
        generateLetterButtons(); // تولید دکمه‌های حروف

        document.getElementById("levelIndicator").innerText = `مرحله: ${currentLevel + 1}`; // نمایش شماره مرحله
    } else {
        // در صورتی که تمام مراحل بازی به پایان رسیده باشد
        document.getElementById("message").innerText = "❤️شما تمام مراحل را تمام کرده‌اید! تبریک می‌گویم❤️";
        document.getElementById("buttons").style.display = "none"; // پنهان‌سازی دکمه‌ها
        document.getElementById("levelIndicator").style.display = "none"; // پنهان‌سازی نشانگر مرحله
        document.getElementById("topRight").style.display = "none"; // پنهان‌سازی بالای صفحه
        document.getElementById("image").style.display = "none"; // پنهان‌سازی تصویر
        document.getElementById("word").style.display = "none"; // پنهان‌سازی کلمه
    }
}

// تابع نمایش کلمه حدس زده‌شده تا به حال
function displayWord() {
    document.getElementById("word").innerText = correctGuesses.join(" "); // نمایش کلمه با خط‌های زیر برای حروف حدس‌زده‌نشده
}

// تولید دکمه‌های حروف برای حدس زدن
function generateLetterButtons() {
    const buttonsDiv = document.getElementById("buttons");
    buttonsDiv.innerHTML = ""; // پاک‌سازی دکمه‌های قبلی
    const letters = "ابتثجچحخدذرزژسشصضطظعغفقکگلمنوهی"; // حروف فارسی
    let randomLetters = []; // آرایه‌ای برای ذخیره حروف تصادفی

    // تولید ۱۰ حرف تصادفی از حروف الفبای فارسی
    for (let i = 0; i < 10; i++) {
        let randomIndex = Math.floor(Math.random() * letters.length);
        randomLetters.push(letters[randomIndex]);
    }

    // اضافه کردن حروف کلمه انتخاب شده به حروف تصادفی
    selectedWord.split('').forEach(char => {
        if (!randomLetters.includes(char) && char !== ' ') {
            randomLetters.push(char);
        }
    });

    // ترکیب کردن و مرتب‌سازی تصادفی حروف
    randomLetters = randomLetters.sort(() => Math.random() - 0.5);

    // ساخت دکمه‌ها برای حروف و اضافه کردن آنها به صفحه
    randomLetters.forEach(letter => {
        let button = document.createElement("button");
        button.innerText = letter; // متن دکمه را به حرف مورد نظر تنظیم می‌کند
        button.classList.add("letter-btn"); // کلاس CSS برای دکمه‌ها
        button.onclick = () => makeGuess(button, letter); // تنظیم رویداد کلیک دکمه
        buttonsDiv.appendChild(button); // افزودن دکمه به صفحه
    });
}

// تابع بررسی و پردازش حدس بازیکن
function makeGuess(button, letter) {
    button.disabled = true; // غیرفعال کردن دکمه پس از کلیک
    if (selectedWord.includes(letter)) {
        // اگر حرف حدس زده شده در کلمه باشد
        for (let i = 0; i < selectedWord.length; i++) {
            if (selectedWord[i] === letter) {
                correctGuesses[i] = letter; // جایگذاری حرف در کلمه
            }
        }
    } else {
        // اگر حرف حدس زده شده اشتباه باشد
        if (!wrongGuesses.includes(letter)) {
            wrongGuesses.push(letter); // اضافه کردن به لیست حدس‌های اشتباه
            remainingAttempts--; // کاهش تعداد تلاش‌های باقی‌مانده
        }
    }
    displayWord(); // بروزرسانی نمایش کلمه
    checkGameStatus(); // بررسی وضعیت بازی
}

// تابع بررسی وضعیت بازی (برد یا باخت)
function checkGameStatus() {
    if (!correctGuesses.includes("_")) {
        // اگر تمام حروف درست حدس زده شده باشند
        document.getElementById("message").innerText = "شما برنده شدید!";
        disableButtons(); // غیرفعال‌سازی دکمه‌ها
        coins += 30; // اضافه کردن سکه به بازیکن
        updateCoinCount(); // بروزرسانی نمایش تعداد سکه‌ها
        animateWord(); // نمایش انیمیشن
    } else if (remainingAttempts <= 0) {
        // اگر تعداد تلاش‌ها به پایان برسد
        document.getElementById("message").innerText = "شما باختید! دوباره تلاش کنید";
        disableButtons(); // غیرفعال‌سازی دکمه‌ها
        document.getElementById("resetButton").style.display = "block"; // نمایش دکمه شروع مجدد
        hideGameElements(); // پنهان کردن عناصر بازی
    }
}

// تابع پنهان‌سازی عناصر بازی
function hideGameElements() {
    document.getElementById("buttons").style.display = "none"; // پنهان کردن دکمه‌ها
    document.getElementById("word").style.display = "none"; // پنهان کردن کلمه
}

// تابع نمایش دوباره عناصر بازی
function showGameElements() {
    document.getElementById("buttons").style.display = "block"; // نمایش دکمه‌ها
    document.getElementById("word").style.display = "block"; // نمایش کلمه
}

// راه‌اندازی دوباره بازی از دکمه "شروع مجدد"
document.getElementById("resetButton").onclick = () => {
    initializeGame(); // اجرای دوباره بازی
    document.getElementById("resetButton").style.display = "none"; // پنهان‌سازی دکمه شروع مجدد
    showGameElements(); // نمایش عناصر بازی
};

// تابع نمایش انیمیشن برد بازیکن
function animateWord() {
    const wordElement = document.getElementById("word");
    wordElement.classList.add("complete"); // اضافه کردن کلاس CSS برای انیمیشن
    setTimeout(() => {
        wordElement.innerText = selectedWord; // نمایش کامل کلمه
        wordElement.classList.remove("complete"); // حذف کلاس انیمیشن
        wordElement.classList.add("show-complete"); // اضافه کردن کلاس برای نمایش کامل
        setTimeout(() => {
            currentLevel++; // افزایش مرحله بازی
            wordElement.classList.remove("show-complete"); // حذف کلاس نمایش
            initializeGame(); // راه‌اندازی مرحله بعد
        }, 2000);
    }, 1000);
}

// فعال‌سازی دوباره دکمه‌ها
function enableButtons() {
    const buttons = document.querySelectorAll(".letter-btn");
    buttons.forEach(button => button.disabled = false); // فعال کردن تمام دکمه‌ها
}

// غیرفعال‌سازی تمام دکمه‌ها
function disableButtons() {
    const buttons = document.querySelectorAll(".letter-btn");
    buttons.forEach(button => button.disabled = true); // غیرفعال کردن تمام دکمه‌ها
}

// بروزرسانی تعداد سکه‌های بازیکن
function updateCoinCount() {
    document.getElementById("coinCount").innerText = `سکه‌ها: ${coins}`;
}

// استفاده از راهنمایی در بازی
function useHint(hintNumber) {
    const hintCosts = {1: 30, 2: 50, 3: 90}; // هزینه راهنمایی‌ها
    if (coins >= hintCosts[hintNumber]) {
        // بررسی اگر بازیکن سکه کافی برای راهنمایی دارد
        if (hintNumber === 1) {
            giveHint1(); // اجرای راهنمایی اول
        } else if (hintNumber === 2) {
            giveHint2(); // اجرای راهنمایی دوم
        } else if (hintNumber === 3) {
            giveHint3(); // اجرای راهنمایی سوم
        }
        coins -= hintCosts[hintNumber]; // کسر سکه‌های بازیکن
        updateCoinCount(); // بروزرسانی تعداد سکه‌ها
    } else {
        alert("برای استفاده از این راهنمایی به سکه بیشتری نیاز دارید!");
    }
}

// راهنمایی اول: نمایش یکی از حروف کلمه
function giveHint1() {
    let revealed = false;
    while (!revealed) {
        let randomIndex = Math.floor(Math.random() * selectedWord.length);
        if (correctGuesses[randomIndex] === "_") {
            correctGuesses[randomIndex] = selectedWord[randomIndex]; // نمایش یک حرف تصادفی
            revealed = true;
            disableButton(selectedWord[randomIndex]); // غیرفعال‌سازی دکمه مربوطه
        }
    }
    displayWord(); // بروزرسانی نمایش کلمه
    checkGameStatusAfterHint(); // بررسی وضعیت بازی پس از راهنمایی
}

// راهنمایی دوم: غیرفعال‌سازی سه حرف اشتباه
function giveHint2() {
    const buttons = document.querySelectorAll("#buttons .letter-btn");
    const incorrectLetters = Array.from(buttons).filter(button => 
        !selectedWord.includes(button.innerText) && !button.disabled
    );

    const buttonsToDisable = incorrectLetters.slice(0, 3);

    buttonsToDisable.forEach(button => {
        button.disabled = true; // غیرفعال کردن دکمه‌ها
    });
    checkGameStatusAfterHint(); // بررسی وضعیت بازی پس از راهنمایی
}

// راهنمایی سوم: نمایش کامل کلمه
function giveHint3() {
    correctGuesses = selectedWord.split(""); // نمایش کامل کلمه
    displayWord(); // بروزرسانی نمایش
    checkGameStatusAfterHint(); // بررسی وضعیت بازی پس از راهنمایی

    const buttons = document.querySelectorAll("#buttons .letter-btn");
    buttons.forEach(button => {
        if (selectedWord.includes(button.innerText)) {
            button.disabled = true; // غیرفعال کردن دکمه‌های مربوط به حروف
        }
    });

}

// بررسی وضعیت بازی پس از استفاده از راهنمایی
function checkGameStatusAfterHint() {
    if (!correctGuesses.includes("_")) {
        animateWord(); // نمایش انیمیشن برد
    }
}

// غیرفعال کردن دکمه‌های مربوط به حروف حدس‌زده شده
function disableButton(letter) {
    const buttons = document.querySelectorAll("#buttons .letter-btn");
    buttons.forEach(button => {
        if (button.innerText === letter) {
            button.disabled = true;
        }
    });
}

// شروع بازی از صفحه مقدمه
document.getElementById("startGameButton").onclick = function() {
    const introScreen = document.getElementById("introScreen");
    const gameScreen = document.getElementById("gameScreen");
    
    introScreen.classList.add("fade-out"); // اضافه کردن انیمیشن خروج صفحه مقدمه
    gameScreen.classList.add("fade-in"); // اضافه کردن انیمیشن ورود صفحه بازی

    introScreen.addEventListener("animationend", () => {
        introScreen.style.display = "none"; // پنهان کردن صفحه مقدمه
        gameScreen.style.display = "block"; // نمایش صفحه بازی
        initializeGame(); // شروع بازی
    }, { once: true });
};

// اجرای اولیه بازی
initializeGame();
