if (typeof jQuery != 'undefined') {
    if (typeof (ga) == 'undefined') {
        console.error("Google Analytics is not set up correctly, no tracking taking place.");
    } else {

        //Downloads, external links, tel, mailto and hash links
        var filetypes = /\.(zip|exe|dmg|pdf|doc.*|xls.*|ppt.*|mp3|txt|rar|wma|mov|avi|wmv|flv|wav)$/i;
        var baseHref = '';
        if (jQuery('base').attr('href') != undefined) baseHref = jQuery('base').attr('href');
        var hrefRedirect = '';

        gaHitCallbackHandler = function () {
            window.location.href = hrefRedirect;
        }

        jQuery('body').on('click', 'a', function (event) {
            var el = jQuery(this);
            var track = true;
            var href = (typeof (el.attr('href')) != 'undefined') ? el.attr('href') : '';
            var classes = (typeof (el.attr('class')) != 'undefined') ? el.attr('class') : '';
            var id = (typeof (el.attr('id')) != 'undefined') ? el.attr('id') : '';
            var identifiers = "Href:{" + href + "}, ID:{" + id + "}, Classes:{" + classes + "}";
            var isThisDomain = href.match(document.domain.split('.').reverse()[1] + '.' + document.domain.split('.').reverse()[0]);
            if (!href.match(/^javascript:/i)) {
                var elEv = []; elEv.value = 0, elEv.non_i = false;
                if (href.match(/^mailto\:/i)) {
                    elEv.category = 'email';
                    elEv.action = 'click';
                    elEv.label = href.replace(/^mailto\:/i, '');
                    elEv.loc = href;
                }
                else if (href.match(filetypes)) {
                    var extension = (/[.]/.exec(href)) ? /[^.]+$/.exec(href) : undefined;
                    elEv.category = 'download';
                    elEv.action = 'click-' + extension[0];
                    elEv.label = href.replace(/ /g, '-');
                    elEv.loc = baseHref + href;
                }
                else if (href.match(/^https?\:/i) && !isThisDomain) {
                    elEv.category = 'external';
                    elEv.action = 'click';
                    elEv.label = href.replace(/^https?\:\/\//i, '');
                    elEv.non_i = true;
                    elEv.loc = href;
                }
                else if (href.match(/^tel\:/i)) {
                    elEv.category = 'telephone';
                    elEv.action = 'click';
                    elEv.label = href.replace(/^tel\:/i, '');
                    elEv.loc = href;
                }
                else if (href.match(/^#/i)) {
                    elEv.category = 'hash link';
                    elEv.action = 'click';
                    elEv.label = identifiers;
                    elEv.loc = href;
                }
                else track = false;

                if (track) {
                    var ret = true;

                    if ((elEv.category == 'external' || elEv.category == 'download') && (el.attr('target') == undefined || el.attr('target').toLowerCase() != '_blank')) {
                        hrefRedirect = elEv.loc;
                        ga('send', 'event', elEv.category.toLowerCase(), elEv.action.toLowerCase(), elEv.label.toLowerCase(), elEv.value, {
                            'nonInteraction': elEv.non_i,
                            'hitCallback': gaHitCallbackHandler
                        });

                        ret = false;
                    }
                    else {
                        ga('send', 'event', elEv.category.toLowerCase(), elEv.action.toLowerCase(), elEv.label.toLowerCase(), elEv.value, {
                            'nonInteraction': elEv.non_i
                        });
                    }

                    return ret;
                }
            }
        });

        //Special stuff
        gaTriggerCallbackHandler = function () {
            //? Not sure what to do here, as js-ga-event-trigger could be literally anything.

            //If it were a link, we'd want to store the href and then redirect...
            //If it were a submit button, we'd want to pause until this, then continue submitting the form, but we should deal with forms separately because 'click' is a bad event for that - Ignores keyboard input submissions etc.
            //I guess the only thing this is useful for is checking to see if people click on things they shouldn't? In which case, no callback is necessary.
        }
        jQuery('body').on('click', '.js-ga-event-trigger', function (event) {
            var el = jQuery(this);
            var category = (typeof (el.attr('data-ga-category')) != 'undefined') ? el.data('ga-category') : '';
            var action = (typeof (el.attr('data-ga-action')) != 'undefined') ? el.data('ga-action') : 'click'; //Defaults to click as this is the click event
            var label = (typeof (el.attr('data-ga-label')) != 'undefined') ? el.data('ga-label') : '';
            var value = (typeof (el.attr('data-ga-value')) != 'undefined') ? el.data('ga-value') : '';

            ga('send', 'event', category, action, label, value, {
                'hitCallback': gaTriggerCallbackHandler
            });
        });

        //Forms
        jQuery('form.js-ga-track-form').on('submit', function (e) {
            e.preventDefault();
            var el = jQuery(this);

            //Let's figure out some way of identifying this form if no data-attr's are set
            var href = (typeof (el.attr('action')) != 'undefined') ? el.attr('action') : '';
            var classes = (typeof (el.attr('class')) != 'undefined') ? el.attr('class') : '';
            var id = (typeof (el.attr('id')) != 'undefined') ? el.attr('id') : '';
            var identifiers = "Action:{" + href + "}, ID:{" + id + "}, Classes:{" + classes + "}";

            var category = (typeof (el.attr('data-ga-category')) != 'undefined') ? el.data('ga-category') : 'form'; //Default category of form
            var action = (typeof (el.attr('data-ga-action')) != 'undefined') ? el.data('ga-action') : 'submit'; //Defaults to submit as this is the submit event
            var label = (typeof (el.attr('data-ga-label')) != 'undefined') ? el.data('ga-label') : identifiers; //If no label is specified, use our identifiers
            var value = (typeof (el.attr('data-ga-value')) != 'undefined') ? el.data('ga-value') : '';

            //Check validity (Standard jQuery validate assumed)
            if (el.valid()) {
                //console.log('valid');
                //This is valid, so do nothing.
            } else {
                //console.log('not valid');
                //Not valid, so let's edit the action to imply that.
                action = action + "-failed-validation";
            }

            //Fire the event, then if this was a valid submission remove the submit prevention and re-submit.
            ga('send', 'event', category, action, label, value, {
                'hitCallback': function () {
                    if (el.valid()) {
                        el.off('submit');
                        el.submit();
                    }
                }
            });

            return false;
        });
    }
}
