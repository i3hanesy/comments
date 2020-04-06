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


  var fragment = document.createDocumentFragment();

  // вставляет элемент в определенную локацию
  var insertElements = function (locationOfInsertion) {
    if (locationOfInsertion) {
      locationOfInsertion.appendChild(fragment);
    }
  };

  // создает внутренний список
  var getAnswerList = function (location) {
    var commentListTemplate = document.querySelector('#new-comment-list').content.querySelector('ul');
    if (commentListTemplate) {
      var element = commentListTemplate.cloneNode(true);
    }

    if (element) {
      fragment.appendChild(element);
    }

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

    if (button.textContent === 'Закрыть комментарий') {
      button.textContent = 'Открыть комментарий';
      button.setAttribute('style', 'border: 1px solid black;');
    } else {
      button.textContent = 'Закрыть комментарий';
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
    if (parentList) {
      var commentItems = parentList.querySelectorAll('.comments__list-item');
      for (var i = 0; i < commentItems.length; i++) {
        var toggleButton = commentItems[i].querySelector('.comment__toggle');

        if (parentList.classList.contains('comments__list-inner')) {
          toggleButton.classList.remove('visually-hidden');
        }
      }
    }
  };

  // создает форму
  var getNewForm = function (insertList) {

    if (comments) {
      var form = comments.querySelector('.form');
    }

    if (form) {
      var nameField = form.querySelector('input[type="text"]');
      var mailField = form.querySelector('input[type="email"]');
      var textField = form.querySelector('textarea');
    }

    var onSubmitFormDown = function (evt) {
      evt.preventDefault();

      getComment(nameField.value, textField.value);
      insertElements(insertList);
      activeToggleInner(insertList);
      getClearForm(nameField, mailField, textField);
      // clearDomElements(comments, 'form');
      insertForm(comments, firstCommentsList);
    };

    if (form) {
      form.addEventListener('submit', onSubmitFormDown);
    }
  };

  // вставляет форму под комментарий
  var insertForm = function (location, commentLocation) {
    var formTemplate = comments.querySelector('.comments__form');
    clearDomElements(comments, 'form');
    fragment.appendChild(formTemplate.cloneNode(true));
    insertElements(location);

    getNewForm(commentLocation);
  };

  // создает классы относительно уровня вложенности
  var getCountInner = function (elementToUse) {
    var parrentList = elementToUse.parentElement;

    var innerList = elementToUse.querySelector('.comments__list-inner');

    // родитель - элемент списка
    if (innerList) {
      var parrentElement = innerList.parentElement;
    }

    if (parrentElement) {
      var parrentElementClass = parrentElement.className;
    }

    // массив классов элемента списка

    if (parrentElementClass) {
      var parrentClassArray = parrentElementClass.split(' ');
    }

    if (COUNTS.COMMENTSCOUNT >= COUNTS.MAXCOMMENTS) {
      COUNTS.COMMENTSCOUNT = 1;
    }
    if (parrentList.classList.contains('inner-' + COUNTS.COMMENTSCOUNT)) {
      COUNTS.COMMENTSCOUNT++;
      parrentClassArray.push('inner-' + COUNTS.COMMENTSCOUNT);
    }

    if (parrentClassArray) {
      innerList.classList.add(parrentClassArray[parrentClassArray.length - 1]);
    }

  };

  // создает точку отчета от 1970г в минутах
  var getDatePoint = function () {
    var date = new Date().getTime() / 60000;
    return date;
  };


  // создает комментарий по шаблону
  var getComment = function (userName, userText) {
    var commentTemplate = document.querySelector('#new-comment').content.querySelector('li');

    if (commentTemplate) {
      var element = commentTemplate.cloneNode(true);
    }

    var markdownText = window.markdownit();

    if (element) {
      var commentText = element.querySelector('.comment__description p');

      element.querySelector('.comment__user-name').textContent = userName;
      commentText.textContent = '';
      commentText.insertAdjacentHTML('afterbegin', markdownText.render(userText));
      fragment.appendChild(element);


      var commentDate = element.querySelector('.comment__date');

      // фиксирует время создания комментария
      var pointTime = getDatePoint();
      setInterval(function () {

        // разница в минутах от точки создания комментария
        var newTime = Math.floor(getDatePoint() - pointTime);

        if (newTime < 60) {
          commentDate.textContent = '' + newTime + ' минут назад';
        } else if (newTime >= 60 && newTime < 120) {
          commentDate.textContent = 'Час назад';
        } else if (newTime >= 120 && newTime < 1440) {
          commentDate.textContent = '' + Math.floor(newTime / 60) + ' часов назад';
        } else if (newTime >= 1440) {
          commentDate.textContent = '' + Math.floor(newTime / 1440) + ' дней назад';
        }

      }, 60000);

      // кнопка ответить
      var commentAnswerButton = element.querySelector('.comment__answer');
      commentAnswerButton.addEventListener('click', function (evt) {
        evt.preventDefault();

        // проверка на наличие списка
        if (!element.querySelector('.comments__list-inner')) {
          getAnswerList(element);
        }

        getCountInner(element);
        insertForm(element, element.querySelector('.comments__list-inner'));

      });
    }
  };

  // определяет первую форму при загрузке страницы
  document.addEventListener('DOMContentLoaded', function () {
    getNewForm(firstCommentsList);
  }, false);

})();
