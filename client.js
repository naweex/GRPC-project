const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const echoProto = protoLoader.loadSync('echo.proto' , {});
const echoDefinition = grpc.loadPackageDefinition(echoProto);
const {echoPackage} = echoDefinition
const serverURL = 'localhost:3000'
const client = new echoPackage.EchoService(serverURL , grpc.credentials.createInsecure());
const echoData = {
    value : 'first value'
}
client.EchoUnary(echoData , (err , response) => {
    if(err) return console.log('error is :' , err.message);
    console.log('response is :' , response);
})

const serverStream = client.EchoServerStream();
setTimeout(() => {
    serverStream.on('data' , (data) => {
        console.log(data);
    })
} , 300)
serverStream.on('end' , (error) => {
    console.log('error' , error);
})
const echos = [
    {value : 'value1'},
    {value : 'value2'},
    {value : 'value3'},
    {value : 'value4'},
]
const clientStream = client.EchoClientStream(echos);
