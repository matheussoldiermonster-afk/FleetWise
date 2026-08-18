import { useEffect, useState } from "react";

import { Chip } from "@mui/material";

import MainLayout from "../../components/layout/MainLayout";
import DataGridTable from "../../components/tables/DataGridTable";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import MaintenanceForm from "../../components/forms/MaintenanceForm";
import api from "../../services/api";
import PageHeader from "../../components/layout/PageHeader";
import SearchInput from "../../components/ui/SearchInput";

import { useSnackbar } from "notistack";
import { useConfirm } from "../../contexts/ConfirmContext";

const TYPE_LABELS = {
  OIL_CHANGE: "Troca de óleo",
  OIL_FILTER: "Filtro de óleo",
  AIR_FILTER: "Filtro de ar",
  FUEL_FILTER: "Filtro de combustível",
  BRAKE_PADS: "Pastilhas de freio",
  BRAKE_DISC: "Disco de freio",
  TIRES: "Pneus",
  BATTERY: "Bateria",
  BELT: "Correia",
  INSPECTION: "Revisão",
  INSURANCE: "Seguro",
  LICENSING: "Licenciamento",
  OTHER: "Outro",
};

function Maintenances() {
  const [maintenances, setMaintenances] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState(null);
  const [search, setSearch] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();

  async function loadMaintenances() {
    try {
      const response = await api.get("/maintenances");
      setMaintenances(response.data);
    } catch (error) {
      console.error("Erro ao carregar manutenções:", error);
      enqueueSnackbar("Erro ao carregar manutenções.", { variant: "error" });
    }
  }

  useEffect(() => {
    loadMaintenances();
  }, []);

  function handleSuccess() {
    setIsModalOpen(false);
    setSelectedMaintenance(null);
    loadMaintenances();
  }

  function handleNewMaintenance() {
    setSelectedMaintenance(null);
    setIsModalOpen(true);
  }

  async function handleDelete(maintenance) {
    const confirmed = await confirm(
      `Deseja excluir a manutenção "${TYPE_LABELS[maintenance.type] || maintenance.type}" de ${maintenance.vehicle?.plate}?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/maintenances/${maintenance.id}`);
      enqueueSnackbar("Manutenção excluída com sucesso!", { variant: "success" });
      loadMaintenances();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        error.response?.data?.message || "Erro ao excluir manutenção.",
        { variant: "error" }
      );
    }
  }

  const columns = [
    {
      field: "vehiclePlate",
      headerName: "Veículo",
      flex: 1,
    },
    {
      field: "typeLabel",
      headerName: "Tipo",
      flex: 1,
    },
    {
      field: "currentKm",
      headerName: "KM na manutenção",
      flex: 1,
    },
    {
      field: "nextKm",
      headerName: "Vence em (KM)",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Situação",
      flex: 1,
      renderCell: (params) => {
        const remaining = params.row.nextKm - (params.row.vehicle?.currentKm ?? params.row.currentKm);
        const critical = remaining <= 500;
        return (
          <Chip
            size="small"
            label={remaining <= 0 ? `Venceu há ${Math.abs(remaining)} km` : `Faltam ${remaining} km`}
            color={critical ? "error" : "success"}
            variant={critical ? "filled" : "outlined"}
          />
        );
      },
    },
  ];

  const rows = maintenances
    .filter((m) =>
      (m.vehicle?.plate || "").toLowerCase().includes(search.toLowerCase()) ||
      (m.vehicle?.model || "").toLowerCase().includes(search.toLowerCase())
    )
    .map((m) => ({
      ...m,
      vehiclePlate: `${m.vehicle?.model || ""} - ${m.vehicle?.plate || ""}`,
      typeLabel: TYPE_LABELS[m.type] || m.type,
    }));

  return (
    <MainLayout>
      <PageHeader
        title="🛠 Manutenções"
        subtitle="Cadastre e acompanhe as manutenções preventivas da frota."
        action={
          <Button onClick={handleNewMaintenance}>+ Nova Manutenção</Button>
        }
      />

      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Pesquisar por veículo..."
      />

      <DataGridTable
        rows={rows}
        columns={columns}
        onEdit={(row) => {
          setSelectedMaintenance(row);
          setIsModalOpen(true);
        }}
        onDelete={(row) => handleDelete(row)}
      />

      <Modal
        isOpen={isModalOpen}
        title={selectedMaintenance ? "Editar Manutenção" : "Cadastrar Manutenção"}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMaintenance(null);
        }}
      >
        <MaintenanceForm
          maintenance={selectedMaintenance}
          onSuccess={handleSuccess}
        />
      </Modal>
    </MainLayout>
  );
}

export default Maintenances;
