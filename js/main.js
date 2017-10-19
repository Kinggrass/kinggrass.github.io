var slideIndex = 1;

function plusDivs(n) {
    showDivs(slideIndex += n);
}

function currentDiv(n, element) {
    showDivs(slideIndex = n);
    if (element) {
        $(element).addClass('selected_img');
        $(element).siblings('div').removeClass('selected_img');
    }
}

function showDivs(n) {
    var $slides = $(".mySlides");
    if ($slides) {
        var $dots = $(".gallery_thumb");
        if (n > $slides.length) {
            slideIndex = 1
        }
        if (n < 1) {
            slideIndex = $slides.length
        }


        $dots.removeClass("slider_opacity");
        $slides.fadeOut(1000);

        $slides.promise().done(function () {
            $slides.eq(slideIndex - 1).fadeIn(1000);
            $dots.eq(slideIndex - 1).addClass("slider_opacity");
        });
    }
}



$.urlParam = function (a) {
    var b = new RegExp("[?&]" + a + "=([^&#]*)").exec(window.location.href);
    if (b == null) {
        return null
    } else {
        return b[1] || 0
    }
};


function removeURLParameter(url, parameter) {
    //prefer to use l.search if you have a location/link object
    var urlparts = url.split('?');
    if (urlparts.length >= 2) {

        var prefix = encodeURIComponent(parameter) + '=';
        var pars = urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (var i = pars.length; i-- > 0;) {
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }

        url = urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : "");
        return url;
    } else {
        return url;
    }
}

function updateURL(path, targetPage) {
    window.history.pushState({
        "html": removeURLParameter(removeURLParameter(window.location.pathname, 'content'), 'path') + "?content=" + targetPage + "&path=" + path,
        "pageTitle": targetPage
    }, "", removeURLParameter(removeURLParameter(window.location.pathname, 'content'), 'path') + "?content=" + targetPage + "&path=" + path);
}

function updatePageTitle(titleOfPage) {
    document.title = titleOfPage.replace('_', ' ');
}

function highlightSelectedMenuEntry(selectedContent) {
    $("#navigation > ul").children().each(function () { //LOAD CONTENT AT CLICK
        $aChild = $(this).children("a");
        if ($aChild.attr("contenttoload") && $aChild.attr("contenttoload").length != 0 && $aChild.attr("contenttoload") === selectedContent) {
            $(this).addClass("current_selected_page");
        } else {
            $(this).removeClass("current_selected_page");
        }
    });
}

function loadContent(path, contentToLoad) {

    $("#main_section").slideUp(1000, function () {
        $("#main_section").load(path + contentToLoad + ".html #content_to_load", function (response, status, xhr) {
            if (status == "error") {
                var msg = "Sorry but there was an error: ";
                $("#main_section").html(msg + xhr.status + " " + xhr.statusText + " </br>Please contact me about this.");
                $("#main_section").addClass("error_message");
            } else {
                updateURL(path, contentToLoad);
                updatePageTitle(contentToLoad);
                highlightSelectedMenuEntry(contentToLoad);
                $("#main_section").attr("content_name", contentToLoad);
                $("#main_section").removeClass("error_message");
            }
            $("#main_section").fadeIn(1000, function () {
                $("#content_text").slideDown(1000, function () {
                    setupGallery();
                    if (contentToLoad === 'references') {
                        loadReferences();
                    }
                });
            });
        });
    });
}

function setupGallery() {
    var $galleries = $(".my_gallery");
    if ($galleries) {
        $galleries.each(function () {

            var $oneGallery = $(this);
            $oneGallery.append('<div class="gallery_nav"></div>');


            $oneGallery.children(".mySlides").each(function (index, value) {
                var $gallerynav = $oneGallery.find(".gallery_nav");
                $gallerynav.append('<div ' + (index === 0 ? 'class="selected_img"' : '') + ' onclick="currentDiv(' + (index + 1) + ', this)"><span class="helper"></span><img class="gallery_thumb" src="' + $(this).attr('src') + '"></div>');
            });
        });
        slideIndex = 1;
        currentDiv(slideIndex, null);
    }
}



