import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import DataTable from "../../components/tables/DataTable";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import VehicleForm from "../../components/forms/VehicleForm";
import api from "../../services/api";

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function loadVehicles() {
    try {
      const response = await api.get("/vehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
    }
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  function handleVehicleCreated() {
    setIsModalOpen(false);
    loadVehicles();
  }

  const columns = [
    "Placa",
    "Marca",
    "Modelo",
    "Ano",
    "Combustível",
  ];

  const rows = vehicles.map((vehicle) => [
    vehicle.plate,
    vehicle.brand,
    vehicle.model,
    vehicle.year,
    vehicle.fuelType,
  ]);

  return (
    <MainLayout>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>🚗 Veículos</h1>

        <Button onClick={() => setIsModalOpen(true)}>
          + Novo Veículo
        </Button>
      </div>

      <DataTable columns={columns} data={rows} />

      <Modal
        isOpen={isModalOpen}
        title="Cadastrar Veículo"
        onClose={() => setIsModalOpen(false)}
      >
        <VehicleForm onSuccess={handleVehicleCreated} />
      </Modal>
    </MainLayout>
  );
}

export default Vehicles;