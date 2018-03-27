var FILTER = '';

///////////////////////////////////////////////////
//               UI FUNCTIONS
///////////////////////////////////////////////////

function refreshTable() {
    $('#refresh-tasks-button').find('.fa').addClass('fa-spin-fast');
    $('#refresh-tasks-button').blur();
    $("#search-tasks-input").val('');
    setTimeout(function(){
        $('#tasks tbody').html('');
        addNewTaskRowToTable();
        getTasks();
    }, 500);
}

function showTasks(tasks) {
    for (var i=0;i<tasks.length;i++){
        var task = tasks[i];
        $('#add-task-button').parent('tr').after(getTaskMarkup(task));
    }
    $('#tasks tbody').fadeIn();
    $("input[name=content]").focus();
    if (($('.task-content').text().indexOf('Make the world a better place') > -1)
        &&
        ($('.task-content').text().indexOf('Learn how to use Thunderlist') > -1)
        &&
        ($('.task-content').length == 2)
        &&
        (FILTER == '')) {
            setTimeout(function(){
                showTutorial()
            }, 1000);
        }
}

function openTask(el, id) {
    el.removeClass('closed').addClass('open');
    var contentEl = $(el).find('.task-content');
    var content = $(contentEl).html();
    contentEl.html('\
        <div class="input-group">\
            <span class="input-group-addon" style="padding:0px 12px 4px 12px;">&#8629;</span>\
            <input type="text" class="form-control" name="update-content" value="" />\
        </div>\
    ');
    var input = contentEl.find('input');
    input.focus().val(content);
    el.find('.task-status').hide();
    el.find('.task-controls').hide();
    el.find('.task-edit-save').show();
    el.find('.task-edit-cancel').show();
}



function getTaskMarkup(task) {
    return '\
        <tr class="task closed clickable'+(task.done ? ' text-muted' : '')+'" data-task-id="'+task.id+'">\
            <td class="task-controls cell-align-center">\
                <i class="delete-task-button fa fa-lg fa-times text-danger clickable mr-2" aria-hidden="true"></i> \
                <i class="complete-task-button fa fa-lg fa-check text-success clickable mr-2'+(task.done ? ' d-none' : '')+'" aria-hidden="true"></i>\
                <i class="uncomplete-task-button fa fa-lg fa-undo text-primary clickable mr-2'+(!task.done ? ' d-none' : '')+'" aria-hidden="true"></i>\
            </td>\
            <td class="task-edit-cancel cell-align-center text-center" style="display:none;">\
                <button class="btn btn-lg btn-danger clickable cancel-task-button" style="width:60px;">\
                    <i class="fa fa-chevron-left" aria-hidden="true"></i>\
                </button>\
            </td>\
            <td class="task-content">'+
                task.content+
            '</td>\
            <td class="task-status cell-align-center">'+
                (task.done ? '<span class="badge badge-success">Done</span>' : '<span class="badge badge-primary">In Progress</span>')+
            '</td>\
            <td class="task-edit-save cell-align-center" style="display:none;">\
                <button class="btn btn-lg btn-success clickable save-task-button" style="width:60px;">\
                    <i class="fa fa-floppy-o" aria-hidden="true"></i>\
                </button>\
            </td>\
        </tr>\
    ';
}

function addNewTaskRowToTable() {
    $('#tasks tbody').prepend('\
        <tr id="add-task-row">\
            <td id="add-task-button" class="cell-align-center">\
                <button type="submit" style="border:none;background:none;cursor:pointer;">\
                    <span class="fa-stack">\
                        <i class="fa fa-sticky-note fa-stack-2x text-primary"></i>\
                        <i class="fa fa-plus fa-stack-1x text-white"></i>\
                    </span>\
                </button>\
            </td>\
            <td class="cell-align-center"><input type="text" class="form-control" name="content" placeholder="Add a new item" /></td>\
            <td></td>\
        </tr>');
}

function showTutorial() {
    $('#add-task-row input').attr({
        "data-step": "1",
        "data-intro": "Use this box to add new items.",
    });
    $('tr.task').first().find('.task-content').attr({
        "data-step": "2",
        "data-intro": "Tap an existing item to edit it.",
    });
     $('tr.task:eq(1)').find('.task-controls').attr({
        "data-step": "3",
        "data-intro": "Use the controls to delete an item or to mark it as complete.",
    });
    introJs().start();
}

///////////////////////////////////////////////////
//               DATA FUNCTIONS
///////////////////////////////////////////////////

function getListId() {
    return $('table#tasks').attr('data-list-id');
}

function getList() {
    $.ajax({url: "/api/list/"+getListId()})
    .done(function(data) {
        $('#list-name').html(data.name);
    });
}

function getTasks() {
    $.ajax({url: "/api/lists/"+getListId()+"/"+FILTER})
    .done(function(data) {
              showTasks(data);
              $('#refresh-tasks-button').find('.fa').removeClass('fa-spin-fast');
    });
}

function updateTask(el, id, fields) {
    $.ajax({
               type: "POST",
               url: '/api/lists/'+getListId()+'/task/'+id,
               data: fields,
               success: function(data)
               {
                   refreshTask(el, id);
               }
             });
}

function refreshTask(el, id) {
    $.ajax({
               type: "GET",
               url: '/api/lists/'+getListId()+'/task/'+id,
               success: function(data)
               {
                   var markup = getTaskMarkup(data);
                   $(el).before(markup).remove();
               }
             });
}

function addTask(content) {
    if (!content.length) {
        $("input[name=content]").focus();
        return;
    }
    $.ajax({
           type: "POST",
           url: '/api/lists/'+getListId(),
           data: { content: content },
           success: function(data)
           {
               $("input[name=content]").val('');
               $('#add-task-button').parent('tr').after(getTaskMarkup(data));
           }
         });
}

