(function() {

    $('#continue').on('click',function() {
        $('#step-1').addClass('hidden');
        $('#step-2').removeClass('hidden');
    });

    $('#back').on('click', function () {
        $('#step-2').addClass('hidden');
        $('#step-1').removeClass('hidden');
    });
})();