document.onreadystatechange = function(){
    $('#bundesländerSelector').popover({
        placement : 'top',
        html : true,
        trigger: "focus",
        title : '<div class="popover-header"><div class="popover-title">First Step</div><a href="#" class="close" data-dismiss="alert">&times;</a></div>',
        content : '<div class="popover-content"><p>Excellent Bootstrap popover! I really love it.</p></div>'
    })
    .addClass($(this).data("class"));

    $('#bundesländerSelector').popover('show');

    $(document).on("click", ".popover .close" , function(){
        $(this).parents(".popover").not(this).popover('hide');

        $('#dataWrapper').popover({
            placement : 'left',
            html : true,
            trigger: "focus",
            title : '<div class="popover-header"><div class="popover-title">Second Step</div><a href="#" class="close" data-dismiss="alert">&times;</a></div>',
            content : '<div class="popover-content"><p>Excellent Bootstrap popover! I really love it.</p></div>'
        })
        $('#dataWrapper').popover('show');

        $(document).on("click", ".popover .close" , function(){
            $('#dataWrapper').popover('hide');
        })
    });

    
};

