const engine = require('./ImageGenerator');
var uuid = require("uuid");
const fs = require('fs');
const AWS = require('aws-sdk');
var request = require('request');
var s3 = new AWS.S3();

exports.handler = async function(event, context, callback) {
    
    var message = event.Records[0].Sns.Message;
    let buff = Buffer.from(message, 'base64');
    let text = buff.toString('ascii');
    let rawParams = text.split('&');
    let params = new Object();

    for(var param of rawParams) {
        let paramSplitted = param.split('=');
        params[paramSplitted[0]] = paramSplitted[1];
    }

    console.log(params);
    let newImage = await engine.generate(decodeURIComponent(params.text).replace(/\+/g,' '));

    var paramsS3 = {
        "Body": newImage,
        "Bucket": "YOU-BUCKET-NAME",
        "Key": uuid.v4() + '.jpg',
        "ACL": "public-read",
        "ContentType": "image/jpg" 
    };
    s3.upload(paramsS3, async function(err, data){
        if(err) {
            callback(err, null);
        } else {
            console.log(params.response_url);
            await sendSlack(data.Location, decodeURIComponent(params.response_url));
        };
    });
    callback(null, null);
};

async function sendSlack(data, url) {
    const options = {
        url: url,
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': "Bearer xoxp-r46y54byeby6erny6erny6erny6ern"
        },
        body: JSON.stringify({
            'replace_original': true,
            'response_type': 'in_channel',
            'text': '',
            "attachments": [{
                'text': '',
                'image_url': data
            }],
        })
    };

    request(options, function(err, res, body) {
        let json = JSON.parse(err);
        console.log(json);
    });
}
