/**
 * 공통방법패키지 처리
 * Copyright (c) 2019 admin 
 */

var startLayDate;
var endLayDate;
$(function() {
	
    //  layer확장皮肤
    if (window.layer !== undefined) {
        layer.config({
            extend: 'moon/style.css',
            skin: 'layer-ext-moon'
        });
    }
	
    // 뒤맨위묶다
    if ($.fn.toTop !== undefined) {
        $('#scroll-up').toTop();
    }
	
    // select2checkbox이벤트묶다
    if ($.fn.select2 !== undefined) {
        $.fn.select2.defaults.set( "theme", "bootstrap" );
        $("select.form-control:not(.noselect2)").each(function () {
            $(this).select2().on("change", function () {
                $(this).valid();
            })
        })
    }
	
    // iCheckradio及checkbox이벤트묶다
    if ($.fn.iCheck !== undefined) {
        $(".check-box:not(.noicheck),.radio-box:not(.noicheck)").each(function() {
            $(this).iCheck({
                checkboxClass: 'icheckbox-blue',
                radioClass: 'iradio-blue',
            })
        })
    }
	
    // 취소回车자동양식 제출
    $(document).on("keypress", ":input:not(textarea):not([type=submit])", function(event) {
        if (event.keyCode == 13) {
            event.preventDefault();
        }
    });
	 
    // laydate 시간통제수단묶다
    if ($(".select-time").length > 0) {
       layui.use('laydate', function() {
            var laydate = layui.laydate;
            startLayDate = laydate.render({
                elem: '#startTime',
                max: $('#endTime').val(),
                theme: 'molv',
                type: $('#startTime').attr("data-type") || 'date',
                trigger: 'click',
                done: function(value, date) {
                    // 종료시간이상시작시간
                    if (value !== '') {
                        endLayDate.config.min.year = date.year;
                        endLayDate.config.min.month = date.month - 1;
                        endLayDate.config.min.date = date.date;
                    } else {
                        endLayDate.config.min.year = '';
                        endLayDate.config.min.month = '';
                        endLayDate.config.min.date = '';
                    }
                }
            });
            endLayDate = laydate.render({
                elem: '#endTime',
                min: $('#startTime').val(),
                theme: 'molv',
                type: $('#endTime').attr("data-type") || 'date',
                trigger: 'click',
                done: function(value, date) {
                    // 시작시간미만종료시간
                    if (value !== '') {
                        startLayDate.config.max.year = date.year;
                        startLayDate.config.max.month = date.month - 1;
                        startLayDate.config.max.date = date.date;
                    } else {
                        startLayDate.config.max.year = '2099';
                        startLayDate.config.max.month = '12';
                        startLayDate.config.max.date = '31';
                    }
                }
            });
        });
    }
	
    // laydate time-input 시간통제수단묶다
    if ($(".time-input").length > 0) {
        layui.use('laydate', function () {
            var com = layui.laydate;
            $(".time-input").each(function (index, item) {
                var time = $(item);
                // 제어통제수단外观
                var type = time.attr("data-type") || 'date';
                // 제어에코체재
                var format = time.attr("data-format") || 'yyyy-MM-dd';
                // 제어datetime버튼
                var buttons = time.attr("data-btn") || 'clear|now|confirm', newBtnArr = [];
                // datetime 선택 마치다后콜백다루다
                var callback = time.attr("data-callback") || {};
                if (buttons) {
                    if (buttons.indexOf("|") > 0) {
                        var btnArr = buttons.split("|"), btnLen = btnArr.length;
                        for (var j = 0; j < btnLen; j++) {
                            if ("clear" === btnArr[j] || "now" === btnArr[j] || "confirm" === btnArr[j]) {
                                newBtnArr.push(btnArr[j]);
                            }
                        }
                    } else {
                        if ("clear" === buttons || "now" === buttons || "confirm" === buttons) {
                            newBtnArr.push(buttons);
                        }
                    }
                } else {
                    newBtnArr = ['clear', 'now', 'confirm'];
                }
                com.render({
                    elem: item,
                    theme: 'molv',
                    trigger: 'click',
                    type: type,
                    format: format,
                    btns: newBtnArr,
                    done: function (value, data) {
                        if (typeof window[callback] != 'undefined'
                            && window[callback] instanceof Function) {
                            window[callback](value, data);
                        }
                    }
                });
            });
        });
    }
	
    // tree 키워드검색묶다
    if ($("#keyword").length > 0) {
        $("#keyword").bind("focus", function focusKey(e) {
            if ($("#keyword").hasClass("empty")) {
                $("#keyword").removeClass("empty");
            }
        }).bind("blur", function blurKey(e) {
            if ($("#keyword").val() === "") {
                $("#keyword").addClass("empty");
            }
            $.tree.searchNode(e);
        }).bind("input propertychange", $.tree.searchNode);
    }
	
    // tree시트트리 확장/축소
    var expandFlag;
    $("#expandAllBtn").click(function() {
        var dataExpand = $.common.isEmpty(table.options.expandAll) ? true : table.options.expandAll;
        expandFlag = $.common.isEmpty(expandFlag) ? dataExpand : expandFlag;
        if (!expandFlag) {
            $.bttTable.bootstrapTreeTable('expandAll');
        } else {
            $.bttTable.bootstrapTreeTable('collapseAll');
        }
        expandFlag = expandFlag ? false: true;
    })
	
    // 按下ESC버튼닫기테이블
    $('body', document).on('keyup', function(e) {
        if (e.which === 27) {
            $.modal.closeAll();
        }
    });
});

