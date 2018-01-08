var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var JobID = "";
var JobDesc = "";
var JobTime = "";
var JobYear = "";
var JobMonth = "";
var JobDay = "";
var JobDateTime = "";
var JobAuthor = "";
var JobStatusID = "";
var JobAssignedName = "";
var JobIDArray = [];
var JobDescArray = [];
var JobDateTimeArray = [];
var JobAuthorArray = [];
var JobStatusIDArray = [];
var PushComplete = [];
var JobEntityIDArray = [];
var JobAssignedEntityArray = [];
var JobAssignedNameArray = [];
var EntityNameArray = [];
var EntityIDArray = [];

var sql = require("mssql");
process.setMaxListeners(50);

var config = {
    user: 'MaintApp',
    password: 'N3WPASS!',
    server: '10.8.0.142',
    database: 'piranacmms',
};

DBQueries();
var SQLQueryTimer = setInterval(DBQueries, 60000);

function DBQueries() {
    JobIDArray = [];
    JobDescArray = [];
    JobDateTimeArray = [];
    JobAuthorArray = [];
    JobStatusIDArray = [];
    try {
        PushWorkOrders()
    } catch (err) {
        console.log(err)
    }
    sql.close()
    sql.connect(config, function (err) {
        if (err) console.log(err);
        const requestnumjobs = new sql.Request();
        const requestjobdesc = new sql.Request();
        const requestjobtime = new sql.Request();
        const requestjobauthor = new sql.Request();
        const requestjobstatus = new sql.Request();
        const requestjobentity = new sql.Request();
        const requestassignedentity = new sql.Request();
        const requestassignedname = new sql.Request();
        const requestentitynames = new sql.Request();
        const requestentityIDlist = new sql.Request();
        requestjobdesc.stream = true;
        requestnumjobs.stream = true;
        requestjobtime.stream = true;
        requestjobauthor.stream = true;
        requestjobstatus.stream = true;
        requestjobentity.stream = true;
        requestassignedentity.stream = true;
        requestassignedname.stream = true;
        requestentitynames.stream = true;
        requestentityIDlist.stream = true;
        requestnumjobs.query('SELECT ID FROM dbo.Work_Order Where (Work_Order_StatusID = 1 OR Work_Order_StatusID = 2 OR Work_Order_StatusID = 3 OR Work_Order_StatusID = 4 OR Work_Order_StatusID = 5) AND EntityID <> 59 AND EntityID <> 60 AND EntityID <> 78 AND EntityID <> 79 AND EntityID <> 31 AND EntityID <> 32 ORDER BY Work_Order_Raised ASC')
        requestnumjobs.on('row', row => {
            JobID = JSON.stringify(row);
            JobID = JobID.replace(/\D/g, '');
            JobIDArray.push(JobID);
            console.log("Querying Work Order " + JobID + " Details");
        })
        requestnumjobs.on('done', result => {
            //console.log("Job ID Array Generation Complete!")
        })
        requestjobdesc.query('SELECT Work_Order_Description FROM dbo.Work_Order Where (Work_Order_StatusID = 1 OR Work_Order_StatusID = 2 OR Work_Order_StatusID = 3 OR Work_Order_StatusID = 4 OR Work_Order_StatusID = 5) AND EntityID <> 59 AND EntityID <> 60 AND EntityID <> 78 AND EntityID <> 79 AND EntityID <> 31 AND EntityID <> 32 ORDER BY Work_Order_Raised ASC')
        requestjobdesc.on('row', row => {
            JobDesc = JSON.stringify(row);
            JobDesc = JobDesc.substr(27)
            JobDesc = JobDesc.slice(0, -2);
            JobDescArray.push(JobDesc);
        })
        requestnumjobs.on('done', result => {
            //console.log("Job Description Array Generation Complete!")
        })
        requestjobtime.query('SELECT Work_Order_Raised FROM dbo.Work_Order Where (Work_Order_StatusID = 1 OR Work_Order_StatusID = 2 OR Work_Order_StatusID = 3 OR Work_Order_StatusID = 4 OR Work_Order_StatusID = 5) AND EntityID <> 59 AND EntityID <> 60 AND EntityID <> 78 AND EntityID <> 79 AND EntityID <> 31 AND EntityID <> 32 ORDER BY Work_Order_Raised ASC')
        requestjobtime.on('row', row => {
            JobDate = JSON.stringify(row);
            JobDate = JobDate.substr(22);
            JobYear = JobDate.slice(0, -22);
            JobMonth = JobDate.slice(0, -19);
            JobMonth = JobMonth.substr(5);
            JobDay = JobDate.slice(0, -16);
            JobDay = JobDay.substr(8);
            JobTime = JobDate.slice(0, -2)
            JobTime = JobTime.substr(11)
            JobTime = JobTime.slice(0, -8);
            JobDateTimeArray.push(JobDay + "-" + JobMonth + "-" + JobYear + " " + JobTime);
        })
        requestjobtime.on('done', result => {
            //console.log("Job Time Array Generation Complete!")
        })
        requestjobauthor.query('SELECT Work_Order_Requester FROM dbo.Work_Order Where (Work_Order_StatusID = 1 OR Work_Order_StatusID = 2 OR Work_Order_StatusID = 3 OR Work_Order_StatusID = 4 OR Work_Order_StatusID = 5) AND EntityID <> 59 AND EntityID <> 60 AND EntityID <> 78 AND EntityID <> 79 AND EntityID <> 31 AND EntityID <> 32 ORDER BY Work_Order_Raised ASC')
        requestjobauthor.on('row', row => {
            JobAuthor = JSON.stringify(row);
            JobAuthor = JobAuthor.substr(25)
            JobAuthor = JobAuthor.slice(0, -2);
            JobAuthorArray.push(JobAuthor);
        })
        requestjobstatus.query('SELECT Work_Order_StatusID FROM dbo.Work_Order Where (Work_Order_StatusID = 1 OR Work_Order_StatusID = 2 OR Work_Order_StatusID = 3 OR Work_Order_StatusID = 4 OR Work_Order_StatusID = 5) AND EntityID <> 59 AND EntityID <> 60 AND EntityID <> 78 AND EntityID <> 79 AND EntityID <> 31 AND EntityID <> 32 ORDER BY Work_Order_Raised ASC')
        requestjobstatus.on('row', row => {
            JobStatusID = JSON.stringify(row);
            JobStatusID = JobStatusID.substr(23)
            JobStatusID = JobStatusID.slice(0, -1);
            JobStatusIDArray.push(JobStatusID);
        })

        requestentityIDlist.query('SELECT ID FROM dbo.Entity ORDER BY ID ASC')
        requestentityIDlist.on('row', row => {
            var id = JSON.stringify(row);
            id = id.substr(6)
            id = id.slice(0, -1)
            EntityIDArray.push(id);
        })

        requestentityIDlist.on('done', result => {
            requestentitynames.query('SELECT Name FROM dbo.Entity ORDER BY ID ASC')
            requestentitynames.on('row', row => {
                var name = JSON.stringify(row);
                name = name.substr(9)
                name = name.slice(0, -2)
                EntityNameArray.push(name);
            })
        });

        requestentitynames.on('done', result => {
            requestjobentity.query('SELECT EntityID FROM dbo.Work_Order Where (Work_Order_StatusID = 1 OR Work_Order_StatusID = 2 OR Work_Order_StatusID = 3 OR Work_Order_StatusID = 4 OR Work_Order_StatusID = 5) AND EntityID <> 59 AND EntityID <> 60 AND EntityID <> 78 AND EntityID <> 79 AND EntityID <> 31 AND EntityID <> 32 ORDER BY Work_Order_Raised ASC')
            requestjobentity.on('row', row => {
                JobEntityID = JSON.stringify(row);
                JobEntityID = JobEntityID.substr(12)
                JobEntityID = JobEntityID.slice(0, -1);
                JobEntityID = EntityNameArray[EntityIDArray.indexOf(JobEntityID)]
                JobEntityIDArray.push(JobEntityID);
            })

        })

        requestassignedentity.query('SELECT Work_Order_Assigned_To FROM dbo.Work_Order Where (Work_Order_StatusID = 1 OR Work_Order_StatusID = 2 OR Work_Order_StatusID = 3 OR Work_Order_StatusID = 4 OR Work_Order_StatusID = 5) AND EntityID <> 59 AND EntityID <> 60 AND EntityID <> 78 AND EntityID <> 79 AND EntityID <> 31 AND EntityID <> 32 ORDER BY Work_Order_Raised ASC')
        requestassignedentity.on('row', row => {
            JobAssignedEntity = JSON.stringify(row);
            JobAssignedEntity = JobAssignedEntity.substr(26)
            JobAssignedEntity = JobAssignedEntity.slice(0, -1);
            JobAssignedEntityArray.push(JobAssignedEntity);
        })
        requestassignedentity.on('done', result => {

            var JobAssignedEntityArrayClean = JobAssignedEntityArray.clean("null");
            for (i = 0; i < JobAssignedEntityArrayClean.length; i++) {
                requestassignedname.query('SELECT Name FROM dbo.Entity Where ID = ' + JobAssignedEntityArrayClean[i])
                requestassignedname.on('row', row => {
                    JobAssignedName = JSON.stringify(row);
                    JobAssignedName = JobAssignedName.substr(9)
                    JobAssignedName = JobAssignedName.slice(0, -2);
                    JobAssignedNameArray.push(JobAssignedName);
                })
            }
            var AssignedJobArrayFixed = [];
            var x = 0;
            requestassignedname.on('done', result => {
                AssignedJobArrayFixed.push(JobAssignedNameArray[JobAssignedEntityArrayClean.length * x]);
                x++
            });
            x = 0

            var counter = 0;
            for (i = 0; i < JobAssignedEntityArray.length; i++) {
                if (JobAssignedEntityArray[i] != 'null') {
                    JobAssignedEntityArray[i] = AssignedJobArrayFixed[counter];
                    counter++;
                } else {
                    JobAssignedEntityArray[i] = "";
                }
            }
            counter = 0;
        })
    })
};

