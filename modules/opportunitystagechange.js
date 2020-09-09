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
        q="select id from Opportunity Where Name = name";
    
  
    
  

            
                
                
                  
                
            
  const g =    force.query(oauthObj,q)
    
  var d =     g.then((data)=>{
      let opportunities = JSON.parse(data).records;
      opportunities.forEach(function (opportunity) {
           console.log(opportunity.Id);
      })
       })
    console.log(d);
force.update(oauthObj,"Opportunity",
        {
   
            Id : "0062w000004ilulAAA",
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
