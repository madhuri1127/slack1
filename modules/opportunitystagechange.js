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
  
    
  
force.query(oauthObj, q)
        .then(data => {
            let contact = JSON.parse(data).records;
            
                
                
                   let s = contact.id;
                    console.log(s);
                
                
            
        })
       
    console.log(s);
force.update(oauthObj,"Opportunity",
        {
   
            Id : s,
            StageName :StageName
        })

        .then(data => {
            
                    
                res.json({
                    text: "StageName Changed Successfully"
                 
                });
            
        })

     console.log(s);
};
