document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {

    console.log('[MobileOAI]-{INFO}-Device is ready');
    console.log('[MobileOAI]-{INFO}-Running on cordova' + cordova.platformId + '@' + cordova.version);
    console.log('------------------------------------------------------');

    helloWorld();

}

function helloWorld(){
    window.plugins.speechRecognition.hasPermission(function (isGranted){
        if(isGranted){
            console.log("[MobileOAI]-{INFO}-Speech recognition permission granted");
            AuthFinger();
        }else{
            window.plugins.speechRecognition.requestPermission(function (){
                console.log('[MobileOAI]-{INFO}-Permission granted');
                AuthFinger();
            }, function (err){
                console.log("[MobileOAI]-{ERROR}-Permission denied: " + err);
                navigator.app.exitApp();
            });
        }
    }, function(err){
        console.log("[MobileOAI]-{ERROR}-Speech recognition permission denied: " + err);
        navigator.app.exitApp();
    });
}

function AuthFinger(){
    Fingerprint.show({
        description: "Authentification pour le Private Token",
      }, successCallback, errorCallback);
  
      function successCallback(){
        console.log('[MobileOAI]-{INFO}-Authentication success');
        nfcRead();
      }
  
      function errorCallback(error){
        console.log('[MobileOAI]-{ERROR}-Authentication error: ' + error);
      }
}

function nfcRead(){
    console.log('[MobileOAI]-{INFO}-NFC read');

    nfc.addNdefListener (
        function (nfcEvent) {
            console.log('[MobileOAI]-{INFO}-NFC event detected');
            var tag = nfcEvent.tag,

            ndefMessage = tag.ndefMessage;

            var privateToken = nfc.bytesToString(ndefMessage[0].payload).substring(3);
            window.privateToken = privateToken;

            console.log('[MobileOAI]-{INFO}-Private Token: ' + window.privateToken);
            console.log('[MobileOAI]-{INFO}-NFC read success');
            console.log('------------------------------------------------------');  
            
            window.location.assign("acceuil.html");
        },
    );
}