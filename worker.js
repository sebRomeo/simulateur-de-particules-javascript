
importScripts('testworker2.js')

onmessage = function (e) {
    console.log('Message received from main script');
    var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
    console.log('Posting message back to main script');
    //postMessage(workerResult);
    console.log(`globVrTest`, glob1)
    console.log(`e.data[0]`, e.data[0])
}