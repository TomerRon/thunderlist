///////////////////////////////////////////////////
//               UI FUNCTIONS
///////////////////////////////////////////////////

function showLists(lists) {
    for (var i=0;i<lists.length;i++){
        var list = lists[i];
        var el = $(getListMarkup(list));
        $('#lists').prepend(el);
        getListInfo(el, list);
    }
}

function updateListInfo(el, list) {
    $(el).find('.count-total').html(list.count);
    $(el).find('.count-complete').html(list.countComplete);
    $(el).find('.count-incomplete').html(list.countIncomplete);
    $(el).find('.count-urgent').html('0');
    if (list.count == list.countComplete) {
        $(el).find('.card').removeClass('border-primary').addClass('border-success');
        $(el).find('.card-header').removeClass('bg-primary').addClass('bg-success');
        $(el).find('.hide-on-complete').addClass('d-none');
    }
}

function getListMarkup(list) {
    return '\
        <div class="col-sm-6">\
            <a href="/lists/'+list.id+'" class="card border-primary mb-4 list" data-list-id='+list.id+'>\
                <div class="card-header bg-primary">'+list.name+'</div>\
                <div class="card-body">\
                    <span class="hide-on-complete">\
                    <i class="fa fa-sticky-note mr-1" aria-hidden="true"></i><span class="count-total mr-2"></span>\
                    </span>\
                    <i class="fa fa-check text-success mr-1" aria-hidden="true"></i><span class="count-complete mr-2"></span>\
                    <span class="hide-on-complete">\
                        <i class="fa fa-tasks text-primary mr-1" aria-hidden="true"></i><span class="count-incomplete mr-2"></span>\
                        <i class="fa fa-exclamation-circle text-danger mr-1" aria-hidden="true"></i><span class="count-urgent mr-2"></span>\
                    </span>\
                </div>\
            </a>\
        </div>\
    ';
}

function startTutorial() {
    $('.list:contains(My First List)').first().attr({
        "data-step": "1",
        "data-intro": "<div class='text-center'><h3>Welcome to Thunderlist!</h3>Click here to open your first list.</div>",
    });
    introJs().start();
}

///////////////////////////////////////////////////
//               DATA FUNCTIONS
///////////////////////////////////////////////////

function getLists() {
    $.ajax({url: "/api/lists/"})
    .done(function(data) {
        showLists(data);
        if ($('body').attr('data-tutorial')) {
            $('body').removeAttr('data-tutorial');
            startTutorial();
            
            // Fix when pressing back to dashboard so the tutorial won't start again
            window.history.replaceState({}, document.title, window.location.protocol + "//" + window.location.host + window.location.pathname);
        }
    });
}

function getListInfo(el, list) {
    $.ajax({url: "/api/lists/"+list.id})
    .done(function(data) {
        var countComplete = 0;
        for (var i=0;i<data.length;i++) {
              if (data[i].done) {
                countComplete += 1;
              }
        }
        list.count = data.length;
        list.countComplete = countComplete;
        list.countIncomplete = data.length - countComplete;
        
        updateListInfo(el, list);
    });
}

function addList(name) {
    if (!name.length) {
        $("#new-list-name").focus();
        return;
    }
    $.ajax({
           type: "POST",
           url: '/api/lists/',
           data: { name: name },
           success: function(data)
           {
               window.location = "/lists/"+data.id;
           }
         });
}

$(document).ready(function() {
    
    $(document).on('click', '.new-list-button', function() {
        addList($("#new-list-name").val());
    });
    $(document).on('keypress', "#new-list-name", function(event){
        if(event.keyCode == 13) {
            addList($(this).val());
        }
    });
});