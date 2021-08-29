import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  const usersRef = admin.database().ref("users");
  await usersRef.update({
    [user.uid]: {
      createdAt: new Date(),
    },
  });
});

export const onUserDelete = functions.auth.user().onDelete((user) => {
  admin.database().ref(`users/${user.uid}`).remove();
});

export const onUserTableChange = functions.database.ref("users")
    .onWrite(async () => {
      const users = await admin.database().ref("users").get();
      admin.database().ref("settings/usersCount").set(users.numChildren());
    });
