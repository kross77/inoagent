import * as React from 'react'
import {useEffect} from "react";
import initRain from './initRain';


const Rain = ({children}) => {
    useEffect(() => {
        initRain('particleCanvas');
    }, [])
    return (
        <>
            <canvas id="particleCanvas" style={{
                position: "fixed",
                width: "100vw",
                height: "100vh",
                margin: "auto",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                background: "#CE3375",
            }}> </canvas>
            {children}
        </>

    )
}

export default Rain;