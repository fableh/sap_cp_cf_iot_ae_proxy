# SAP IoT AE Node.js proxy app for the sapcp cf env. to get access from SAP Analytics Cloud

Create the user provided service via cf CLI e.g. for the OAuth credentials:

'cf create-user-provided-service my-usp-sap-proxy -p "{\"clientId\":\"<your client id>\",\"clientSecret\":\"<your client secret>\", \"tenant\":\"<your CF tenant name>\",  \"landscape\":\"eu10\", \"host\":\"hana.ondemand.com\"}"'



SAP CP Cockpit at Cloud Foundry with the previous binded "user defined variable"

![Alt text](pics/udv_1.PNG?raw=true "SAP CP Cloud Fiundry service binding ")
