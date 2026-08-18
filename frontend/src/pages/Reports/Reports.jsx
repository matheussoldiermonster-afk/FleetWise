import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  Box,
  Grid,
  TextField,
  MenuItem,
  Button,
  Tabs,
  Tab,
} from "@mui/material";

import { useSnackbar } from "notistack";

import MainLayout from "../../components/layout/MainLayout";
import PageHeader from "../../components/layout/PageHeader";
import api from "../../services/api";

import GeneralTab from "./tabs/GeneralTab";
import VehicleTab from "./tabs/VehicleTab";
import TechnicianTab from "./tabs/TechnicianTab";
import FinancialTab from "./tabs/FinancialTab";
import PersonalUsageTab from "./tabs/PersonalUsageTab";
import MaintenanceTab from "./tabs/MaintenanceTab";
import RankingTab from "./tabs/RankingTab";
import ConsumptionTab from "./tabs/ConsumptionTab";
import ReimbursementTab from "./tabs/ReimbursementTab";
import ExecutiveSummaryDialog from "./ExecutiveSummaryDialog";

const TABS = [
  "Geral",
  "Por Veículo",
  "Por Técnico",
  "Financeiro",
  "Uso Particular",
  "Manutenção",
  "Ranking",
  "Consumo",
  "Saldo Reembolso",
];

function getDefaultPeriod() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const toInputDate = (d) => d.toISOString().slice(0, 10);

  return { startDate: toInputDate(start), endDate: toInputDate(end) };
}

