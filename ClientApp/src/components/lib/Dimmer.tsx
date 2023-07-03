import React from "react";

export enum DimmerStyle {
    Light,
    Dark
}

type LoadingProps = {
    dimmerStyle?: DimmerStyle,
    opacity?: string,
    children?: React.ReactNode
}

function Dimmer({ dimmerStyle = DimmerStyle.Light, opacity = "0.6", children }: LoadingProps) {

    const color = dimmerStyle === DimmerStyle.Light ? `rgba(255, 255, 255, ${opacity})` : `rgba(1, 1, 1, ${opacity})`;
    const style: React.CSSProperties = {
        position: "fixed",
        width: "100%",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: color,
        zIndex: 9999
    }

    return (
        <div style={style}>
            {children}
        </div>
    )
}

export default Dimmer;
