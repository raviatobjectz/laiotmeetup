#LA AWS Meetup

This repo contains the code presented in the LA AWS Meetup

## Folders & Files

1.) piInstallScript.sh - Contains the software install steps necessary to get the raspberry pi ready.

2.) device - Contains the code for the IOT sensors. The src folder contains the code to ready from the sensors via the GrovePi board and it also contains an iot_simulator.js which is a simulated version of the sensors for those who does not have the groove pi board.

3.) cloudformation - This contains the AWS cloudformation scripts to create all the necessary resources on the AWS side. These will need to be manually executed via AWS console of AWS CLI.

4.) angular - Contains the angular js code for the web frontend. This is an optional component.


## Installation with GrovePi

1.) Requirements

    a.) Raspberry pi
    b.) GroovePI
    c.) Temperature sensor
    d.) Luminosity sensor
    e.) Touch sensor
    f.) Buzzer sensor
    g.) AWS account

2.) Installation

    a.) cd into the laiotmeetup folder
    b.) chmod +x piInstallScript.sh
    c.) ./piInstallScript.sh

3.) Certificates

    a.) Create, activate and download the Device certificates from the AWS IOT Console. Link with instructions.
        http://docs.aws.amazon.com/iot/latest/developerguide/create-device-certificate.html
    b.) Rename the downloaded private key to private.pem and save it in laiotmeetup/device/certs folder.
    c.) Rename the downloaded certificate to certificate.crt and save it in laiotmeetup/device/certs folder.
    d.) Get the certificate ARN for using in step 4.

4.) Creating the AWS resources.

    a.) Create the IOT thing in AWS using the IOT_Meetup_Device.json and the cloudformation GUI on AWS or using the AWS CLI.  You will need to provide the certificate ARN from step 3d as an input parameter.

        CLI example
        aws cloudformation create-stack --stack-name myteststack --template-body file:////home//local//test//sampletemplate.json

        Cloudformation GUI on AWS
        http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-create-stack.html

    b.) Once the above resource creation is completed, login to AWS IOT console and get the fully qualified dns name of the REST API endpoint of the IOT Thing.
    c.) Open the cloudformation template file called IOT_Meetup_Lambda_Rule.json and replace the <YOUR ENDPOINT HERE> with your endpoint and save.
    d.) Create all the remaining AWS resources using step 4a and the template files
        IOT_Meetup_Lambda_Rule.json,
        IOT_Meetup_SNS_Rule.json,
        IOT_Meetup_Dynamo_Rule.json,
        IOT_Meetup_S3_Rule.json,
        IOT_Meetup_SQS_Rule.json

 5.) Connecting GrovePi

   a.) Connect the GrovePi to the rasberrypi board
   b.) Connect the light sensor to analog port A0
   c.) connect the temperature sensor to analog port A1
   d.) Connect the touch sensor to digital port D3
   e.) Connect the buzzer to digital port D8

 6.) Execution

    a.) Login to Raspberry pi
    b.) cd to laiotmeetup/device/src folder
    c.) node iot.js

 7.) Now you should start seeing the data come through the AWS resources S3, SNS, SQS, DYNAMODB AND LAMBDA


## Installation with Simulator

 1.) Requirements

     a.) Raspberry pi
     g.) AWS account

 2.) Installation

     a.) cd into the laiotmeetup folder
     b.) chmod +x piInstallScript.sh
     c.) ./piInstallScript.sh

 3.) Certificates

     a.) Create, activate and download the Device certificates from the AWS IOT Console. Link with instructions.
         http://docs.aws.amazon.com/iot/latest/developerguide/create-device-certificate.html
     b.) Rename the downloaded private key to private.pem and save it in laiotmeetup/device/certs folder.
     c.) Rename the downloaded certificate to certificate.crt and save it in laiotmeetup/device/certs folder.
     d.) Get the certificate ARN for using in step 4.

 4.) Creating the AWS resources.

     a.) Create the IOT thing in AWS using the IOT_Meetup_Device.json and the cloudformation GUI on AWS or using the AWS CLI. You will need to provide the certificate ARN from step 3d as an input parameter.

         CLI example
         aws cloudformation create-stack --stack-name myteststack --template-body file:////home//local//test//sampletemplate.json

         Cloudformation GUI on AWS
         http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-create-stack.html

     b.) Once the above resource creation is completed, login to AWS IOT console and get the fully qualified dns name of the REST API endpoint of the IOT Thing.
     c.) Open the cloudformation template file called IOT_Meetup_Lambda_Rule.json and replace the <YOUR ENDPOINT HERE> with your endpoint and save.
     d.) Create all the remaining AWS resources using step 4a and the template files
         IOT_Meetup_Lambda_Rule.json,
         IOT_Meetup_SNS_Rule.json,
         IOT_Meetup_Dynamo_Rule.json,
         IOT_Meetup_S3_Rule.json,
         IOT_Meetup_SQS_Rule.json

  5.) Execution

     a.) Login to Raspberry pi
     b.) cd to laiotmeetup/device/src folder
     c.) node iot_simulator.js

  6.) Now you should start seeing the data come through the AWS resources S3, SNS, SQS, DYNAMODB AND LAMBDA

## Optional Angular Portion

  1.) CognitoID

    a.) Login to AWS Cognito
    b.) Create a new ID Pool under federated IdentityPool
    c.) Grant the necessary AWS IOT access to the ID Pool
    d.) Copy the generated CognitoID


  2.) Setup angular app

    a.) cd lameetup/angular
    b.) Open the app.js and update the <youridpool> from CognitoID
    c.) Open the app.js and update the <youriotendpoint> from AWS Thing Endpoint

  3.) Run

      a.) cd lameetup/angular
      b.) gulp
      c.) Open a browser and point it to the Gulp url.
