import { initPlasmicLoader } from "@plasmicapp/loader-nextjs";
import FirebaseService from "./components/firebase/Service";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "4PQukbmiw8zq1T3nKUQ5EL",
      token: "VC6zDaiKfAjTgJyJKuPKciKvTzLQHovfHU9MmaJ6mRfgbEkT39tOs8w0K26qisOD3IAMI2pH8ajlkIj93Q5A",
    },
  ],
});

export const firebaseService = new FirebaseService();