(function ($) {
    'use strict';
    $.fn.toTop = function(opt) {
        var elem = this;
        var win = (opt && opt.hasOwnProperty('win')) ? opt.win : $(window);
        var doc = (opt && opt.hasOwnProperty('doc')) ? opt.doc : $('html, body');
        var options = $.extend({
            autohide: true,
            offset: 50,
            speed: 500,
            position: true,
            right: 15,
            bottom: 5
        }, opt);
        elem.css({
            'cursor': 'pointer'
        });
        if (options.autohide) {
            elem.css('display', 'none');
        }
        if (options.position) {
            elem.css({
                'position': 'fixed',
                'right': options.right,
                'bottom': options.bottom,
            });
        }
        elem.click(function() {
            doc.animate({
                scrollTop: 0
            }, options.speed);
        });
        win.scroll(function() {
            var scrolling = win.scrollTop();
            if (options.autohide) {
                if (scrolling > options.offset) {
                    elem.fadeIn(options.speed);
                } else elem.fadeOut(options.speed);
            }
        });
    };
})(jQuery);

/** 새로 고침 탭 */
var refreshItem = function(){
    var topWindow = $(window.parent.document);
    var currentId = $('.page-tabs-content', topWindow).find('.active').attr('data-id');
    var target = $('.illeesam_iframe[data-id="' + currentId + '"]', topWindow);
    var url = target.attr('src');
    target.attr('src', url).ready();
}

/** 탭 닫기 */
var closeItem = function(dataId){
	var topWindow = $(window.parent.document);
	if($.common.isNotEmpty(dataId)){
	    window.parent.$.modal.closeLoading();
	    // dataId닫기명세텝
	    $('.menuTab[data-id="' + dataId + '"]', topWindow).remove();
	    // 제거 해당 탭에 해당하는 콘텐츠 영역
	    $('.mainContent .illeesam_iframe[data-id="' + dataId + '"]', topWindow).remove();
	    return;
	}
	var panelUrl = window.frameElement.getAttribute('data-panel');
	$('.page-tabs-content .active i', topWindow).click();
	if($.common.isNotEmpty(panelUrl)){
	    $('.menuTab[data-id="' + panelUrl + '"]', topWindow).addClass('active').siblings('.menuTab').removeClass('active');
	    $('.mainContent .illeesam_iframe', topWindow).each(function() {
	        if ($(this).data('id') == panelUrl) {
	            $(this).show().siblings('.illeesam_iframe').hide();
	            return false;
            }
        });
    }
}

