import { Flex, Layout, Space, Typography, Spin } from "antd";

export default function MainAreaLayout(props: {
    title: React.ReactNode;
    description?: React.ReactNode;
    children: React.ReactNode;
    extra?: React.ReactNode;
    loading?: boolean;
}) {
    let loading = props.loading || false;

    return (
        <Layout className="!bg-[#090D16] min-h-full flex flex-col">
            <Layout.Header className="!bg-[#090D16] !px-4 sm:!px-8 !py-4 !h-auto border-b border-[#3B82F6]/15">
                <Flex
                    align="center"
                    justify="space-between"
                    className="w-full flex-wrap gap-3"
                >
                    <Flex vertical>
                        <Typography.Title
                            level={4}
                            className="!text-[#F8FAFC] !mb-0 text-lg sm:text-xl font-bold tracking-tight"
                        >
                            {props.title}
                        </Typography.Title>
                        {props.description && (
                            <Typography.Text className="!text-[#F8FAFC]/60 text-xs sm:text-sm mt-0.5">
                                {props.description}
                            </Typography.Text>
                        )}
                    </Flex>
                    <Space className="ml-auto">
                        {props.extra}
                    </Space>
                </Flex>
            </Layout.Header>
            <Layout.Content className="!bg-[#090D16] !p-3 sm:!p-6 flex-1 overflow-x-auto">
                <Spin spinning={loading} size="large">
                    {props.children}
                </Spin>
            </Layout.Content>
        </Layout>
    );
}