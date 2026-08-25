import { Typography, Spin } from "antd";

export default function MainAreaLayout(props: {
    title: React.ReactNode;
    description?: React.ReactNode;
    children: React.ReactNode;
    extra?: React.ReactNode;
    loading?: boolean;
}) {
    const loading = props.loading || false;

    return (
        <div className="w-full space-y-6">
            {/* Executive Workspace Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div className="space-y-1">
                    <Typography.Title
                        level={3}
                        className="!text-[#FAFAFA] !mb-0 text-xl sm:text-2xl font-extrabold tracking-tight"
                    >
                        {props.title}
                    </Typography.Title>
                    {props.description && (
                        <p className="text-xs sm:text-sm text-zinc-400 font-normal">
                            {props.description}
                        </p>
                    )}
                </div>
                {props.extra && (
                    <div className="flex items-center gap-2.5 flex-shrink-0">
                        {props.extra}
                    </div>
                )}
            </div>

            {/* Workspace Content Canvas */}
            <div className="w-full">
                <Spin spinning={loading} size="large">
                    {props.children}
                </Spin>
            </div>
        </div>
    );
}