$(document).ready(function () {
    /* SUBSTITUTE CONTENT ON NAVIAGTION CLICK*/

    var contentToLoad = $.urlParam("content"); //LOAD CONTENT AT START OF PAGE
    var pathToLoad = $.urlParam("path");

    if(!contentToLoad || !pathToLoad){
        loadContent('_include/_content/', 'about_me');
    }
    else if(contentToLoad !== "") {
        loadContent(pathToLoad, contentToLoad);
    }



    /* ######################################## */
});


function navigationClick(element) {
    $aChild = $(element).children("a");
    $currentContent = $("#main_section").attr("content_name");
    if ($aChild.attr("contenttoload") && $aChild.attr("contenttoload").length != 0 && $aChild.attr("contenttoload") !== $currentContent) {
        loadContent("_include/_content/", $aChild.attr("contenttoload"));
    }
}
/*
$(window).load(function() {
   $("#navigation > ul > li").click(function (e) { //LOAD CONTENT AT CLICK
        e.preventDefault();
        
    });
});
*/
function loadOneReference(index) {

    var $referenceBuild = $('<div contenttoload="reference_' + index + '" id="reference_work_' + index + '" class="reference_work"> <div class="reference_work_title"><h1>Project <span>No.' + index + '</span></h1></div> <div class="reference_work_thumb"><div class="reference_work_description"></div></div> </div>');

    $referenceBuild.click(function (e) { //LOAD CONTENT AT CLICK
        $aChild = $(this);
        $currentContent = $("#main_section").attr("content_name");

        if ($aChild.attr("contenttoload") && $aChild.attr("contenttoload").length != 0 && $aChild.attr("contenttoload") !== $currentContent) {
            loadContent("_include/_content/_references/", $aChild.attr("contenttoload"));
        }
    });

    $referenceBuild.mousedown(function (event) {
        switch (event.which) {
            case 2:
                //alert('Middle mouse button pressed');
                $aChild = $(this);
                console.log("middle click");
                var win = window.open('index.html?content=' + $aChild.attr("contenttoload") + '&path=_include/_content/_references/', '_blank');
                if (win) {
                    event.preventDefault();
                } else {
                    //Browser has blocked it
                    alert('Please allow popups for this website, to open the links with middle click in an new tab.');
                }
                return false;
                break;
            default:
                //alert('You have a strange mouse');
                $(this).attr('target', '_self"');
        }
    });

    $("#reference_collection")
        .append($referenceBuild);

    var currentDestination = "#reference_work_" + index;
    var currentLoadTarget = "_include/_content/_references/reference_" + index + ".html";

    $('<div/>').load(currentLoadTarget + " .my_gallery:first > img:first", function (response, status, xhr) {
        if (status == "error") {
            $("#reference_collection " + currentDestination).remove();
        } else {
            $(currentDestination + " .reference_work_thumb").css('background-image', 'url("' + $(this).children(":first").attr('src') + '")');

            $('<div/>').load(currentLoadTarget + " #content_title", function (response, status, xhr) {
                if (status == "error") {

                } else {

                    var $titleToAppend = $(this).children('h1').first();
                    $titleToAppend.removeAttr('id');

                    if ($titleToAppend.data('shortdescr')) {
                        $titleToAppend.text($titleToAppend.data('shortdescr'));
                    }
                    $(currentDestination + " .reference_work_title").append($titleToAppend);
                }
            });
            $('<div/>').load(currentLoadTarget + " #description", function (response, status, xhr) {
                if (status == "error") {

                } else {

                    var $descriptionToAppend = $(this).children('#description').first().html();

                    $(currentDestination + " .reference_work_thumb .reference_work_description").append($descriptionToAppend);
                }
            });
            loadOneReference(index + 1);
        }
    });
}

function loadReferences() {
    var loadindex = 0;
    loadOneReference(loadindex);
}

$(window).on("popstate", function (e) {
    var contentToLoad = $.urlParam("content"); //LOAD CONTENT AT START OF PAGE
    var pathToLoad = $.urlParam("path");

    if (contentToLoad !== "") {
        loadContent(pathToLoad, contentToLoad);
    }
});
