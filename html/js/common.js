/** !
 *	全局通用js
 *	Created @ 2017/2/28 by v_syuanyang
 */
(function(){

    // 侧栏展开折叠
    var sideBar = $(".bk-sidebar");
    $(".slide-switch").on("click",function(){
        sideBar.toggleClass("slide-open slide-close")
        if(sideBar.hasClass("slide-close")){
            $(".flex-subnavs").hide();
        }
    });

    //单级菜单
    sideBar.on("click","li>a",function(){
        if($(this).parents(".bk-sidebar").hasClass("slide-close")) return;
        var _this = $(this).parent();
        var _thisParent = _this.siblings();
        if(_this.hasClass("pure-link")){
            _this.addClass("open").siblings().removeClass("open");
        }else{
            _this.toggleClass("open").siblings().removeClass("open");
            _this.find(".flex-subnavs").slideToggle();
        }

        _thisParent.find(".flex-subnavs").slideUp();
    });

    //多级菜单
    sideBar.on("click",".flex-subnavs a",function(){
        $(".flex-subnavs a").removeClass("on");
        $(this).addClass("on");
        if($(this).parents(".bk-sidebar").hasClass("slide-close")){
            $(this).parents("li").addClass("open").siblings().removeClass("open")
        }
    });

    // 监听分辨率
    $(window).on('resize', function(){
        var width = $(window).width();
        if (width > 1366){
            sideBar.removeClass("slide-close").addClass("slide-open");
            
        }else{
            sideBar.removeClass("slide-open").addClass("slide-close");
        
        }
    });
    $(window).trigger('resize');
})();