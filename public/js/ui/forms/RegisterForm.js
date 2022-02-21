/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.register(data, (err, response) => {
      if (response) {
        App.getForm("register").element.reset();
        App.setState("user-logged");
      } else if (err) {
        console.log(err);
      }
      App.getModal("register").close();
    });
  }
}
