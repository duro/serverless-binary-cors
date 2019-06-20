class ServerlessBinaryCors {
  constructor(serverless, options) {
    this.serverless = serverless
    this.options = options

    this.hooks = {
      'before:package:finalize': this.addBinaryResponseTemplate.bind(this),
    }
  }

  addBinaryResponseTemplate() {
    let Resources = this.serverless.service.provider.compiledCloudFormationTemplate.Resources
    for (let key in Resources) {
      if (this.isCorsMethod(Resources, key)) {
        this.modifyOptionsMethod(Resources[key])
      }
    }
  }

  modifyOptionsMethod(methodCF) {
    let IntegrationResponses = methodCF.Properties.Integration.IntegrationResponses
    for (const index in IntegrationResponses) {
      IntegrationResponses[index].ResponseTemplates = {
        // Leaving this here as reference to the original value used by Serverless
        // 'application/json': '#set($origin = $input.params("Origin"))\n#if($origin == "") #set($origin = $input.params("origin")) #end\n#if($origin == "*") #set($context.responseOverride.header.Access-Control-Allow-Origin = $origin) #end',
        'image/jpeg': '',
      }
    }
  }

  isCorsMethod(resources, key) {
    return (
      resources[key].Type === 'AWS::ApiGateway::Method' &&
      resources[key].Properties.HttpMethod === 'OPTIONS' &&
      resources[key].Properties.Integration.Type === 'MOCK'
    )
  }
}

module.exports = ServerlessBinaryCors
