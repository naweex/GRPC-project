const grpc = require('@grpc/grpc-js')
const { log } = require('@grpc/grpc-js/build/src/logging')
const protoLoader = require('@grpc/proto-loader')
const echoProto = protoLoader.loadSync('echo.proto' , {})
const echoDefinition = grpc.loadPackageDefinition(echoProto)
const {echoPackage} = echoDefinition
const serverURL = 'localhost:3000'
const server = new grpc.Server()
function EchoUnary(call,callBack){
    console.log('call : ' , call.request);
    callBack(null , {message : 'recived'})
}
function EchoClientStream(call,callBack){
    call.on('data' , data => {
        console.log(data);
    })
    call.on('end' , error => {
        console.log(error);
        
    })
}
function EchoServerStream(call,callBack){
    for (let index = 0; index < 10; index++) {
        call.write({
            value : index
        })
    }
    call.on('end' , error => {
        console.log(error);
    })
}
function BidiStream(call,callBack){}

server.addService(echoPackage.EchoService.service , {
    EchoUnary,
    EchoClientStream,
    EchoServerStream,
    BidiStream
})

server.bindAsync(serverURL, grpc.ServerCredentials.createInsecure(), () => {
    console.log('running at localhost:3000');
    server.start();
  });



