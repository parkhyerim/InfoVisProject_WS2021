document.onreadystatechange = function(){
    $(function(){
        $('[data-toggle="popover"]').popover({
            placement : 'top',
            html : true,
            title : '<div class="popover-header"><div class="popover-title">First Step</div><a href="#" class="close" data-dismiss="alert">&times;</a></div>',
            content : '<div class="popover-content"><p>Excellent Bootstrap popover! I really love it.</p></div>'
        })
        .addClass($(this).data("class"));

        $(document).on("click", ".popover .close" , function(){
            $('[data-toggle="popover"]').popover('hide');
        })

      });    
};