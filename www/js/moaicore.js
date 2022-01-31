document.addEventListener('deviceready', onDeviceReady, false);
document.getElementById("bOne").addEventListener("click", startRecognition);

function onDeviceReady() {

    console.log("[MobileOAI]-{INFO}-Hey, I'm ready!");

    cordova.plugin.http.setDataSerializer('json');

    window.plugins.speechRecognition.isRecognitionAvailable(function(available){
        if(available){
            console.log("[MobileOAI]-{INFO}-Speech recognition available");
        }
    }, function(err){
        console.error("[MobileOAI]-{ERROR}-Speech recognition not available: " + err);
    });

}

function startRecognition(){
    console.log("[MobileOAI]-{INFO}-Start recognition");

    window.plugins.speechRecognition.startListening(function(result){
        console.log("[MobileOAI]-{INFO}-Recognition result: " + result);
        oaiRequest(result);
    }, function(err){
        console.error("[MobileOAI]-{ERROR}-Speech recognition error: " + err);
    }, {
        language: "fr-FR",
        showPopup: true
    });
}

function oaiRequest(ask) {
    console.log("[MobileOAI]-{INFO}-OAI request");
    console.log("[MobileOAI]-{INFO}-Ask: " + ask);

    console.log('[MobileOAI]-{INFO}-Interpretation of OAI request');
    console.log("------------------------------------------------------");

    cordova.plugin.http.post('https://api.openai.com/v1/engines/text-davinci-001/completions', {
        prompt: ask,
        max_tokens: 250
    }, { Authorization: 'Bearer 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' }, function(response) {
        // prints 200
        console.log(response.status);
        console.log(response.data);
        try {
            response.data = JSON.parse(response.data);

            console.log(response.data.choices[0].text);
            console.log("------------------------------------------------------");
            console.log("[MobileOAI]-{INFO}-OAI request success");

            TTS.speak({
                text: response.data.choices[0].text,
                locale: 'fr-FR',
                rate: 1
            }, function () {
                console.log('[MobileOAI]-{INFO}-TTS : OK');
            }, function (reason) {
                console.log('[MobileOAI]-{ERROR}-TTS : ' + reason);
            });

        } catch(e) {
            console.error('[MobileOAI]-{ERROR}-JSON parse error: ' + e);
        }
    }, function(response) {
        console.log("[MobileOAI]-{ERROR}-OAI request error: " + response.status);
        console.log(response.error);
    });

    console.log("[MobileOAI]-{INFO}-Asking : OK");
}
