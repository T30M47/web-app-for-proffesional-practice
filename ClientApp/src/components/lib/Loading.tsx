import Title from 'antd/lib/typography/Title';
import React from 'react';
import styled from 'styled-components';
import Dimmer from './Dimmer';


const LoadingText = styled.div`
    display: block;
    position: relative;
    top: 45%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 80px;
    text-align: center;

    @-webkit-keyframes spin {
        from {
            -webkit-transform: rotate(0deg);
        }

        to {
            -webkit-transform: rotate(360deg);
        }
    }

    @keyframes spin {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }
    }

`


type LoadingProps = {
    spinnerColor?: string,
    text?: string
}

function Loading({ spinnerColor = "#fa541c", text = "" }: LoadingProps) {
    const loaderStyle: React.CSSProperties = {
        display: "block",
        position: "absolute",
        marginLeft: "-30px",
        left: "50%",
        top: "40%",
        width: "60px",
        height: "60px",
        borderStyle: "solid",
        borderColor: spinnerColor,
        borderTopColor: "transparent",
        borderWidth: "4px",
        borderRadius: "50%",
        WebkitAnimation: "spin .6s linear infinite",
        animation: "spin .6s linear infinite"
    }

    return (
        <Dimmer>
            <div style={loaderStyle}></div>
            <LoadingText>
                <Title level={5}>{text}</Title>
            </LoadingText>
        </Dimmer>
    )
}

export default Loading;
