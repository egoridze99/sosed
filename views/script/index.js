function drawTransactions(transactions) {
  transactions = transactions.reverse();
  const forRender = [];
  const transactionsBlock = document.querySelector('.wrapper');
  transactionsBlock.innerHTML = '';

  transactions.forEach(item => {
    const row = document.createElement('div');
    row.className = 'row border-bottom';

    const colName = document.createElement('div');
    colName.className = 'col-md-2';
    const pName = document.createElement('p');
    pName.className = 'mt-3 black';
    pName.textContent = item.saler.name + ' ' + item.saler.surname;
    colName.appendChild(pName);
    row.appendChild(colName);

    const colDate = document.createElement('div');
    colDate.className = 'col-md-2';
    const pDate = document.createElement('p');
    pDate.className = 'mt-3 black';
    pDate.textContent = item.dateString;
    colDate.appendChild(pDate);
    row.appendChild(colDate);

    const colLitres = document.createElement('div');
    colLitres.className = 'col-md-2';
    const pLitres = document.createElement('p');
    pLitres.className = 'mt-3 black';
    pLitres.textContent = item.litres;
    colLitres.appendChild(pLitres);
    row.appendChild(colLitres);

    const colSum = document.createElement('div');
    colSum.className = 'col-md-2';
    const pSum = document.createElement('p');
    pSum.className = 'mt-3 black';
    pSum.textContent = item.totalSum;
    colSum.appendChild(pSum);
    row.appendChild(colSum);

    const colFree = document.createElement('div');
    colFree.className = 'col-md-2';
    const pFree = document.createElement('p');
    pFree.className = 'mt-3 black';
    pFree.textContent = item.getFree === true ? 'Да' : 'Нет';
    colFree.appendChild(pFree);
    row.appendChild(colFree);

    forRender.push(row);
  });

  forRender.forEach(item => {
    transactionsBlock.appendChild(item);
  })
}

document.querySelector("#myForm").addEventListener("submit", function(event) { // НАЙТИ ЮЗЕРА
  event.preventDefault(); // Отмена действия формы

  const inputValue = document.querySelector("#getNumber").value; // Получаем значения введенного номера
  const body = JSON.stringify({ // Упаковка в JSON
    number: inputValue
  });

  const url = "/dashboard/getUser"; // Параметры запроса
  const options = {
    method: "POST",
    body,
    headers: {
      "content-type": "application/json"
    }
  };

  fetch(url, options)
    .then(res => res.json())
    .then(userInfo => {
      if (userInfo.error === 404) {
        $('#notFoundModal').modal('toggle') // Открыть модалку
      } else {
        const {user, transactions} = userInfo; // Деструктуризация объекта
        
        document.querySelector("#userSpan").textContent = user.buyer.name + " " + user.buyer.surname; // Имя
        document.querySelector("#userTelefone").textContent = user.telefoneNumber; // Номер
        document.querySelector("#userTotal").textContent = user.total; // Общая сумма покупок
        document.querySelector('#toFree').textContent = user.free; // Сколько до бесплатного

        const litresBlock = document.querySelector('#telefone-number'); // Открыть блок
        litresBlock.dataset.telefoneNumber = user.telefoneNumber;
        litresBlock.dataset.userId = user._id;
        litresBlock.style.display = 'block';

        drawTransactions(transactions);
      }
    })
    .catch(err => console.error(err));
});

document.querySelector("#newBuyer").addEventListener("submit", function(event) { //
  event.preventDefault();

  const url = "/dashboard/newUser";
  const name = document.querySelector("#name").value;
  const surname = document.querySelector("#surname").value;
  const telefone = document.querySelector("#number").value;

  const body = JSON.stringify({
    name,
    surname,
    telefone
  });

  const options = {
    method: "POST",
    body,
    headers: {
      "content-type": "application/json"
    }
  };

  fetch(url, options)
    .then(res => res.json())
    .then(obj => {
      if (obj.error === 200) {
        $("#errorModal").modal("toggle");
      } else {
        const { name, surname, telefone, total, _id, transactions, free } = obj;

        document.querySelector("#userSpan").textContent = name + " " + surname;
        document.querySelector("#userTelefone").textContent = telefone;
        document.querySelector("#userTotal").textContent = total;
        document.querySelector('#toFree').textContent = free; // Сколько до бесплатного

        const litresBlock = document.querySelector('#telefone-number');
        litresBlock.dataset.telefoneNumber = telefone;
        litresBlock.dataset.userId = _id;
        litresBlock.style.display = 'block';

        drawTransactions(transactions);
      }
    })
    .catch(err => console.error(err));

  $("#exampleModal").modal("hide");
});

document.querySelector('#addTransaction')
  .addEventListener('submit', function(event) {
    event.preventDefault();
    const litresBlock = document.querySelector('#telefone-number');
    const userId = litresBlock.dataset.userId;
    const userTotal = document.querySelector('#userTotal');
    const userToFree = document.querySelector('#toFree');

    moment.locale('ru');

    const litres = document.querySelector('#litres').value;
    const totalSum = document.querySelector('#amount-sum').value;

    const body = JSON.stringify({
      userId,
      transaction : {
        litres,
        totalSum,
        date : moment().format('LL')
      }
    });

    const url = '/dashboard/addTransaction';
    const options = {
      method : 'POST',
      body,
      headers : {
        'CONTENT-TYPE' : 'application/json'
      }
    };

    fetch(url, options)
      .then(res => res.json())
      .then(userInfo => {
        const {user, transactions} = userInfo;
        userTotal.textContent = user.total; // Показать сколько денег всего израсходовал
        userToFree.textContent = user.free;

        if (transactions[transactions.length-1].getFree === true) {
          $('#getFreeModal').modal('toggle'); 
        }

        drawTransactions(transactions);
      })
      .catch(err => console.error(err))
  });