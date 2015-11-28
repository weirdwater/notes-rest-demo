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
    var target = $(e.target);
    // action link > li > ul > article
    var noteElement = target.parent().parent().parent();

    if (target.data('action'))
      e.preventDefault();

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
      case 'new':
        $('.container')
          .empty()
          .append(createForm());
        break;
      case 'save':
        saveNote();
        break;
    }
  }

  function saveNote()
  {
    var newNote = {
      author: author,
      title:  $('#inp-title').val(),
      body:   $('#inp-body').val()
    };

    $.ajax({
      url: url,
      type: 'POST',
      data: newNote
    })
    .done(getNoteSuccess)
    .fail(saveNoteFail);
  }

  function saveNoteFail(error)
  {
    alert(error.status + ': ' + error.message);
  }

  function changeAuthor(name)
  {
    author = name;
    $('#author').text(name);
  }

  function getNote(id)
  {
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
      .append($('<h1>', {
        id: 'page-title',
        text: 'Notes'
      }))
      .append($('<button>', {
        class: 'button-main',
        'data-action': 'new',
        text: 'New Note'
    }));
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
      $.each($(data).get().reverse(), function(index, note) {
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

  function createForm()
  {
    var domFragment = document.createDocumentFragment();
    $(domFragment)
      .append($('<h1>', {
        id: 'page-title',
        text: 'New Note'
      }))
      .append($('<label>', {
        for: 'inp-title',
        text: 'Title'
      }))
      .append($('<input>', {
        type: 'text',
        id: 'inp-title'
      }))
      .append($('<label>', {
        for: 'inp-body',
        text: 'Body'
      }))
      .append($('<textarea>', {
        id: 'inp-body',
        rows: 5
      }))
      .append($('<button>', {
        'data-action': 'back',
        text: 'Cancel'
      }))
      .append($('<button>', {
        class: 'button-main',
        'data-action': 'save',
        text: 'Save'
      }));
    return domFragment;
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
        text: 'Author: ' + note.author
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
