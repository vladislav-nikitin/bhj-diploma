/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.element = element;
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */

  renderAccountsList() {
    if (!User.current()) {
      return;
    } else
      Account.list(User.current(), (err, response) => {
        if (response.success) {
          const accountSelect = this.element.querySelector(".accounts-select");
          accountSelect.innerHTML = "";
          response.data.forEach((item) => {
            accountSelect.insertAdjacentHTML(
              "beforeend",
              `<option value="${item.id}">${item.name}</option>`
            );
          });
        }
      });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
      if (response) {
        if (this.element.id === "new-income-form") {
          App.getForm("createIncome").element.reset();
          App.getModal("newIncome").close();
        }
        if (this.element.id === "new-expense-form") {
          App.getForm("createExpense").element.reset();
          App.getModal("newExpense").close();
        }
        App.update();
      }
    });
  }
}
