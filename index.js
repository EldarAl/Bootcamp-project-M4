//Блоки выбора валюты и ввода суммы
let currencyBlock = document.querySelector(".cur_container");
let currencyBlock2 = document.querySelector(".cur_container2");

//Поля для отображения курса валют
const curRate = document.querySelector(".rate");
const curRate2 = document.querySelector(".rate2");

//Выбранные валюты внизу инпута
const selCurrency = document.querySelectorAll(".sel-currency");
const selCurrency2 = document.querySelectorAll(".sel-currency2");

//Инпуты
const input = document.querySelector(".input");
const input2 = document.querySelector(".input2");
input.addEventListener('input',calculate);
input2.addEventListener('input',calculate2);


//Стартовое значение инпута
input.value = 1;

//Слушатели для выбора валюты в блоках
currencyBlock.addEventListener("click", selectCurrency);
currencyBlock2.addEventListener("click", selectCurrency2);

//Кнопка смены значений
const button = document.querySelector(".arrow");
button.addEventListener("click", replacing);

//Функция выбора валюты 1-ого блока
function selectCurrency(e) {
  let childs = currencyBlock.querySelectorAll(".currency");
  //Удаляем класс с элементов
  childs.forEach((item) => {
    item.classList.remove("purple");
  });
  e.target.classList.add("purple");
  changeCurrency();
  getRate();
  calculate();
}

//Функция выбора валюты 2-ого блока
function selectCurrency2(e) {
  let childs = currencyBlock2.querySelectorAll(".currency");
  childs.forEach((item) => {
    item.classList.remove("purple");
  });
  e.target.classList.add("purple");
  changeCurrency2();
  getRate();
  calculate();
}
let a = selCurrency[0].innerText;
let b = selCurrency2[0].innerText;

//Функция смены первой отображаемой валюты внизу инпута
function changeCurrency() {
  let container = document.querySelector(".cur_container");
  const firstCurrency = container.querySelector(".purple");
  if (firstCurrency.classList.contains("select")) {
    selCurrency.forEach((item) => {
      item.innerText = firstCurrency.value;
    });
    a = firstCurrency.value;
  } else {
    selCurrency.forEach((item) => {
      item.innerText = firstCurrency.innerText;
    });
    a = firstCurrency.innerText;
  }
}

//Функция смены второй отображаемой валюты внизу инпута
function changeCurrency2() {
  let container2 = document.querySelector(".cur_container2");
  const secondCurrency = container2.querySelector(".purple");
  if (secondCurrency.classList.contains("select")) {
    selCurrency2.forEach((item) => {
      item.innerText = secondCurrency.value;
    });
    b = secondCurrency.value;
  } else {
    selCurrency2.forEach((item) => {
      item.innerText = secondCurrency.innerText;
    });
    b = secondCurrency.innerText;
  }
}

//Запрос у сервера данных о валюте
async function getRate() {
  if (a == b) {
    curRate.innerText = 1;
    curRate2.innerText = 1;
  } else {
    //Пока идет обработка выводим popup
    popup();
    await fetch(`https://api.ratesapi.io/api/latest?base=${a}&symbols=${b}`, {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        curRate.innerText = res.rates[selCurrency2[0].innerText];
        curRate2.innerText = 1 / res.rates[selCurrency2[0].innerText];
      })
      .catch(() => {
        alert("Произошла ошибка.Повторите еще раз");
      });
    calculate();
    //Убираем popup после загрузки
    setTimeout(() => {
      popup();
    }, 500);
  }
}

// //Функция вычисляющая значение правого контрола
function calculate() {
  input.value = handleChange(input);
  input2.value = (input.value * curRate.innerText).toFixed(3);
}
// //Функция вычисляющая значение левого контрола
function calculate2() {
  input2.value = handleChange(input2);
  input.value = (input2.value * curRate2.innerText).toFixed(3);
}

//Функция позволяющая ввод только цифр и точки с запятой
function handleChange(event) {
  let inputVal = event.value;
  let inp = "";
  let first = true;
  for (let i = 0; i < inputVal.length; i++) {
    if (first && (inputVal[i] === "," || inputVal[i] === ".")) {
      inp += inputVal[i];
      first = false;
    }
    if (!isNaN(inputVal[i])) {
      inp += inputVal[i];
    }
  }
  event.value = inp.replace(",", ".");
  return event.value;
}

//Функция меняющая местами валюты и значения инпутов
function replacing() {
  //Меняем местами зачения курсов валют
  let temp = curRate.innerText;
  curRate.innerText = curRate2.innerText;
  curRate2.innerText = temp;
  //Меняем местами зачения инпутов
  let temp2 = input.value;
  input.value = input2.value;
  input2.value = temp2;
  //Меняем местами валютные блоки
  let span = currencyBlock.querySelectorAll("span");
  let span2 = currencyBlock2.querySelectorAll("span");
  let select = currencyBlock.querySelector("select");
  let select2 = currencyBlock2.querySelector("select");
  span.forEach((item) => {
    currencyBlock2.appendChild(item);
  });
  currencyBlock2.appendChild(select);
  span2.forEach((item) => {
    currencyBlock.appendChild(item);
  });
  currencyBlock.appendChild(select2);

  calculate();
  changeCurrency();
  changeCurrency2();
  // getRate();
}

// Функция запускающая Pop-up при загрузке
function popup() {
  const pop = document.querySelector(".popup");
  pop.classList.toggle("toggle");
}

//Запускаем запрос у сервера о валютах выбранных по дэфолту
getRate();