function PushWorkOrders() {
    var tid = setInterval(EmitJob, 250);
    var loopcount = 0;

    function EmitJob() {
        if (loopcount == JobIDArray.length - 1) {
            PushComplete[loopcount] = true;
        } else {
            PushComplete[loopcount] = false;
        };
        console.log("Creating Work Order for Job " + JobIDArray[loopcount])
        io.sockets.emit('newJob', JobIDArray[loopcount], JobDescArray[loopcount], JobDateTimeArray[loopcount], JobAuthorArray[loopcount], JobStatusIDArray[loopcount], PushComplete[loopcount], JobEntityIDArray[loopcount], JobAssignedNameArray[loopcount])

        if (loopcount == JobIDArray.length - 1) {
            for (i = 0; i < loopcount + 1; i++) {
                JobIDArray.pop();
                JobDescArray.pop();
                JobDateTimeArray.pop();
                JobAuthorArray.pop();
                JobStatusIDArray.pop();
                JobEntityIDArray.pop();
                JobAssignedEntityArray.pop();
                JobAssignedNameArray = [];
            }
            abortTimer();
            return;
        }
        loopcount++;
    }

    function abortTimer() {
        clearInterval(tid);
    }
}

http.listen(8009, function () {
    console.log('listening on *:8009');
});

app.use("/public", express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
    res.sendFile('/index.html', {
        root: __dirname
    });
});

Array.prototype.clean = function (deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};