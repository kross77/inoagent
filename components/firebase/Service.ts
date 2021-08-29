import {FirebaseApp, initializeApp } from "firebase/app";
import {Analytics, getAnalytics } from "firebase/analytics";
import {Auth, getAuth, signInAnonymously, onAuthStateChanged, User } from "firebase/auth";
import { Database, getDatabase, ref, onValue} from "firebase/database";
import { useState, useEffect } from "react";


export const useUserState = (s: FirebaseService) => {
    const [user, setUser] = useState(undefined);
    useEffect(() => {
        return onAuthStateChanged(s.auth, (user) => {

            console.log('onAuthStateChanged', {user})
            if (user) {
                s.user = user;
                setUser(user);
            } else {
                s.user = null
                setUser(null);
            }
        });
    }, [])
    return user;
}

export default class FirebaseService{
    app:FirebaseApp
    analytics:Analytics
    auth:Auth
    user:User = undefined;
    db:Database;

    constructor() {
        const firebaseConfig = JSON.parse(process.env.NEXT_PUBLIC_FIREBASE_CONFIG);
        console.log({firebaseConfig})
        this.app = initializeApp(firebaseConfig);
        try{
            this.analytics = getAnalytics(this.app);
        }catch(e){
            console.error("Can't initialize analytics")
        }

        this.auth = getAuth();
        this.db = getDatabase();
    }



    get userLoading(){
        return this.user === undefined;
    }

    get userAuthenticated(){
        return !!this.user?.uid;
    }


    async signInAnonymously(){
        try{
            await signInAnonymously(this.auth)
            return {error: null, result: 'Auth completed'}
        }catch(e){
            return {error: e.message, result: null}
        }

    }

    async listenUserCount(cb){
        console.log('listenUserCount init')
        const starCountRef = ref(this.db, 'settings/usersCount');
        return onValue(starCountRef, (snapshot) => {
            const data = snapshot.val();
            console.log('listenUserCount', data)
            cb(data)
        });
    }


}