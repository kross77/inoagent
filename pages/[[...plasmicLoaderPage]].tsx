import * as React from "react";
import { PlasmicComponent } from "@plasmicapp/loader-nextjs";
import { GetStaticPaths, GetStaticProps } from "next";
import {
  ComponentRenderData,
  PlasmicRootProvider,
} from "@plasmicapp/loader-react";
import { registerComponent, } from '@plasmicapp/host';
import Error from "next/error";
import {firebaseService, PLASMIC} from "../init";
import {useEffect, useState} from "react";
import firebase from "firebase/compat";
import {useUserState} from "../components/firebase/Service";
import Rain from "../components/ui/Rain";



export default function PlasmicLoaderPage(props: {
  plasmicData?: ComponentRenderData
}) {
  const { plasmicData } = props;


  const [loading, setLoading] = useState(true);
  const [authorized, setAuth] = useState(false);
  const [userCount, setUserCount] = useState(null);
  const user = useUserState(firebaseService);
  useEffect(() => {

    setLoading(firebaseService.userLoading);
    setAuth(firebaseService.userAuthenticated);
    console.log('firebaseService.userLoading', {loading: firebaseService.userLoading, authenticated: firebaseService.userAuthenticated})
  }, [user])

  //@ts-ignore
  useEffect(() => {
    return firebaseService.listenUserCount((userCount) =>{
      setUserCount(userCount);
    })
  }, [])

  if (!plasmicData || plasmicData.entryCompMetas.length === 0) {
    return <Error statusCode={404} />;
  }

  return (
      <Rain>
        <PlasmicRootProvider
            loader={PLASMIC}
            prefetchedData={plasmicData}
        >
          <PlasmicComponent component={'Homepage'} componentProps={{
            usersCount: userCount == null ? "..." : userCount,
            root: {
              props: {
                style: {background: 'transparent'}
              }
            },
            enterArea: {
              props: {
                onClick: () => {
                  firebaseService.signInAnonymously();
                },
                authorized,
                loading,
              }
            }
          }} />
        </PlasmicRootProvider>
      </Rain>

  );
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { plasmicLoaderPage } = context.params ?? {};
  const plasmicPath = typeof plasmicLoaderPage === 'string' ? plasmicLoaderPage : Array.isArray(plasmicLoaderPage) ? `/${plasmicLoaderPage.join('/')}` : '/';
  const plasmicData = await PLASMIC.maybeFetchComponentData(plasmicPath);
  if (plasmicData) {
    return {
      props: { plasmicData },
    };
  }
  return {
    // non-Plasmic catch-all
    props: {},
  };
}

export const getStaticPaths: GetStaticPaths = async () => {
  const pageModules = await PLASMIC.fetchPages();
  return {
    paths: pageModules.map((mod) => ({
      params: {
        plasmicLoaderPage: mod.path.substring(1).split("/"),
      },
    })),
    fallback: false,
  };
}