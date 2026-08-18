import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import MainLayout from "../../components/layout/MainLayout";
import DataGridTable from "../../components/tables/DataGridTable";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import TechnicianForm from "../../components/forms/TechnicianForm";
import api from "../../services/api";
import PageHeader from "../../components/layout/PageHeader";
import SearchInput from "../../components/ui/SearchInput";

import { useSnackbar } from "notistack";
import { useConfirm } from "../../contexts/ConfirmContext";


function Technicians() {
  const [technicians, setTechnicians] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [search, setSearch] = useState("");

  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.prefillSearch) {
      setSearch(location.state.prefillSearch);
    }
  }, [location.state]);

  async function loadTechnicians() {
    try {
      const response = await api.get("/technicians");
      setTechnicians(response.data);
    } catch (error) {
      console.error("Erro ao carregar técnicos:", error);
      enqueueSnackbar("Erro ao carregar técnicos.", { variant: "error" });
    }
  }

  useEffect(() => {
    loadTechnicians();
  }, []);

  function handleSuccess() {
    setIsModalOpen(false);
    setSelectedTechnician(null);
    loadTechnicians();
  }

  function handleNewTechnician() {
    setSelectedTechnician(null);
    setIsModalOpen(true);
  }

  function handleEdit(technician) {
  setSelectedTechnician(technician);
  setIsModalOpen(true);
}

  async function handleDelete(technician) {

    const confirmed = await confirm(`Deseja excluir ${technician.name}?`);

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/technicians/${technician.id}`);

      enqueueSnackbar("Técnico excluído com sucesso!", { variant: "success" });

      loadTechnicians();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        error.response?.data?.message || "Erro ao excluir técnico.",
        { variant: "error" }
      );
    }
  }

 const columns = [
  {
    field: "name",
    headerName: "Nome",
    flex: 1,
  },
  {
    field: "phone",
    headerName: "Telefone",
    flex: 1,
  },
  {
    field: "role",
    headerName: "Cargo",
    flex: 1,
  },
];

const filteredTechnicians = technicians.filter((technician) =>
  technician.name.toLowerCase().includes(search.toLowerCase())
);

const rows = filteredTechnicians;

  return (
    <MainLayout>
      <PageHeader
      
  title="👷 Técnicos"
  subtitle="Gerencie todos os técnicos cadastrados."
  action={
    <Button onClick={handleNewTechnician}>
      + Novo Técnico
    </Button>
  }
/>
<SearchInput
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  placeholder="Pesquisar técnico..."
/>

      <DataGridTable
  rows={rows}
  columns={columns}
  onEdit={(row) => {
    setSelectedTechnician(row);
    setIsModalOpen(true);
  }}
  onDelete={(row) => handleDelete(row)}
/>

      <Modal
        isOpen={isModalOpen}
        title={
          selectedTechnician
            ? "Editar Técnico"
            : "Cadastrar Técnico"
        }
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTechnician(null);
        }}
      >
        <TechnicianForm
          technician={selectedTechnician}
          onSuccess={handleSuccess}
        />
      </Modal>
    </MainLayout>
  );
}

export default Technicians;