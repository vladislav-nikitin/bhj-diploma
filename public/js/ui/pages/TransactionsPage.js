/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor(element) {
    if (element) {
      this.element = element;
      this.registerEvents();
    } else {
      throw new Error("передан пустой элемент в конструктор");
    }
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update(options) {
    if (options) {
      this.render();
    } else {
      this.render(this.lastOptions);
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener("click", (event) => {
      event.preventDefault();
      let removeAccount = event.target.closest(".remove-account");
      let transactionRemove = event.target.closest(".transaction__remove");
      if (removeAccount) {
        this.removeAccount(this.lastOptions.account_id);
      }
      if (transactionRemove) {
        this.removeTransaction(transactionRemove.dataset.id);
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets(),
   * либо обновляйте только виджет со счетами
   * для обновления приложения
   * */
  removeAccount() {
    if (confirm("Вы действительно хотите удалить счёт?")) {
      Account.remove({ id }, (err, response) => {
        if (response.success) {
          console.log(this.lastOptions);
          this.clear();
          App.updateWidgets();
          App.updateForms();
        }
      });
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (confirm("Вы действительно хотите удалить эту транзакцию?")) {
      Transaction.remove({ id }, (err, response) => {
        if (response.success) {
          console.log(err, response, id, { id });
          App.update();
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options) {
    if (options) {
      this.lastOptions = options;
      if (options.account_id && options) {
        Account.get(options.account_id, (err, response) => {
          if (response) {
            this.renderTitle(response.data.name);
            document.querySelector(".remove-account").dataset.id =
              response.data.id;
          }
        });
      }
      Transaction.list(options, (err, response) => {
        if (response) {
          if (this.element.querySelector(".transaction")) {
            this.element.querySelector(".content").innerHTML = "";
          }
          this.renderTransactions(response.data);
        }
      });
    }
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle("Название счёта");
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    this.element.querySelector(".content-title").textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date) {
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return date.toLocaleDateString("ru-RU", options);
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item) {
    return `<div class="transaction transaction_${item.type} row">
    <div class="col-md-7 transaction__details">
      <div class="transaction__icon">
          <span class="fa fa-money fa-2x"></span>
      </div>
      <div class="transaction__info">
          <h4 class="transaction__title">${item.name}</h4>
         <div class="transaction__date">${this.formatDate(
           item.created_at
         )}</div>
         
      </div>
    </div>
    <div class="col-md-3">
      <div class="transaction__summ">
      ${item.sum} <span class="currency">₽</span>
      </div>
    </div>
    <div class="col-md-2 transaction__controls">
        <button class="btn btn-danger transaction__remove" data-id='${item.id}'>
            <i class="fa fa-trash"></i>  
        </button>
    </div>
</div>`;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    let content = this.element.querySelector(".content");
    for (let item of data) {
      content.insertAdjacentHTML("beforeend", this.getTransactionHTML(item));
    }
  }
}
