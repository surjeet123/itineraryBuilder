GeneralGenericUtilities = {
    callajaxReturnSuccess: function (url, type, form_data, IsLoader) {
        if (IsLoader) {
            GeneralGenericUtilities.ajaxindicatorstart('', 'Please wait');
        }
        return $.ajax({
            url: url,
            type: type,
            data: form_data
        });

    },
    callajaxReturnSuccessWithForgeToken: function (url, type, form_data, IsLoader) {
        if (IsLoader) {
            GeneralGenericUtilities.ajaxindicatorstart('', 'Please wait');
        }
        form_data.__RequestVerificationToken = $('input[name="__RequestVerificationToken"]').val();
        return $.ajax({
            url: url,
            type: type,
            data: form_data,
        });

    },
    callajaxReturnSuccessForFile: function (url, type, form_data, IsLoader) {
        if (IsLoader) {
            GeneralGenericUtilities.ajaxindicatorstart('', 'Please wait');
        }
        return $.ajax({
            url: url,
            type: type,
            data: form_data,
            enctype: "multipart/form-data",
            contentType: false,
            processData: false
        });

    },
    callajaxWithoutAsync: function (url, type, form_data) {
        var Model = null;
        //GeneralGenericUtilities.ajaxindicatorstart('', 'Please wait');
        $.ajax({
            url: url,
            type: type,
            data: form_data,
            async: false,
            success: function (data) {
                Model = data.model;
                //GeneralGenericUtilities.ajaxindicatorstop();
            },
            error: function (error) {

            }
        });
        return Model;
    },
    callajaxAsync: function (url, type, form_data) {
        var Model = null;
        GeneralGenericUtilities.ajaxindicatorstart('', 'Please wait');
        $.ajax({
            url: url,
            type: type,
            data: form_data,
            success: function (data) {
                Model = data.model;
                GeneralGenericUtilities.ajaxindicatorstop();
            },
            error: function (error) {

            }
        });
        return Model;
    },
    InitialiseDataTable: function (event) {
        try {
            $(event).DataTable({ destroy: true, order: [] });
        }
        catch (err) {
            console.log(err);
        }
    },
    callajaxforhtml: function (url, type, form_data) {
        var Model = null;
        $.ajax({
            cache: false,
            url: url,
            type: type,
            data: form_data,
            async: false,
            success: function (data) {
                Model = data;
            },
            error: function (error) {

            }
        });
        return Model;
    },
    CalAjaxFunctionRepetitivelyToLoadHTML: function (AjaxRequests, IsAsync) {

        //setup an array of AJAX options, each object is an index that will specify information for a single AJAX request
        // var ajaxes  = [{ url : '<url>', dataType : 'json' }, { url : '<url2>', dataType : 'xml' }],current = 0;
        var ajaxes = AjaxRequests, current = 0;
        //declare your function to run AJAX requests

        return new Promise(function (resolve, reject) {
            function do_ajax() {

                //check to make sure there are more requests to make
                if (current < ajaxes.length) {
                    if (ajaxes[current].data == undefined) {
                        ajaxes[current].data = {};
                    }
                    //make the AJAX request with the given data from the `ajaxes` array of objects
                    $.ajax({
                        url: ajaxes[current].url,
                        dataType: ajaxes[current].dataType,
                        data: ajaxes[current].data,
                        async: IsAsync,
                        type: ajaxes[current].type,
                        success: function (serverResponse) {
                            $(ajaxes[current].Controlid).html(serverResponse.model);
                            current++;

                            do_ajax();
                        }
                    });

                } else {
                    resolve(true);
                }
            }
            do_ajax();
        })
    },
    CalAjaxFunctionRepetitively: function (AjaxRequests, IsAsync, IsPredective) {

        //setup an array of AJAX options, each object is an index that will specify information for a single AJAX request
        // var ajaxes  = [{ url : '<url>', dataType : 'json' }, { url : '<url2>', dataType : 'xml' }],current = 0;
        var ajaxes = AjaxRequests, current = 0;
        //declare your function to run AJAX requests
        function do_ajax() {

            //check to make sure there are more requests to make
            if (current < ajaxes.length) {

                if (ajaxes[current].data == undefined) {
                    ajaxes[current].data = {};
                }
                //make the AJAX request with the given data from the `ajaxes` array of objects
                $.ajax({
                    url: ajaxes[current].url,
                    dataType: ajaxes[current].dataType,
                    data: ajaxes[current].data,
                    async: IsAsync,
                    success: function (serverResponse) {
                        GeneralGenericUtilities.BindDropdownGeneric(ajaxes[current].Controlid, serverResponse.model);
                        if (IsPredective) {
                            $('' + ajaxes[current].Controlid + '').chosen();
                            $('' + ajaxes[current].Controlid + '').trigger("liszt:updated");
                        }
                        if (ajaxes[current].IsPredective) {
                            $('' + ajaxes[current].Controlid + '').chosen();
                            $('' + ajaxes[current].Controlid + '').trigger("liszt:updated");
                        }
                        current++;

                        do_ajax();
                    }
                });
            }
        }
        do_ajax();
    },
    CalAjaxFunctionRepetitivelyWithPromise: function (AjaxRequests, IsAsync, IsPredective) {

        //setup an array of AJAX options, each object is an index that will specify information for a single AJAX request
        // var ajaxes  = [{ url : '<url>', dataType : 'json' }, { url : '<url2>', dataType : 'xml' }],current = 0;
        var ajaxes = AjaxRequests, current = 0;
        //declare your function to run AJAX requests
        return new Promise(function (resolve, reject) {
            function do_ajax() {

                //check to make sure there are more requests to make
                if (current < ajaxes.length) {

                    if (ajaxes[current].data == undefined) {
                        ajaxes[current].data = {};
                    }
                    //make the AJAX request with the given data from the `ajaxes` array of objects
                    $.ajax({
                        url: ajaxes[current].url,
                        dataType: ajaxes[current].dataType,
                        data: ajaxes[current].data,
                        async: IsAsync,
                        success: function (serverResponse) {
                            GeneralGenericUtilities.BindDropdownGeneric(ajaxes[current].Controlid, serverResponse.model);
                            if (IsPredective) {
                                $('' + ajaxes[current].Controlid + '').chosen();
                                $('' + ajaxes[current].Controlid + '').trigger("liszt:updated");
                            }
                            if (ajaxes[current].IsPredective) {
                                $('' + ajaxes[current].Controlid + '').chosen();
                                $('' + ajaxes[current].Controlid + '').trigger("liszt:updated");
                            }
                            current++;

                            do_ajax();
                        }
                    });
                } else {
                    resolve(true);
                }
            }
            do_ajax();
        })
    },
    CallAjaxFunctionRepetitivelyNew: function (AjaxRequests, IsAsync, onComplete) {

        //setup an array of AJAX options, each object is an index that will specify information for a single AJAX request
        // var ajaxes  = [{ url : '<url>', dataType : 'json' }, { url : '<url2>', dataType : 'xml' }],current = 0;
        var ajaxes = AjaxRequests, current = 0;
        //declare your function to run AJAX requests
        function do_ajax() {

            //check to make sure there are more requests to make
            if (current < ajaxes.length) {

                if (ajaxes[current].data == undefined) {
                    ajaxes[current].data = {};
                }
                //make the AJAX request with the given data from the `ajaxes` array of objects
                $.ajax({
                    url: ajaxes[current].url,
                    dataType: ajaxes[current].dataType,
                    data: ajaxes[current].data,
                    async: IsAsync,
                    success: function (serverResponse) {
                        GeneralGenericUtilities.BindDropdownGeneric(ajaxes[current].Controlid, serverResponse.model);
                        if (ajaxes[current].IsPredective) {
                            $('' + ajaxes[current].Controlid + '').chosen();
                            $('' + ajaxes[current].Controlid + '').trigger("liszt:updated");
                        }
                        current++;

                        do_ajax();
                    }
                });
            }

            // ajax calls completed, carry out optional onComplete function
            onComplete && onComplete();
        }
        do_ajax();
    },
    ajaxindicatorstart: function (Control, text) {

        jQuery('body').append('<div id="resultLoading" style="display:none"><div><img src="/Content/img/ajax-loader.gif"><div>' + text + '</div></div><div class="bg"></div></div>');
        jQuery('#resultLoading').css({
            'width': '100%',
            'height': '100%',
            'position': 'fixed',
            'z-index': '10000000',
            'top': '0',
            'left': '0',
            'right': '0',
            'bottom': '0',
            'margin': 'auto'
        });

        jQuery('#resultLoading .bg').css({
            'background': '#000000',
            'opacity': '0.7',
            'width': '100%',
            'height': '100%',
            'position': 'absolute',
            'top': '0'
        });

        jQuery('#resultLoading>div:first').css({
            'width': '250px',
            'height': '75px',
            'text-align': 'center',
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'right': '0',
            'bottom': '0',
            'margin': 'auto',
            'font-size': '16px',
            'z-index': '10',
            'color': '#ffffff'

        });

        jQuery('#resultLoading .bg').height('100%');
        jQuery('#resultLoading').fadeIn(300);
        //  jQuery('body').css('cursor', 'wait');
    },
    ajaxindicatorstop: function () {
        jQuery('#resultLoading .bg').height('100%');
        jQuery('#resultLoading').fadeOut(300);
        //jQuery('#' + Control + '').css('cursor', 'default');
    },
    ShowErrorMessage: function (message) {
        $.notify(message, { color: "#fff", align: "right", background: "#D44950", icon: "bell", verticalAlign: "top" });
    },
    ShowSuccessMessage: function (message) {
        $("#successMessage").html(message).fadeTo(2000, 500).slideUp(500);
    },
    showSuccessErrorMessage: function (Model, Message) {
        if (Model === true) {
            $.notify(Message, { color: "#fff", background: "#20D67B", icon: "check", align: "right", verticalAlign: "top" });
        }
        else {
            $.notify(Message || "Error Occured.Try Again.!!", { color: "#fff", align: "right", background: "#D44950", icon: "bell", verticalAlign: "top" });
        }
    },
    showSmallSuccessErrorMessage: function (SuccessControl, ErrorControl, Model, Message) {
        if (Model === true) {
            $.notify(Message, { color: "#fff", background: "#20D67B", icon: "check", align: "right", verticalAlign: "top" });
        }
        else {
            $.notify(Message || "Error Occured.Try Again.!!", { color: "#fff", align: "right", background: "#D44950", icon: "bell", verticalAlign: "top" });
        }
    },
    BindDropdownGeneric: function (controlid, Model) {
        $('' + controlid + '').html('');
        $.each(Model, function (i, v) {
            $('' + controlid + '').append('<option value="' + v.Value + '" ' + (v.Selected === true ? 'selected="true"' : '') + '>' + v.Text + '</option>');
        });

        return $('' + controlid + ''); // to allow jquery chain methods
    },
    BindDropdownGenericWithChosen: function (controlid, Model, isChosen) {
        if (isChosen)
            $('' + controlid + '').chosen();
        $('' + controlid + '').html('');
        $.each(Model, function (i, v) {
            $('' + controlid + '').append('<option value="' + v.Value + '" ' + (v.Selected === true ? 'selected="true"' : '') + '>' + v.Text + '</option>');
        });
        if (isChosen)
            $('' + controlid + '').trigger("liszt:updated");
    },
    SetDateTimeFormat: function (OldDate) {
        var MonthName = OldDate.substring(0, 3);
        var NewMonth = ("JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(MonthName) / 3 + 1);
        if (NewMonth.toString().length < 1)
            NewMonth = "0" + NewMonth;

        var NewDay = OldDate.replace(' ', '').replace(MonthName, '').substr(0, 2);

        var NewYear = OldDate.replace(' ', '').replace(MonthName, '').substr(3, 4);

        var Time = OldDate.split('-')[1];

        return NewMonth + "/" + NewDay + "/" + NewYear + Time;
    },
    SetDateFormat: function (OldDate) {
        var MonthName = OldDate.substring(0, 3);
        var NewMonth = ("JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(MonthName) / 3 + 1);
        if (NewMonth.toString().length < 1)
            NewMonth = "0" + NewMonth;

        var NewDay = OldDate.replace(' ', '').replace(MonthName, '').substr(0, 2);

        var NewYear = OldDate.replace(' ', '').replace(MonthName, '').substr(3, 4);

        //var Time = OldDate.split('-')[1];

        return NewMonth + "/" + NewDay + "/" + NewYear;
    },
    ConvertJsonResultToDate: function (JsonDate) {
        var mydate = JsonDate
        if (mydate != null) {
            var date = new Date(parseInt(mydate.replace(/\/Date\((-?\d+)\)\//, '$1')));
            mydate = GeneralGenericUtilities.zeroFill(date.getMonth() + 1) + '/' + GeneralGenericUtilities.zeroFill(date.getDate()) + '/' + GeneralGenericUtilities.zeroFill(date.getFullYear());
            return GeneralGenericUtilities.getFormattedDate(mydate);
        }
        return "";
    },
    zeroFill: function (i) {
        return (i < 10 ? '0' : '') + i;
    },
    getFormattedDate: function (input) {
        var pattern = /(.*?)\/(.*?)\/(.*?)$/;
        var result = input.replace(pattern, function (match, p1, p2, p3) {
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return months[(p1 - 1)] + " " + (p2 < 10 ? p2 : p2) + " " + p3;
        });
        return (result);
    },
    ConvertJsonResultToDateTime: function (JsonDate) {
        var mydate = JsonDate;
        if (mydate != null) {
            var date = new Date(parseInt(mydate.replace(/\/Date\((-?\d+)\)\//, '$1')));
            var day = GeneralGenericUtilities.zeroFill(date.getDate());
            var monthIndex = date.getMonth();
            var year = date.getFullYear();
            var hours = GeneralGenericUtilities.zeroFill(date.getHours());
            var minutes = GeneralGenericUtilities.zeroFill(date.getMinutes());
            var formattedDate = day + ' ' + GeneralGenericUtilities.getMonthAbbreviation(monthIndex) + ', ' + year + ', ' + hours + ':' + minutes;
            return formattedDate;
        }
        return "";
    },
    getFormattedDateTime: function (input) {
        var pattern = /(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2})\:(\d{1,2})/;
        var result = input.replace(pattern, function (match, p1, p2, p3, p4, p5) {
            var day = p1;
            var monthIndex = parseInt(p2) - 1;
            var year = p3;
            var hours = GeneralGenericUtilities.zeroFill(p4);
            var minutes = GeneralGenericUtilities.zeroFill(p5);
            return day + ' ' + GeneralGenericUtilities.getMonthAbbreviation(monthIndex) + ', ' + year + ', ' + hours + ':' + minutes;
        });

        return result;
    },
    getMonthAbbreviation: function (monthIndex) {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthIndex];
    },
    SetInactiveCheckbox: function (ControlID, Status) {
        $('#' + ControlID + '').find('#no-more-tables').find('.row:eq(0) .col-sm-6').each(function (i, v) {
            if (i == 0) {
                $(this).removeClass('col-sm-6').addClass('col-sm-4');
            }
            else {
                $(this).removeClass('col-sm-6').addClass('col-sm-2');
            }
        });
        $('<div class="col-sm-6" style="text-align: right;"><input type="checkbox" chktype="GetStatusRecord" id="chk' + ControlID + '" ' + Status + '/> Show inactive only</div>').insertAfter($('#' + ControlID + '').find('#no-more-tables').find('.row:eq(0) .col-sm-4'));

    },
    GetTodayDate: function () {
        var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");
        var tdate = new Date();
        var dd = tdate.getDate(); //yields day
        var MM = tdate.getMonth(); //yields month
        var yyyy = tdate.getFullYear(); //yields year

        var currentDate = m_names[MM] + " " + dd + " " + yyyy;
        return currentDate;
    },
    SetAndRemoveUpdateActions: function (UpdatedString, AddType) {
        UpdateActions = UpdateActions + UpdatedString + ",";
    },
    CheckValidationGeneric: function (event) {
        var IsValid = true;
        $(event).find('select[isrequired="true"]').each(function () {

            if ($('option:selected', this).val() == "-1") {
                $(this).addClass('error');
                var controlid = $(this).attr('id')
                $('#' + controlid + '_chzn').addClass('error');
                IsValid = false;
            }
        });
        $(event).find('input[isrequired="true"], textarea[isrequired="true"]').each(function () {

            if ($(this).val() == "") {
                $(this).addClass('error');
                IsValid = false;
            }

        });
        return IsValid;
    },
    getParameterByName: function (name, isIframe = false) {
        var regexS = "[\\?&]" + name + "=([^&#]*)",
            regex = new RegExp(regexS),
            results = isIframe
                ? regex.exec(window.parent.location.href)
                : regex.exec(window.location.search);
        if (results == null) {
            return "";
        } else {
            return decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    },
    getParameterByNameForPO: function (name, isIframe = false) {
        var regexS = "[\\?&]" + name + "=([^&#]*)",
            regex = new RegExp(regexS),
            results = isIframe
                ? regex.exec(window.parent.location.href)
                : regex.exec(window.location.search);
        if (results == null) {
            return "";
        } else {
            return decodeURIComponent(results[1]);
        }
    },
    showNotification: function (message, isSuccess, aHideDelay = 3000, clickHide = false, alignToPosY = null) {
        // to make it work as CLICK TO HIDE, delay needs to be set to 0 and clickToHide to false

        let notifyOptions = { color: '#fff', align: 'right', icon: 'bell', verticalAlign: 'top' };

        notifyOptions.background = isSuccess == true
            ? '#50D449'
            : '#D44950';

        notifyOptions.autoHideDelay = aHideDelay;
        notifyOptions.clickToHide = clickHide;

        if (alignToPosY != null) {
            notifyOptions.verticalAlign = 'toPositionY';
            notifyOptions.verticalAlignPositionY = this.getParameterByName('hideGui') == 1
                ? alignToPosY - 1
                : alignToPosY;
        }

        $.notify(message, notifyOptions);
    },
    IsEmptyOrSpaces: function (str) {
        return !str || str.match(/^ *$/) !== null;
    },

    addSpaceBeforeCapital(str) {
        // Remove "ID" suffix if it appears at the end
        str = str.replace(/ID$/, '');

        // Add space before capital letters
        return str.replace(/([a-z])([A-Z])/g, '$1 $2');
    },

    validateEmail(email) {
        var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        return emailReg.test(email);
    },

    SweetAlertErrorNotification(message) {
        Swal.fire({
            icon: "error",
            text: message,
        });
    },
    InitilizeBT5DatePicker(controlID) {
        $('' + controlID + '').datetimepicker({
            language: 'en',
            formatType: 'standard',
            format: 'dd M yyyy',
            pickTime: false,
            minView: 2,
            todayHighlight: true,
        });
    },
    ConvertToMMDDYYYY: function (dateString) {
        // Parse the date string into a JavaScript Date object
        var date = new Date(dateString);

        if (!isNaN(date.getTime())) {
            // Get the month, date, and year
            var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if needed
            var day = date.getDate().toString().padStart(2, '0');           // Add leading zero if needed
            var year = date.getFullYear();

            // Return in MM/dd/yyyy format
            return month + '-' + day + '-' + year;
        }
        return "";
    },
    ConvertJsonResultToDateDDMMYYYY: function (JsonDate) {
        var mydate = JsonDate
        if (mydate != null) {
            var date = new Date(parseInt(mydate.replace(/\/Date\((-?\d+)\)\//, '$1')));
            mydate = GeneralGenericUtilities.zeroFill(date.getDate()) + '/' + GeneralGenericUtilities.zeroFill(date.getMonth() + 1) + '/' + date.getFullYear();
            return GeneralGenericUtilities.getFormattedDateDDMMYYYY(mydate);
        }
        return "";
    },
    getFormattedDateDDMMYYYY: function (input) {
        var pattern = /(.*?)\/(.*?)\/(.*?)$/;
        var result = input.replace(pattern, function (match, p1, p2, p3) {
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return p1 + " " + months[parseInt(p2) - 1] + " " + p3;
        });
        return (result);
    },
    RefreshDataTable: function (dataTableId) {
        var dataTable = $(dataTableId).DataTable();
        var currentPage = dataTable.page.info().page;  // Store the current page number

        // Refresh the DataTable
        dataTable.ajax.reload(function () {
            dataTable.page(currentPage).draw(false);    // Set the page back to the stored page number
        });

    }
};