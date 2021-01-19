let visitModule = (function () {
    let customerId = null;
    let $tbody = $('.tbody'),
        $visitTime = $('.visitTime'),
        $visitText = $('.visitText'),
        $submit = $('.submit');
    //=>让默认的拜访日期是明天
    // let time = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toLocaleString().split(' ')[0];
    //=>让默认的拜访日期是今天
    let time = (new Date).toLocaleString().split(' ')[0].formatTime('{0}-{1}-{2}');
    $visitTime.val(time);

    let bindVisitList = () => {};

    return {
        init() {
            customerId = window.location.href.queryURLParams().customerId || "";

            // bindVisitList()
            // bindDelete();
            // bindSubmit();
        }
    }
}());

visitModule.init();