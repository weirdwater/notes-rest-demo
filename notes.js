(function() {
  var url = 'api/';
  var author = 'Arjo';

  getNotesList();

  $('.container').click(clickHandler);

  function clickHandler(e) {
    e.preventDefault();
    var target = $(e.target);
    if (target.data('action') == 'delete') {
      // Delete link > li > ul > article
      var noteElement = target.parent().parent().parent();
      deleteNote(noteElement);
    }
  }

  function getNotesList()
  {
    $.getJSON(url)
      .done(generateNotes)
      .fail(noteListFail);
  }

  function noteListFail(error) {
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
  }

  function deleteNoteFail(error, noteElement)
  {
    console.log(noteElement);
    var title = $('#' + noteElement.attr('id') +' .title').text();
    console.log('Error, couldn\'t delete the note: '+ title);
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
