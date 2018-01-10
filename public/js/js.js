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
            $("#titlebartext").text("Low Priority Work Orders - " + ($('div.jobdivouterclass').length-1));
            $("#JobID" + JobID + " > #jobdivinner > #JobTitle").text("Work Order: " + JobID);
            $("#JobID" + JobID + " > #jobdivinner > #JobDesc").text(JobDesc);
            $("#JobID" + JobID + " > #jobdivinner > #JobTime").text(JobDateTime);
            $("#JobID" + JobID + " > #jobdivinner > #JobAuthor").text(JobAuthor);
            $("#JobID" + JobID + " > #jobdivinner > #JobEntity").text(JobEntity);
            if (JobStatusID == 1) {
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "rgb(255, 186, 186)",
                    color: "rgb(216, 0, 12)"
                });
            } else if (JobStatusID == 2) {
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "rgb(255, 193, 86)",
                    color: "rgb(196, 91, 0)"
                });
            } else if (JobStatusID == 3) {
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "rgb(254, 239, 179)",
                    color: "rgb(159, 96, 0)"
                });
            } else if (JobStatusID == 4) {
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "rgb(223, 242, 191)",
                    color: "rgb(79, 138, 16)"
                });
            } else if (JobStatusID == 5) {
                $("#JobID" + JobID + " > #jobdivinner").css({
                    background: "rgb(237, 237, 237)",
                    color: "rgb(79, 79, 79)"
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