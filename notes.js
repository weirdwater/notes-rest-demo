(function() {
  var url = 'api/';
  var author = 'Arjo';

  getNotesList();

  $('.container').click(clickHandler);
  $('#author').click(function() {
    var name = prompt('New author\'s name');
    changeAuthor(name);
  });

  function clickHandler(e)
  {
    e.preventDefault();
    var target = $(e.target);
    // action link > li > ul > article
    var noteElement = target.parent().parent().parent();

    switch (target.data('action')) {
      case 'delete':
        deleteNote(noteElement);
        break;
      case 'more':
        getNote(noteElement.attr('id'));
        break;
      case 'back':
        getNotesList();
        break;
    }
  }

  function changeAuthor(name)
  {
    author = name;
    $('#author').text(name);
  }

  function getNote(id)
  {
    console.log(url + '?id=' + id);
    $.getJSON(url + '?id=' + id)
      .done(getNoteSuccess)
      .fail(getNoteFail);
  }

  function getNoteSuccess(data)
  {
    $('.container').empty()
      .append($('<h1>', { id: 'page-title', text: 'Notes' }))
      .append(createDetailNoteElement(data));
  }

  function getNoteFail(error)
  {
    alert('oops! Something went wrong');
  }

  function getNotesList()
  {
    $('.container').empty()
      .append($('<h1>', { id: 'page-title', text: 'Notes' }));
    $.getJSON(url)
      .done(generateNotes)
      .fail(noteListFail);
  }

  function noteListFail(error)
  {
    $('<h2>', {
      class: 'error-message',
      text: 'Something went wrong...'
    })
      .appendTo($('.container'));
    console.error(error);
  }

  function generateNotes(data)
  {
    if (data.length) {
      var domFragment = $(document.createDocumentFragment());
      $.each(data, function(index, note) {
        createNoteElement(note)
          .appendTo(domFragment);
      });
      domFragment.appendTo($('.container'));
    }
    else {
      $('<h2>', {
        id: "empty-message",
        class: 'empty-message',
        text: 'Nothing here...'
      })
        .appendTo($('.container'));
    }
  }

  function deleteNote(noteElement)
  {
    $.ajax({
      url: url + '?id=' + noteElement.attr('id'),
      contentType: 'application/json',
      method: 'DELETE'
    })
      .done(function(data) {
        deleteNoteSuccess(data, noteElement);
      })
      .fail(function(error) {
        deleteNoteFail(error, noteElement);
      });
  }

  function deleteNoteSuccess(data, noteElement)
  {
    noteElement.remove();

    if (noteElement.attr('class') == 'detail-note') {
      getNotesList();
    }
  }

  function deleteNoteFail(error, noteElement)
  {
    console.log(noteElement);
    var title = $('#' + noteElement.attr('id') +' .title').text();
    console.log('Error, couldn\'t delete the note: '+ title);
  }

  function createDetailNoteElement(note)
  {
    var back = $('<li>').append($('<a>', {
      href: '#',
      'data-action': 'back',
      text: '[back]'
    }));
    var edit = $('<li>').append($('<a>', {
      href: '#',
      'data-action': 'edit',
      text: '[edit]'
    }));
    var deleteOpt = $('<li>').append($('<a>', {
      href: '#',
      'data-action': 'delete',
      text: '[delete]'
    }));
    var options = $('<ul>', {class: 'action-links'})
      .append(back)
      .append(edit)
      .append(deleteOpt);

    return $('<article>', {
      class: 'detail-note',
      id: note.id
    })
      .append($('<h2>',{
        class: "title",
        text: note.title
      }))
      .append($('<p>', {
        class: 'body',
        text: note.body
      }))
      .append($('<h3>', {
        class: 'author',
        text: note.author
      }))
      .append(options);
  }

  function createNoteElement(note)
  {
    var more = $('<li>').append($('<a>', {
      href: '#',
      'data-action': 'more',
      text: '[more]'
    }));
    var edit = $('<li>').append($('<a>', {
      href: '#',
      'data-action': 'edit',
      text: '[edit]'
    }));
    var deleteOpt = $('<li>').append($('<a>', {
      href: '#',
      'data-action': 'delete',
      text: '[delete]'
    }));
    var options = $('<ul>', {class: 'action-links'})
      .append(more)
      .append(edit)
      .append(deleteOpt);

    return $('<article>', {
      class: 'note',
      id: note.id
    })
      .append($('<h2>',{
        class: "title",
        text: note.title
      }))
      .append($('<p>', {
        class: 'body',
        text: note.body
      }))
      .append(options);
  }
})();
