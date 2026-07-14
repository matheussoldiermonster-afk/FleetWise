import { useState } from "react";
import api from "../../services/api";

function VehicleForm({ onSuccess }) {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    plate: "",
    fuelType: "FLEX",
    averageConsumption: "",
    currentKm: "",
    companyId: 1,
  });

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await api.post("/vehicles", {
        ...form,
        year: Number(form.year),
        averageConsumption: Number(form.averageConsumption),
        currentKm: Number(form.currentKm),
        companyId: Number(form.companyId),
      });

      alert("Veículo cadastrado com sucesso!");

      setForm({
        brand: "",
        model: "",
        year: "",
        plate: "",
        fuelType: "FLEX",
        averageConsumption: "",
        currentKm: "",
        companyId: 1,
      });

      onSuccess();
    } catch (error) {
      alert("Erro ao cadastrar veículo.");
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="brand"
        placeholder="Marca"
        value={form.brand}
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="model"
        placeholder="Modelo"
        value={form.model}
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="year"
        type="number"
        placeholder="Ano"
        value={form.year}
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="plate"
        placeholder="Placa"
        value={form.plate}
        onChange={handleChange}
      />

      <br /><br />

      <select
        name="fuelType"
        value={form.fuelType}
        onChange={handleChange}
      >
        <option value="FLEX">Flex</option>
        <option value="GASOLINE">Gasolina</option>
        <option value="ETHANOL">Etanol</option>
        <option value="DIESEL">Diesel</option>
        <option value="ELECTRIC">Elétrico</option>
      </select>

      <br /><br />

      <input
        name="averageConsumption"
        type="number"
        step="0.1"
        placeholder="Consumo Médio (Km/L)"
        value={form.averageConsumption}
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="currentKm"
        type="number"
        placeholder="Quilometragem Atual"
        value={form.currentKm}
        onChange={handleChange}
      />

      <br /><br />

      <button type="submit">
        Salvar Veículo
      </button>
    </form>
  );
}

export default VehicleForm;