'use strict';

(function () {

  var COUNTS = {
    COUNT: 1,
    COMMENTSCOUNT: 1,
    MAXCOMMENTS: 3,
    MINRATING: -10
  };

  var comments = document.querySelector('#comments');

  if (comments) {
    var firstCommentsList = comments.querySelector('.comments__list');
  }

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

  var getСollapseComment = function (button, wrapper) {
    wrapper.classList.toggle('comment__wrapper--active');
    button.classList.remove('visually-hidden');

    if (button.textContent === 'Свернуть комментарий') {
      button.textContent = 'Развернуть комментарий';
      button.setAttribute('style', 'border: 1px solid black;');
    } else {
      button.textContent = 'Свернуть комментарий';
      button.setAttribute('style', 'border: none;');
    }
  };

  var onCommentTogleDown = function (evt) {
    var clickPoint = evt.target;

    if (clickPoint.classList.contains('comment__toggle')) {
      // return;
      var commentWrapper = clickPoint.nextElementSibling;
      evt.preventDefault();
      getСollapseComment(clickPoint, commentWrapper);
    }

    if (clickPoint.classList.contains('raiting__button')) {
      var commentRatingWrapper = clickPoint.closest('.comment__wrapper');
      var toggleButton = commentRatingWrapper.previousElementSibling;

      var commentRating = clickPoint.parentElement;
      var rating = commentRating.querySelector('input[type = "text"]');

      var buttonUp = clickPoint.classList.contains('raiting__button--up');

      var ratingValue = buttonUp ? (rating.value++) + 1 : (rating.value--) - 1;


      rating.value = ratingValue;
      if (ratingValue <= COUNTS.MINRATING) {
        getСollapseComment(toggleButton, commentRatingWrapper);
      }
    }
  };

  if (comments) {
    comments.addEventListener('click', onCommentTogleDown);
  }

  // активирует кнопку свернуть\развернуть комментарий вложенных элементов
  var activeToggleInner = function (parentList) {
    var commentItems = parentList.querySelectorAll('.comments__list-item');
    for (var i = 0; i < commentItems.length; i++) {
      var toggleButton = commentItems[i].querySelector('.comment__toggle');

      if (parentList.classList.contains('comments__list-inner')) {
        toggleButton.classList.remove('visually-hidden');
      }
    }
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
      activeToggleInner(commentLocation);
      getClearForm(nameField, mailField, textField);
      clearDomElements(comments, 'form');
      getNewForm(comments, firstCommentsList);
    };

    if (form) {
      form.addEventListener('submit', onSubmitFormDown);
    }
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

    if (COUNTS.COMMENTSCOUNT >= COUNTS.MAXCOMMENTS) {
      COUNTS.COMMENTSCOUNT = 1;
    }
    if (parrentList.classList.contains('inner-' + COUNTS.COMMENTSCOUNT)) {
      COUNTS.COMMENTSCOUNT++;
      parrentClassArray.push('inner-' + COUNTS.COMMENTSCOUNT);
    }

    innerList.classList.add(parrentClassArray[parrentClassArray.length - 1]);
  };


  var getDatePoint = function () {
    var date = new Date().getTime() / 60000;
    return date;
  };


  // создает комментарий по шаблону
  var getComment = function (userName, userText) {
    var element = commentTemplate.cloneNode(true);
    element.querySelector('.comment__user-name').textContent = userName;
    element.querySelector('.comment__description p').textContent = userText;
    fragment.appendChild(element);


    var commentDate = element.querySelector('.comment__date');

    var pointTime = getDatePoint();
    setInterval(function () {
      var newTime = Math.floor(getDatePoint() - pointTime);

      if (newTime < 60) {
        commentDate.textContent = '' + newTime + ' минут назад';
      } else if (newTime >= 60 || newTime < 120) {
        commentDate.textContent = 'Час назад';
      } else if (newTime >= 120 || newTime < 1440) {
        commentDate.textContent = '' + Math.floor(newTime / 60) + ' часов назад';
      } else if (newTime >= 1440) {
        commentDate.textContent = '' + Math.floor(newTime / 1440) + ' дней назад';
      }

      // switch (newTime) {
      //   case newTime < 60: commentDate.textContent = '' + newTime + 'минут назад';
      //     break;

      //   case newTime >= 60 || newTime < 120: commentDate.textContent = 'Час назад';
      //     break;

      //   case newTime >= 120 || newTime < 1440: commentDate.textContent = '' + Math.floor(newTime / 60) + 'часов назад';
      //     break;

      //   case newTime >= 1440: commentDate.textContent = '' + Math.floor(newTime / 1440) + 'дней назад';
      //     break;

      // }
      // commentDate.textContent = '' + newTime + '';
    }, 60000);

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

    });
  };

  // создает первую форму при загрузке страницы
  document.addEventListener('DOMContentLoaded', function () {
    getNewForm(comments, firstCommentsList);
  }, false);

})();
