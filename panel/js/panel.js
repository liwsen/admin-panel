define(function(require, exports, module){
    var layer = require('layer');
    require('layer_css');

    //初始化
    exports.init = function(){
        var $nav = $('#nav');
        var $menu = $('#menu');
        var $iframe_tab = $('#iframe_tab');
        var $iframe_block = $('#iframe_block');
        var iframe_prefix = 'iframe_';

        //子菜单显示事件
        $nav.on('click', '.item', function(event) {
            event.preventDefault();
            var menu = $(this).find('a').attr('_for');
            $(this).find('a').addClass('thisclass').end().siblings('.item').find('a').removeClass('thisclass');
            $('#items_'+ menu).addClass('thisclass').siblings('.itemBlock').removeClass('thisclass');
        });
        //初始化菜单
        if($nav.find('.thisclass').lenght === 0){
            $nav.find('.item').eq(0).addClass('thisclass');
        }
        $nav.find('.thisclass').trigger('click');

        //左侧菜单
        $menu.on('click', 'dt', function(event) {
            event.preventDefault();
            $(this).closest('dl').toggleClass('fadeDown');
        })
        .on('click', 'a', function(event) {
            event.preventDefault();
            var id = $(this).closest('dl').attr('id');
            var iframe_id = iframe_prefix + id;
            var href = $(this).attr('href');
            var name = $(this).closest('dl').find('dt').text() + '-' + $(this).text();
            var $tab = $iframe_tab.find('.tab[_for="main"]');
            var $iframe = $iframe_block.find('#main');
            var $tabClose = '';
            //判断现有的Tab个数
            if($iframe_tab.find('.tab').length > 16){
                layer.msg('最多只能同时打开'+ $iframe_tab.find('.tab').length +'个标签页');
                return false;
            }
            //在iframe中显示
            if(!!id){
                //创建Tab
                if(!$iframe_tab.find('.tab[_for="'+ id +'"]').length){
                    $iframe_tab.append('<div class="tab" _for="'+ id +'">'+ name +'<span>X</span></div>');
                }
                $tab = $iframe_tab.find('.tab[_for="'+ id +'"]');
                $tabClose = $tab.find('span').clone();
                //创建Iframe
                if(!$iframe_block.find('#'+ iframe_prefix + id).length){
                    $iframe_block.append('<iframe class="hide" id="'+ iframe_prefix + id +'" name="'+ iframe_prefix + id +'" frameborder="0" scrolling="yes"></iframe>');
                }
                $iframe = $iframe_block.find('#'+ iframe_prefix + id);
            }
            $iframe.attr('src', href);
            $tab.attr('title', name).html(name).append($tabClose).trigger('click');
            //显示状态
            $menu.find('a').removeClass('thisclass');
            $(this).addClass('thisclass');
        });

        //IframeTab点击切换
        $iframe_tab.on('click', '.tab', function(event) {
            event.preventDefault();
            var forName = $(this).attr('_for');
            var prefix = forName === 'main' ? '' : iframe_prefix;
            $(this).addClass('thisclass').siblings('.tab').removeClass('thisclass');
            $iframe_block.find('#'+ prefix + forName).removeClass('hide').siblings('iframe').addClass('hide');
            if(forName !== 'main'){
                //查找同父级子菜单，切换状态
                var menuId = $menu.find('.thisclass').removeClass('thisclass').end().find('#'+ forName).closest('.itemBlock').addClass('thisclass').attr('id');
                //导航栏切换状态
                $nav.find('.thisclass').removeClass('thisclass').end().find('a[_for="'+ menuId.replace('items_', '') +'"]').addClass('thisclass');
            }
        })
        //关闭选项卡
        .on('click', '.tab span', function(event) {
            event.preventDefault();
            event.stopPropagation();
            var $tab = $(this).closest('.tab');
            var index = $tab.index();
            $iframe = $('iframe#'+ $tab.attr('_for'));
            $iframe.remove();
            $tab.remove();
            $iframe_tab.find('.tab').eq(index-1).trigger('click');
        })
        //双击
        .on('dblclick', '.tab', function(event) {
            event.preventDefault();
            $(this).find('span').trigger('click');
        })
        //鼠标中键点击
        .on('mousedown', '.tab', function(event) {
            event.preventDefault();
            if(1 === event.button){
                $(this).find('span').trigger('click');
            }
        });

        //隐藏左侧菜单
        $('.togggleMenuBtn').on('click', function(event) {
            event.preventDefault();
            $('.hmtPanel').toggleClass('hidemenu');
        });
    };
});