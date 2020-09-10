"use strict";

let auth = require("./slack-salesforce-auth"),
    force = require("./force"),
    CHANGESTAGE_TOKEN = process.env.SLACK_CHANGESTAGE_TOKEN,
    opp =[];

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
        q="select id,StageName from Opportunity Limit 1";
    
  
    
  

            
                
                
                  
                
            force.query(oauthObj, q)
        .then(data => {
                //console.log(data);
               // console.log(JSON.parse(data).records);
            let contacts = JSON.parse(data).records;
              opp= JSON.parse(contacts);
               // opp=contacts;
                console.log(opp);
            })
    .catch(error => {
            if (error.code == 401) {
                res.send(`Visit this URL to login to Salesforce: https://${req.hostname}/login/` + slackUserId);
            } else {
                console.log(error);
                res.send("An error as occurred");
            }
        });
   
     
    
 
/*force.update(oauthObj, "Opportunity",
             {
    
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
        });*/

};
