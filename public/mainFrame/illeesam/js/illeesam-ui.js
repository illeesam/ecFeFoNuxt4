/**
 * 일반 js 메소드 캡슐화 처리
 * Copyright (c) 2019 admin
 */

// 현재table관련정보
var table = {
    config: {},
    // 현재예시구성
    options: {},
    // 설정예시구성
    set: function(id) {
        if($.common.getLength(table.config) > 1 && $.common.isNotEmpty(event)) {
            var tableId = $.common.isEmpty(id) ? $(event.currentTarget).parents(".bootstrap-table").find("table.table").attr("id") : id;
            if ($.common.isNotEmpty(tableId)) {
                table.options = table.get(tableId);
            }
        }
    },
    // get예시구성
    get: function(id) {
        return table.config[id];
    },
    // 기억  선택 예시그룹
    rememberSelecteds: {},
    // 기억  선택 ID그룹
    rememberSelectedIds: {}
};

(function ($) {
    $.extend({
        _tree: {},
        bttTable: {},
        // 시트패키지 처리
        table: {
            // 초기화시트설정
            init: function(options) {
                var defaults = {
                    id: "bootstrap-table",
                    type: 0, // 0 대표bootstrapTable 1대표bootstrapTreeTable
                    method: 'post',
                    height: undefined,
                    sidePagination: "server",
                    sortName: undefined,
                    sortOrder: "asc",
                    pagination: true,
                    paginationLoop: false,
                    pageSize: 10,
                    pageNumber: 1,
                    pageList: [5, 10, 20, 30, 50, 100, 200, 500],
                    toolbar: "toolbar",
                    loadingFontSize: 13,
                    striped: false,
                    escape: false,
                    firstLoad: true,
                    showFooter: false,
                    search: false,
                    showSearch: true,
                    showPageGo: false,
                    showRefresh: true,
                    showColumns: true,
                    showToggle: true,
                    showExport: false,
                    showPrint: false,
                    exportDataType: 'all',
                    exportTypes: ['csv', 'txt', 'doc', 'excel'],
                    clickToSelect: false,
                    singleSelect: false,
                    mobileResponsive: true,
                    maintainSelected: false,
                    rememberSelected: false,
                    fixedColumns: false,
                    fixedNumber: 0,
                    fixedRightNumber: 0,
                    queryParams: $.table.queryParams,
                    rowStyle: undefined
                };
                var options = $.extend(defaults, options);
                table.options = options;
                table.config[options.id] = options;
                $.table.initEvent();
                $('#' + options.id).bootstrapTable({
                    id: options.id,
                    url: options.url,                                   // 요청backend的URL(*)
                    contentType: "application/x-www-form-urlencoded",   // 코딩유형
                    method: options.method,                             // 요청 메서드(*)
                    cache: false,                                       // 사용여부캐시
                    height: options.height,                             // 테이블의 높이
                    striped: options.striped,                           // 표시할지 여부행간격色
                    sortable: true,                                     // 여부 활성종류
                    sortStable: true,                                   // 설정为 true 将获得稳定的종류
                    sortName: options.sortName,                         // 열 정렬명
                    sortOrder: options.sortOrder,                       // 종류유형  asc 또는 desc
                    pagination: options.pagination,                     // 표시할지 여부페이지(*)
                    paginationLoop: options.paginationLoop,             // 여부 활성페이지条없는限주기的함수
                    pageNumber: 1,                                      // 초기화 첫페이지,기본첫페이지
                    pageSize: options.pageSize,                         // 모든페이지的기록 행숫자(*) 
                    pageList: options.pageList,                         // 사용가능 선택 的모든페이지 수행숫자(*)
                    firstLoad: options.firstLoad,                       // 여부 첫번째요청데이터 다운로드,~을위한데이터较大할 수있다구성false
                    escape: options.escape,                             // 탈출HTML캐릭터串
                    showFooter: options.showFooter,                     // 표시할지 여부表尾
                    iconSize: 'outline',                                // icon크기:undefined기본的버튼크기 xs超小버튼sm小버튼lg큰버튼
                    toolbar: '#' + options.toolbar,                     // 명세工作栏
                    loadingFontSize: options.loadingFontSize,           // 사용자정의加载텍스트的폰트크기
                    sidePagination: options.sidePagination,             // server활성제공端페이지client고객端페이지
                    search: options.search,                             // 여부 검색란표시框함수
                    searchText: options.searchText,                     // 검색框초기보여줌的콘텐츠,기본비었다
                    showSearch: options.showSearch,                     // 표시할지 여부검색정보
                    showPageGo: options.showPageGo,                     // 표시할지 여부도약페이지
                    showRefresh: options.showRefresh,                   // 표시할지 여부새로고침버튼
                    showColumns: options.showColumns,                   // 표시할지 여부숨김某목록select
                    showToggle: options.showToggle,                     // 표시할지 여부상세보다 그리고 목록보다的토글버튼
                    showExport: options.showExport,                     // 여부 지원export파일
                    showPrint: options.showPrint,                       // 여부 지원인쇄페이지
                    showHeader: options.showHeader,                     // 표시할지 여부머리글
                    showFullscreen: options.showFullscreen,             // 표시할지 여부전체화면버튼
                    uniqueId: options.uniqueId,                         // 오직的심벌마크符
                    clickToSelect: options.clickToSelect,               // 여부 활성클릭체크행
                    singleSelect: options.singleSelect,                 // 여부 라디오checkbox
                    mobileResponsive: options.mobileResponsive,         // 여부 지원이동端적응
                    cardView: options.cardView,                         // 여부 활성카드 보기 표시
                    detailView: options.detailView,                     // 여부 활성보여줌세부사항보다
                    onCheck: options.onCheck,                           // 当 선택 此행时이벤트
                    onUncheck: options.onUncheck,                       // 当취소此행时이벤트
                    onCheckAll: options.onCheckAll,                     // 当모든선택행时이벤트
                    onUncheckAll: options.onUncheckAll,                 // 当취소모든선택행时이벤트
                    onClickRow: options.onClickRow,                     // 클릭라인이벤트的이벤트
                    onDblClickRow: options.onDblClickRow,               // 더블클릭라인이벤트的이벤트
                    onClickCell: options.onClickCell,                   // 클릭그리드이벤트的이벤트
                    onDblClickCell: options.onDblClickCell,             // 더블클릭그리드이벤트的이벤트
                    onEditableSave: options.onEditableSave,             // 행内수정저장的이벤트
                    onExpandRow: options.onExpandRow,                   // 클릭상세보다的이벤트
                    onPostBody: options.onPostBody,                     // 적용마치다后구현的이벤트
                    maintainSelected: options.maintainSelected,         // 프런트 엔드페이지넘김时예약所选행
                    rememberSelected: options.rememberSelected,         // 활성페이지넘김기억 앞面的 선택 
                    fixedColumns: options.fixedColumns,                 // 여부 활성冻结목록(왼쪽)
                    fixedNumber: options.fixedNumber,                   // 목록冻结的个숫자(왼쪽)
                    fixedRightNumber: options.fixedRightNumber,         // 목록冻结的个숫자(오른쪽)
                    onReorderRow: options.onReorderRow,                 // 드래그 완료 시 핸들러 기능
                    queryParams: options.queryParams,                   // 옮기다설정(*)
                    rowStyle: options.rowStyle,                         // 사용자정의함수설정행스타일
                    footerStyle: options.footerStyle,                   // 사용자정의함수설정페이지脚스타일
                    headerStyle: options.headerStyle,                   // 사용자정의함수설정제목스타일
                    columns: options.columns,                           // 보여줌목록정보(*)
                    data: options.data,                                 // 被加载
                    responseHandler: $.table.responseHandler,           // 로딩제공器send오다데이터전에핸들러 함수
                    onLoadSuccess: $.table.onLoadSuccess,               // 모든 데이터가 로드되면 핸들러를 트리거합니다.
                    exportOptions: options.exportOptions,               // 프런트 엔드export소홀히목록索引
                    exportDataType: options.exportDataType,             // export유형(기본all:export모든데이터;basic:export현재페이지;selected:export체크)
                    exportTypes: options.exportTypes,                   // export파일유형 (json,xml,png,csv,txt,sql,doc,excel,xlsx,powerpoint,pdf)
                    printPageBuilder: options.printPageBuilder,         // 사용자정의인쇄페이지테마
                    detailFormatter: options.detailFormatter,           // 在행下面전시다른데이터목록
                });
            },
            // get예시ID,如존재다수의반환#id1,#id2 delimeter구분자
            getOptionsIds: function(separator) {
                var _separator = $.common.isEmpty(separator) ? "," : separator;
                var optionsIds = "";  
                $.each(table.config, function(key, value){
                    optionsIds += "#" + key + _separator;
                });
                return optionsIds.substring(0, optionsIds.length - 1);
            },
            // 테이블 조회
            queryParams: function(params) {
                table.set();
                var curParams = {
                    // 옮기다설정조회파라메터
                    pageSize:       params.limit,
                    pageNum:        params.offset / params.limit + 1,
                    searchValue:    params.search,
                    orderByColumn:  params.sort,
                    isAsc:          params.order
                };
                var currentId = $.common.isEmpty(table.options.formId) ? $('form').attr('id') : table.options.formId;
                return $.extend(curParams, $.common.formToJSON(currentId)); 
            },
            // 요청get데이터后다루다콜백
            responseHandler: function(res) {
                if (typeof table.get(this.id).responseHandler == "function") {
                    table.get(this.id).responseHandler(res);
                }
                if (res.code == web_status.SUCCESS) {
                    if ($.common.isNotEmpty(table.options.sidePagination) && table.options.sidePagination == 'client') {
                        return res.rows;
                    } else {
                        if ($.common.isNotEmpty(table.options.rememberSelected) && table.options.rememberSelected) {
                            var column = $.common.isEmpty(table.options.uniqueId) ? table.options.columns[1].field : table.options.uniqueId;
                            $.each(res.rows, function(i, row) {
                                row.state = $.inArray(row[column], table.rememberSelectedIds[table.options.id]) !== -1;
                            })
                        }
                        return { rows: res.rows, total: res.total };
                    }
                } else {
                    $.modal.alertWarning(res.msg);
                    return { rows: [], total: 0 };
                }
            },
            // 초기화이벤트
            initEvent: function() {
                // 예시ID정보
                var optionsIds = $.table.getOptionsIds();
                // 감독听이벤트다루다
                $(optionsIds).on(TABLE_EVENTS, function () {
                    table.set($(this).attr("id"));
                });
                // 在시트体적용마치다,并在 DOM 中可见后이벤트(이벤트)
                $(optionsIds).on("post-body.bs.table", function (e, args) {
                    // 浮动툴팁특수 효과
                    $(".table [data-toggle='tooltip']").tooltip();
                    // 임시팝업창특수 효과
                    $('.table [data-toggle="popover"]').popover();
                });
                // 체크,취소,전체체크,전체취소(이벤트)
                $(optionsIds).on("check.bs.table check-all.bs.table uncheck.bs.table uncheck-all.bs.table", function (e, rowsAfter, rowsBefore) {
                    // checkbox페이지예약저장선택한IDs
                    var rows = $.common.equals("uncheck-all", e.type) ? rowsBefore : rowsAfter;
                    var rowIds = $.table.affectedRowIds(rows);
                    if ($.common.isNotEmpty(table.options.rememberSelected) && table.options.rememberSelected) {
                        func = $.inArray(e.type, ['check', 'check-all']) > -1 ? 'union' : 'difference';
                        var selectedIds = table.rememberSelectedIds[table.options.id];
                        if($.common.isNotEmpty(selectedIds)) {
                            table.rememberSelectedIds[table.options.id] = _[func](selectedIds, rowIds);
                        } else {
                            table.rememberSelectedIds[table.options.id] = _[func]([], rowIds);
                        }
                        var selectedRows = table.rememberSelecteds[table.options.id];
                        if($.common.isNotEmpty(selectedRows)) {
                            table.rememberSelecteds[table.options.id] = _[func](selectedRows, rows);
                        } else {
                            table.rememberSelecteds[table.options.id] = _[func]([], rows);
                        }
                    }
                });
                // 加载성공,체크,취소,전체체크,전체취소(이벤트)
                $(optionsIds).on("check.bs.table uncheck.bs.table check-all.bs.table uncheck-all.bs.table load-success.bs.table", function () {
                    var toolbar = table.options.toolbar;
                    var uniqueId = table.options.uniqueId;
                    // 도구 모음 버튼제어
                    var rows = $.common.isEmpty(uniqueId) ? $.table.selectFirstColumns() : $.table.selectColumns(uniqueId);
                    // 다중여부
                    $('#' + toolbar + ' .multiple').toggleClass('disabled', !rows.length);
                    // 단독여부
                    $('#' + toolbar + ' .single').toggleClass('disabled', rows.length!=1);
                });
                // 그림미리보기이벤트
                $(optionsIds).off("click").on("click", '.img-circle', function() {
                    var src = $(this).attr('src');
                    var target = $(this).data('target');
                    if($.common.equals("self", target)) {
                        var height = $(this).data('height');
                        var width = $(this).data('width');
                        top.layer.open({
                            title: false,
                            type: 1,
                            closeBtn: true,
                            shadeClose: true,
                            area: ['auto', 'auto'],
                            content: "<img src='" + src + "' height='" + height + "' width='" + width + "'/>"
                        });
                    } else if ($.common.equals("blank", target)) {
                        window.open(src);
                    }
                });
                // 클릭tooltip이벤트
                $(optionsIds).on("click", '.tooltip-show', function() {
                    var target = $(this).data('target');
                    var input = $(this).prev();
                    if ($.common.equals("copy", target)) {
                        input.select();
                        document.execCommand("copy");
                    } else if ($.common.equals("open", target)) {
                        top.layer.alert(input.val(), {
                            title: "메시지 내용",
                            shadeClose: true,
                            btn: ['확인 '],
                            btnclass: ['btn btn-primary'],
                        });
                    }
                });
            },
            // 当모든데이터로드될 때 발생
            onLoadSuccess: function(data) {
                if (typeof table.options.onLoadSuccess == "function") {
                    table.options.onLoadSuccess(data);
                }
            },
            // 시트제거
            destroy: function (tableId) {
                var currentId = $.common.isEmpty(tableId) ? table.options.id : tableId;
                $("#" + currentId).bootstrapTable('destroy');
                delete table.rememberSelectedIds[currentId];
                delete table.rememberSelecteds[currentId];
            },
            // 순서号생성
            serialNumber: function (index, tableId) {
                var currentId = $.common.isEmpty(tableId) ? table.options.id : tableId;
                var tableParams = $("#" + currentId).bootstrapTable('getOptions');
                var pageSize = $.common.isNotEmpty(tableParams.pageSize) ? tableParams.pageSize: table.options.pageSize;
                var pageNumber = $.common.isNotEmpty(tableParams.pageNumber) ? tableParams.pageNumber: table.options.pageNumber;
                return pageSize * (pageNumber - 1) + index + 1;
            },
            // 목록그너머에명세길이浮动메시지 target(copy클릭복사텍스트 open팝업열려있는텍스트)
            tooltip: function (value, length, target) {
                var _length = $.common.isEmpty(length) ? 20 : length;
                var _text = "";
                var _value = $.common.nullToStr(value);
                var _target = $.common.isEmpty(target) ? 'copy' : target;
                if (_value.length > _length) {
                    _text = _value.substr(0, _length) + "...";
                    _value = _value.replace(/\'/g,"&apos;");
                    _value = _value.replace(/\"/g,"&quot;");
                    var actions = [];
                    actions.push($.common.sprintf('<input style="opacity: 0;position: absolute;width:5px;z-index:-1" type="text" value="%s"/>', _value));
                    actions.push($.common.sprintf('<a href="###" class="tooltip-show" data-toggle="tooltip" data-target="%s" title="%s">%s</a>', _target, _value, _text));
                    return actions.join('');
                } else {
                    _text = _value;
                    return _text;
                }
            },
            // 하단버튼토글
            dropdownToggle: function (value) {
                var actions = [];
                actions.push('<div class="btn-group">');
                actions.push('<button type="button" class="btn btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="false">');
                actions.push('<i class="fa fa-cog"></i>&nbsp;<span class="fa fa-chevron-down"></span></button>');
                actions.push('<ul class="dropdown-menu">');
                actions.push(value.replace(/<a/g,"<li><a").replace(/<\/a>/g,"</a></li>"));
                actions.push('</ul>');
                actions.push('</div>');
                return actions.join('');
            },
            // 그림미리보기
            imageView: function (value, height, width, target) {
                if ($.common.isEmpty(width)) {
                    width = 'auto';
                }
                if ($.common.isEmpty(height)) {
                    height = 'auto';
                }
                // blank or self
                var _target = $.common.isEmpty(target) ? 'self' : target;
                if ($.common.isNotEmpty(value)) {
                    return $.common.sprintf("<img class='img-circle img-xs' data-height='%s' data-width='%s' data-target='%s' src='%s'/>", height, width, _target, value);
                } else {
                    return $.common.nullToStr(value);
                }
            },
            // 검색-기본첫번째form
            search: function(formId, tableId, pageNumber, pageSize) {
                table.set(tableId);
                table.options.formId = $.common.isEmpty(formId) ? $('form').attr('id') : formId;
                var params = $.common.isEmpty(tableId) ? $("#" + table.options.id).bootstrapTable('getOptions') : $("#" + tableId).bootstrapTable('getOptions');
                if ($.common.isNotEmpty(pageNumber)) {
                    params.pageNumber = pageNumber;
                }
                if ($.common.isNotEmpty(pageSize)) {
                    params.pageSize = pageSize;
                }
                if($.common.isNotEmpty(tableId)){
                    $("#" + tableId).bootstrapTable('refresh', params);
                } else{
                    $("#" + table.options.id).bootstrapTable('refresh', params);
                }
            },
            // export데이터
            exportExcel: function(formId) {
                table.set();
                $.modal.confirm("확인export모든" + table.options.modalName + "吗?", function() {
                    var currentId = $.common.isEmpty(formId) ? $('form').attr('id') : formId;
                    var params = $("#" + table.options.id).bootstrapTable('getOptions');
                    var dataParam = $("#" + currentId).serializeArray();
                    dataParam.push({ "name": "orderByColumn", "value": params.sortName });
                    dataParam.push({ "name": "isAsc", "value": params.sortOrder });
                    $.modal.loading("load export데이터,기다리세요...");
                    $.post(table.options.exportUrl, dataParam, function(result) {
                        if (result.code == web_status.SUCCESS) {
                            window.location.href = ctx + "common/download?fileName=" + encodeURI(result.msg) + "&delete=" + true;
                        } else if (result.code == web_status.WARNING) {
                            $.modal.alertWarning(result.msg)
                        } else {
                            $.modal.alertError(result.msg);
                        }
                        $.modal.closeLoading();
                    });
                });
            },
            // 다운로드테마
            importTemplate: function() {
                $.get(activeWindow().table.options.importTemplateUrl, function(result) {
                    if (result.code == web_status.SUCCESS) {
                        window.location.href = ctx + "common/download?fileName=" + encodeURI(result.msg) + "&delete=" + true;
                    } else if (result.code == web_status.WARNING) {
                        $.modal.alertWarning(result.msg)
                    } else {
                        $.modal.alertError(result.msg);
                    }
                });
            },
            // import데이터
            importExcel: function(formId, width, height) {
                table.set();
                var currentId = $.common.isEmpty(formId) ? 'importTpl' : formId;
                var _width = $.common.isEmpty(width) ? "400" : width;
                var _height = $.common.isEmpty(height) ? "230" : height;
                top.layer.open({
                    type: 1,
                    area: [_width + 'px', _height + 'px'],
                    fix: false,
                    //불가결정된
                    maxmin: true,
                    shade: 0.3,
                    title: '가져오기' + table.options.modalName + '데이터',
                    content: $('#' + currentId).html(),
                    btn: ['<i class="fa fa-check"></i> import', '<i class="fa fa-remove"></i> 취소'],
                    // 테이블외부지역닫기
                    shadeClose: true,
                    btn1: function(index, layero){
                        var file = layero.find('#file').val();
                        if (file == '' || (!$.common.endWith(file, '.xls') && !$.common.endWith(file, '.xlsx'))){
                            $.modal.msgWarning(" 선택해주세요 앞글자为  xls 또는 xlsx 문서 ");
                            return false;
                        }
                        var index = top.layer.load(2, {shade: false});
                        $.modal.disable();
                        var formData = new FormData(layero.find('form')[0]);
                        $.ajax({
                            url: table.options.importUrl,
                            data: formData,
                            cache: false,
                            contentType: false,
                            processData: false,
                            type: 'POST',
                            success: function (result) {
                                if (result.code == web_status.SUCCESS) {
                                	$.modal.close(index);
                                    $.modal.closeAll();
                                    $.modal.alertSuccess(result.msg);
                                    $.table.refresh();
                                } else if (result.code == web_status.WARNING) {
                                	$.modal.close(index);
                                    $.modal.enable();
                                    $.modal.alertWarning(result.msg)
                                } else {
                                    $.modal.close(index);
                                    $.modal.enable();
                                    $.modal.alertError(result.msg);
                                }
                            },
                            complete: function () {
                            	layero.find('#file').val('');
                            }
                        });
                    }
                });
            },
            // 새로고침시트
            refresh: function(tableId, pageNumber, pageSize, url) {
                var currentId = $.common.isEmpty(tableId) ? table.options.id : tableId;
                var params = $("#" + currentId).bootstrapTable('getOptions');
                if ($.common.isEmpty(pageNumber)) {
                    pageNumber = params.pageNumber;
                }
                if ($.common.isEmpty(pageSize)) {
                    pageSize = params.pageSize;
                }
                if ($.common.isEmpty(url)) {
                    url = $.common.isEmpty(url) ? params.url : url;
                }
                $("#" + currentId).bootstrapTable('refresh', {
                    silent: true,
                    url: url,
                    pageNumber: pageNumber,
                    pageSize: pageSize
                });
            },
            // 새로고침options구성
            refreshOptions: function(options, tableId) {
                var currentId = $.common.isEmpty(tableId) ? table.options.id : tableId;
                $("#" + currentId).bootstrapTable('refreshOptions', options);
            },
            // 조회시트명세열값 deDuplication( true去重,false불가去重)
            selectColumns: function(column, deDuplication) {
                var distinct = $.common.isEmpty(deDuplication) ? true : deDuplication;
                var rows = $.map($("#" + table.options.id).bootstrapTable('getSelections'), function (row) {
                    return $.common.getItemField(row, column);
                });
                if ($.common.isNotEmpty(table.options.rememberSelected) && table.options.rememberSelected) {
                    var selectedRows = table.rememberSelecteds[table.options.id];
                    if($.common.isNotEmpty(selectedRows)) {
                        rows = $.map(table.rememberSelecteds[table.options.id], function (row) {
                            return $.common.getItemField(row, column);
                        });
                    }
                }
                return distinct ? $.common.uniqueFn(rows) : rows;
            },
            // get현재페이지체크또는취소 수행ID
            affectedRowIds: function(rows) {
                var column = $.common.isEmpty(table.options.uniqueId) ? table.options.columns[1].field : table.options.uniqueId;
                var rowIds;
                if ($.isArray(rows)) {
                    rowIds = $.map(rows, function(row) {
                        return $.common.getItemField(row, column);
                    });
                } else {
                    rowIds = [rows[column]];
                }
                return rowIds;
            },
            // 조회시트첫 번째 열 값deDuplication( true去重,false불가去重)
            selectFirstColumns: function(deDuplication) {
                var distinct = $.common.isEmpty(deDuplication) ? true : deDuplication;
                var rows = $.map($("#" + table.options.id).bootstrapTable('getSelections'), function (row) {
                    return $.common.getItemField(row, table.options.columns[1].field);
                });
                if ($.common.isNotEmpty(table.options.rememberSelected) && table.options.rememberSelected) {
                    var selectedRows = table.rememberSelecteds[table.options.id];
                    if($.common.isNotEmpty(selectedRows)) {
                        rows = $.map(selectedRows, function (row) {
                            return $.common.getItemField(row, table.options.columns[1].field);
                        });
                    }
                }
                return distinct ? $.common.uniqueFn(rows) : rows;
            },
            // 에코데이터사전
            selectDictLabel: function(datas, value) {
                if ($.common.isEmpty(datas) || $.common.isEmpty(value)) {
                    return '';
                }
                var actions = [];
                $.each(datas, function(index, dict) {
                    if (dict.dictValue == ('' + value)) {
                        var listClass = $.common.equals("default", dict.listClass) || $.common.isEmpty(dict.listClass) ? "" : "badge badge-" + dict.listClass;
                        actions.push($.common.sprintf("<span class='%s'>%s</span>", listClass, dict.dictLabel));
                        return false;
                    }
                });
                if (actions.length === 0) {
                    actions.push($.common.sprintf("<span>%s</span>", value))
                }
                return actions.join('');
            },
            // 날짜 형식의 에코 데이터 사전(문자열 배열)
            selectDictLabels: function(datas, value, separator) {
                if ($.common.isEmpty(datas) || $.common.isEmpty(value)) {
                    return '';
                }
                var currentSeparator = $.common.isEmpty(separator) ? "," : separator;
                var actions = [];
                $.each(value.split(currentSeparator), function(i, val) {
                    var match = false
                    $.each(datas, function(index, dict) {
                        if (dict.dictValue == ('' + val)) {
                            var listClass = $.common.equals("default", dict.listClass) || $.common.isEmpty(dict.listClass) ? "" : "badge badge-" + dict.listClass;
                            actions.push($.common.sprintf("<span class='%s'>%s</span>", listClass, dict.dictLabel));
                            match = true
                            return false;
                        }
                    });
                    if (!match) {
                        actions.push($.common.sprintf("<span> %s </span>", val));
                    }
                });
                return actions.join('');
            },
            // 보여줌시트명세목록
            showColumn: function(column, tableId) {
                var currentId = $.common.isEmpty(tableId) ? table.options.id : tableId;
                $("#" + currentId).bootstrapTable('showColumn', column);
            },
            // 숨김시트명세목록
            hideColumn: function(column, tableId) {
                var currentId = $.common.isEmpty(tableId) ? table.options.id : tableId;
                $("#" + currentId).bootstrapTable('hideColumn', column);
            },
            // 보여줌모든시트목록
            showAllColumns: function(tableId) {
                var currentId = $.common.isEmpty(tableId) ? table.options.id : tableId;
                $("#" + currentId).bootstrapTable('showAllColumns');
            },
            // 숨김모든시트목록
            hideAllColumns: function(tableId) {
                var currentId = $.common.isEmpty(tableId) ? table.options.id : tableId;
                $("#" + currentId).bootstrapTable('hideAllColumns');
            }
        },
        // 시트트리패키지 처리
        treeTable: {
            // 초기화시트
            init: function(options) {
                var defaults = {
                    id: "bootstrap-tree-table",
                    type: 1, // 0 대표bootstrapTable 1대표bootstrapTreeTable
                    height: 0,
                    rootIdValue: 0,
                    ajaxParams: {},
                    toolbar: "toolbar",
                    striped: false,
                    pagination: false,
                    pageSize: 10,
                    pageList: [5, 10, 20, 30, 50, 100, 200, 500],
                    expandColumn: 1,
                    showSearch: true,
                    showRefresh: true,
                    showColumns: true,
                    expandAll: true,
                    expandFirst: true
                };
                var options = $.extend(defaults, options);
                table.options = options;
                table.config[options.id] = options;
                $.table.initEvent();
                $.bttTable = $('#' + options.id).bootstrapTreeTable({
                    code: options.code,                                 // 사용설정아버지와 아들의 관계
                    parentCode: options.parentCode,                     // 사용설정아버지와 아들의 관계
                    type: 'post',                                       // 요청 메서드(*)
                    url: options.url,                                   // 요청backend的URL(*)
                    data: options.data,                                 // 없는url时사용적용
                    ajaxParams: options.ajaxParams,                     // 요청데이터的ajax的data속성
                    rootIdValue: options.rootIdValue,                   // 설정명세根노드ID값
                    height: options.height,                             // 시트트리的높이
                    pagination: options.pagination,                     // 표시할지 여부페이지
                    dataUrl: options.dataUrl,                           // 加载자식노드비동기요청데이터url
                    pageSize: options.pageSize,                         // 모든페이지的기록 행숫자
                    pageList: options.pageList,                         // 사용가능 선택 的모든페이지 수행숫자
                    expandColumn: options.expandColumn,                 // 어느 열에보여줌확장버튼
                    striped: options.striped,                           // 표시할지 여부행간격色
                    bordered: options.bordered,                         // 표시할지 여부윈도우
                    toolbar: '#' + options.toolbar,                     // 명세工作栏
                    showSearch: options.showSearch,                     // 표시할지 여부검색정보
                    showRefresh: options.showRefresh,                   // 표시할지 여부새로고침버튼
                    showColumns: options.showColumns,                   // 표시할지 여부숨김某목록select
                    expandAll: options.expandAll,                       // 여부 전체확장
                    expandFirst: options.expandFirst,                   // 기본여부레벨 1확장--expandAll为false효과적인 경우
                    columns: options.columns,                           // 보여줌목록정보(*)
                    onClickRow: options.onClickRow,                     // 클릭라인이벤트
                    responseHandler: $.treeTable.responseHandler,       // 로딩제공器send오다데이터전에핸들러 함수
                    onLoadSuccess: $.treeTable.onLoadSuccess            // 모든 데이터가 로드되면 핸들러를 트리거합니다.
                });
            },
            // 상태조회
            search: function(formId) {
                var currentId = $.common.isEmpty(formId) ? $('form').attr('id') : formId;
                var params = $.common.formToJSON(currentId);
                $.bttTable.bootstrapTreeTable('refresh', params);
            },
            // 새로고침
            refresh: function() {
                $.bttTable.bootstrapTreeTable('refresh');
            },
            // 조회시트트리명세열값deDuplication( true去重,false불가去重)
            selectColumns: function(column, deDuplication) {
                var distinct = $.common.isEmpty(deDuplication) ? true : deDuplication;
                var rows = $.map($.bttTable.bootstrapTreeTable('getSelections'), function (row) {
                    return $.common.getItemField(row, column);
                });
                return distinct ? $.common.uniqueFn(rows) : rows;
            },
            // 요청get데이터后다루다콜백,확인이상상태상기시키다
            responseHandler: function(res) {
                if (typeof table.options.responseHandler == "function") {
                    table.options.responseHandler(res);
                }
                if (res.code != undefined && res.code != web_status.SUCCESS) {
                    $.modal.alertWarning(res.msg);
                    return [];
                } else {
                    return res;
                }
            },
            // 当모든데이터로드될 때 발생
            onLoadSuccess: function(data) {
                if (typeof table.options.onLoadSuccess == "function") {
                    table.options.onLoadSuccess(data);
                }
                $(".table [data-toggle='tooltip']").tooltip();
            },
        },
        // Form패키지 처리
        form: {
            // 초기화
            reset: function(formId, tableId, pageNumber, pageSize) {
                table.set(tableId);
                formId = $.common.isEmpty(formId) ? $('form').attr('id') : formId;
                $("#" + formId)[0].reset();
                var tableId = $.common.isEmpty(tableId) ? table.options.id : tableId;
                if (table.options.type == table_type.bootstrapTable) {
                    var params = $("#" + tableId).bootstrapTable('getOptions');
                    if ($.common.isNotEmpty(pageNumber)) {
                        params.pageNumber = pageNumber;
                    }
                    if ($.common.isNotEmpty(pageSize)) {
                        params.pageSize = pageSize;
                    }
                    $("#" + tableId).bootstrapTable('refresh', params);
                } else if (table.options.type == table_type.bootstrapTreeTable) {
                    $("#" + tableId).bootstrapTreeTable('refresh', []);
                }
                if ($.common.isNotEmpty(startLayDate) && $.common.isNotEmpty(endLayDate)) {
                    endLayDate.config.min.year = '';
                    endLayDate.config.min.month = '';
                    endLayDate.config.min.date = '';
                    startLayDate.config.max.year = '2099';
                    startLayDate.config.max.month = '12';
                    startLayDate.config.max.date = '31';
                 }
            },
            // get체크checkbox项
            selectCheckeds: function(name) {
                var checkeds = "";
                $('input:checkbox[name="' + name + '"]:checked').each(function(i) {
                    if (0 == i) {
                        checkeds = $(this).val();
                    } else {
                        checkeds += ("," + $(this).val());
                    }
                });
                return checkeds;
            },
            // get체크select项
            selectSelects: function(name) {
                var selects = "";
                $('#' + name + ' option:selected').each(function (i) {
                    if (0 == i) {
                        selects = $(this).val();
                    } else {
                        selects += ("," + $(this).val());
                    }
                });
                return selects;
            }
        },
        // 팝업层패키지 처리
        modal: {
            // 보여줌icon
            icon: function(type) {
                var icon = "";
                if (type == modal_status.WARNING) {
                    icon = 0;
                } else if (type == modal_status.SUCCESS) {
                    icon = 1;
                } else if (type == modal_status.FAIL) {
                    icon = 2;
                } else {
                    icon = 3;
                }
                return icon;
            },
            // 정보메시지
            msg: function(content, type) {
                if (type != undefined) {
                	top.layer.msg(content, { icon: $.modal.icon(type), time: 1000, shift: 5 });
                } else {
                	top.layer.msg(content);
                }
            },
            // 오류메시지
            msgError: function(content) {
                $.modal.msg(content, modal_status.FAIL);
            },
            // 성공정보
            msgSuccess: function(content) {
                $.modal.msg(content, modal_status.SUCCESS);
            },
            // 경고정보
            msgWarning: function(content) {
                $.modal.msg(content, modal_status.WARNING);
            },
            // 팝업메시지
            alert: function(content, type) {
                top.layer.alert(content, {
                    icon: $.modal.icon(type),
                    title: "시스템메시지",
                    btn: ['확인 '],
                    btnclass: ['btn btn-primary'],
                });
            },
            // 오류메시지
            alertError: function(content) {
                $.modal.alert(content, modal_status.FAIL);
            },
            // 성공메시지
            alertSuccess: function(content) {
                $.modal.alert(content, modal_status.SUCCESS);
            },
            // 경고메시지
            alertWarning: function(content) {
                $.modal.alert(content, modal_status.WARNING);
            },
            // 정보메시지,重신규加载페이지
            msgReload: function(msg, type) {
                top.layer.msg(msg, {
                    icon: $.modal.icon(type),
                    time: 500,
                    shade: [0.1, '#8F8F8F']
                },
                function() {
                    $.modal.reload();
                });
            },
            // 정보메시지성공并새로고침상위양식
            msgSuccessReload: function(msg) {
            	$.modal.msgReload(msg, modal_status.SUCCESS);
            },
            // getiframe페이지的DOM
            getChildFrame: function (index) {
                if($.common.isEmpty(index)){
                    var index = parent.layer.getFrameIndex(window.name);
                    return parent.layer.getChildFrame('body', index);
                } else {
                    return top.layer.getChildFrame('body', index);
                }
            },
            // 닫기form
            close: function (index) {
                if($.common.isEmpty(index)){
                    var index = parent.layer.getFrameIndex(window.name);
                    parent.layer.close(index);
                } else {
                    top.layer.close(index);
                }
            },
            // 닫기전체form
            closeAll: function () {
                top.layer.closeAll();
            },
            // 확인 form
            confirm: function (content, callBack) {
                top.layer.confirm(content, {
                    icon: 3,
                    title: "시스템메시지",
                    btn: ['확인 ', '취소']
                }, function (index) {
                    $.modal.close(index);
                    callBack(true);
                });
            },
            // 팝업层명세너비
            open: function (title, url, width, height, callback) {
                // 만약 모바일,就사용적응크기팝업
                if ($.common.isMobile()) {
                    width = 'auto';
                    height = 'auto';
                }
                if ($.common.isEmpty(title)) {
                    title = false;
                }
                if ($.common.isEmpty(url)) {
                    url = "/404.html";
                }
                if ($.common.isEmpty(width)) {
                    width = 800;
                }
                if ($.common.isEmpty(height)) {
                    height = ($(window).height() - 50);
                }
                if ($.common.isEmpty(callback)) {
                    callback = function(index, layero) {
                        var iframeWin = layero.find('iframe')[0];
                        iframeWin.contentWindow.submitHandler(index, layero);
                    }
                }
                top.layer.open({
                    type: 2,
                    area: [width + 'px', height + 'px'],
                    fix: false,
                    //불가결정된
                    maxmin: true,
                    shade: 0.3,
                    title: title,
                    content: url,
                    btn: ['확인', '닫기'],
                    // 테이블외부지역닫기
                    shadeClose: true,
                    yes: callback,
                    cancel: function(index) {
                        return true;
                    }
                });
            },
            // 팝업层명세설정옵션
            openOptions: function (options) {
                var _url = $.common.isEmpty(options.url) ? "/404.html" : options.url; 
                var _title = $.common.isEmpty(options.title) ? "시스템윈도우" : options.title; 
                var _width = $.common.isEmpty(options.width) ? "800" : options.width; 
                var _height = $.common.isEmpty(options.height) ? ($(window).height() - 50) : options.height;
                var _btn = ['<i class="fa fa-check"></i> 확인 ', '<i class="fa fa-close"></i> 닫기'];
                // 만약 모바일,就사용적응크기팝업
                if ($.common.isMobile()) {
                    _width = 'auto';
                    _height = 'auto';
                }
                if ($.common.isEmpty(options.yes)) {
                    options.yes = function(index, layero) {
                        options.callBack(index, layero);
                    }
                }
                var btnCallback = {};
                if(options.btn instanceof Array){
                    for (var i = 1, len = options.btn.length; i < len; i++) {
                        var btn = options["btn" + (i + 1)];
                        if (btn) {
                            btnCallback["btn" + (i + 1)] = btn;
                        }
                    }
                }
                var index = top.layer.open($.extend({
                    id: options.id,       // 오직id
                    anim: options.anim,   // 팝업생기 0-6
                    type: 2,
                    maxmin: $.common.isEmpty(options.maxmin) ? true : options.maxmin,
                    shade: 0.3,
                    title: _title,
                    fix: false,
                    area: [_width + 'px', _height + 'px'],
                    content: _url,
                    shadeClose: $.common.isEmpty(options.shadeClose) ? true : options.shadeClose,
                    skin: options.skin,
                    // options.btn설정为0표현불가보여줌버튼
                    btn: $.common.isEmpty(options.btn) ? _btn : options.btn,
                    yes: options.yes,
                    cancel: function () {
                        return true;
                    }
                }, btnCallback));
                if ($.common.isNotEmpty(options.full) && options.full === true) {
                    top.layer.full(index);
                }
            },
            // 팝업层전체화면
            openFull: function (title, url, width, height) {
                // 만약 모바일,就사용적응크기팝업
                if ($.common.isMobile()) {
                    width = 'auto';
                    height = 'auto';
                }
                if ($.common.isEmpty(title)) {
                    title = false;
                }
                if ($.common.isEmpty(url)) {
                    url = "/404.html";
                }
                if ($.common.isEmpty(width)) {
                    width = 800;
                }
                if ($.common.isEmpty(height)) {
                    height = ($(window).height() - 50);
                }
                var index = top.layer.open({
                    type: 2,
                    area: [width + 'px', height + 'px'],
                    fix: false,
                    //불가결정된
                    maxmin: true,
                    shade: 0.3,
                    title: title,
                    content: url,
                    btn: ['확인', '닫기'],
                    // 테이블외부지역닫기
                    shadeClose: true,
                    yes: function(index, layero) {
                        var iframeWin = layero.find('iframe')[0];
                        iframeWin.contentWindow.submitHandler(index, layero);
                    },
                    cancel: function(index) {
                        return true;
                    }
                });
                top.layer.full(index);
            },
            // 탭 페이지 방식열려있는
            openTab: function (title, url, isRefresh) {
                createMenuItem(url, title, isRefresh);
            },
            // 탭페이지같은 탭에서 열기
            parentTab: function (title, url) {
                var dataId = window.frameElement.getAttribute('data-id');
                createMenuItem(url, title);
                closeItem(dataId);
            },
            // 탭 닫기
            closeTab: function (dataId) {
                closeItem(dataId);
            },
            // 장애가있는버튼
            disable: function() {
                var doc = window.top == window.parent ? window.document : window.parent.document;
                $("a[class*=layui-layer-btn]", doc).addClass("layer-disabled");
            },
            // 활성버튼
            enable: function() {
                var doc = window.top == window.parent ? window.document : window.parent.document;
                $("a[class*=layui-layer-btn]", doc).removeClass("layer-disabled");
            },
            // 마스크 레이어 열기
            loading: function (message) {
                $.blockUI({ message: '<div class="loaderbox"><div class="loading-activity"></div> ' + message + '</div>' });
            },
            // 마스크 레이어 닫기
            closeLoading: function () {
                setTimeout(function(){
                    $.unblockUI();
                }, 50);
            },
            // 重신규加载
            reload: function () {
                parent.location.reload();
            }
        },
        // 운영패키지 처리
        operate: {
            // 제출데이터
            submit: function(url, type, dataType, data, callback) {
                var config = {
                    url: url,
                    type: type,
                    dataType: dataType,
                    data: data,
                    beforeSend: function () {
                        $.modal.loading("load 처리중,기다리세요...");
                    },
                    success: function(result) {
                        if (typeof callback == "function") {
                            callback(result);
                        }
                        $.operate.ajaxSuccess(result);
                    }
                };
                $.ajax(config)
            },
            // post요청传输
            post: function(url, data, callback) {
                $.operate.submit(url, "post", "json", data, callback);
            },
            // get요청传输
            get: function(url, callback) {
                $.operate.submit(url, "get", "json", "", callback);
            },
            // 상세정보
            detail: function(id, width, height) {
                table.set();
                var _url = $.operate.detailUrl(id);
                var options = {
                    title: table.options.modalName + "상세",
                    width: width,
                    height: height,
                    url: _url,
                    skin: 'layui-layer-gray', 
                    btn: ['닫기'],
                    yes: function (index, layero) {
                        $.modal.close(index);
                    }
                };
                $.modal.openOptions(options);
            },
            // 상세정보,以tab페이지보여줌
            detailTab: function(id) {
                table.set();
                $.modal.openTab("상세" + table.options.modalName, $.operate.detailUrl(id));
            },
            // 상세입장주소
            detailUrl: function(id) {
                var url = "/404.html";
                if ($.common.isNotEmpty(id)) {
                    url = table.options.detailUrl.replace("{id}", id);
                } else {
                    var id = $.common.isEmpty(table.options.uniqueId) ? $.table.selectFirstColumns() : $.table.selectColumns(table.options.uniqueId);
                    if (id.length == 0) {
                        $.modal.alertWarning("하나 이상의 레코드를 선택하십시오");
                        return;
                    }
                    url = table.options.detailUrl.replace("{id}", id);
                }
                return url;
            },
            // 삭제정보
            remove: function(id) {
                table.set();
                $.modal.confirm("확인 " + table.options.modalName + "를 삭제하시겠습니까?", function() {
                    var url = $.common.isEmpty(id) ? table.options.removeUrl : table.options.removeUrl.replace("{id}", id);
                    if(table.options.type == table_type.bootstrapTreeTable) {
                        $.operate.get(url);
                    } else {
                        var data = { "ids": id };
                        $.operate.submit(url, "post", "json", data);
                    }
                });
            },
            // 일괄삭제정보
            removeAll: function() {
                table.set();
                var rows = $.common.isEmpty(table.options.uniqueId) ? $.table.selectFirstColumns() : $.table.selectColumns(table.options.uniqueId);
                if (rows.length == 0) {
                    $.modal.alertWarning("하나 이상의 레코드를 선택하십시오");
                    return;
                }
                $.modal.confirm("선택한 삭제 확인" + rows.length + "건 삭제하시겠습니까?", function() {
                    var url = table.options.removeUrl;
                    var data = { "ids": rows.join() };
                    $.operate.submit(url, "post", "json", data);
                });
            },
            // 비움정보
            clean: function() {
                table.set();
                $.modal.confirm("확인비움모든" + table.options.modalName + "吗?", function() {
                    var url = table.options.cleanUrl;
                    $.operate.submit(url, "post", "json", "");
                });
            },
            // 추가정보
            add: function(id) {
                table.set();
                $.modal.open("추가" + table.options.modalName, $.operate.addUrl(id));
            },
            // 추가정보,以tab페이지보여줌
            addTab: function (id) {
                table.set();
                $.modal.openTab("추가" + table.options.modalName, $.operate.addUrl(id));
            },
            // 추가정보 전체화면
            addFull: function(id) {
                table.set();
                $.modal.openFull("추가" + table.options.modalName, $.operate.addUrl(id));
            },
            // 추가입장주소
            addUrl: function(id) {
                var url = $.common.isEmpty(id) ? table.options.createUrl.replace("{id}", "") : table.options.createUrl.replace("{id}", id);
                return url;
            },
            // 수정정보
            edit: function(id) {
                table.set();
                if($.common.isEmpty(id) && table.options.type == table_type.bootstrapTreeTable) {
                    var row = $("#" + table.options.id).bootstrapTreeTable('getSelections')[0];
                    if ($.common.isEmpty(row)) {
                        $.modal.alertWarning("하나 이상의 레코드를 선택하십시오");
                        return;
                    }
                    var url = table.options.updateUrl.replace("{id}", row[table.options.uniqueId]);
                    $.modal.open("수정" + table.options.modalName, url);
                } else {
                    $.modal.open("수정" + table.options.modalName, $.operate.editUrl(id));
                }
            },
            // 수정정보,以tab페이지보여줌
            editTab: function(id) {
                table.set();
                $.modal.openTab("수정" + table.options.modalName, $.operate.editUrl(id));
            },
            // 수정정보 전체화면
            editFull: function(id) {
                table.set();
                var url = "/404.html";
                if ($.common.isNotEmpty(id)) {
                    url = table.options.updateUrl.replace("{id}", id);
                } else {
                    if(table.options.type == table_type.bootstrapTreeTable) {
                        var row = $("#" + table.options.id).bootstrapTreeTable('getSelections')[0];
                        if ($.common.isEmpty(row)) {
                            $.modal.alertWarning("하나 이상의 레코드를 선택하십시오");
                            return;
                        }
                        url = table.options.updateUrl.replace("{id}", row[table.options.uniqueId]);
                    } else {
                        var row = $.common.isEmpty(table.options.uniqueId) ? $.table.selectFirstColumns() : $.table.selectColumns(table.options.uniqueId);
                        url = table.options.updateUrl.replace("{id}", row);
                    }
                }
                $.modal.openFull("수정" + table.options.modalName, url);
            },
            // 수정입장주소
            editUrl: function(id) {
                var url = "/404.html";
                if ($.common.isNotEmpty(id)) {
                    url = table.options.updateUrl.replace("{id}", id);
                } else {
                    var id = $.common.isEmpty(table.options.uniqueId) ? $.table.selectFirstColumns() : $.table.selectColumns(table.options.uniqueId);
                    if (id.length == 0) {
                        $.modal.alertWarning("하나 이상의 레코드를 선택하십시오");
                        return;
                    }
                    url = table.options.updateUrl.replace("{id}", id);
                }
                return url;
            },
            // 저장정보 새로고침시트
            save: function(url, data, callback) {
                var config = {
                    url: url,
                    type: "post",
                    dataType: "json",
                    data: data,
                    beforeSend: function () {
                        $.modal.loading("load 처리중,기다리세요...");
                        $.modal.disable();
                    },
                    success: function(result) {
                        if (typeof callback == "function") {
                            callback(result);
                        }
                        $.operate.successCallback(result);
                    }
                };
                $.ajax(config)
            },
            // 저장정보 팝업결과툴팁
            saveModal: function(url, data, callback) {
                var config = {
                    url: url,
                    type: "post",
                    dataType: "json",
                    data: data,
                    beforeSend: function () {
                        $.modal.loading("load 처리중,기다리세요...");
                    },
                    success: function(result) {
                        if (typeof callback == "function") {
                            callback(result);
                        }
                        if (result.code == web_status.SUCCESS) {
                            $.modal.alertSuccess(result.msg)
                        } else if (result.code == web_status.WARNING) {
                            $.modal.alertWarning(result.msg)
                        } else {
                            $.modal.alertError(result.msg);
                        }
                        $.modal.closeLoading();
                    }
                };
                $.ajax(config)
            },
            // 저장텝정보
            saveTab: function(url, data, callback) {
                var config = {
                    url: url,
                    type: "post",
                    dataType: "json",
                    data: data,
                    beforeSend: function () {
                        $.modal.loading("load 처리중,기다리세요...");
                    },
                    success: function(result) {
                        if (typeof callback == "function") {
                            callback(result);
                        }
                        $.operate.successTabCallback(result);
                    }
                };
                $.ajax(config)
            },
            // 저장결과팝업msg새로고침table시트
            ajaxSuccess: function (result) {
                if (result.code == web_status.SUCCESS && table.options.type == table_type.bootstrapTable) {
                    $.modal.msgSuccess(result.msg);
                    $.table.refresh();
                } else if (result.code == web_status.SUCCESS && table.options.type == table_type.bootstrapTreeTable) {
                    $.modal.msgSuccess(result.msg);
                    $.treeTable.refresh();
                } else if (result.code == web_status.SUCCESS && $.common.isEmpty(table.options.type)) {
                    $.modal.msgSuccess(result.msg)
                }  else if (result.code == web_status.WARNING) {
                    $.modal.alertWarning(result.msg)
                }  else {
                    $.modal.alertError(result.msg);
                }
                $.modal.closeLoading();
            },
            // 저장결과重신규加载페이지
            saveReload: function (result) {
                if (result.code == web_status.SUCCESS) {
                    $.modal.msgSuccessReload(result.msg);
                } else if (result.code == web_status.WARNING) {
                    $.modal.alertWarning(result.msg)
                }  else {
                    $.modal.alertError(result.msg);
                }
                $.modal.closeLoading();
            },
            // 성공콜백구현이벤트(상위양식고요변경)
            successCallback: function(result) {
                if (result.code == web_status.SUCCESS) {
                    var parent = activeWindow();
                    if($.common.isEmpty(parent.table)) {
                    	$.modal.msgSuccessReload(result.msg);
                    } else if (parent.table.options.type == table_type.bootstrapTable) {
                        $.modal.close();
                        parent.$.modal.msgSuccess(result.msg);
                        parent.$.table.refresh();
                    } else if (parent.table.options.type == table_type.bootstrapTreeTable) {
                        $.modal.close();
                        parent.$.modal.msgSuccess(result.msg);
                        parent.$.treeTable.refresh();
                    }
                } else if (result.code == web_status.WARNING) {
                    $.modal.alertWarning(result.msg)
                }  else {
                    $.modal.alertError(result.msg);
                }
                $.modal.closeLoading();
                $.modal.enable();
            },
            // 텝성공콜백구현이벤트(상위양식고요변경)
            successTabCallback: function(result) {
                if (result.code == web_status.SUCCESS) {
                    var topWindow = $(window.parent.document);
                    var currentId = $('.page-tabs-content', topWindow).find('.active').attr('data-panel');
                    var $contentWindow = $('.illeesam_iframe[data-id="' + currentId + '"]', topWindow)[0].contentWindow;
                    $.modal.close();
                    $contentWindow.$.modal.msgSuccess(result.msg);
                    $contentWindow.$(".layui-layer-padding").removeAttr("style");
                    if ($contentWindow.table.options.type == table_type.bootstrapTable) {
                        $contentWindow.$.table.refresh();
                    } else if ($contentWindow.table.options.type == table_type.bootstrapTreeTable) {
                        $contentWindow.$.treeTable.refresh();
                    }
                    $.modal.closeTab();
                } else if (result.code == web_status.WARNING) {
                    $.modal.alertWarning(result.msg)
                } else {
                    $.modal.alertError(result.msg);
                }
                $.modal.closeLoading();
            }
        },
        // 확인패키지 처리
        validate: {
            // 판정반환심벌마크여부 오직 false 为존재 true 为존재하지 않는다
            unique: function (value) {
                if (value == "0") {
                    return true;
                }
                return false;
            },
            // Form검증
            form: function (formId) {
                var currentId = $.common.isEmpty(formId) ? $('form').attr('id') : formId;
                return $("#" + currentId).validate().form();
            },
            // 초기화Form검증(분명한메시지정보)
            reset: function (formId) {
                var currentId = $.common.isEmpty(formId) ? $('form').attr('id') : formId;
                return $("#" + currentId).validate().resetForm();
            }
        },
        // 트리플러그인패키지 처리
        tree: {
            _option: {},
            _lastValue: {},
            // 초기화트리구조
            init: function(options) {
                var defaults = {
                    id: "tree",                    // 속성ID
                    expandLevel: 0,                // 확장등급노드
                    view: {
                        selectedMulti: false,      // 설정동시에 허용됩니까?체크다수의노드
                        nameIsHTML: true           // 설정 name 속성여부 지원 HTML 스크립트
                    },
                    check: {
                        enable: false,             // 置 zTree 的노드上표시할지 여부 checkbox / radio
                        nocheckInherit: true,      // 설정자식노드여부 자동상속
                        chkboxType: { "Y": "ps", "N": "ps" } // 父자식노드협회关系
                    },
                    data: {
                        key: {
                            title: "title"         // 노드데이터저장노드메시지정보的속성명
                        },
                        simpleData: {
                            enable: true           // true / false 각기표현 사용 / 불가사용 단순한데이터모델
                        }
                    },
                };
                var options = $.extend(defaults, options);
                $.tree._option = options;
                // 트리구조초기화加载
                var setting = {
                    callback: {
                        onClick: options.onClick,                      // 사용감지노드被클릭的이벤트콜백
                        onCheck: options.onCheck,                      // 사용감지 checkbox / radio 체크  또는  취소확인的이벤트콜백
                        onDblClick: options.onDblClick                 // 사용감지鼠标더블클릭之후에이벤트콜백
                    },
                    check: options.check,
                    view: options.view,
                    data: options.data
                };
                $.get(options.url, function(data) {
                    var treeId = $("#treeId").val();
                    tree = $.fn.zTree.init($("#" + options.id), setting, data);
                    $._tree = tree;
                    for (var i = 0; i < options.expandLevel; i++) {
                        var nodes = tree.getNodesByParam("level", i);
                        for (var j = 0; j < nodes.length; j++) {
                            tree.expandNode(nodes[j], true, false, false);
                        }
                    }
                    var node = tree.getNodesByParam("id", treeId, null)[0];
                    $.tree.selectByIdName(treeId, node);
                    // 콜백tree방법
                    if(typeof(options.callBack) === "function"){
                        options.callBack(tree);
                    }
                });
            },
            // 검색노드
            searchNode: function() {
                // 가져오기입력키워드의 가치
                var value = $.common.trim($("#keyword").val());
                if ($.tree._lastValue == value) {
                    return;
                }
                // 저장마지막한번검색명
                $.tree._lastValue = value;
                var nodes = $._tree.getNodes();
                // 빈 문자열을 확인하려는 경우 확인하지 않습니다.
                if (value == "") {
                    $.tree.showAllNode(nodes);
                    return;
                }
                $.tree.hideAllNode(nodes);
                // 검색값 퍼지 일치
                $.tree.updateNodes($._tree.getNodesByParamFuzzy("name", value));
            },
            // Id 그리고 Name체크명세노드
            selectByIdName: function(treeId, node) {
                if ($.common.isNotEmpty(treeId) && node && treeId == node.id) {
                    $._tree.selectNode(node, true);
                }
            },
            // 보여줌모든노드
            showAllNode: function(nodes) {
                nodes = $._tree.transformToArray(nodes);
                for (var i = nodes.length - 1; i >= 0; i--) {
                    if (nodes[i].getParentNode() != null) {
                        $._tree.expandNode(nodes[i], true, false, false, false);
                    } else {
                        $._tree.expandNode(nodes[i], true, true, false, false);
                    }
                    $._tree.showNode(nodes[i]);
                    $.tree.showAllNode(nodes[i].children);
                }
            },
            // 숨김모든노드
            hideAllNode: function(nodes) {
                var nodes = $._tree.transformToArray(nodes);
                for (var i = nodes.length - 1; i >= 0; i--) {
                    $._tree.hideNode(nodes[i]);
                }
            },
            // 보여줌모든상위노드
            showParent: function(treeNode) {
                var parentNode;
                while ((parentNode = treeNode.getParentNode()) != null) {
                    $._tree.showNode(parentNode);
                    $._tree.expandNode(parentNode, true, false, false);
                    treeNode = parentNode;
                }
            },
            // 보여줌모든孩자식노드
            showChildren: function(treeNode) {
                if (treeNode.isParent) {
                    for (var idx in treeNode.children) {
                        var node = treeNode.children[idx];
                        $._tree.showNode(node);
                        $.tree.showChildren(node);
                    }
                }
            },
            // 변경노드상태
            updateNodes: function(nodeList) {
                $._tree.showNodes(nodeList);
                for (var i = 0, l = nodeList.length; i < l; i++) {
                    var treeNode = nodeList[i];
                    $.tree.showChildren(treeNode);
                    $.tree.showParent(treeNode)
                }
            },
            // get현재체크목록
            getCheckedNodes: function(column) {
                var _column = $.common.isEmpty(column) ? "id" : column;
                var nodes = $._tree.getCheckedNodes(true);
                return $.map(nodes, function (row) {
                    return row[_column];
                }).join();
            },
            // 루트 부모는 허용되지 않습니다 선택 
            notAllowParents: function(_tree) {
                var nodes = _tree.getSelectedNodes();
                if(nodes.length == 0){
                    $.modal.msgError(" 선택해주세요 포스트노드제출");
                    return false;
                }
                for (var i = 0; i < nodes.length; i++) {
                    if (nodes[i].level == 0) {
                        $.modal.msgError("할수없다  선택 루트노드(" + nodes[i].name + ")");
                        return false;
                    }
                    if (nodes[i].isParent) {
                        $.modal.msgError("할수없다  선택 상위노드(" + nodes[i].name + ")");
                        return false;
                    }
                }
                return true;
            },
            // 허용되지 않음 마지막계층노드 선택 
            notAllowLastLevel: function(_tree) {
                var nodes = _tree.getSelectedNodes();
                for (var i = 0; i < nodes.length; i++) {
                    if (!nodes[i].isParent) {
                        $.modal.msgError("할수없다  선택 마지막계층노드(" + nodes[i].name + ")");
                        return false;
                    }
                }
                return true;
            },
            // 숨김/검색란표시栏
            toggleSearch: function() {
                $('#search').slideToggle(200);
                $('#btnShow').toggle();
                $('#btnHide').toggle();
                $('#keyword').focus();
            },
            // 축소
            collapse: function() {
                $._tree.expandAll(false);
            },
            // 확장
            expand: function() {
                $._tree.expandAll(true);
            }
        },
        // 공통방법패키지 처리
        common: {
            // 판정캐릭터串여부 비었다
            isEmpty: function (value) {
                if (value == null || this.trim(value) == "") {
                    return true;
                }
                return false;
            },
            // 문자열이 비어 있지 않은지 확인
            isNotEmpty: function (value) {
                return !$.common.isEmpty(value);
            },
            // 空Object转캐릭터串
            nullToStr: function(value) {
                if ($.common.isEmpty(value)) {
                    return "-";
                }
                return value;
            },
            // 표시할지 여부데이터 비었다기본값보여줌
            visible: function (value) {
                if ($.common.isEmpty(value) || value == true) {
                    return true;
                }
                return false;
            },
            // 공간截取
            trim: function (value) {
                if (value == null) {
                    return "";
                }
                return value.toString().replace(/(^\s*)|(\s*$)|\r|\n/g, "");
            },
            // 比较둘캐릭터串(크기写敏感)
            equals: function (str, that) {
                return str == that;
            },
            // 比较둘캐릭터串(크기写불가敏感)
            equalsIgnoreCase: function (str, that) {
                return String(str).toUpperCase() === String(that).toUpperCase();
            },
            // 将캐릭터串按명세캐릭터分割
            split: function (str, sep, maxLen) {
                if ($.common.isEmpty(str)) {
                    return null;
                }
                var value = String(str).split(sep);
                return maxLen ? value.slice(0, maxLen - 1) : value;
            },
            // 문자열 형식화(%s )
            sprintf: function (str) {
                var args = arguments, flag = true, i = 1;
                str = str.replace(/%s/g, function () {
                    var arg = args[i++];
                    if (typeof arg === 'undefined') {
                        flag = false;
                        return '';
                    }
                    return arg == null ? '' : arg;
                });
                return flag ? str : '';
            },
            // 날짜 형식 시간戳  -> yyyy-MM-dd HH-mm-ss
            dateFormat: function(date, format) {
                var that = this;
                if (that.isEmpty(date)) return "";
                if (!date) return;
                if (!format) format = "yyyy-MM-dd";
                switch (typeof date) {
                case "string":
                    date = new Date(date.replace(/-/g, "/"));
                    break;
                case "number":
                    date = new Date(date);
                    break;
                }
                if (!date instanceof Date) return;
                var dict = {
                    "yyyy": date.getFullYear(),
                    "M": date.getMonth() + 1,
                    "d": date.getDate(),
                    "H": date.getHours(),
                    "m": date.getMinutes(),
                    "s": date.getSeconds(),
                    "MM": ("" + (date.getMonth() + 101)).substr(1),
                    "dd": ("" + (date.getDate() + 100)).substr(1),
                    "HH": ("" + (date.getHours() + 100)).substr(1),
                    "mm": ("" + (date.getMinutes() + 100)).substr(1),
                    "ss": ("" + (date.getSeconds() + 100)).substr(1)
                };
                return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g,
                function() {
                    return dict[arguments[0]];
                });
            },
            // get노드데이터,지원多계층입장
            getItemField: function (item, field) {
                var value = item;
                if (typeof field !== 'string' || item.hasOwnProperty(field)) {
                    return item[field];
                }
                var props = field.split('.');
                for (var p in props) {
                    value = value && value[props[p]];
                }
                return value;
            },
            // 명세무작위숫자반환
            random: function (min, max) {
                return Math.floor((Math.random() * max) + min);
            },
            // 판정캐릭터串여부 네start시작
            startWith: function(value, start) {
                var reg = new RegExp("^" + start);
                return reg.test(value)
            },
            // 판정캐릭터串여부 네end结尾
            endWith: function(value, end) {
                var reg = new RegExp(end + "$");
                return reg.test(value)
            },
            // 정렬去重
            uniqueFn: function(array) {
                var result = [];
                var hashObj = {};
                for (var i = 0; i < array.length; i++) {
                    if (!hashObj[array[i]]) {
                        hashObj[array[i]] = true;
                        result.push(array[i]);
                    }
                }
                return result;
            },
            // 정렬중적모든요소放入하나캐릭터串
            join: function(array, separator) {
                if ($.common.isEmpty(array)) {
                    return null;
                }
                return array.join(separator);
            },
            // getform下모든的설정并전환为jsonObject
            formToJSON: function(formId) {
                var json = {};
                $.each($("#" + formId).serializeArray(), function(i, field) {
                    if(json[field.name]) {
                        json[field.name] += ("," + field.value);
                    } else {
                        json[field.name] = field.value;
                    }
                });
                return json;
            },
            // 데이터사전转select
            dictToSelect: function(datas, value, name) {
                var actions = [];
                actions.push($.common.sprintf("<select class='form-control' name='%s'>", name));
                $.each(datas, function(index, dict) {
                    actions.push($.common.sprintf("<option value='%s'", dict.dictValue));
                    if (dict.dictValue == ('' + value)) {
                        actions.push(' selected');
                    }
                    actions.push($.common.sprintf(">%s</option>", dict.dictLabel));
                });
                actions.push('</select>');
                return actions.join('');
            },
            // getobjObject길이
            getLength: function(obj) {
                var count = 0;　　
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        count++;
                    }　　
                }
                return count;
            },
            // 판정이동端
            isMobile: function () {
                return navigator.userAgent.match(/(Android|iPhone|SymbianOS|Windows Phone|iPad|iPod)/i);
            },
            // 숫자정기적표현,0~9자리만 가능
            numValid : function(text){
                var patten = new RegExp(/^[0-9]+$/);
                return patten.test(text);
            },
            // 英文정기적표현, 문자 a-z 및 A-Z만
            enValid : function(text){
                var patten = new RegExp(/^[a-zA-Z]+$/);
                return patten.test(text);
            },
            // 英文,숫자정기적표현,~해야하다포함(字母,숫자)
            enNumValid : function(text){
                var patten = new RegExp(/^(?=.*[a-zA-Z]+)(?=.*[0-9]+)[a-zA-Z0-9]+$/);
                return patten.test(text);
            },
            // 英文,숫자,특별한캐릭터정기적표현,~해야하다포함(字母,숫자,특별한캐릭터!@#$%^&*()-=_+)
            charValid : function(text){
                var patten = new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#\$%\^&\*\(\)\-=_\+])[A-Za-z\d~!@#\$%\^&\*\(\)\-=_\+]{6,}$/);
                return patten.test(text);
            },
        }
    });
})(jQuery);

/** 양식 유형 */
table_type = {
    bootstrapTable: 0,
    bootstrapTreeTable: 1
};

/** Web상태 */
web_status = {
    SUCCESS: 0,
    FAIL: 500,
    WARNING: 301
};

/** 팝업 상태 코드 */
modal_status = {
    SUCCESS: "success",
    FAIL: "error",
    WARNING: "warning"
};