import { useEffect, useState } from "react";

import {
  Grid,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

import { useSnackbar } from "notistack";

import api from "../../services/api";

const MAINTENANCE_TYPES = [
  { value: "OIL_CHANGE", label: "Troca de óleo" },
  { value: "OIL_FILTER", label: "Filtro de óleo" },
  { value: "AIR_FILTER", label: "Filtro de ar" },
  { value: "FUEL_FILTER", label: "Filtro de combustível" },
  { value: "BRAKE_PADS", label: "Pastilhas de freio" },
  { value: "BRAKE_DISC", label: "Disco de freio" },
  { value: "TIRES", label: "Pneus" },
  { value: "BATTERY", label: "Bateria" },
  { value: "BELT", label: "Correia" },
  { value: "INSPECTION", label: "Revisão" },
  { value: "INSURANCE", label: "Seguro" },
  { value: "LICENSING", label: "Licenciamento" },
  { value: "OTHER", label: "Outro" },
];

function MaintenanceForm({ maintenance, onSuccess }) {
  const { enqueueSnackbar } = useSnackbar();
  const [vehicles, setVehicles] = useState([]);

  const [form, setForm] = useState({
    vehicleId: "",
    type: "OIL_CHANGE",
    currentKm: "",
    nextKm: "",
    description: "",
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  useEffect(() => {
    if (maintenance) {
      setForm({
        vehicleId: maintenance.vehicleId || "",
        type: maintenance.type || "OIL_CHANGE",
        currentKm: maintenance.currentKm ?? "",
        nextKm: maintenance.nextKm ?? "",
        description: maintenance.description || "",
      });
    }
  }, [maintenance]);

  async function loadVehicles() {
    try {
      const response = await api.get("/vehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function handleVehicleChange(event) {
    const vehicleId = event.target.value;
    const vehicle = vehicles.find((v) => String(v.id) === String(vehicleId));

    setForm({
      ...form,
      vehicleId,
      // sugere o KM atual do veículo, se ainda não foi digitado
      currentKm: form.currentKm || vehicle?.currentKm || "",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const payload = {
      vehicleId: Number(form.vehicleId),
      type: form.type,
      currentKm: Number(form.currentKm),
      nextKm: Number(form.nextKm),
      description: form.description,
    };

    try {
      if (maintenance) {
        await api.put(`/maintenances/${maintenance.id}`, payload);
      } else {
        await api.post("/maintenances", payload);
      }

      enqueueSnackbar(
        maintenance
          ? "Manutenção atualizada com sucesso!"
          : "Manutenção cadastrada com sucesso!",
        { variant: "success" }
      );

      onSuccess();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        error.response?.data?.message || "Erro ao salvar manutenção.",
        { variant: "error" }
      );
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            required
            label="Veículo"
            name="vehicleId"
            value={form.vehicleId}
            onChange={handleVehicleChange}
          >
            {vehicles.map((v) => (
              <MenuItem key={v.id} value={v.id}>
                {v.plate} - {v.brand} {v.model}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            required
            label="Tipo de manutenção"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            {MAINTENANCE_TYPES.map((t) => (
              <MenuItem key={t.value} value={t.value}>
                {t.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            required
            type="number"
            label="KM atual (na hora do serviço)"
            name="currentKm"
            value={form.currentKm}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            required
            type="number"
            label="Vence em (KM)"
            name="nextKm"
            value={form.nextKm}
            onChange={handleChange}
            helperText="KM em que a próxima troca/revisão deve acontecer"
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={2}
            label="Descrição / observações"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Button fullWidth variant="contained" type="submit" size="large">
            {maintenance ? "Salvar Alterações" : "Cadastrar Manutenção"}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}

export default MaintenanceForm;
