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
        let Amount = params[1],
       let name = params[0],
        
 q = "SELECT  Amount FROM Opportunity WHERE Name LIKE '%" + name + "%' LIMIT 2";
let re = force.query(q);
let cooper = re.records;
cooper.Amount =  Amount;
 let ret=    force.sobject('Opportunity').update(cooper)
        
      if (ret.success) {
    console.log('Stage updated in Salesforce.');
} 
};
