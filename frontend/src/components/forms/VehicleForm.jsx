import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { useSnackbar } from "notistack";

function VehicleForm({ vehicle, onSuccess }) {
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    plate: "",
    fuelType: "FLEX",
    averageConsumption: "",
    currentKm: "",
    companyId: 1,
    reimbursable: false,
  });

  useEffect(() => {
    if (vehicle) {
      setForm({
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        plate: vehicle.plate,
        fuelType: vehicle.fuelType,
        averageConsumption: vehicle.averageConsumption,
        currentKm: vehicle.currentKm,
        companyId: vehicle.companyId,
        reimbursable: vehicle.reimbursable || false,
      });
    }
  }, [vehicle]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleCheckboxChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.checked,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      ...form,
      year: Number(form.year),
      averageConsumption: Number(form.averageConsumption),
      currentKm: Number(form.currentKm),
      companyId: Number(form.companyId),
      reimbursable: Boolean(form.reimbursable),
    };

    try {
      if (vehicle) {
        await api.put(`/vehicles/${vehicle.id}`, payload);

        enqueueSnackbar("Veículo atualizado com sucesso!", {
          variant: "success",
        });
      } else {
        await api.post("/vehicles", payload);

        enqueueSnackbar("Veículo cadastrado com sucesso!", {
          variant: "success",
        });
      }

      setForm({
        brand: "",
        model: "",
        year: "",
        plate: "",
        fuelType: "FLEX",
        averageConsumption: "",
        currentKm: "",
        companyId: 1,
        reimbursable: false,
      });

      onSuccess();
    } catch (error) {
      console.error(error);

      enqueueSnackbar("Erro ao salvar veículo.", {
        variant: "error",
      });
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Marca"
            name="brand"
            value={form.brand}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Modelo"
            name="model"
            value={form.model}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            type="number"
            label="Ano"
            name="year"
            value={form.year}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            label="Placa"
            name="plate"
            value={form.plate}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <FormControl fullWidth>
            <InputLabel>Combustível</InputLabel>

            <Select
              label="Combustível"
              name="fuelType"
              value={form.fuelType}
              onChange={handleChange}
            >
              <MenuItem value="FLEX">Flex</MenuItem>
              <MenuItem value="GASOLINE">Gasolina</MenuItem>
              <MenuItem value="ETHANOL">Etanol</MenuItem>
              <MenuItem value="DIESEL">Diesel</MenuItem>
              <MenuItem value="ELECTRIC">Elétrico</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="number"
            label="Consumo Médio (Km/L)"
            name="averageConsumption"
            inputProps={{ step: 0.1 }}
            value={form.averageConsumption}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="number"
            label="Quilometragem Atual"
            name="currentKm"
            value={form.currentKm}
            onChange={handleChange}
          />
        </Grid>

        <Grid size={12}>
          <FormControlLabel
            control={
              <Checkbox
                name="reimbursable"
                checked={form.reimbursable}
                onChange={handleCheckboxChange}
              />
            }
            label="Carro particular do técnico (reembolso por combustível — gera saldo de KM disponível)"
          />
        </Grid>

        <Grid size={12}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
          >
            {vehicle ? "Atualizar Veículo" : "Salvar Veículo"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default VehicleForm;