"use strict";

let auth = require("./slack-salesforce-auth"),
    force = require("./force"),
    CHANGESTAGE_TOKEN = process.env.SLACK_CHANGESTAGE_TOKEN;

exports.execute = (req, res) => {

    if (req.body.token != CHANGE_TOKEN) {
        res.send("Invalid token");
        return;
    }

    let slackUserId = req.body.user_id,
        oauthObj = auth.getOAuthObject(slackUserId),
        params = req.body.text.split(":"),
        StageName = params[1],
        name = params[0],
        
 q = "SELECT StageName FROM Opportunity WHERE Name LIKE '%" + name + "%' LIMIT 1";
    force.update(oauthObj,q)
        {
           StageName:StageName
        }
        .then(data => {
            let opportunities = JSON.parse(data).records;
            if (opportunities && opportunities.length > 0) {
                let attachments = [];
                opportunities.forEach(function (opportunity) {
                    let fields = [];
                    
                    
                    fields.push({title: "Open in Salesforce:", value: oauthObj.instance_url + "/" + opportunity.Id, short:false});
                    attachments.push({
                        color: "#FCB95B",
                        fields: fields
                    });
                });
                res.json({
                    text: "StageName Changed Successfully"
                    attachments: attachments
                });
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
