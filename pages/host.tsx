import * as React from 'react';
import {PlasmicCanvasHost} from '@plasmicapp/host';
import Head from 'next/head';

export default function Host() {
    return (
        <div>
            <Head>
                <script src="https://static1.plasmic.app/preamble.js"/>
            </Head>
            <PlasmicCanvasHost/>
        </div>
    );
}