/**
 * 첫페이지방법패키지 처리
 * Copyright (c) 2019 admin
 */
layer.config({
    extend: 'moon/style.css',
    skin: 'layer-ext-moon'
});

var isMobile = false;
var sidebarHeight = isMobile ? '100%' : '96%';

$(function() {
    // MetsiMenu
    $('#side-menu').metisMenu();

    // 고정 메뉴바
    $('.sidebar-collapse').slimScroll({
        height: sidebarHeight,
        railOpacity: 0.9,
        alwaysVisible: false
    });

    // 메뉴토글
    $('.navbar-minimalize').click(function() {
    	if (isMobile) {
    	    $("body").toggleClass("canvas-menu");
    	} else {
    	    $("body").toggleClass("mini-navbar");
    	}
        SmoothlyMenu();
    });

    $('#side-menu>li').click(function() {
    	if ($('body').hasClass('canvas-menu mini-navbar')) {
            NavToggle();
        }

    });
    $('#side-menu>li li a:not(:has(span))').click(function() {
        if ($(window).width() < 769) {
            NavToggle();
        }
    });

    $('.nav-close').click(NavToggle);

    //ios브라우저호환性다루다
    if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        $('#content-main').css('overflow-y', 'auto');
    }

});

$(window).bind("load resize", function() {
    isMobile = $.common.isMobile() || $(window).width() < 769;
    if (isMobile) {
        $('body').addClass('canvas-menu');
        $("body").removeClass("mini-navbar");
        $("nav .logo").addClass("hide");
        $(".slimScrollDiv").css({ "overflow": "hidden" });
        $('.navbar-static-side').fadeOut();
    } else {
    	if($('body').hasClass('canvas-menu')) {
    	    $('body').addClass('fixed-sidebar');
    	    $('body').removeClass('canvas-menu');
    	    $("body").removeClass("mini-navbar");
    	    $("nav .logo").removeClass("hide");
    	    $(".slimScrollDiv").css({ "overflow": "visible" });
    	    $('.navbar-static-side').fadeIn();
    	}
    }
});

function syncMenuTab(dataId) {
	if(isLinkage) {
        var $dataObj = $('a[href$="' + decodeURI(dataId) + '"]');
        if ($dataObj.attr("class") != null && !$dataObj.hasClass("noactive")) {
            $('.nav ul').removeClass("in");
            $dataObj.parents("ul").addClass("in")
            $dataObj.parents("li").addClass("active").siblings().removeClass("active").find('li').removeClass("active");
            $dataObj.parents("ul").css('height', 'auto').height();
            $(".nav ul li, .nav li").removeClass("selected");
            $dataObj.parent("li").addClass("selected");
            setIframeUrl(dataId);
            
            // 상위메뉴 동기화
            var tabStr = $dataObj.parents(".tab-pane").attr("id");
            if ($.common.isNotEmpty(tabStr)) {
                var sepIndex = tabStr.lastIndexOf('_');
                var menuId = tabStr.substring(sepIndex + 1, tabStr.length);
                $("#tab_" + menuId + " a").click();
            }
        }
    }
}

function NavToggle() {
    $('.navbar-minimalize').trigger('click');
}

function fixedSidebar() {
    $('#side-menu').hide();
    $("nav .logo").addClass("hide");
    setTimeout(function() {
        $('#side-menu').fadeIn(500);
    }, 100);
}

// 앵커 포인트 설정
function setIframeUrl(href) {
	if($.common.equals("history", mode)) {
	    storage.set('publicPath', href);
	} else {
	    var nowUrl = window.location.href;
	    var newUrl = nowUrl.substring(0, nowUrl.indexOf("#"));
	    window.location.href = newUrl + "#" + href;
	}
}

function SmoothlyMenu() {
    if (isMobile && !$('body').hasClass('canvas-menu')) {
    	$('.navbar-static-side').fadeIn();
    	fixedSidebar();
    } else if (!isMobile &&!$('body').hasClass('mini-navbar')) {
    	fixedSidebar();
    	$("nav .logo").removeClass("hide");
    } else if (isMobile && $('body').hasClass('fixed-sidebar')) {
    	$('.navbar-static-side').fadeOut();
    	fixedSidebar();
    } else if (!isMobile && $('body').hasClass('fixed-sidebar')) {
    	fixedSidebar();
    } else {
        $('#side-menu').removeAttr('style');
    }
}

