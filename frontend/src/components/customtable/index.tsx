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
        return data.map((ele, index) => ({
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
                width: 70,
                fixed: "left",
            });
            return newColumns;
        }
        return columns ?? [];
    }, [columns, serialNumberConfig]);

    return (
        <div className="w-full bg-[#131B2E] border border-[#3B82F6]/20 rounded-xl overflow-hidden shadow-xl">
            <Table
                columns={finalColumns}
                dataSource={processedData}
                loading={loading}
                pagination={{
                    pageSize: 10,
                    onChange: onPageChange,
                    size: "small",
                }}
                rowKey={(record) => (record as any)?.id ?? (record as any)?.rowIndex}
                scroll={{ x: 'max-content' }}
                size="middle"
            />
        </div>
    );
};

export default CustomTable;