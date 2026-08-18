import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/layout/PageHeader";
import DataGridTable from "../../components/tables/DataGridTable";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import TripForm from "../../components/forms/TripForm";
import api from "../../services/api";

import { useSnackbar } from "notistack";
import { useConfirm } from "../../contexts/ConfirmContext";

function Trips() {
  const [trips, setTrips] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();

  async function loadTrips() {
    try {
      const response = await api.get("/trips");
      setTrips(response.data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Erro ao carregar viagens.", { variant: "error" });
    }
  }

  useEffect(() => {
    loadTrips();
  }, []);

  function handleSuccess() {
    setIsModalOpen(false);
    setSelectedTrip(null);
    loadTrips();
  }

  async function handleDelete(trip) {
    const confirmed = await confirm("Deseja excluir esta viagem?");

    if (!confirmed) return;

    try {
      await api.delete(`/trips/${trip.id}`);

      enqueueSnackbar("Viagem removida com sucesso!", { variant: "success" });

      loadTrips();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        error.response?.data?.message || "Erro ao excluir viagem.",
        { variant: "error" }
      );
    }
  }

  const rows = trips.map((trip) => ({
    ...trip,
    plate: trip.vehicle?.plate,
    technicianName: trip.technician?.name,
  }));

  const columns = [
    { field: "plate", headerName: "Veículo", flex: 1 },
    { field: "technicianName", headerName: "Técnico", flex: 1 },
    { field: "initialKm", headerName: "KM Inicial", flex: 1 },
    { field: "finalKm", headerName: "KM Final", flex: 1 },
    { field: "workKm", headerName: "KM Trabalho", flex: 1 },
    { field: "personalKm", headerName: "KM Particular", flex: 1 },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="🛣️ Viagens"
        subtitle="Gerencie todas as viagens registradas."
        action={
          <Button
            onClick={() => {
              setSelectedTrip(null);
              setIsModalOpen(true);
            }}
          >
            + Nova Viagem
          </Button>
        }
      />

      <DataGridTable
        rows={rows}
        columns={columns}
        onEdit={(trip) => {
          setSelectedTrip(trip);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        title={selectedTrip ? "Editar Viagem" : "Nova Viagem"}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTrip(null);
        }}
      >
        <TripForm
          trip={selectedTrip}
          onSuccess={handleSuccess}
        />
      </Modal>
    </MainLayout>
  );
}

export default Trips;
