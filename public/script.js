'use strict';

(function () {

  let dataJson = document.getElementById('json'); //span с json данными
  let tbody = document.getElementById('tbody');
  let popup = document.getElementById('popup');
  let fullName = document.getElementById('full_name');
  let phone = document.getElementById('phone');
  let address = document.getElementById('address');
  let form = document.getElementById('form');
  let addButton = document.getElementById('add_button');
  let delAllButton = document.getElementById('deleteAll_button');
  let h3popup = document.getElementById('popup_head');

  let jsonArray = JSON.parse(dataJson.dataset.json); //массив с объектами json

  if (localStorage.length === 0) { //при первой загрузке страницы в локал записываются данные из json
    jsonArray.forEach((item, i) => {
      localStorage.setItem(item.id, JSON.stringify(item)); //записываем объекты в локал
      localStorage.setItem('count', i + 1); //счетчик количества записанных в локал данных ???
    })
  }
  renderPage(); //смотрит какие данные есть в локал и отрисовывает их в таблицу

  tbody.addEventListener('click', (event) => { //при нажатии на строку в таблице
    let row = event.target.parentNode;
    console.log(row.dataset.id);
    if (event.target.tagName === "BUTTON") {
      localStorage.removeItem(row.dataset.id);
      console.log(row);
      row.parentNode.removeChild(row);

    } else {
      popup.classList.remove('hidden'); //открывается всплывающее окно
      h3popup.textContent = "Отредактируйте данные";

      let obj = JSON.parse(localStorage.getItem(row.dataset.id)); //из локал достаются данные по Id
      fullName.value = obj.full_name; // и вставляются в строки
      fullName.dataset.id = row.dataset.id;
      phone.value = obj.phone;
      address.value = obj.address;
    }

  });

  form.addEventListener('click', (event) => { //делегирование
    event.preventDefault(); //включенно временно или нет

    if (event.target.id === 'close_button') { //если нажата кнопка закрыть
      popup.classList.add('hidden'); //закрыть всплывающее окно
    }
    if (event.target.id === 'ok_button') { //при нажатии на кнопку ок
      if (fullName.value.trim() === '' || phone.value.trim() === '' || address.value.trim() === '') { //если заполнены не все поля
        event.preventDefault();
        h3popup.textContent = "Все поля должны быть заполнены";
      } else {
        let newObj = {  //создается новый объект со всеми необходимыми данными
          "id": fullName.dataset.id,
          "full_name": fullName.value,
          "phone": phone.value,
          "address": address.value
        };
        if (localStorage.getItem(fullName.dataset.id) === null) { //проверяем есть ли в локал больница с таким id
          console.log('новый');
          updateLocalStorage(newObj); //меняем содержимое локал
          createNewRow(newObj); //создаем новую строку в конце
          localStorage.setItem('count', Number(localStorage.getItem('count')) + 1); //счетчик в локал менется на новое значение
        } else {

          localStorage.removeItem(newObj.id); //удаляем из локал этот объект
          updateLocalStorage(newObj); //меняем содержимое локал
          let row = document.querySelector('[data-id = \"' + newObj.id + '\"]'); //находим редактируемую строчку
          Array.from(row.children).forEach((item) => {
            item.textContent = newObj[item.className]
          })
        }
      }
    }
  });


  addButton.addEventListener('click', () => { //кнопка добавить
    popup.classList.remove('hidden');
    h3popup.textContent = "Введите новые данные";
    fullName.dataset.id = Number(localStorage.getItem('count')) + 1; //при нажатии "добавить" строке присваивается новый id. значение счетчика в локал + 1
    fullName.value = '';
    phone.value = ''; //поменять работу счетчика
    address.value = '';
  });

  delAllButton.addEventListener('click', () => {
    localStorage.clear();
    renderPage();
  })

})();

function createNewRow(obj) { //создаем новую строку с данными и добавляем ее таблицу
  let elemTr = document.createElement('tr');
  elemTr.setAttribute('data-id', obj.id);
  createNewTd("full_name", obj.full_name, elemTr);
  createNewTd("phone", obj.phone, elemTr);
  createNewTd("address", obj.address, elemTr);
  createDelButton(elemTr);
  tbody.append(elemTr);
}

function createNewTd(classAdd, text, tr) { //для создания ячеек в строке.
  let elemTd = document.createElement('td');
  elemTd.classList.add(classAdd);
  elemTd.textContent = text;
  tr.append(elemTd);
}

function createDelButton(tr) {
  let elem = document.createElement('button');
  elem.classList.add('deleteBut');
  tr.append(elem);
}

function renderPage() {
  let values = [];
  let keys = Object.keys(localStorage); //получаем массив с ключами из локал
  keys.splice(keys.indexOf('count'), 1); //удаляем оттуда счетчик
  let i = keys.length;
  keys.sort((a, b) => (a - b));
  while (i--) {
    values.unshift(localStorage.getItem(keys[i])); //массив с объектами из локал
  }
  values.forEach((item) => {
    createNewRow(JSON.parse(item)); //отрисовываем таблицу.
  });
}

function updateLocalStorage(obj) {
  localStorage.setItem(obj.id, JSON.stringify(obj)); //этот объект загружается в локал

  popup.classList.add('hidden');
}