import { Divider, Flex, Layout, Space, Typography, Spin } from "antd";
import { useEffect } from "react";

export default function MainAreaLayout(props: {
    title: React.ReactNode;
    description?: React.ReactNode;
    children: React.ReactNode;
    extra?: React.ReactNode;
    loading?: boolean
}) {
    let loading = props.loading || false;

    useEffect(()=>{
        
    },[]);

    return (
        <>
            <Layout style={{ height: "100%", overflow: "scroll" }}>
                <Layout.Header
                    style={{
                        padding: "42px 32px",
                        backgroundColor: "transparent",
                    }}
                >
                    <Flex
                        align="center"
                        justify="space-between"
                        style={{ height: "100%" }}
                    >
                        <Flex vertical>
                            <Typography.Title
                                level={4}
                                style={{ marginBottom: 2 }}
                            >
                                {props.title}
                            </Typography.Title>
                            {props.description ? (
                                <Typography.Text type="secondary">
                                    {props.description}
                                </Typography.Text>
                            ) : (
                                <></>
                            )}
                        </Flex>
                        <Space
                            style={{ justifySelf: "flex-end" }}
                            styles={{ item: { display: "flex" } }}
                        >
                            {props.extra}
                        </Space>
                    </Flex>
                </Layout.Header>
                <Divider style={{ margin: 0 }} />
                <Layout.Content
                    style={{ padding: "16px 32px", borderRadius: 0 }}
                >
                    <Spin spinning={loading}>{props.children}</Spin>
                </Layout.Content>
            </Layout>
        </>
    );
}