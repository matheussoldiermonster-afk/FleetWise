import { useEffect, useState } from "react";

import {
  Grid,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";

import { useSnackbar } from "notistack";

import api from "../../services/api";

function TechnicianForm({ technician, onSuccess }) {
  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "TECHNICIAN",
  });

  useEffect(() => {
    if (technician) {
      setForm({
        name: technician.name || "",
        phone: technician.phone || "",
        role: technician.role || "TECHNICIAN",
      });
    }
  }, [technician]);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      if (technician) {
        await api.put(`/technicians/${technician.id}`, form);
      } else {
        await api.post("/technicians", form);
      }

      enqueueSnackbar(
        technician
          ? "Técnico atualizado com sucesso!"
          : "Técnico cadastrado com sucesso!",
        { variant: "success" }
      );

      onSuccess();
    } catch (error) {
      console.error(error);

      enqueueSnackbar("Erro ao salvar técnico.", { variant: "error" });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>

        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Nome"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            required
            label="Telefone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Cargo"
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <MenuItem value="TECHNICIAN">
              Técnico
            </MenuItem>

            <MenuItem value="SUPERVISOR">
              Supervisor
            </MenuItem>

            <MenuItem value="DRIVER">
              Motorista
            </MenuItem>

            <MenuItem value="OTHER">
              Outro
            </MenuItem>
          </TextField>
        </Grid>

        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            type="submit"
            size="large"
          >
            {technician
              ? "Salvar Alterações"
              : "Cadastrar Técnico"}
          </Button>
        </Grid>

      </Grid>
    </form>
  );
}

export default TechnicianForm;