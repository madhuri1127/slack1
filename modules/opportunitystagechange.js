"use strict";

let auth = require("./slack-salesforce-auth"),
    force = require("./force"),
    CHANGESTAGE_TOKEN = process.env.SLACK_CHANGESTAGE_TOKEN;
  var  opp = [] ;
var op;

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
        q="select Id,StageName from Opportunity where Name= name Limit 1 ";
    
        console.log(name);
  
    
  

            
                
                
                  
                
            force.query(oauthObj, q)
        .then(data => {
                
            let contacts = JSON.parse(data).records;
              
               opp=contacts;
             
              
                 console.log(JSON.stringify(opp[0].Id));   
            op=JSON.stringify(opp[0].Id);
                op = op.replace(/"/g, '');
    
    })
 .catch(error => {
            if (error.code == 401) {
                res.send(`Visit this URL to login to Salesforce: https://${req.hostname}/login/` + slackUserId);
            } else {
                console.log(error);
                res.send("An error as occurred");
            }
        });
    
     
       
 
force.update(oauthObj,"Opportunity",
        {
               Id :op,
            StageName :StageName
        })
            
         .then(data => {
            
              console.log(op);
     console.log(StageName);
    
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
