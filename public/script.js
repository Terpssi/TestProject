'use strict';

(function () {

  var dataJson = document.getElementById('json'); //span с json данными
  var tbody = document.getElementById('tbody');
  var popup = document.getElementById('popup'); //всплывающее окно
  var h3popup = document.getElementById('popup_head'); //заголовок всплывашки
  var fullName = document.getElementById('full_name');
  var phone = document.getElementById('phone');
  var address = document.getElementById('address');
  var popupWindow = document.getElementById('popup_window');
  var addButton = document.getElementById('add_button'); //кнопка Добавить
  var delAllButton = document.getElementById('deleteAll_button'); //кнопка Очистить хранилище


  var jsonArray = JSON.parse(dataJson.dataset.json); //массив с объектами json

  if (localStorage.length === 0) { //при первой загрузке страницы в локал записываются данные из json
    jsonArray.forEach(function (item, i) {
      localStorage.setItem(item.id, JSON.stringify(item));
      localStorage.setItem('count', i + 2); //счетчик записанных в локал данных на (1 больше количества)
    })
  }
  renderPage(); //смотрит какие данные есть в локал и отрисовывает их в таблицу

  tbody.addEventListener('click', function (event) {

    var row = event.target.parentNode;

    if (event.target.tagName === "BUTTON") { //кнопка "удалить" в строке
      localStorage.removeItem(row.dataset.id);
      row.parentNode.removeChild(row);
    } else {
      //При нажатии на строку открывается окно редактирования данных
      popup.classList.remove('hidden'); //
      h3popup.textContent = "Отредактируйте данные";
      var localDataObj = JSON.parse(localStorage.getItem(row.dataset.id)); //из локал по id достается объект с данными
      fullName.dataset.id = row.dataset.id;
      fullName.value = localDataObj.full_name;
      phone.value = localDataObj.phone;
      address.value = localDataObj.address;
    }

  });

  popupWindow.addEventListener('click', function (event) {
    event.preventDefault();

    if (event.target.id === 'close_button') { //закрыть всплывающее окно
      popup.classList.add('hidden');
      popupWindow.classList.remove('error')
    }

    if (event.target.id === 'ok_button') {
      if (fullName.value.trim() === '' || phone.value.trim() === '' || address.value.trim() === '') { //если заполнены не все поля
        h3popup.textContent = "Все поля должны быть заполнены";
        popupWindow.classList.add('error');
      } else {
        popupWindow.classList.remove('error');
        var objNewData = {  //создается новый объект со всеми необходимыми данными
          "id": fullName.dataset.id,
          "full_name": fullName.value,
          "address": address.value,
          "phone": phone.value
        };
        if (localStorage.getItem(fullName.dataset.id) === null) { //если в локал нет данных с таким id..
          updateLocalStorage(objNewData); //меняем содержимое локал
          createNewRow(objNewData); //создаем новую строку в конце
          localStorage.setItem('count', Number(localStorage.getItem('count')) + 1); //счетчик в локал увеличивается
        } else {
          localStorage.removeItem(objNewData.id); //удаляем из локал этот объект
          updateLocalStorage(objNewData); //меняем содержимое локал
          var row = document.querySelector('[data-id = \"' + objNewData.id + '\"]'); //находим и меняем редактируемую строчку
          blinkAnimation(row); //обозначение редактируемой строчки
          Array.prototype.slice.call(row.children).forEach(function (item) {
            if (item.tagName === 'TD') {
              item.textContent = objNewData[item.className];
            }
          })
        }
      }
    }
  });


  addButton.addEventListener('click', function () { //при нажатии "добавить" открывается окно добавления данных. Строке присваивается новый id: значение счетчика
    popup.classList.remove('hidden');
    h3popup.textContent = "Введите новые данные";
    fullName.dataset.id = Number(localStorage.getItem('count'));
    fullName.value = '';
    phone.value = '';
    address.value = '';
  });

  delAllButton.addEventListener('click', function () { //при нажатии "Очистить хранилище", из локал и таблицы удаляются все данные
    localStorage.clear();
    Array.prototype.slice.call(tbody.children).forEach(function (item) {
      item.parentNode.removeChild(item);
    })
  })

})();

function createNewRow(objData) { //создаем новую строку с данными и добавляем ее таблицу
  var newRow = document.createElement('tr');
  newRow.setAttribute('data-id', objData.id);
  for (var j = 1; j < Object.keys(objData).length; j++) { //создаем столбцы
    var elemTd = document.createElement('td');
    elemTd.classList.add(Object.keys(objData)[j]);
    elemTd.textContent = objData[Object.keys(objData)[j]];
    newRow.appendChild(elemTd);
  }
  var rowDelButton = document.createElement('button'); //создаем кнопку удаления
  rowDelButton.classList.add('deleteButton');
  rowDelButton.title = 'Удалить';
  newRow.appendChild(rowDelButton);
  blinkAnimation(newRow); //обозначение новой строчки
  tbody.appendChild(newRow);
}

function renderPage() { //отрисовывает таблицу исходя из данных в локал
  var values = [];
  var keys = Object.keys(localStorage); //получаем массив с ключами из локал
  keys.splice(keys.indexOf('count'), 1); //удаляем оттуда счетчик
  var index = keys.length;
  keys.sort(function (a, b) {
    return (a - b);
  });
  while (index--) {
    values.unshift(localStorage.getItem(keys[index])); //массив с объектами из локал
  }
  values.forEach(function (item) {
    createNewRow(JSON.parse(item)); //отрисовываем таблицу.
  });
}

function updateLocalStorage(obj) { //загружает в локал новый объект и закрывает окно
  localStorage.setItem(obj.id, JSON.stringify(obj));
  popup.classList.add('hidden');
}

function blinkAnimation(row) { //мигает зеленым
  row.classList.add('newBlinkRow');
  setTimeout(function () {
    row.classList.remove('newBlinkRow')
  },2000)
}