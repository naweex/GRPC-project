const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const echoProto = protoLoader.loadSync('echo.proto' , {})
const echoDefinition = grpc.loadPackageDefinition(echoProto)
const {echoPackage} = echoDefinition


const server = new grpc.Server()
server.addService(echoDefinition.EchoService.service , {
    EchoUnary : '',
    EchoClientStream: '',
    EchoServerStream: '' ,
    BidiStream: ''
})

