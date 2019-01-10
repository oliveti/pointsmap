import * as functions from 'firebase-functions';
import {PayloadLM} from './model/lametric/payloadLM.model';

const admin = require('firebase-admin');
// const request = require('request');

admin.initializeApp(functions.config().firebase);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const count = functions.https.onRequest((request, response) => {
  const payloadLM = new PayloadLM();

  admin.database().ref('entries').once('value', snapshot => {

    const entries = snapshot.val();

    payloadLM.frames.push({
      text: '' + Object.keys(entries).length,
      icon: 'a5838'
    });

    response.send(payloadLM);
  });

});

/*export const pushToLaMetricOnWrite =
  functions.database.ref(EntriesService.basePath + '/{entryId}').onWrite((event) => {
      const payloadLM = new PayloadLM();

      payloadLM.frames.push({
        text: '777',
        icon: 'a5838'
      });

        request.post('https://developer.lametric.com/api/v1/dev/widget/update/com.lametric.xxxxxxxx/2', payloadLM,
            function (error, response, body) {
                console.log('error:', error);
            }
        );

    }
  );
  */

