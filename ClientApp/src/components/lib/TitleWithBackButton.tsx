import React, { Fragment } from "react";
import { BackButton } from "./buttons/BackButton";

type TitleWithBackButtonProps = {
    title: string
}

function TitleWithBackButton({ title }: TitleWithBackButtonProps) {
    return (
        <Fragment>
            <h1><BackButton />{title}</h1>
        </Fragment>
    )
}

export default TitleWithBackButton;
