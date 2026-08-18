import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

function DataGridTable({
  rows,
  columns,
  onEdit,
  onDelete,
}) {
  const actionColumn = {
    field: "actions",
    headerName: "Ações",
    width: 120,
    sortable: false,
    filterable: false,

    renderCell: (params) => (
      <>
        {onEdit && (
          <IconButton
            color="primary"
            onClick={() => onEdit(params.row)}
          >
            <EditIcon />
          </IconButton>
        )}

        {onDelete && (
          <IconButton
            color="error"
            onClick={() => onDelete(params.row)}
          >
            <DeleteIcon />
          </IconButton>
        )}
      </>
    ),
  };

  const gridColumns =
    onEdit || onDelete ? [...columns, actionColumn] : columns;

  return (
    <Box
      sx={{
        height: 600,
        width: "100%",
        background: "background.paper",
        borderRadius: 1,
        overflow: "hidden",
        boxShadow: 2,
      }}
    >
      <DataGrid
  rows={rows}
  columns={gridColumns}
  sx={{
    border: 0,

    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#16a34a",
      color: "#fff",
    },

    "& .MuiDataGrid-columnHeader": {
      backgroundColor: "#16a34a",
    },

    "& .MuiDataGrid-columnHeaderTitle": {
      color: "#fff",
      fontWeight: 700,
    },

    "& .MuiDataGrid-iconButtonContainer": {
      color: "#fff",
    },

    "& .MuiDataGrid-menuIcon": {
      color: "#fff",
    },
  }}
/>
    </Box>
  );
}

export default DataGridTable;