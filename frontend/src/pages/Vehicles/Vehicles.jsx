import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/layout/PageHeader";
import DataGridTable from "../../components/tables/DataGridTable";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import SearchInput from "../../components/ui/SearchInput";
import VehicleForm from "../../components/forms/VehicleForm";
import api from "../../services/api";

import { useSnackbar } from "notistack";
import { useConfirm } from "../../contexts/ConfirmContext";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [search, setSearch] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();
  const location = useLocation();

  // Chegou aqui pela busca global do cabeçalho? já filtra.
  useEffect(() => {
    if (location.state?.prefillSearch) {
      setSearch(location.state.prefillSearch);
    }
  }, [location.state]);

  async function loadVehicles() {
    try {
      const response = await api.get("/vehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
      enqueueSnackbar("Erro ao carregar veículos.", { variant: "error" });
    }
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  function handleSuccess() {
    setIsModalOpen(false);
    setSelectedVehicle(null);
    loadVehicles();
  }

  function handleNewVehicle() {
    setSelectedVehicle(null);
    setIsModalOpen(true);
  }

  function handleEdit(vehicle) {
    setSelectedVehicle(vehicle);
    setIsModalOpen(true);
  }

  async function handleDelete(vehicle) {
    const confirmed = await confirm(
      `Deseja realmente excluir o veículo ${vehicle.plate}?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/vehicles/${vehicle.id}`);

      enqueueSnackbar("Veículo excluído com sucesso!", { variant: "success" });

      loadVehicles();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        error.response?.data?.message || "Erro ao excluir veículo.",
        { variant: "error" }
      );
    }
  }

  const columns = [
    { field: "plate", headerName: "Placa", flex: 1 },
    { field: "brand", headerName: "Marca", flex: 1 },
    { field: "model", headerName: "Modelo", flex: 1 },
    { field: "year", headerName: "Ano", flex: 1 },
    { field: "fuelType", headerName: "Combustível", flex: 1 },
  ];

  const filteredVehicles = vehicles.filter(
    (v) =>
      v.plate.toLowerCase().includes(search.toLowerCase()) ||
      v.model.toLowerCase().includes(search.toLowerCase()) ||
      v.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout>
      <PageHeader
        title="🚗 Veículos"
        subtitle="Gerencie todos os veículos da frota."
        action={
          <Button onClick={handleNewVehicle}>+ Novo Veículo</Button>
        }
      />

      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Pesquisar por placa, marca ou modelo..."
      />

      <DataGridTable
        rows={filteredVehicles}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        title={selectedVehicle ? "Editar Veículo" : "Cadastrar Veículo"}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedVehicle(null);
        }}
      >
        <VehicleForm
          vehicle={selectedVehicle}
          onSuccess={handleSuccess}
        />
      </Modal>
    </MainLayout>
  );
}

export default Vehicles;