/** 탭 만들기 */
function createMenuItem(dataUrl, menuName, isRefresh) {
    var panelUrl = window.frameElement.getAttribute('data-id'),
    dataIndex = $.common.random(1, 100),
    flag = true;
    if (dataUrl == undefined || $.trim(dataUrl).length == 0) return false;
    var topWindow = $(window.parent.document);
    // 텝메뉴존재
    $('.menuTab', topWindow).each(function() {
        if ($(this).data('id') == dataUrl) {
            if (!$(this).hasClass('active')) {
                $(this).addClass('active').siblings('.menuTab').removeClass('active');
                scrollToTab(this);
                $('.page-tabs-content').animate({ marginLeft: ""}, "fast");
                // 탭에 해당하는 콘텐츠 영역 표시
                $('.mainContent .illeesam_iframe', topWindow).each(function() {
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
        var str = '<a href="javascript:;" class="active menuTab noactive" data-id="' + dataUrl + '" data-panel="' + panelUrl + '">' + menuName + ' <i class="fa fa-times-circle"></i></a>';
        $('.menuTab', topWindow).removeClass('active');

        // 추가접근에 해당하는 iframe
        var str1 = '<iframe class="illeesam_iframe" name="iframe' + dataIndex + '" width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" data-panel="' + panelUrl + '" seamless></iframe>';
        $('.mainContent', topWindow).find('iframe.illeesam_iframe').hide().parents('.mainContent').append(str1);
        
        window.parent.$.modal.loading("데이터로딩중,기다리세요...");
        $('.mainContent iframe:visible', topWindow).on('load', function() {
            window.parent.$.modal.closeLoading();
        });

        // 추가텝
        $('.menuTabs .page-tabs-content', topWindow).append(str);
        scrollToTab($('.menuTab.active', topWindow));
    }
    return false;
}

// 새로고침iframe
function refreshTab() {
	var topWindow = $(window.parent.document);
	var currentId = $('.page-tabs-content', topWindow).find('.active').attr('data-id');
	var target = $('.illeesam_iframe[data-id="' + currentId + '"]', topWindow);
    var url = target.attr('src');
	target.attr('src', url).ready();
}

// 명세 탭으로 스크롤
function scrollToTab(element) {
    var topWindow = $(window.parent.document);
    var marginLeftVal = calSumWidth($(element).prevAll()),
    marginRightVal = calSumWidth($(element).nextAll());
    // 보이는 영역이 아니다.tab너비
    var tabOuterWidth = calSumWidth($(".content-tabs", topWindow).children().not(".menuTabs"));
    //가시 영역tab너비
    var visibleWidth = $(".content-tabs", topWindow).outerWidth(true) - tabOuterWidth;
    //실제스크롤너비
    var scrollVal = 0;
    if ($(".page-tabs-content", topWindow).outerWidth() < visibleWidth) {
        scrollVal = 0;
    } else if (marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
        if ((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
            scrollVal = marginLeftVal;
            var tabElement = element;
            while ((scrollVal - $(tabElement).outerWidth()) > ($(".page-tabs-content", topWindow).outerWidth() - visibleWidth)) {
                scrollVal -= $(tabElement).prev().outerWidth();
                tabElement = $(tabElement).prev();
            }
        }
    } else if (marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
        scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
    }
    $('.page-tabs-content', topWindow).animate({ marginLeft: 0 - scrollVal + 'px' }, "fast");
}

// 요소 컬렉션의 전체 너비를 계산합니다.
function calSumWidth(elements) {
    var width = 0;
    $(elements).each(function() {
        width += $(this).outerWidth(true);
    });
    return width;
}

// 현재 활성 탭 페이지와 연결된 iframe의 Windows 개체를 반환합니다.
function activeWindow() {
	var topWindow = $(window.parent.document);
	var currentId = $('.page-tabs-content', topWindow).find('.active').attr('data-id');
	if (!currentId) {
		return window.parent;
	}
    return $('.illeesam_iframe[data-id="' + currentId + '"]', topWindow)[0].contentWindow;
}

/** 비밀번호규칙 범위 유효성 검사 */
function checkpwd(chrtype, password) {
    if (chrtype == 1) {
        if(!$.common.numValid(password)){
            $.modal.alertWarning("비밀번호0~9자리만 가능");
            return false;
        }
    } else if (chrtype == 2) {
        if(!$.common.enValid(password)){
            $.modal.alertWarning("비밀번호 문자 a-z 및 A-Z만");
            return false;
        }
    } else if (chrtype == 3) {
        if(!$.common.enNumValid(password)){
            $.modal.alertWarning("비밀번호및 문자와 숫자가 있어야 합니다.");
            return false;
        }
    } else if (chrtype == 4) {
        if(!$.common.charValid(password)){
            $.modal.alertWarning("비밀번호및 문자, 숫자 및 특수 기호가 있어야 합니다.<font color='red'>~!@#$%^&*()-=_+</font>");
            return false;
        }
    }
    return true;
}

// 로그인쇄패키지 처리
var log = {
    log: function(msg) {
        console.log(msg);
    },
    info: function(msg) {
        console.info(msg);
    },
    warn: function(msg) {
        console.warn(msg);
    },
    error: function(msg) {
        console.error(msg);
    }
};

// 로컬 캐시다루다
var storage = {
    set: function(key, value) {
        window.localStorage.setItem(key, value);
    },
    get: function(key) {
        return window.localStorage.getItem(key);
    },
    remove: function(key) {
        window.localStorage.removeItem(key);
    },
    clear: function() {
        window.localStorage.clear();
    }
};

// sub테이블운영패키지 처리
var sub = {
    editColumn: function() {
    	var dataColumns = [];
		for (var columnIndex = 0; columnIndex < table.options.columns.length; columnIndex++) {
    		if (table.options.columns[columnIndex].visible != false) {
    			dataColumns.push(table.options.columns[columnIndex]);
    		}
    	}
		var params = new Array();
		var data = $("#" + table.options.id).bootstrapTable('getData');
    	var count = data.length;
    	for (var dataIndex = 0; dataIndex < count; dataIndex++) {
    	    var columns = $('#' + table.options.id + ' tr[data-index="' + dataIndex + '"] td');
    	    var obj = new Object();
    	    for (var i = 0; i < columns.length; i++) {
    	        var inputValue = $(columns[i]).find('input');
    	        var selectValue = $(columns[i]).find('select');
    	        var textareaValue = $(columns[i]).find('textarea');
    	        var key = dataColumns[i].field;
    	        if ($.common.isNotEmpty(inputValue.val())) {
    	            obj[key] = inputValue.val();
    	        } else if ($.common.isNotEmpty(selectValue.val())) {
    	            obj[key] = selectValue.val();
    	        } else if ($.common.isNotEmpty(textareaValue.val())) {
    	            obj[key] = textareaValue.val();
    	        } else {
    	            obj[key] = "";
    	        }
    	    }
    	    var item = data[dataIndex];
    	    var extendObj = $.extend({}, item, obj);
    	    params.push({ index: dataIndex, row: extendObj });
    	}
    	$("#" + table.options.id).bootstrapTable("updateRow", params);
    },
    delColumn: function(column) {
    	sub.editColumn();
    	var subColumn = $.common.isEmpty(column) ? "index" : column;
    	var ids = $.table.selectColumns(subColumn);
        if (ids.length == 0) {
            $.modal.alertWarning("하나 이상의 레코드를 선택하십시오");
            return;
        }
        $("#" + table.options.id).bootstrapTable('remove', { field: subColumn, values: ids });
    },
    addColumn: function(row, tableId) {
    	var currentId = $.common.isEmpty(tableId) ? table.options.id : tableId;
    	table.set(currentId);
    	var count = $("#" + currentId).bootstrapTable('getData').length;
    	sub.editColumn();
    	$("#" + currentId).bootstrapTable('insertRow', {
            index: count + 1,
            row: row
        });
    }
};

// 동적加载css파일
function loadCss(file, headElem) {
    var link = document.createElement('link');
    link.href = file;
    link.rel = 'stylesheet';
    link.type = 'text/css';
    if (headElem) headElem.appendChild(link);
    else document.getElementsByTagName('head')[0].appendChild(link);
}

// 동적加载js파일
function loadJs(file, headElem) {
    var script = document.createElement('script');
    script.src = file;
    script.type = 'text/javascript';
    if (headElem) headElem.appendChild(script);
    else document.getElementsByTagName('head')[0].appendChild(script);
}

// 뒤로 키 비활성화(Backspace)
window.onload = function() {
	document.getElementsByTagName("body")[0].onkeydown = function() {
		// get이벤트Object  
		var elem = event.relatedTarget || event.srcElement || event.target || event.currentTarget;
		// 키는 backSpace 키입니다.  
		if (event.keyCode == 8) {
			// 아이디어가 키보드에서 이벤트 기본 전달을 방지해야 합니까?  
			var name = elem.nodeName;
			var className = elem.className;
			// 특정 블록스타일명
			if (className.indexOf('note-editable') != -1)
			{
				return true;
			}
			if (name != 'INPUT' && name != 'TEXTAREA') {
				return _stopIt(event);
			}
			var type_e = elem.type.toUpperCase();
			if (name == 'INPUT' && (type_e != 'TEXT' && type_e != 'TEXTAREA' && type_e != 'PASSWORD' && type_e != 'FILE' && type_e != 'SEARCH' && type_e != 'NUMBER' && type_e != 'EMAIL')) {
				return _stopIt(event);
			}
			if (name == 'INPUT' && (elem.readOnly == true || elem.disabled == true)) {
				return _stopIt(event);
			}
		}
	};
};
function _stopIt(e) {
	if (e.returnValue) {
		e.returnValue = false;
	}
	if (e.preventDefault) {
		e.preventDefault();
	}
	return false;
}

/** 전역 Ajax 처리 설정 */
$.ajaxSetup({
    complete: function(XMLHttpRequest, textStatus) {
        if (textStatus == 'timeout') {
            $.modal.alertWarning("제공시간 초과,기다리세요다시 시도하십시오!");
            $.modal.enable();
            $.modal.closeLoading();
        } else if (textStatus == "parsererror" || textStatus == "error") {
            $.modal.alertWarning("제공器오류,제발연결관리자!");
            $.modal.enable();
            $.modal.closeLoading();
        }
    }
});