function deleteTask(el, id) {
    $(el).find('.delete-task-button').removeClass('fa-times text-danger').addClass('fa-spinner fa-spin');
    setTimeout(function(){
        $.ajax({
               type: "DELETE",
               url: '/api/lists/'+getListId()+'/task/'+id,
               success: function(data)
               {
                    $(el).fadeOut(300, function(){
                        $(this).remove();
                    });
               }
             });
        }, 500);
}

function completeTask(el, id) {
    $(el).find('.complete-task-button').removeClass('fa-check text-success').addClass('fa-spinner fa-spin');
    setTimeout(function(){
        $.ajax({
               type: "POST",
               url: '/api/lists/'+getListId()+'/task/'+id,
               data: { done: true, },
               success: function(data)
               {
                   $(el).addClass('text-muted');
                   $(el).find('.task-status .badge').removeClass().addClass('badge badge-success').html('Done');
                   $(el).find('.complete-task-button').addClass('fa-check text-success d-none').removeClass('fa-spinner fa-spin');
                   $(el).find('.uncomplete-task-button').removeClass('d-none');
               }
             });
    }, 500);
}

function uncompleteTask(el, id) {
    $(el).find('.uncomplete-task-button').removeClass('fa-undo text-primary').addClass('fa-spinner fa-spin');
    setTimeout(function(){
        $.ajax({
               type: "POST",
               url: '/api/lists/'+getListId()+'/task/'+id,
               data: { done: false },
               success: function(data)
               {
                   $(el).removeClass('text-muted');
                   $(el).find('.task-status .badge').removeClass().addClass('badge badge-primary').html('In Progress');
                   $(el).find('.uncomplete-task-button').addClass('fa-undo text-primary d-none').removeClass('fa-spinner fa-spin');
                   $(el).find('.complete-task-button').removeClass('d-none');
               }
             });
    }, 500);
}

function search(content) {
    FILTER = '';
    $('#refresh-tasks-button').find('.fa').addClass('fa-spin-fast');
    setTimeout(function() {
        $.ajax({
            type:'POST',
            url: "/api/lists/"+getListId()+"/search",
            data: { content: content },
            success: function(data)
            {
                $('#tasks tbody').html('');
                $('#refresh-tasks-button').find('.fa').removeClass('fa-spin-fast');
                addNewTaskRowToTable();
                showTasks(data);
            }
        });
    }, 500);
}

function deleteList() {
    setTimeout(function(){
        $.ajax({
               type: "DELETE",
               url: '/api/lists/',
               data: { listId: getListId() },
               success: function(data)
               {
                    window.location = "/dashboard";
               }
             });
        }, 500);
}

///////////////////////////////////////////////////
//               UI BINDINGS
///////////////////////////////////////////////////

$(document).ready(function(){
    
    $(document).on('click', "#add-task-button", function(event){
        event.stopPropagation();
        addTask($("input[name=content]").val());
    });
    
    $(document).on('keypress', "input[name=content]", function(event){
        if(event.keyCode == 13) {
            addTask($("input[name=content]").val());
        }
    });
    
    $(document).on('click', '.delete-task-button', function(event){
        event.stopPropagation();
        var task = $(this).closest('tr.task');
        var id = task.attr("data-task-id");
        if (id) deleteTask(task, id);
    });
    
    $(document).on('click', '.complete-task-button', function(event){
        event.stopPropagation();
        var task = $(this).closest('tr.task');
        var id = task.attr("data-task-id");
        if (id) completeTask(task, id);
    });
    
    $(document).on('click', '.uncomplete-task-button', function(event){
        event.stopPropagation();
        var task = $(this).closest('tr.task');
        var id = task.attr("data-task-id");
        if (id) uncompleteTask(task, id);
    });
    
    $(document).on('click', '#refresh-tasks-button', function(){
        refreshTable();
    });

    $(document).on('click', 'tr.task.closed', function(){
        var task = $(this);
        var id = task.attr("data-task-id");
        if (id) openTask(task, id);
    });
    $(document).on('click', ".save-task-button", function(){
        var task = $(this).closest('tr.task');
        var id = task.attr("data-task-id");
        var fields = { content: task.find('input[name=update-content]').val() };
        updateTask(task, id, fields);
    });
    $(document).on('keypress', "input[name=update-content]", function(event){
        if(event.keyCode == 13) {
            var task = $(this).closest('tr.task');
            var id = task.attr("data-task-id");
            var fields = { content: $(this).val() };
            updateTask(task, id, fields);
        }
        if(event.keyCode == 27) {
            var task = $(this).closest('tr.task');
            var id = task.attr("data-task-id");
            refreshTask(task, id);
        }
    });
    $(document).on('click', ".cancel-task-button", function(){
        var task = $(this).closest('tr.task');
        var id = task.attr("data-task-id");
        refreshTask(task, id);
    });
    
    // Search controls binding
    $(document).on('click', "#search-tasks-button", function(event){
        search($("#search-tasks-input").val());
    });
    
    $(document).on('keypress', "#search-tasks-input", function(event){
        if(event.keyCode == 13) {
            search($(this).val());
        }
    });
    
    // Filter controls binding
    $(document).on('click', '.filter-controls .all', function(){
        FILTER = ''
        refreshTable();
    });
    $(document).on('click', '.filter-controls .inprogress', function(){
        FILTER = 'inprogress'
        refreshTable();
    });
    $(document).on('click', '.filter-controls .done', function(){
        FILTER = 'done'
        refreshTable();
    });
    
    $(document).on('click', '#delete-list-button', function() {
        deleteList(); 
    });
});