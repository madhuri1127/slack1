"use strict";

let auth = require("./slack-salesforce-auth"),
    force = require("./force"),
   CREATE_CONTACT_TOKEN = process.env.SLACK_CREATE_CONTACT_TOKEN;

exports.execute = (req, res) => {

    if (req.body.token != CREATE_CONTACT_TOKEN) {
        res.send("Invalid token");
        return;
    }

    let slackUserId = req.body.user_id,
        oauthObj = auth.getOAuthObject(slackUserId),
params = req.body.text.split(":"),
        Name = params[0],
        Phone= params[1];
        

  
 force.create(oauthObj, "Contact",
        {
          Name:Name,
         Phone:Phone
        })
        .then(data => {
            let fields = [];
            fields.push({title: "Name", value: Name, short:false});
            fields.push({title: "Phone", value: Phone, short:false});
            fields.push({title: "Open in Salesforce:", value: oauthObj.instance_url + "/" + data.id, short:false});
            let message = {
                text: "A new contact has been created:",
                attachments: [
                    {color: "#F2CF5B", fields: fields}
                ]
            };
            res.json(message);
        })
        .catch((error) => {
            if (error.code == 401) {
                res.send(`Visit this URL to login to Salesforce: https://${req.hostname}/login/` + slackUserId);

            } else {
                res.send("An error as occurred");
            }
        });

};
