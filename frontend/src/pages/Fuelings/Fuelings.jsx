import { useEffect, useState } from "react";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/layout/PageHeader";
import DataGridTable from "../../components/tables/DataGridTable";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import FuelingForm from "../../components/forms/FuelingForm";

import api from "../../services/api";

import { useSnackbar } from "notistack";
import { useConfirm } from "../../contexts/ConfirmContext";

function Fuelings() {
  const [fuelings, setFuelings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();

  async function loadFuelings() {
    try {
      const response = await api.get("/fuelings");
      setFuelings(response.data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Erro ao carregar abastecimentos.", { variant: "error" });
    }
  }

  useEffect(() => {
    loadFuelings();
  }, []);

  function handleNewFueling() {
    setIsModalOpen(true);
  }

  function handleSuccess() {
    setIsModalOpen(false);
    loadFuelings();
  }

  async function handleDelete(fueling) {
    const confirmed = await confirm(
      `Deseja realmente excluir este abastecimento de ${fueling.vehicle?.plate}?`
    );

    if (!confirmed) return;

    try {
      await api.delete(`/fuelings/${fueling.id}`);

      enqueueSnackbar("Abastecimento excluído com sucesso!", { variant: "success" });

      loadFuelings();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        error.response?.data?.message || "Erro ao excluir abastecimento.",
        { variant: "error" }
      );
    }
  }

  const rows = fuelings.map((fueling) => ({
    ...fueling,
    plate: fueling.vehicle?.plate,
    dateFormatted: new Date(fueling.date).toLocaleDateString("pt-BR"),
    totalValueFormatted: `R$ ${Number(fueling.totalValue).toFixed(2)}`,
  }));

  const columns = [
    { field: "dateFormatted", headerName: "Data", flex: 1 },
    { field: "plate", headerName: "Veículo", flex: 1 },
    { field: "odometer", headerName: "KM", flex: 1 },
    { field: "liters", headerName: "Litros", flex: 1 },
    { field: "totalValueFormatted", headerName: "Valor", flex: 1 },
  ];

  return (
    <MainLayout>
      <PageHeader
        title="⛽ Abastecimentos"
        subtitle="Histórico de abastecimentos da frota."
        action={
          <Button onClick={handleNewFueling}>+ Novo Abastecimento</Button>
        }
      />

      <DataGridTable
        rows={rows}
        columns={columns}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        title="Novo Abastecimento"
        onClose={() => setIsModalOpen(false)}
      >
        <FuelingForm onSuccess={handleSuccess} />
      </Modal>
    </MainLayout>
  );
}

export default Fuelings;
