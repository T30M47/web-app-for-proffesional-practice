import { Content } from "antd/lib/layout/layout";
import React from "react";

type MainContentProps = {
    children: React.ReactNode
}

function MainContent({ children }: MainContentProps) {
    return (
        <Content style={{ padding: 24 }}>
            <div id="mainContent" style={{ background: '#fff', padding: 24 }}>
                {children}
            </div>
        </Content>
    )
}

export default MainContent;
