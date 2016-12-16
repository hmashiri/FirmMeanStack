var express = require('express');

var router = express.Router();


router.

// create caseinfo post route (accessed at POST http://localhost:3002/api/caseinfo)
    .post(function(req, res) {

        var caseInfo = new CaseInfo();
        caseInfo.caseName = req.body.caseName;
        caseInfo.caseNumber = req.body.caseNumber;
        caseInfo.practiceArea = req.body.practiceArea;
        caseInfo.attorney = req.body.attorney;
        caseinfo.customerName = req.body.customerName;


        // set caseinfo name (comes from the request)
        console.log("body:" + req.body);

        // get caseinfo case name (comes from the request)
        console.log("message:" + caseInfo.caseName);
        caseInfo.save(function(err) {
            if (err)
                res.send(err);

            res.json({ caseInfo: 'caseInfo name created!' });
        });


    })

    // get all the cases data (accessed at GET http://localhost:3002/api/caseinfo)
    .get(function(req, res) {
        CaseInfo.find(function(err, caseInfo) {
            if (err)
                res.send(err);

            res.json(caseInfo);
        });
    });

// on routes that end in /caseinfo/:caseinfo_id
// ----------------------------------------------------
router.route('/:caseInfo_id')

// get the case information with the id
    .get(function(req, res) {
        CaseInfo.findById(req.params.caseInfo_id, function(err, caseInfo) {
            if (err)
                res.send(err);
            res.json(caseInfo);
        });
    })

    // update caseInfo with this id
    .put(function(req, res) {
        CaseInfo.findById(req.params.caseInfo_id, function(err, caseInfo) {

            if (err)
                res.send(err);

            caseInfo.caseName = req.body.caseName;
            caseInfo.caseNumber = req.body.caseNumber;
            caseInfo.practiceArea = req.body.practiceArea;
            caseInfo.attorney = req.body.attorney;
            caseInfo.customerName = req.body.customerName;

            caseInfo.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ caseInfo: 'cases data updated!' });
            });

        });
    })

    // delete caseinfo data with this id
    .delete(function(req, res) {
        CaseInfo.remove({
            _id: req.params.caseInfo_id
        }, function(err, caseInfo) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });





module.exports = router;
