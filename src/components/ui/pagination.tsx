import React, { useState } from "react";
import TablePagination from "@mui/material/TablePagination";
import { FC } from "react";
import { useTheme } from "next-themes";

type TablePaginationComponentProps = {
  currentPage: number;
  pageSize: number;
  total: number;
  handleChange: (key: string, value: number) => void;
};

const TablePaginationComponent: FC<TablePaginationComponentProps> = ({
  currentPage,
  pageSize,
  total,
  handleChange,
}) => {
  const [page, setPage] = useState(currentPage);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    handleChange("page", newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleChange("page_size", parseInt(event.target.value, 10));
  };

  const { theme = "light", setTheme } = useTheme();

  return (
    <TablePagination
      component="div"
      count={total}
      page={currentPage}
      onPageChange={handleChangePage}
      rowsPerPage={pageSize}
      onRowsPerPageChange={handleChangeRowsPerPage}
      sx={{
        ".MuiTablePagination-actions > button": {
          color: theme === "light" ? "#000" : "#fff",
        },
        ".MuiTablePagination-displayedRows": {
          color: theme === "light" ? "#000" : "#fff",
        },
        ".MuiSvgIcon-root": {
          color: theme === "light" ? "#000" : "#fff",
        },
        ".MuiTablePagination-selectLabel, .MuiTablePagination-input": {
          color: theme === "light" ? "#000" : "#fff",
        },
      }}
    />
  );
};

export default TablePaginationComponent;
