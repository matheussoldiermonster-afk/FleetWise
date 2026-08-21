import { useEffect, useMemo, useState } from "react";

import {
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";

import { useSnackbar } from "notistack";

import api from "../../services/api";

function FuelingForm({ onSuccess }) {
  const { enqueueSnackbar } = useSnackbar();
  const [vehicles, setVehicles] = useState([]);

  const [form, setForm] = useState({
    vehicleId: "",
    date: new Date().toISOString().split("T")[0],
    odometer: "",
    liters: "",
    totalValue: "",
    fuelType: "GASOLINE",
    gasStation: "",
    responsible: "",
    notes: "",
    consumptionRate: "",
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    try {
      const response = await api.get("/vehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  const pricePerLiter = useMemo(() => {
    const liters = Number(form.liters);
    const total = Number(form.totalValue);

    if (!liters || !total) return "0,00";

    return (total / liters).toFixed(2);
  }, [form.liters, form.totalValue]);

  const selectedVehicle = vehicles.find(
    (v) => String(v.id) === String(form.vehicleId)
  );

  const availableKm = useMemo(() => {
    const liters = Number(form.liters);
    const rate = Number(form.consumptionRate);

    if (!liters || !rate) return null;

    return Number((liters * rate).toFixed(2));
  }, [form.liters, form.consumptionRate]);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.post("/fuelings", {
        vehicleId: Number(form.vehicleId),
        date: form.date,
        odometer: Number(form.odometer),
        liters: Number(form.liters),
        totalValue: Number(form.totalValue),
        fuelType: form.fuelType,
        gasStation: form.gasStation,
        responsible: form.responsible,
        notes: form.notes,
        ...(selectedVehicle?.reimbursable &&
          form.consumptionRate !== "" && {
            consumptionRate: Number(form.consumptionRate),
          }),
      });

      enqueueSnackbar("Abastecimento cadastrado!", { variant: "success" });

      onSuccess();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        error.response?.data?.message || "Erro ao cadastrar abastecimento.",
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
            label="Veículo"
            name="vehicleId"
            value={form.vehicleId}
            onChange={handleChange}
            required
          >
            {vehicles.map((vehicle) => (
              <MenuItem
                key={vehicle.id}
                value={vehicle.id}
              >
                {vehicle.plate} - {vehicle.model}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            type="date"
            label="Data"
            name="date"
            value={form.date}
            onChange={handleChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="KM Atual"
            name="odometer"
            type="number"
            value={form.odometer}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Litros"
            name="liters"
            type="number"
            value={form.liters}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Valor Total"
            name="totalValue"
            type="number"
            value={form.totalValue}
            onChange={handleChange}
            required
          />
        </Grid>

        <Grid item xs={12}>
          <Typography
            color="primary"
            fontWeight="bold"
          >
            Preço por litro: R$ {pricePerLiter}
          </Typography>
        </Grid>

        {selectedVehicle?.reimbursable && (
          <>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="KM/L deste abastecimento"
                name="consumptionRate"
                inputProps={{ step: 0.1 }}
                value={form.consumptionRate}
                onChange={handleChange}
                helperText="Usado para calcular a quilometragem disponível gerada"
              />
            </Grid>

            <Grid item xs={6}>
              <Typography color="secondary.main" fontWeight="bold" mt={1}>
                {availableKm !== null
                  ? `📍 Quilometragem disponível gerada: ${availableKm} km`
                  : "Informe litros e KM/L para calcular"}
              </Typography>
            </Grid>
          </>
        )}

        <Grid item xs={6}>
          <TextField
            select
            fullWidth
            label="Combustível"
            name="fuelType"
            value={form.fuelType}
            onChange={handleChange}
          >
            <MenuItem value="GASOLINE">Gasolina</MenuItem>
            <MenuItem value="ETHANOL">Etanol</MenuItem>
            <MenuItem value="DIESEL">Diesel</MenuItem>
            <MenuItem value="FLEX">Flex</MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Posto"
            name="gasStation"
            value={form.gasStation}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Responsável"
            name="responsible"
            value={form.responsible}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Observações"
            name="notes"
            value={form.notes}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
          >
            Salvar Abastecimento
          </Button>
        </Grid>

      </Grid>
    </form>
  );
}

export default FuelingForm;