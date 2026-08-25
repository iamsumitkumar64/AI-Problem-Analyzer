import { Table } from "antd";
import type { TableProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo } from "react";

interface CustomTableProps<T> {
    serialNumberConfig: {
        show: boolean;
        name: string;
    };
    columns: TableProps<T>["columns"];
    data: T[];
    loading?: boolean;
    onPageChange?: (_page: number, _pageSize: number) => void;
}

const CustomTable = <T extends object>({
    columns,
    data,
    loading,
    serialNumberConfig,
    onPageChange,
}: CustomTableProps<T>) => {
    const processedData = useMemo(() => {
        return (data || []).map((ele, index) => ({
            key: (ele as any)?.id ?? index,
            rowIndex: index + 1,
            ...ele,
        }));
    }, [data]);

    const finalColumns: ColumnsType<T> = useMemo(() => {
        if (serialNumberConfig.show) {
            const newColumns = [...(columns ?? [])];
            newColumns.unshift({
                dataIndex: "rowIndex",
                key: "rowIndex",
                align: "center",
                title: serialNumberConfig.name,
                width: 65,
                fixed: "left",
                render: (val: number) => (
                    <span className="text-xs font-mono font-medium text-slate-500">
                        {val < 10 ? `0${val}` : val}
                    </span>
                )
            });
            return newColumns;
        }
        return columns ?? [];
    }, [columns, serialNumberConfig]);

    return (
        <div className="w-full bg-[#121214] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl">
            <Table
                columns={finalColumns}
                dataSource={processedData}
                loading={loading}
                pagination={{
                    pageSize: 10,
                    onChange: onPageChange,
                    size: "small",
                    showTotal: (total, range) => (
                        <span className="text-xs text-zinc-500 font-medium">
                            Showing {range[0]}-{range[1]} of {total} records
                        </span>
                    ),
                }}
                rowKey={(record) => (record as any)?.id ?? (record as any)?.rowIndex}
                scroll={{ x: 'max-content' }}
                size="middle"
            />
        </div>
    );
};

export default CustomTable;