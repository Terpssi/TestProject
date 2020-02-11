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
  let h3popup = document.getElementById('popup_head');

  let jsonArray = JSON.parse(dataJson.dataset.json); //массив с объектами json

  if (localStorage.length === 0) { //при первой загрузке страницы в локал записываются данные из json
    jsonArray.forEach((item, i) => {
      localStorage.setItem(item.id, JSON.stringify(item)); //записываем объекты в локал
      localStorage.setItem('count', i + 1); //счетчик количества записанных в локал данных
    })
  }
  renderPage(); //смотрит какие данные есть в локал и отрисовывает их в таблицу

  tbody.addEventListener('click', (event) => { //при нажатии на строку в таблице
    popup.classList.remove('hidden'); //открывается всплывающее окно
    h3popup.textContent = "Отредактируйте данные";
    let row = event.target.parentNode;
    let obj = JSON.parse(localStorage.getItem(row.dataset.id)); //из локал достаются данные по Id
    fullName.value = obj.full_name; // и вставляются в строки
    fullName.dataset.id = row.dataset.id;
    phone.value = obj.phone;
    address.value = obj.address;
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
        } else {
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
    //переделка счетчика
    let keys = Object.keys(localStorage);
    keys.splice(keys.indexOf('count'), 1);
    let i = keys.length;

    fullName.dataset.id = i + 1; //при нажатии "добавить" строке присваивается новый id. значение счетчика в локал + 1
    fullName.value = '';
    phone.value = ''; //поменять работу счетчика
    address.value = '';
  })

})();

function createNewRow(obj) { //создаем новую строку с данными и добавляем ее таблицу
  let elemTr = document.createElement('tr');
  elemTr.setAttribute('data-id', obj.id);
  console.log(obj);
  createNewTd("full_name", obj.full_name, elemTr);
  createNewTd("phone", obj.phone, elemTr);
  createNewTd("address", obj.address, elemTr);
  tbody.append(elemTr);
}

function createNewTd(classAdd, text, tr) { //для создания ячеек в строке.
  let elemTd = document.createElement('td');
  elemTd.classList.add(classAdd);
  elemTd.textContent = text;
  tr.append(elemTd);
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
    createNewRow(JSON.parse(item));
  });
}

function updateLocalStorage(obj) {
  localStorage.removeItem(obj.id); //удаляем из локал этот объект
  localStorage.setItem(obj.id, JSON.stringify(obj)); //этот объект загружается в локал
  localStorage.setItem('count', obj.id); //счетчик в локал менется на новое значение
  popup.classList.add('hidden');
}