import React from "react";

import { TablePagination } from "@material-ui/core";

function TablePaging(props) {
  const {
    handleChangePage,
    count,
    handleChangeRowsPerPage,
    page,
    rowsPerPage,
  } = props;
  return (
    <TablePagination
      style={{ display: "flex" }}
      rowsPerPageOptions={[100, 200, 300]}
      component="div"
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onChangePage={handleChangePage}
      onChangeRowsPerPage={handleChangeRowsPerPage}
      labelRowsPerPage="تعداد ردیف "
      backIconButtonText="صفحه قبل"
      nextIconButtonText="صفحه بعد"
      labelDisplayedRows={({ from, to, count }) =>
        `${from}-${to} از ${count !== -1 ? count : 0}`
      }
    />
  );
}

export default TablePaging;
