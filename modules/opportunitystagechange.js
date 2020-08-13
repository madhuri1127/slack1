"use strict";

let auth = require("./slack-salesforce-auth"),
    force = require("./force"),
    OPPSTAGE_TOKEN = process.env.SLACK_OPPSTAGE_TOKEN;

exports.execute = (req, res) => {

    if (req.body.token != OPPSTAGE_TOKEN) {
        res.send("Invalid token");
        return;
    }

    let slackUserId = req.body.user_id,
        oauthObj = auth.getOAuthObject(slackUserId),
q = "SELECT Id, Name, Amount, Probability, StageName, CloseDate FROM Opportunity WHERE Name LIKE '%" + req.body.text + "%' LIMIT 5";
       

  force.query(oauthObj, q)
        .then(data => {
            let opportunities = JSON.parse(data).records;
            if (opportunities && opportunities.length > 0) {
                let attachments = [];
                opportunities.forEach(function (opportunity) {
                    let fields = [];
                    fields.push({title: "Opportunity", value: opportunity.Name, short: true});
                    fields.push({title: "Stage", value: opportunity.StageName, short: true});
                    fields.push({
                        title: "Amount",
                        value: new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                        }).format(opportunity.Amount),
                        short: true
                    });
                    fields.push({title: "Probability", value: opportunity.Probability + "%", short: true});
                    fields.push({title: "Open in Salesforce:", value: oauthObj.instance_url + "/" + opportunity.Id, short:false});
                    attachments.push({
                        color: "#FCB95B",
                        fields: fields
                    });
                });
                 res.json({text: "Opportunities matching '" + req.body.text + "':", attachments: attachments});
            } else {
                res.send("No records");
            }
        })
        .catch(error => {
            if (error.code == 401) {
                res.send(`Visit this URL to login to Salesforce: https://${req.hostname}/login/` + slackUserId);
            } else {
                console.log(error);
                res.send("An error as occurred");
            }
        });
};
