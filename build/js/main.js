'use strict';

(function () {

  var comments = document.querySelector('#comments');
  var firstCommentsList = comments.querySelector('.comments__list');

  var form = comments.querySelector('.form');
  var nameField = form.querySelector('input[type="text"]');
  var mailField = form.querySelector('input[type="email"]');
  var textField = form.querySelector('textarea');

  var commentTemplate = document.querySelector('#new-comment').content.querySelector('li');
  var commentListTemplate = document.querySelector('#new-comment-list').content.querySelector('ul');
  var formTemplate = document.querySelector('#new-form').content.querySelector('form');

  var fragment = document.createDocumentFragment();
  var insertElements = function (locationOfInsertion) {
    locationOfInsertion.appendChild(fragment);
  };

  // создает внутренний список
  var getAnswerList = function (location) {
    fragment.appendChild(commentListTemplate.cloneNode(true));
    insertElements(location);
  };

  // чистит форму
  var getClearForm = function () {
    nameField.value = '';
    mailField.value = '';
    textField.value = '';
  };

  var getNewForm = function (location) {
    fragment.appendChild(formTemplate.cloneNode(true));
    insertElements(location);
  };

  // создает комментарий по шаблону
  var getComment = function (userName, userText) {
    var element = commentTemplate.cloneNode(true);
    element.querySelector('.comment__user-name').textContent = userName;
    element.querySelector('.comment__description p').textContent = userText;
    fragment.appendChild(element);

    // кнопка ответить
    var commentAnswerButton = element.querySelector('.comment__answer');
    commentAnswerButton.addEventListener('click', function (evt) {
      evt.preventDefault();
      form.removeEventListener('submit', onSubmitFormDown);

      // обработчик внутренних комментариев
      var onSubmitFormDown2 = function (event) {
        event.preventDefault();

        getComment(nameField.value, textField.value);
        insertElements(element.querySelector('.comments__list-inner'));
        getClearForm();
        form.removeEventListener('submit', onSubmitFormDown2);
        form.addEventListener('submit', onSubmitFormDown);
      };

      // проверка на наличие списка
      if (!element.querySelector('.comments__list-inner')) {
        getAnswerList(element);
        form.addEventListener('submit', onSubmitFormDown2);
      } else {
        form.addEventListener('submit', onSubmitFormDown2);
      }
    });
  };

  // обработчик комментариев первого уровня
  var onSubmitFormDown = function (evt) {
    evt.preventDefault();

    getComment(nameField.value, textField.value);
    insertElements(firstCommentsList);
    getClearForm();
  };

  form.addEventListener('submit', onSubmitFormDown);

  document.addEventListener('DOMContentLoaded', function () {
    getNewForm(comments);
  }, false);

})();
