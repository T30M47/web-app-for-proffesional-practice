import { AntdIconProps } from "@ant-design/icons/lib/components/AntdIcon";
import ArrowLeftOutlined from "@ant-design/icons/lib/icons/ArrowLeftOutlined";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface ArrowLeftProps extends AntdIconProps {
    color: string,
    hoverColor: string
}


const ArrowLeft = styled(ArrowLeftOutlined).withConfig({
    shouldForwardProp: (prop) => !['color', 'hoverColor'].includes(prop),
}) <ArrowLeftProps>`
    color: ${props => props.color};
    margin-right: 10px;

    &:hover {
        color: ${props => props.hoverColor};
    }
`

export const BackButton = () => {
    const navigate = useNavigate();

    return (
        <ArrowLeft onClick={() => navigate(-1)} color="black" hoverColor="#fa541c" />
    )
}


