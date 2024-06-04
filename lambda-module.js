const cdk = require('aws-cdk-lib');
const lambda = require('aws-cdk-lib/aws-lambda');
const iam = require('aws-cdk-lib/aws-iam');
const ec2 = require('aws-cdk-lib/aws-ec2');
const { Construct } = require('constructs');

class LambdaModule extends Construct {
  constructor(scope, id, props) {
    super(scope, id);

    // Validate required properties
    if (!props.runtime || !props.code || !props.handler || !props.timeout) {
      throw new Error('The runtime, code, timeout and handler properties are required.');
    }

    // Parameters to Create Lambda with or without Role
    const lambdaProps = {
        runtime: lambda.Runtime[props.runtime],
        code: lambda.Code.fromAsset(props.code),
        handler: props.handler,
        timeout: cdk.Duration.seconds(props.timeout),
      };

    // If there is role option, add the parameter to Lambda
    if (props.role) {
        lambdaProps.role = iam.Role.fromRoleName(this, `${id}-Role`, props.role);
      }

     // If VPC is provided, add VPC and subnets to Lambda
     if (props.vpc) {
      const vpc = ec2.Vpc.fromLookup(this, 'ImportedVpc', {
        vpcId: props.vpc,
      });

      lambdaProps.vpc = vpc;

      if (props.subnets && Array.isArray(props.subnets)) {
        const subnets = props.subnets.map(subnetId =>
          ec2.Subnet.fromSubnetId(this, `ImportedSubnet-${subnetId}`, subnetId)
        );

        lambdaProps.vpcSubnets = { subnets: subnets };
      }

      // If security group is provided, add it to Lambda
      if (props.sg) {
        const securityGroup = ec2.SecurityGroup.fromSecurityGroupId(this, 'ImportedSG', props.sg);
        lambdaProps.securityGroups = [securityGroup];
      }
    }
  
    // Create Lambda Function
    this.lambdaFunction = new lambda.Function(this, id, lambdaProps);

    // Agregar dependencia si se proporciona
    if (props.dependsOn) {
        this.lambdaFunction.node.addDependency(props.dependsOn);
      }
  }

  // Método para obtener la función Lambda creada
  getFunction() {
    return this.lambdaFunction;
  }
}

module.exports = { LambdaModule };
