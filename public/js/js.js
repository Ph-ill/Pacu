var firstrun = true;
var JobIDArray = [];
var IDs = [];
$(document).ready(function () {
    $('#fidgetspinner').hide();
    $('#fidgetspinner').fadeIn("slow", function () {});
    $('.jobdivouterclass').hide();
    $('#infodiv').hide();
    $('#infobutton').click(function () {
        $('#infodiv').fadeIn("fast", function () {});
    });
    $(document).click(function () {
        $('#infodiv').fadeOut("fast", function () {});
    });
    $("#infodiv").click(function (e) {
        e.stopPropagation();
        return false;
    });
    $("#infobutton").click(function (e) {
        e.stopPropagation();
        return false;
    });
    $('#infobutton')
        .hover(function () {
            $(this).stop().animate({
                top: -10
            }, 'fast');
        }, function () {
            $(this).stop().animate({
                top: -75
            }, 'fast');
        });
});

$(function () {
    var socket = io.connect('web-dev:8009');
    socket.on('newJob', function (JobID, JobDesc, JobDateTime, JobAuthor, JobStatusID, PushComplete, JobEntity) {
        JobIDArray.push(JobID)
        if (PushComplete) {
            IDs = [];
            $("#pagewrapper").find(".jobdivouterclass").each(function () {
                IDs.push(this.id);
            });
            for (i = 0; i < JobIDArray.length; i++) {
                try {
                    if (IDs[i] != "jobdivouter") {
                        if (contains.call(JobIDArray, IDs[i].substr(5)) == false) {
                            $("#" + IDs[i]).remove();
                            console.log("Removed Job: " + IDs[i].substr(5))
                        }
                    }
                } catch (err) {
                    //error output here
                }
            }
            JobIDArray = [];
        }
        if (firstrun != true) {
            $('#fidgetspinner').fadeOut("fast", function () {});
            if ($("#JobID" + JobID).length == 0) {
                if(JobID){ //THIS IS NEW AND PROBABLY BREAKS EVERYTHING
                    console.log("Adding Job: " + JobID)
                    var clone = $("#jobdivouter").clone();
                    clone.attr("id", "JobID" + JobID);
                    $("#pagewrapper").prepend(clone);
                }
            }
            $("#JobID" + JobID + " > #jobdivinner > #JobTitle").text("Work Order: " + JobID);
            $("#JobID" + JobID + " > #jobdivinner > #JobDesc").text(JobDesc);
            $("#JobID" + JobID + " > #jobdivinner > #JobTime").text(JobDateTime);
            $("#JobID" + JobID + " > #jobdivinner > #JobAuthor").text(JobAuthor);
            $("#JobID" + JobID + " > #jobdivinner > #JobEntity").text(JobEntity);
            if (JobStatusID == 1) {
                $("#JobID" + JobID + " > #jobdivinner").css({
                    'box-shadow': "0px 0px 0px 3px rgba(209,0,0,1)"
                });
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "rgb(248,80,50)"
                });
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "-webkit-linear-gradient(top, rgba(248,80,50,1) 0%,rgba(241,111,92,1) 50%,rgba(246,41,12,1) 52%,rgba(240,47,23,1) 71%,rgba(231,56,39,1) 100%)"
                });
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "-linear-gradient(to bottom, rgba(248,80,50,1) 0%,rgba(241,111,92,1) 50%,rgba(246,41,12,1) 52%,rgba(240,47,23,1) 71%,rgba(231,56,39,1) 100%)"
                });
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "-webkit-linear-gradient(top, rgba(248,80,50,1) 0%,rgba(241,111,92,1) 50%,rgba(246,41,12,1) 52%,rgba(240,47,23,1) 71%,rgba(231,56,39,1) 100%)"
                });
            } else if (JobStatusID == 2) {
                $("#JobID" + JobID + " > #jobdivinner").css({
                    'box-shadow': "0px 0px 0px 3px rgba(248,80,50, 1)"
                });
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "rgb(247,204,86)"
                });
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "-moz-linear-gradient(top, rgba(247,204,86,1) 0%, rgba(244,146,9,1) 50%, rgba(242,109,38,1) 53%, rgba(247,157,74,1) 100%)"
                });
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "-webkit-linear-gradient(top, rgba(247,204,86,1) 0%,rgba(244,146,9,1) 50%,rgba(242,109,38,1) 53%,rgba(247,157,74,1) 100%)"
                });
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "background: linear-gradient(to bottom, rgba(247,204,86,1) 0%,rgba(244,146,9,1) 50%,rgba(242,109,38,1) 53%,rgba(247,157,74,1) 100%)"
                });
            } else if (JobStatusID == 3) {
                $("#JobID" + JobID + " > #jobdivinner").css({
                    'box-shadow': "0px 0px 0px 3px rgba(226,196,0, 1)"
                });
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "rgb(241,249,87)"
                });
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "-moz-linear-gradient(top, rgba(241,249,87,1) 0%, rgba(239,239,38,1) 50%, rgba(229,203,9,1) 54%, rgba(238,247,74,1) 100%)"
                });
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "-webkit-linear-gradient(top, rgba(241,249,87,1) 0%,rgba(239,239,38,1) 50%,rgba(229,203,9,1) 54%,rgba(238,247,74,1) 100%)"
                });
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "linear-gradient(to bottom, rgba(241,249,87,1) 0%,rgba(239,239,38,1) 50%,rgba(229,203,9,1) 54%,rgba(238,247,74,1) 100%)"
                });
            } else if (JobStatusID == 4) {
                $("#JobID" + JobID + " > #jobdivinner").css({
                    'box-shadow': "0px 0px 0px 3px rgba(127, 168, 38, 1)"
                });
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "rgb(191,210,85)"
                });
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "-moz-linear-gradient(top, rgba(191,210,85,1) 0%, rgba(142,185,42,1) 50%, rgba(114,170,0,1) 52%, rgba(158,203,45,1) 100%)"
                });
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "-webkit-linear-gradient(top, rgba(191,210,85,1) 0%,rgba(142,185,42,1) 50%,rgba(114,170,0,1) 52%,rgba(158,203,45,1) 100%)"
                });
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "linear-gradient(to bottom, rgba(191,210,85,1) 0%,rgba(142,185,42,1) 50%,rgba(114,170,0,1) 52%,rgba(158,203,45,1) 100%)"
                });
            } else if (JobStatusID == 5) {
                $("#JobID" + JobID + " > #jobdivinner").css({
                    'box-shadow': "0px 0px 0px 3px rgba(136, 148, 155, 1)"
                });
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "rgb(242,246,248)"
                });
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "-moz-linear-gradient(top, rgba(242,246,248,1) 0%, rgba(216,225,231,1) 50%, rgba(181,198,208,1) 52%, rgba(224,239,249,1) 100%)"
                });
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "-webkit-linear-gradient(top, rgba(242,246,248,1) 0%,rgba(216,225,231,1) 50%,rgba(181,198,208,1) 52%,rgba(224,239,249,1) 100%)"
                });
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "linear-gradient(to bottom, rgba(242,246,248,1) 0%,rgba(216,225,231,1) 50%,rgba(181,198,208,1) 52%,rgba(224,239,249,1) 100%)"
                });
            }
            $('#JobID' + JobID).fadeIn("slow", function () {});
        }
        if (PushComplete == true) {
            firstrun = false;
        }
    });
});
var contains = function (needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if (!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function (needle) {
            var i = -1,
                index = -1;

            for (i = 0; i < this.length; i++) {
                var item = this[i];

                if ((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};