/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const xhr = new XMLHttpRequest();
  let formData = new FormData();
  xhr.responseType = "json";

  if (options.method === "GET") {
    options.url += `?`;
    for (let option of options.data) {
      options.url += `${option}=${options.data[option]}&`;
    }
  } else {
    for (let option of options.data) {
      formData.append(option, options.data[option]);
    }
  }

  xhr.open(options.method, options.url);
  xhr.send(formData);

  xhr.addEventListener("readystatechange", function () {
    if (xhr.readyState === xhr.DONE && xhr.status === 200) {
      options.callback(null, xhr.response);
    } else if (xhr.readyState == xhr.DONE && xhr.status != 200) {
      options.callback(xhr.response, null);
    }
  });
};
