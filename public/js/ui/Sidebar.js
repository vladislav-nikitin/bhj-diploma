/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initAuthLinks();
    this.initToggleButton();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const body = document.querySelector("body");
    document
      .querySelector(".sidebar-toggle")
      .addEventListener("click", function (event) {
        event.preventDefault();
        body.classList.toggle("sidebar-open");
        body.classList.toggle("sidebar-collapse");
      });
  }

  /**
   * При нажатии на кнопку входа, показывает окно входа
   * (через найденное в App.getModal)
   * При нажатии на кнопку регастрации показывает окно регистрации
   * При нажатии на кнопку выхода вызывает User.logout и по успешному
   * выходу устанавливает App.setState( 'init' )
   * */
  static initAuthLinks() {
    const login = document.querySelector(".menu-item_login");
    const register = document.querySelector(".menu-item_register");
    const logout = document.querySelector(".menu-item_logout");

    const modalRegister = App.getModal("register");
    const modalLogin = App.getModal("login");

    register.addEventListener("click", function (event) {
      event.preventDefault();
      modalRegister.open();
    });

    login.addEventListener("click", function (event) {
      event.preventDefault();
      modalLogin.open();
    });

    logout.addEventListener("click", function (event) {
      event.preventDefault();
      User.logout((err, response) => {
        if ((response.success = true)) {
          App.setState("init");
        }
      });
    });
  }
}