function Reports() {
  const { enqueueSnackbar } = useSnackbar();

  const [tab, setTab] = useState(0);

  const [filters, setFilters] = useState({
    ...getDefaultPeriod(),
    vehicleId: "",
    technicianId: "",
    fuelType: "",
  });

  const [vehicles, setVehicles] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const [selectedVehicleId, setSelectedVehicleId] = useState("");
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [selectedReimbursementVehicleId, setSelectedReimbursementVehicleId] = useState("");

  const [reports, setReports] = useState({});
  const [loadingTab, setLoadingTab] = useState(false);

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    loadCurrentTab();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, selectedVehicleId, selectedTechnicianId, selectedReimbursementVehicleId]);

  async function loadOptions() {
    try {
      const [vehiclesRes, techniciansRes] = await Promise.all([
        api.get("/vehicles"),
        api.get("/technicians"),
      ]);

      setVehicles(vehiclesRes.data);
      setTechnicians(techniciansRes.data);

      if (vehiclesRes.data.length > 0) {
        setSelectedVehicleId(vehiclesRes.data[0].id);
      }
      if (techniciansRes.data.length > 0) {
        setSelectedTechnicianId(techniciansRes.data[0].id);
      }

      const reimbursableVehicles = vehiclesRes.data.filter((v) => v.reimbursable);
      if (reimbursableVehicles.length > 0) {
        setSelectedReimbursementVehicleId(reimbursableVehicles[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  }

  function buildParams(extra = {}) {
    const params = { ...extra };

    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.fuelType) params.fuelType = filters.fuelType;

    return params;
  }

  async function loadCurrentTab() {
    setLoadingTab(true);

    try {
      switch (tab) {
        case 0: {
          const params = buildParams();
          if (filters.vehicleId) params.vehicleId = filters.vehicleId;
          if (filters.technicianId) params.technicianId = filters.technicianId;
          const res = await api.get("/reports/general", { params });
          setReports((prev) => ({ ...prev, general: res.data }));
          break;
        }
        case 1: {
          if (!selectedVehicleId) break;
          const res = await api.get(`/reports/vehicle/${selectedVehicleId}`, {
            params: buildParams(),
          });
          setReports((prev) => ({ ...prev, vehicle: res.data }));
          break;
        }
        case 2: {
          if (!selectedTechnicianId) break;
          const res = await api.get(
            `/reports/technician/${selectedTechnicianId}`,
            { params: buildParams() }
          );
          setReports((prev) => ({ ...prev, technician: res.data }));
          break;
        }
        case 3: {
          const res = await api.get("/reports/financial", {
            params: buildParams(),
          });
          setReports((prev) => ({ ...prev, financial: res.data }));
          break;
        }
        case 4: {
          const params = buildParams();
          if (filters.vehicleId) params.vehicleId = filters.vehicleId;
          if (filters.technicianId) params.technicianId = filters.technicianId;
          const res = await api.get("/reports/personal-usage", { params });
          setReports((prev) => ({ ...prev, personalUsage: res.data }));
          break;
        }
        case 5: {
          const res = await api.get("/reports/maintenance");
          setReports((prev) => ({ ...prev, maintenance: res.data }));
          break;
        }
        case 6: {
          const res = await api.get("/reports/expense-ranking", {
            params: buildParams(),
          });
          setReports((prev) => ({ ...prev, ranking: res.data }));
          break;
        }
        case 7: {
          const res = await api.get("/reports/consumption", {
            params: buildParams(),
          });
          setReports((prev) => ({ ...prev, consumption: res.data }));
          break;
        }
        case 8: {
          if (!selectedReimbursementVehicleId) break;
          const res = await api.get(
            `/reports/reimbursement-balance/${selectedReimbursementVehicleId}`,
            { params: buildParams() }
          );
          setReports((prev) => ({ ...prev, reimbursement: res.data }));
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        error.response?.data?.message || "Erro ao carregar relatório.",
        { variant: "error" }
      );
    } finally {
      setLoadingTab(false);
    }
  }

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  return (
    <MainLayout>
      <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
        <PageHeader
          title="📊 Relatórios"
          subtitle="Análises completas da frota, por período, veículo ou técnico."
        />

        <ExecutiveSummaryDialog filters={filters} />
      </Box>

      {/* Filtros */}
      <Card elevation={3} sx={{ borderRadius: 4, mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Data inicial"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size={{ xs: 6, sm: 3, md: 2 }}>
              <TextField
                fullWidth
                size="small"
                type="date"
                label="Data final"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
              <TextField
                fullWidth
                select
                size="small"
                label="Veículo (Geral/Uso Particular)"
                name="vehicleId"
                value={filters.vehicleId}
                onChange={handleFilterChange}
              >
                <MenuItem value="">Todos</MenuItem>
                {vehicles.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.model} - {v.plate}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 4, md: 2.5 }}>
              <TextField
                fullWidth
                select
                size="small"
                label="Técnico (Geral/Uso Particular)"
                name="technicianId"
                value={filters.technicianId}
                onChange={handleFilterChange}
              >
                <MenuItem value="">Todos</MenuItem>
                {technicians.map((t) => (
                  <MenuItem key={t.id} value={t.id}>
                    {t.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 4, md: 2 }}>
              <TextField
                fullWidth
                select
                size="small"
                label="Combustível"
                name="fuelType"
                value={filters.fuelType}
                onChange={handleFilterChange}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="GASOLINE">Gasolina</MenuItem>
                <MenuItem value="ETHANOL">Etanol</MenuItem>
                <MenuItem value="DIESEL">Diesel</MenuItem>
                <MenuItem value="FLEX">Flex</MenuItem>
                <MenuItem value="ELECTRIC">Elétrico</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, md: 1 }}>
              <Button fullWidth variant="contained" onClick={loadCurrentTab}>
                Filtrar
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Tabs
        value={tab}
        onChange={(e, value) => setTab(value)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 3 }}
      >
        {TABS.map((label) => (
          <Tab key={label} label={label} />
        ))}
      </Tabs>

      {tab === 0 && <GeneralTab report={reports.general} loading={loadingTab} />}

      {tab === 1 && (
        <VehicleTab
          vehicles={vehicles}
          selectedVehicleId={selectedVehicleId}
          onSelectVehicle={setSelectedVehicleId}
          report={reports.vehicle}
          loading={loadingTab}
        />
      )}

      {tab === 2 && (
        <TechnicianTab
          technicians={technicians}
          selectedTechnicianId={selectedTechnicianId}
          onSelectTechnician={setSelectedTechnicianId}
          report={reports.technician}
          loading={loadingTab}
        />
      )}

      {tab === 3 && <FinancialTab report={reports.financial} loading={loadingTab} />}

      {tab === 4 && (
        <PersonalUsageTab
          report={reports.personalUsage}
          loading={loadingTab}
          onCostPerKmSaved={loadCurrentTab}
        />
      )}

      {tab === 5 && <MaintenanceTab report={reports.maintenance} loading={loadingTab} />}

      {tab === 6 && <RankingTab report={reports.ranking} loading={loadingTab} />}

      {tab === 7 && <ConsumptionTab report={reports.consumption} loading={loadingTab} />}

      {tab === 8 && (
        <ReimbursementTab
          vehicles={vehicles}
          selectedVehicleId={selectedReimbursementVehicleId}
          onSelectVehicle={setSelectedReimbursementVehicleId}
          report={reports.reimbursement}
          loading={loadingTab}
        />
      )}
    </MainLayout>
  );
}

export default Reports;
