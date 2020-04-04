'use strict';

(function () {

  var count = 1;
  var comments = document.querySelector('#comments');
  var firstCommentsList = comments.querySelector('.comments__list');

  var commentTemplate = document.querySelector('#new-comment').content.querySelector('li');
  var commentListTemplate = document.querySelector('#new-comment-list').content.querySelector('ul');
  var formTemplate = document.querySelector('#new-form').content.querySelector('form');

  var fragment = document.createDocumentFragment();

  // вставляет элемент в определенную локацию
  var insertElements = function (locationOfInsertion) {
    locationOfInsertion.appendChild(fragment);
  };

  // создает внутренний список
  var getAnswerList = function (location) {
    var element = commentListTemplate.cloneNode(true);
    fragment.appendChild(element);
    insertElements(location);
  };

  // чистит форму
  var getClearForm = function (name, mail, text) {
    name.value = '';
    mail.value = '';
    text.value = '';
  };

  // удаляет элементы из Dom
  var clearDomElements = function (parentElement, tagElement) {
    var domElement = parentElement.querySelectorAll(tagElement);
    domElement.forEach(function (node) {
      node.parentNode.removeChild(node);
    });
  };

  var getToggleButton = function (parentList) {
    if (parentList.classList.contains('comments__list-inner')) {
      var toggleButton = parentList.querySelector('.comment__toggle');
      var commentWrapper = parentList.querySelector('.comment__toggle ~ .comment__wrapper');
      toggleButton.classList.remove('visually-hidden');

      // отлавливает событие кнопки свернуть\развернуть комментарий
      toggleButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        getСollapseComment();
      });

    }

    // раскрывает и закрывает комментарий
    var getСollapseComment = function () {
      commentWrapper.classList.toggle('comment__wrapper--active');

      if (toggleButton.textContent === 'Свернуть комментарий') {
        toggleButton.textContent = 'Развернуть комментарий';
      } else {
        toggleButton.textContent = 'Свернуть комментарий';
      }
    };
  };

  // создает новую форму
  var getNewForm = function (location, commentLocation) {
    fragment.appendChild(formTemplate.cloneNode(true));
    insertElements(location);

    var form = comments.querySelector('.form');
    var nameField = form.querySelector('input[type="text"]');
    var mailField = form.querySelector('input[type="email"]');
    var textField = form.querySelector('textarea');

    // обработчик комментариев
    var onSubmitFormDown = function (evt) {
      evt.preventDefault();

      getComment(nameField.value, textField.value);
      insertElements(commentLocation);
      getToggleButton(commentLocation);

      getClearForm(nameField, mailField, textField);
      clearDomElements(comments, 'form');
      getNewForm(comments, firstCommentsList);
    };

    form.addEventListener('submit', onSubmitFormDown);
  };

  // создает классы относительно уровня вложенности
  var getCountInner = function (elementToUse) {
    var parrentList = elementToUse.parentElement;

    var innerList = elementToUse.querySelector('.comments__list-inner');

    // родитель - элемент списка
    var parrentElement = innerList.parentElement;
    var parrentElementClass = parrentElement.className;

    // массив классов элемента списка
    var parrentClassArray = parrentElementClass.split(' ');

    if (count >= 3) {
      count = 1;
    }
    if (parrentList.classList.contains('inner-' + count)) {
      count++;
      parrentClassArray.push('inner-' + count);
    }

    innerList.classList.add(parrentClassArray[parrentClassArray.length - 1]);
  };


  // создает комментарий по шаблону
  var getComment = function (userName, userText) {
    var element = commentTemplate.cloneNode(true);
    element.querySelector('.comment__user-name').textContent = userName;
    element.querySelector('.comment__description p').textContent = userText;
    fragment.appendChild(element);

    var commentAnswerButton = element.querySelector('.comment__answer');

    // кнопка ответить
    commentAnswerButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      clearDomElements(comments, 'form');

      // проверка на наличие списка
      if (!element.querySelector('.comments__list-inner')) {
        getAnswerList(element);
      }

      getCountInner(element);
      getNewForm(element, element.querySelector('.comments__list-inner'));

      // getСollapseComment();
    });
  };

  // создает первую форму при загрузке страницы
  document.addEventListener('DOMContentLoaded', function () {
    getNewForm(comments, firstCommentsList);
  }, false);

})();