/**
 * iframe다루다
 */
$(function() {
    //요소 컬렉션의 전체 너비를 계산합니다.
    function calSumWidth(elements) {
        var width = 0;
        $(elements).each(function() {
            width += $(this).outerWidth(true);
        });
        return width;
    }

    // 활성화명세텝
    function setActiveTab(element) {
        if (!$(element).hasClass('active')) {
            var currentId = $(element).data('id');
            syncMenuTab(currentId);
            // 탭에 해당하는 콘텐츠 영역 표시
            $('.illeesam_iframe').each(function() {
                if ($(this).data('id') == currentId) {
                    $(this).show().siblings('.illeesam_iframe').hide();
                }
            });
            $(element).addClass('active').siblings('.menuTab').removeClass('active');
            scrollToTab(element);
        }
    }

    //명세 탭으로 스크롤
    function scrollToTab(element) {
        var marginLeftVal = calSumWidth($(element).prevAll()),
        marginRightVal = calSumWidth($(element).nextAll());
        // 보이는 영역이 아니다.tab너비
        var tabOuterWidth = calSumWidth($(".content-tabs").children().not(".menuTabs"));
        //가시 영역tab너비
        var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
        //실제스크롤너비
        var scrollVal = 0;
        if ($(".page-tabs-content").outerWidth() < visibleWidth) {
            scrollVal = 0;
        } else if (marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
            if ((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
                scrollVal = marginLeftVal;
                var tabElement = element;
                while ((scrollVal - $(tabElement).outerWidth()) > ($(".page-tabs-content").outerWidth() - visibleWidth)) {
                    scrollVal -= $(tabElement).prev().outerWidth();
                    tabElement = $(tabElement).prev();
                }
            }
        } else if (marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
            scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
        }
        $('.page-tabs-content').animate({ marginLeft: 0 - scrollVal + 'px' }, "fast");
    }

    //왼쪽에 숨겨진 탭 보기
    function scrollTabLeft() {
        var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
        // 보이는 영역이 아니다.tab너비
        var tabOuterWidth = calSumWidth($(".content-tabs").children().not(".menuTabs"));
        //가시 영역tab너비
        var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
        //실제스크롤너비
        var scrollVal = 0;
        if (($(".page-tabs-content").width()) < visibleWidth) {
            return false;
        } else {
            var tabElement = $(".menuTab:first");
            var offsetVal = 0;
            while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) { //멀리찾다현재tab최근집단
                offsetVal += $(tabElement).outerWidth(true);
                tabElement = $(tabElement).next();
            }
            offsetVal = 0;
            if (calSumWidth($(tabElement).prevAll()) > visibleWidth) {
                while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).prev();
                }
                scrollVal = calSumWidth($(tabElement).prevAll());
            }
        }
        $('.page-tabs-content').animate({ marginLeft: 0 - scrollVal + 'px' }, "fast");
    }

    //오른쪽에 숨겨진 탭 보기
    function scrollTabRight() {
        var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
        // 보이는 영역이 아니다.tab너비
        var tabOuterWidth = calSumWidth($(".content-tabs").children().not(".menuTabs"));
        //가시 영역tab너비
        var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
        //실제스크롤너비
        var scrollVal = 0;
        if ($(".page-tabs-content").width() < visibleWidth) {
            return false;
        } else {
            var tabElement = $(".menuTab:first");
            var offsetVal = 0;
            while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) { //멀리찾다현재tab최근집단
                offsetVal += $(tabElement).outerWidth(true);
                tabElement = $(tabElement).next();
            }
            offsetVal = 0;
            while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                offsetVal += $(tabElement).outerWidth(true);
                tabElement = $(tabElement).next();
            }
            scrollVal = calSumWidth($(tabElement).prevAll());
            if (scrollVal > 0) {
                $('.page-tabs-content').animate({ marginLeft: 0 - scrollVal + 'px' }, "fast");
            }
        }
    }

    //순회하여 메뉴 항목에 data-index 속성을 추가합니다.
    $(".menuItem").each(function(index) {
        if (!$(this).attr('data-index')) {
            $(this).attr('data-index', index);
        }
    });

    function menuItem() {
        // get심벌마크데이터
        var dataUrl = $(this).attr('href'),
        dataIndex = $(this).data('index'),
        menuName = $.trim($(this).text()),
        isRefresh = $(this).data("refresh"),
        flag = true;

        var $dataObj = $('a[href$="' + decodeURI(dataUrl) + '"]');
        if (!$dataObj.hasClass("noactive")) {
            $('.tab-pane li').removeClass("active");
            $('.nav ul').removeClass("in");
            $dataObj.parents("ul").addClass("in")
            $dataObj.parents("li").addClass("active").siblings().removeClass("active").find('li').removeClass("active");
            $dataObj.parents("ul").css('height', 'auto').height();
            $(".nav ul li, .nav li").removeClass("selected");
            $(this).parent("li").addClass("selected");
        }
        setIframeUrl(dataUrl);
        if (dataUrl == undefined || $.trim(dataUrl).length == 0) return false;

        // 텝메뉴존재
        $('.menuTab').each(function() {
            if ($(this).data('id') == dataUrl) {
                if (!$(this).hasClass('active')) {
                    $(this).addClass('active').siblings('.menuTab').removeClass('active');
                    scrollToTab(this);
                    // 탭에 해당하는 콘텐츠 영역 표시
                    $('.mainContent .illeesam_iframe').each(function() {
                        if ($(this).data('id') == dataUrl) {
                            $(this).show().siblings('.illeesam_iframe').hide();
                            return false;
                        }
                    });
                }
                if (isRefresh) {
                    refreshTab();
                }
                flag = false;
                return false;
            }
        });
        // 탭 메뉴가 존재하지 않습니다
        if (flag) {
            var str = '<a href="javascript:;" class="active menuTab" data-id="' + dataUrl + '">' + menuName + ' <i class="fa fa-times-circle"></i></a>';
            $('.menuTab').removeClass('active');

            // 추가접근에 해당하는 iframe
            var str1 = '<iframe class="illeesam_iframe" name="iframe' + dataIndex + '" width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';
            $('.mainContent').find('iframe.illeesam_iframe').hide().parents('.mainContent').append(str1);

            $.modal.loading("데이터로딩중,기다리세요...");

            $('.mainContent iframe:visible').on('load', function() {
            	$.modal.closeLoading();
            });

            // 추가텝
            $('.menuTabs .page-tabs-content').append(str);
            scrollToTab($('.menuTab.active'));
        }
        return false;
    }

    function menuBlank() {
    	// 새 창에서 익스트라넷이 열립니다.http://시작,如http://ruoyi.vip
    	var dataUrl = $(this).attr('href');
    	window.open(dataUrl);
    	return false;
    }

    $('.menuItem').on('click', menuItem);

    $('.menuBlank').on('click', menuBlank);

    // 탭 닫기메뉴
    function closeTab() {
        var closeTabId = $(this).parents('.menuTab').data('id');
        var currentWidth = $(this).parents('.menuTab').width();
        var panelUrl = $(this).parents('.menuTab').data('panel');
        // 현재 요소는활동상태
        if ($(this).parents('.menuTab').hasClass('active')) {

            // 현재 요소 다음에는 형제 요소가 있으므로 다음 하나의 요소가 상태에 있습니다.
            if ($(this).parents('.menuTab').next('.menuTab').length) {

                var activeId = $(this).parents('.menuTab').next('.menuTab:eq(0)').data('id');
                $(this).parents('.menuTab').next('.menuTab:eq(0)').addClass('active');

                $('.mainContent .illeesam_iframe').each(function() {
                    if ($(this).data('id') == activeId) {
                        $(this).show().siblings('.illeesam_iframe').hide();
                        return false;
                    }
                });

                var marginLeftVal = parseInt($('.page-tabs-content').css('margin-left'));
                if (marginLeftVal < 0) {
                    $('.page-tabs-content').animate({ marginLeft: (marginLeftVal + currentWidth) + 'px' }, "fast");
                }

                //  제거 현재텝
                $(this).parents('.menuTab').remove();

                // 탭에 해당하는 콘텐츠 영역 제거
                $('.mainContent .illeesam_iframe').each(function() {
                    if ($(this).data('id') == closeTabId) {
                        $(this).remove();
                        return false;
                    }
                });
            }

            // 현재 요소 뒤에 형제 요소가 없으므로 현재 요소의 상위 하나 요소가 상태입니다
            if ($(this).parents('.menuTab').prev('.menuTab').length) {
                var activeId = $(this).parents('.menuTab').prev('.menuTab:last').data('id');
                $(this).parents('.menuTab').prev('.menuTab:last').addClass('active');
                $('.mainContent .illeesam_iframe').each(function() {
                    if ($(this).data('id') == activeId) {
                        $(this).show().siblings('.illeesam_iframe').hide();
                        return false;
                    }
                });

                //  제거 현재텝
                $(this).parents('.menuTab').remove();

                // 탭에 해당하는 콘텐츠 영역 제거
                $('.mainContent .illeesam_iframe').each(function() {
                    if ($(this).data('id') == closeTabId) {
                        $(this).remove();
                        return false;
                    }
                });

                if($.common.isNotEmpty(panelUrl)){
            		$('.menuTab[data-id="' + panelUrl + '"]').addClass('active').siblings('.menuTab').removeClass('active');
            		$('.mainContent .illeesam_iframe').each(function() {
                        if ($(this).data('id') == panelUrl) {
                            $(this).show().siblings('.illeesam_iframe').hide();
                            return false;
                        }
                    });
            	}
            }
        }
        // 현재 요소가 에 없습니다.활동상태
        else {
            //  제거 현재텝
            $(this).parents('.menuTab').remove();

            // 제거 해당 탭에 해당하는 콘텐츠 영역
            $('.mainContent .illeesam_iframe').each(function() {
                if ($(this).data('id') == closeTabId) {
                    $(this).remove();
                    return false;
                }
            });
        }
        scrollToTab($('.menuTab.active'));
        syncMenuTab($('.page-tabs-content').find('.active').attr('data-id'));
        return false;
    }

    $('.menuTabs').on('click', '.menuTab i', closeTab);

    //활성화된 스텝으로 스크롤
    function showActiveTab() {
        scrollToTab($('.menuTab.active'));
    }
    $('.tabShowActive').on('click', showActiveTab);

    // 클릭텝메뉴
    function activeTab() {
        if (!$(this).hasClass('active')) {
            var currentId = $(this).data('id');
            syncMenuTab(currentId);
            // 탭에 해당하는 콘텐츠 영역 표시
            $('.mainContent .illeesam_iframe').each(function() {
                if ($(this).data('id') == currentId) {
                    $(this).show().siblings('.illeesam_iframe').hide();
                    return false;
                }
            });
            $(this).addClass('active').siblings('.menuTab').removeClass('active');
            scrollToTab(this);
        }
    }

    // 클릭텝메뉴
    $('.menuTabs').on('click', '.menuTab', activeTab);

    // 새로고침iframe
    function refreshTab() {
    	var currentId = $('.page-tabs-content').find('.active').attr('data-id');
    	var target = $('.illeesam_iframe[data-id="' + currentId + '"]');
        var url = target.attr('src');
    	target.attr('src', url).ready();
    }

    // 페이지전체화면
    function fullScreenTab() {
    	var currentId = $('.page-tabs-content').find('.active').attr('data-id');
    	var target = $('.illeesam_iframe[data-id="' + currentId + '"]');
    	target.fullScreen(true);
    }

    // 현재닫기텝
    function tabCloseCurrent() {
    	$('.page-tabs-content').find('.active i').trigger("click");
    }

    //기타닫기텝
    function tabCloseOther() {
        $('.page-tabs-content').children("[data-id]").not(":first").not(".active").each(function() {
            $('.illeesam_iframe[data-id="' + $(this).data('id') + '"]').remove();
            $(this).remove();
        });
        $('.page-tabs-content').animate({ marginLeft: '0px' }, "fast");
    }

    // 닫기전체텝
    function tabCloseAll() {
    	$('.page-tabs-content').children("[data-id]").not(":first").each(function() {
            $('.illeesam_iframe[data-id="' + $(this).data('id') + '"]').remove();
            $(this).remove();
        });
        $('.page-tabs-content').children("[data-id]:first").each(function() {
            $('.illeesam_iframe[data-id="' + $(this).data('id') + '"]').show();
            $(this).addClass("active");
        });
        $('.page-tabs-content').css("margin-left", "0");
        syncMenuTab($('.page-tabs-content').find('.active').attr('data-id'));
    }


    // 전체화면표시
    $('#fullScreen').on('click', function () {
    	$(document).toggleFullScreen();
    });
    
    // 잠금화면
    $('#lockScreen').on('click', function () {
    	storage.set('lockPath', $('.page-tabs-content').find('.active').attr('data-id'));
    	location.href  = ctx + "lockscreen";
    });

    // 페이지새로고침버튼
    $('.tabReload').on('click', refreshTab);

    // 페이지전체화면버튼
    $('.tabFullScreen').on('click', fullScreenTab);

    // 더블클릭텝전체화면표시
    $('.menuTabs').on('dblclick', '.menuTab', activeTabMax);

    // 좌측이동버튼
    $('.tabLeft').on('click', scrollTabLeft);

    // 우측이동버튼
    $('.tabRight').on('click', scrollTabRight);

    // 현재닫기
    $('.tabCloseCurrent').on('click', tabCloseCurrent);

    // 기타닫기
    $('.tabCloseOther').on('click', tabCloseOther);

    // 닫기전체
    $('.tabCloseAll').on('click', tabCloseAll);

    // tab전체화면표시
    $('.tabMaxCurrent').on('click', function () {
        $('.page-tabs-content').find('.active').trigger("dblclick");
    });

    // 전체 화면 닫기
    $('#ax_close_max').click(function(){
    	$('#content-main').toggleClass('max');
    	$('#ax_close_max').hide();
    })

    // 더블클릭텝전체화면표시
    function activeTabMax() {
        $('#content-main').toggleClass('max');
        $('#ax_close_max').show();
    }

    $(window).keydown(function(event) {
        if (event.keyCode == 27) {
            $('#content-main').removeClass('max');
            $('#ax_close_max').hide();
        }
    });

    window.onhashchange = function() {
        var hash = location.hash;
        var url = hash.substring(1, hash.length);
        $('a[href$="' + url + '"]').click();
    };

    // 우클릭 메뉴 구현
    $.contextMenu({
        selector: ".menuTab",
        trigger: 'right',
        autoHide: true,
        items: {
            "close_current": {
                name: "현재닫기",
                icon: "fa-close",
                callback: function(key, opt) {
                    opt.$trigger.find('i').trigger("click");
                }
            },
            "close_other": {
                name: "기타닫기",
                icon: "fa-window-close-o",
                callback: function(key, opt) {
                    setActiveTab(this);
                    tabCloseOther();
                }
            },
            "close_left": {
                name: "좌측닫기",
                icon: "fa-reply",
                callback: function(key, opt) {
                    setActiveTab(this);
                    this.prevAll('.menuTab').not(":last").each(function() {
                        if ($(this).hasClass('active')) {
                            setActiveTab(this);
                        }
                        $('.illeesam_iframe[data-id="' + $(this).data('id') + '"]').remove();
                        $(this).remove();
                    });
                    $('.page-tabs-content').animate({ marginLeft: '0px' }, "fast");
                }
            },
            "close_right": {
                name: "우측닫기",
                icon: "fa-share",
                callback: function(key, opt) {
                    setActiveTab(this);
                    this.nextAll('.menuTab').each(function() {
                        $('.illeesam_iframe[data-id="' + $(this).data('id') + '"]').remove();
                        $(this).remove();
                    });
                }
            },
            "close_all": {
                name: "전체닫기",
                icon: "fa-window-close",
                callback: function(key, opt) {
                    tabCloseAll();
                }
            },
            "step": "---------",
            "full": {
                name: "전체화면",
                icon: "fa-arrows-alt",
                callback: function(key, opt) {
                    setActiveTab(this);
                    var target = $('.illeesam_iframe[data-id="' + this.data('id') + '"]');
                    target.fullScreen(true);
                }
            },
            "refresh": {
                name: "페이지새로고침",
                icon: "fa-refresh",
                callback: function(key, opt) {
                    setActiveTab(this);
                    var target = $('.illeesam_iframe[data-id="' + this.data('id') + '"]');
                    var url = target.attr('src');
                    $.modal.loading("데이터로딩중,기다리세요...");
                    target.attr('src', url).on('load', function() {
                    	$.modal.closeLoading();
                    });
                }
            },
            "open": {
                name: "팝업열기",
                icon: "fa-link",
                callback: function(key, opt) {
                    var target = $('.illeesam_iframe[data-id="' + this.data('id') + '"]');
                    window.open(target.attr('src'));
                }
            },
        }
    });
});
