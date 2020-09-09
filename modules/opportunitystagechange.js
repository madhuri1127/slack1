"use strict";

let auth = require("./slack-salesforce-auth"),
    force = require("./force"),
    CHANGESTAGE_TOKEN = process.env.SLACK_CHANGESTAGE_TOKEN;

exports.execute = (req, res) => {

    if (req.body.token != CHANGESTAGE_TOKEN) {
        res.send("Invalid token");
        return;
    }

    let slackUserId = req.body.user_id,
        oauthObj = auth.getOAuthObject(slackUserId),
        params = req.body.text.split(":"),
        StageName = params[1],
        name = params[0],
        q="select id from Opportunity Where Name = name";
  
    
    let s = force.query(oauthObj,q);

force.update(oauthObj,s ,
        {
            Id : s.id,
            StageName :StageName
        })

        .then(data => {
            
                    
                res.json({
                    text: "StageName Changed Successfully"
                 
                });
            
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
