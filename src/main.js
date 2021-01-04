document.onreadystatechange = function(){
    $('[data-toggle="popover"]').popover({
        placement : 'top',
        html : true,
        trigger: "focus",
        title : '<div class="popover-header"><div class="popover-title">First Step</div><a href="#" class="close" data-dismiss="alert">&times;</a></div>',
        content : '<div class="popover-content"><p>Excellent Bootstrap popover! I really love it.</p></div>'
    });
    $('[data-toggle="popover"]').popover('show');

    $(document).on("click", ".popover .close" , function(){
        $(this).parents(".popover").popover('hide');
    });

    //document.querySelector(".arrow").innerHTML ="Arrow";
};

