import { Component, ErrorInfo } from "react";
import { router } from "./Routes";

interface Props {
    children: JSX.Element | JSX.Element[];
}

interface State {
    hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({ hasError: false });
        router.navigate("/error");
    }

    public render() {
        return this.props.children;
    }
}

export default ErrorBoundary;
