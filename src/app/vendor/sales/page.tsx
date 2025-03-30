"use client";

import React, { FC, useEffect, useState } from "react";
import { Dispatch, RootState } from "@/store";
import { withAuth } from "@/components/views/dash/authGuard";
import { connect } from "react-redux";
import VendorLayout from "../layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TablePagination from "@/components/ui/pagination";
import { VendorSalesFilters } from "@/domain/dto/input/vendor.input";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Transaction } from "@/domain/vendor";
import { VendorSalesAPIResponse } from "@/domain/dto/output";
import { addCommaSeparators } from "@/utilities";
import useDeviceType from "@/lib/hooks/useDeviceType";
import { DeviceType } from "@/domain/constants";
import SalesPageShimmer from "./shimmer";

export type SalesPageProps = {
  getVendorSales: (filters: VendorSalesFilters) => void;
  vendorSales: VendorSalesAPIResponse;
  isProcessingRequest: boolean;
};

const SalesPage: FC<SalesPageProps> & { layout: any } = ({
  getVendorSales,
  vendorSales,
  isProcessingRequest,
}) => {
  const [filters, setFilters] = useState<VendorSalesFilters>({
    page: 1,
    page_size: 10,
  } as VendorSalesFilters);
  const deviceType = useDeviceType();

  const [sorting, setSorting] = useState<SortingState>([]);

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "product_number",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tracking no
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-1 h-4 w-4" />
            ) : null}
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("product_number") || "N/A"}
        </div>
      ),
    },
    {
      accessorKey: "product_name",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Product Name
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-1 h-4 w-4" />
            ) : null}
          </div>
        );
      },
      cell: ({ row }) => <div>{row.getValue("product_name") || "N/A"}</div>,
    },
    {
      id: "price",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-1 h-4 w-4" />
            ) : null}
          </div>
        );
      },
      cell: ({ row }) => {
        const transaction = row.original;
        const price =
          Number.parseInt(transaction.total_cost) /
          transaction.total_tickets_count;
        return <div>{addCommaSeparators(price)}</div>;
      },
      sortingFn: (rowA, rowB) => {
        const priceA =
          Number.parseInt(rowA.original.total_cost) /
          rowA.original.total_tickets_count;
        const priceB =
          Number.parseInt(rowB.original.total_cost) /
          rowB.original.total_tickets_count;
        return priceA - priceB;
      },
    },
    {
      accessorKey: "total_tickets_count",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center justify-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Order(s)
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-1 h-4 w-4" />
            ) : null}
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-center text-blue-500">
          {row.getValue("total_tickets_count")}
        </div>
      ),
    },
    {
      accessorKey: "total_cost",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center justify-end cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Amount
            {column.getIsSorted() === "asc" ? (
              <ChevronUp className="ml-1 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ChevronDown className="ml-1 h-4 w-4" />
            ) : null}
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="text-right">{row.getValue("total_cost")}</div>
      ),
    },
  ];

  const table = useReactTable({
    data: vendorSales?.results || [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: filters?.page_size || 10,
      },
    },
  });

  useEffect(() => {
    getVendorSales(filters);
  }, [filters]);

  return (
    <div className="flex flex-col h-fit justify-center">
      <div className="px-4 py-2 md:px-6 md:py-3 bg-white">
        {deviceType === DeviceType.mobile ? (
          <div className="flex justify-between items-center mb-2 mt-12 md:mt-0">
            <h2 className="text-lg font-medium">Sales</h2>
          </div>
        ) : (
          <h2 className="text-lg font-medium text-center mb-3">Sales</h2>
        )}
        {isProcessingRequest ? (
          <SalesPageShimmer />
        ) : (
          <div className="shadow-md">
            {!vendorSales || vendorSales?.results?.length === 0 ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-center">
                  <p className="text-muted-foreground mb-3">
                    No transactions found. Start selling and track your earnings
                    here!
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow
                            key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                          >
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                          >
                            No results.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <TablePagination
                  currentPage={filters?.page}
                  pageSize={filters?.page_size}
                  total={(vendorSales?.count as number) || 0}
                  handleChange={(key, value) =>
                    setFilters((prev) => ({ ...prev, [key]: value }))
                  }
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

SalesPage.layout = VendorLayout;

const mapStateToProps = (state: RootState) => {
  const isProcessingRequest = state.loading.effects.vendor.getVendorSales;
  const { vendorSales } = state.vendor;
  return {
    vendorSales,
    isProcessingRequest,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getVendorSales: (filters: VendorSalesFilters) =>
    dispatch.vendor.getVendorSales(filters),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withAuth(SalesPage));
