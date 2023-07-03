import { ButtonProps, default as defaultAntdButton } from "antd/lib/button";
import darken from "polished/lib/color/darken";
import styled from "styled-components";


interface StyleButtonProps extends ButtonProps {
    backgroundColor: string
}


export const StyleButton = styled(defaultAntdButton).withConfig({
    shouldForwardProp: (prop) => !['backgroundColor'].includes(prop),
}) <StyleButtonProps>`
    background: ${props => props.backgroundColor} !important;
    border-color: ${props => props.backgroundColor} !important;

    &:focus {
        background: ${props => darken(0.1, props.backgroundColor)} !important;
        border-color: ${props => darken(0.1, props.backgroundColor)} !important;
    }

    &:hover {
        background: ${props => darken(0.1, props.backgroundColor)} !important;
        border-color: ${props => darken(0.1, props.backgroundColor)} !important;
    }

    &::before {
        opacity: 0 !important;
    }
`

export const RedButton = (props: ButtonProps) => {
    return (
        <StyleButton {...props} type="primary" backgroundColor="#ff4d4f">
            {props.children}
        </StyleButton>
    )
}

export const GreenButton = (props: ButtonProps) => {
    return (
        <StyleButton {...props} type="primary" backgroundColor="#389e0d">
            {props.children}
        </StyleButton>
    )
}

export const BlueButton = (props: ButtonProps) => {
    return (
        <StyleButton {...props} type="primary" backgroundColor="#38618C">
            {props.children}
        </StyleButton>
    )
}
