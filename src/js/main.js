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

  var fragment = document.createDocumentFragment();
  var insertElements = function (locationOfInsertion) {
    locationOfInsertion.appendChild(fragment);
  };

  // чистит форму
  var getClearForm = function () {
    nameField.value = '';
    mailField.value = '';
    textField.value = '';
  };

  var getAnswerList = function () {
    if (comments.querySelector('.comments__list-inner--one')) {
      return;
    }

    fragment.appendChild(commentListTemplate.cloneNode(true));
    insertElements(firstCommentsList);
  };

  var getComment = function (userName, userText) {
    var element = commentTemplate.cloneNode(true);
    element.querySelector('.comment__user-name').textContent = userName;
    element.querySelector('.comment__description p').textContent = userText;
    fragment.appendChild(element);

    insertElements(firstCommentsList);
  };

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    getComment(nameField.value, textField.value);
    getClearForm();
  });

})();
