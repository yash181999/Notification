'use-strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.sendNotification = functions.firestore.document("Users/{user_id}/Notification/{notification_id}").onWrite((change,context)=> {
    
   
    const user_id = context.params.user_id;
    const notification_id = context.params.notification_id;


    return admin.firestore().collection("Users").doc(user_id).collection("Notification").doc(notification_id).get().then(queryResult=>{
         
        const from_user_id= queryResult.data().from;

        const message = queryResult.data().message;

        const from_data = admin.firestore().collection("Users").doc(from_user_id).get();

        const to_data = admin.firestore().collection("Users").doc(user_id).get();

        return Promise.all([from_data, to_data]).then(result => {
            const from_name = result[0].data().Email;

            const to_name = result[1].data().Email;

            const token_id = result[1].data().tokenId;

           const payload = {
               notification: {
                   title : "Notification from : " + from_name,
                   body : message,
                   icon : "default"
               }
           }

           return admin.messaging().sendToDevice(token_id,payload).then(result =>{
             return console.log("Notification sent  " + token_id);

 
           })

        });


    });
    
    
});

