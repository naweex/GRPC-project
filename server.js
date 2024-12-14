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
    const list = []
    call.on('data' , data => {
        list.push(data)
        console.log('server : ' ,data);
    })
    call.on('end' , error => {
        console.log(list);
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
function dateTime(call, callback) {
    call.on("data", data => {
        console.log("server dateTime : ", data);
        call.write({value : new Date().toLocaleString()})
    })
    call.on("end", err => {
        console.log(err);
    })
}

server.addService(echoPackage.EchoService.service , {
    EchoUnary,
    EchoClientStream,
    EchoServerStream,
    dateTime
})

server.bindAsync(serverURL, grpc.ServerCredentials.createInsecure(), () => {
    console.log('running at localhost:3000');
    server.start();
  });



