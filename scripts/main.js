jQuery(function ($) {

    // place script here
    var speed = 300;

    function isAboveMobileSize() {
        // <=ie8 will always return false from Modernizr.mq http://stackoverflow.com/questions/14766074/getting-modernizr-mq-working-in-ie-8
        // we want to include <=ie8 in this desktop size bracket
        return !Modernizr.mq("only screen and (max-width: 679px)");
    }
    function iPadLandscape() {
        // <=ie8 will always return false from Modernizr.mq http://stackoverflow.com/questions/14766074/getting-modernizr-mq-working-in-ie-8
        // we want to include <=ie8 in this desktop size bracket
        return !Modernizr.mq("only screen and (min-device-width : 768px) and (max-device-width : 1024px) and (orientation : landscape)");
    }
    function isDesktopSize() {
        // <=ie8 will always return false from Modernizr.mq http://stackoverflow.com/questions/14766074/getting-modernizr-mq-working-in-ie-8
        // we want to include <=ie8 in this desktop size bracket
        return !Modernizr.mq("only screen and (max-width: 979px)");
    }
	
	//Any input which redirects a user
    $(".js-shortcut").change(function () {
        var url = $(this).val();
        if (url !== "default") {
            window.location.href = url;
        }
    });
	
	//Toggle element visibility
    $('.js-toggle').click(function () {
        var toggleClass = $(this).data('target');
        $(this).toggleClass('toggled');
        $(target).toggle();
        return false;
    });
	
	//Toggle class
    $('.js-toggle-class').click(function () {
        var toggleClass = $(this).data('class');
        if ($(this).attr('data-target')) {
            var target = $(this).data('target');
            $(target).toggleClass(toggleClass);
            $(this).toggleClass('toggled');
        } else {
            $(this).toggleClass(toggleClass);
        }
        return false;
    });
	
	//Focus
    $('.js-focus').click(function () {
        var target = $(this).data('focus');
        var $target = $(target);
        $target.focus();
        $target.val($target.val());
    });
	

	//Prevent disabled links/buttons
    $('.btn, a, button, input[type=submit]').click(function (e) {
        if ($(this).hasClass('btn-disabled') || $(this).hasClass('disabled')) {
            e.preventDefault();
            return false;
        }   
    });
	
	//Tables - Responsive, activate!
    $('table').each(function () {
        var currentTable = $(this);
        if ($(this).find('th').length) {
            $(this).find('th').each(function (i) {
                var label = $(this).text();
                $(this).addClass('table-label');
                $(currentTable).find('tr').each(function () {
                    $(this).find('td').eq(i).attr('data-label', label);
                });
            });
        }
    });

    $('.js-trigger-calendar').click(function(){
        $('.addthisevent-drop').trigger('click');
        return false;
    });
	
	//A variety of height based functionality which we run once up front, then again on resize
    function setHeights() {
        var eq = [
            ".what-when-where-segment",//An element you want to eqh
        ], num, group_every, i, count, max; 

		for (num in eq) {         
			if ($(eq[num]).length) {
				$(eq[num]).css('height', 'auto');
				group_every = 1; //Change this on a per element basis with if (eq[num] == ".featured-job"), or based on isDesktopSize etc - If you want to change the number per row
				if(isDesktopSize()){ group_every = 3; }
				i = 0;

				//Count all of our chosen
				count = $(eq[num]).size();

				//Until the current position is higher than count (ie, until we've done them all), increment by group_every.
				//This allows us to group things, for example, if you have a huge <ul> list and want each line of five to be equal, group_every 5 will achieve that without having to break them into seperate ULs.
				for (i = 0; i < count; i = i + group_every) {
					max = 0;
					$(eq[num]).slice(i, (i + group_every)).
					//Compare heights among this group
					each(function () {
						max = Math.max($(this).outerHeight(), max);
						//Set all in this group to that height
					}).height(max);
				}

			}
		}		
    }
    setHeights();
    $(window).on('resize', setHeights);
	
	//Smooth scroll anchor jump
	$('a[href*=#]').click(function(){
		$('html, body').animate({
			scrollTop: $( $.attr(this, 'href') ).offset().top
		}, 700);
		return false;
	});

});     //jQuery