# slack-slash-cmd-image-process-lambda
This is an amazon AWS lambda code that reads from a AWS SNS topic looking  in the message for the contents of a Slack Slash command. 
Processes an predifined image with the text on the slash command. 
Saves it to AWS S3 and returns to Slack the URL of the new image
# AWS Configuration
TODO

Proxy Lambda needed, maybe it should be in the repo. This should be available through AWS Api Gateway (For Slack)

SNS Topic to which this repo's lambda should be subscribed to it.
# Deploy
TODO
```
aws lambda update-function-code --function-name lambdaName --zip-file fileb://package.zip --region us-east-1
```
