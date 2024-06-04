# mod-aws-cdk-lambda

[![CDK](https://img.shields.io/badge/CDK-2.138.0-yellow)](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html)

> Module that allows the creation of Screts in SecretManager and its dependencies.

>
> ## Table of Contents

- [mod-aws-cdk-lambda](#mod-aws-cdk-lambda)
  - [Table of Contents](#Table-of-Contents)
  - [Diagram](#Diagram)
  - [Prerequisites](#Prerequisites)
  - [Providers](#Providers)
  - [Inputs](#Inputs)
  - [Outputs](#Outputs)
  - [Example usage](#Example-usage)
  - [Basic Invocation Example](#Basic%20Invocation%20Example)
  - [Custom Invocation Example](#Custom%20Invocation%20Example%20with%20Role%20or%20Network)

## Diagram

![](./images/lambda.png)

## Prerequisites

You will need the following things properly installed on your computer.

- [Git](http://git-scm.com/)
- [Node](https://nodejs.org/en/download)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_install)
- [JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript)

## Requirements

![NPM](https://img.shields.io/badge/NPM%20INSTALL-grey?style=for-the-badge&logo=NPM)



## Providers

| Name | Version |
| ---- | ------- |
| ![AWS](https://img.shields.io/badge/AWS-gree)  | ![N/A](https://img.shields.io/badge/N/A-grey)     |

## Inputs

| Name                  | Description                              | Type           | Default | Required |
| --------------------- | ---------------------------------------- | -------------- | ------- | :------: |
| runtime               | Runtime for the Code.                    | `string`       | n/a     |   yes    |
| code                  | Custom Path for the Code.                | `string`       | n/a     |   yes    |
| handler               | Custom File Name and Function Name.      | `string`       | n/a     |   yes    |
| timeout               | Custom Time Execution in Seconds.        | `number`       | 3       |   yes    |
| role                  | Existing Custom Role Name.               | `string`       | n/a     |   no     |
| dependsOn             | Wait to create IAM Role First.           | `variable`     | n/a     |   no     |
| sg                    | Existing SecurityGroup ID.               | `string`       | n/a     |   no     |
| vpc                   | Existing VPC ID.                         | `string`       | n/a     |   no     |
| vpcSubnets            | Existing Subnets IDs.                    | `array/string` | n/a     |   no     |



## Outputs

| Name  | Description                                 |
| ----- | ------------------------------------------- |
| ![N/A](https://img.shields.io/badge/N/A-grey) | ![N/A](https://img.shields.io/badge/N/A-grey) |

## Example usage

- This module allows the creation of a lambda function in a simple way, it can be created without roles or any network configuration and it can also be created only with a role or with the role and the necessary network configuration.


### Basic Invocation Example

```CDK
Add in package.json

"dependencies": {
    "aws-cdk-lib": "latest",
    "constructs": "latest",
    "lambdaModule": "gitlab:mauriciogonzalezferia/mod-aws-cdk-lambda"
  }

#################################################################

const cdk = require('aws-cdk-lib');
const { lambdaModule } = require('lambdaModule/lambda-module');

// Your Custom Stack
class CdkLambdaStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Inside your custom stack
    // Create Lambda Funtion
    const myLambda = new LambdaModule(this, 'MyLambda', {
      runtime: 'PYTHON_3_9',    // Runtime for the Code
      code: 'lambda',   // Path relative to your project
      handler: 'main.lambda_handler',    // File Name and Funtion Name
      timeout: 30      // Time for the execute Funtion
    });
  }
}

module.exports = { CdkLambdaStack };   // Your Custom Stack

```

### Custom Invocation Example with Role

```CDK
Add in package.json

"dependencies": {
    "aws-cdk-lib": "latest",
    "constructs": "latest",
    "lambdaModule": "gitlab:mauriciogonzalezferia/mod-aws-cdk-lambda",
    "iamRoleModule": "gitlab:mauriciogonzalezferia/mod-aws-cdk-iam-role"
  }

#################################################################

const cdk = require('aws-cdk-lib');
const { lambdaModule } = require('lambdaModule/lambda-module');
const { iamRoleModule } = require('iamRoleModule/iam-role-module');

// Your Custom Stack
class CdkLambdaStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Inside your custom stack

    // Create Custom Role
    const Roles = new iamRoleModule(this, 'iamRoleModule', {
      roles: {
        lambda: {
          name: 'lambda-role',
          description: 'Description for the role',
          policyName: 'policy-lambda-role',
          actions: ['*'],    // Allow Actions Services
          resources: ['*'],    // Allow on Resources or ARN
          ServicePrincipal: 'lambda.amazonaws.com'   // Assume Policy on Service - Trusted Config
        }
      }
    });

    // Create Lambda Funtion
    const myLambda = new LambdaModule(this, 'MyLambda', {
      runtime: 'PYTHON_3_9',    // Runtime for the Code
      code: 'lambda',   // Path relative to your project
      handler: 'main.lambda_handler',   // File Name and Funtion Name
      timeout: 30,     // Time for the execute Funtion
      role: 'lambda-role',  // IAM Role Name
      dependsOn: Roles      // Wait to create IAM Role First
    });
  }
}

module.exports = { CdkLambdaStack };   // Your Custom Stack

```


### Custom Invocation Example with All Services

```CDK
Add in package.json

"dependencies": {
    "aws-cdk-lib": "latest",
    "constructs": "latest",
    "lambdaModule": "gitlab:mauriciogonzalezferia/mod-aws-cdk-lambda",
    "iamRoleModule": "gitlab:mauriciogonzalezferia/mod-aws-cdk-iam-role"
  }

###########################################################################

********    Add in bin/index.js     **********

const cdk = require('aws-cdk-lib');
const { CdkLambdaStack } = require('../lib/lambda-stack');

const cdkLambda = new cdk.App();
const iamStack = new CdkLambdaStack(cdkLambda, "lambda-stack", {
  stackName: "lambda-stack",
  env: {
        account: process.env.ACCOUNT,
        region: process.env.REGION,
      }
});

############################################################################

********    Add in .env     **********

ACCOUNT=0987654321
REGION=us-east-1

############################################################################

const cdk = require('aws-cdk-lib');
const { lambdaModule } = require('lambdaModule/lambda-module');
const { iamRoleModule } = require('iamRoleModule/iam-role-module');

// Your Custom Stack
class CdkLambdaStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Inside your custom stack

    // Create Custom Role
    const Roles = new iamRoleModule(this, 'iamRoleModule', {
      roles: {
        lambda: {
          name: 'lambda-role',
          description: 'Description for the role',
          policyName: 'policy-lambda-role',
          actions: ['*'],    // Allow Actions Services
          resources: ['*'],    // Allow on Resources or ARN
          ServicePrincipal: 'lambda.amazonaws.com'   // Assume Policy on Service - Trusted Config
        }
      }
    });

    // Create Lambda Funtion
    const myLambda = new LambdaModule(this, 'MyLambda', {
      runtime: 'PYTHON_3_9',    // Runtime for the Code
      code: 'lambda',   // Path relative to your project
      handler: 'main.lambda_handler',   // File Name and Funtion Name
      timeout: 30,     // Time for the execute Funtion
      role: 'lambda-role',  // IAM Role Name
      dependsOn: Roles,      // Wait to create IAM Role First
      sg: "sg-05e1cd9ed00fb06e6",       // Security Group ID
      vpc: "vpc-0fe6d03832aafaedf",     // VPC ID
      vpcSubnets: ["subnet-09fc51262efe0588f", "subnet-0c7fa8a542a7cdc07"],     // Subnets ID
    });
  }
}

module.exports = { CdkLambdaStack };   // Your Custom Stack

```