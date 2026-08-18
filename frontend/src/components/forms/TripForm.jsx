import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import api from "../../services/api";

function TripForm({ trip, onSuccess }) {
  const { enqueueSnackbar } = useSnackbar();
  const [vehicles, setVehicles] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const [form, setForm] = useState({
    vehicleId: "",
    technicianId: "",

    startKm: "",
    initialTime: "08:00",

    breakStartKm: "",
    breakStartTime: "12:00",

    breakEndKm: "",
    breakEndTime: "14:00",

    endKm: "",
    finalTime: "18:00",

    client: "",
    city: "",
    purpose: "WORK",
    notes: "",
  });

  useEffect(() => {
    loadVehicles();
    loadTechnicians();
  }, []);

  useEffect(() => {
    if (trip) {
      setForm({
        vehicleId: trip.vehicleId,
        technicianId: trip.technicianId,

        startKm: trip.initialKm ?? trip.startKm ?? "",
        initialTime: trip.initialTime || "08:00",

        breakStartKm: trip.breakStartKm ?? "",
        breakStartTime: trip.breakStartTime || "12:00",

        breakEndKm: trip.breakEndKm ?? "",
        breakEndTime: trip.breakEndTime || "14:00",

        endKm: trip.finalKm ?? trip.endKm ?? "",
        finalTime: trip.finalTime || "18:00",

        client: trip.client || "",
        city: trip.city || "",
        purpose: trip.purpose || "WORK",
        notes: trip.notes || "",
      });
    }
  }, [trip]);

  async function loadVehicles() {
    try {
      const response = await api.get("/vehicles");
      setVehicles(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadTechnicians() {
    try {
      const response = await api.get("/technicians");
      setTechnicians(response.data);
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

  const selectedVehicle = vehicles.find(
    (v) => String(v.id) === String(form.vehicleId)
  );

  const startKm = Number(form.startKm) || 0;
  const breakStartKm = Number(form.breakStartKm) || 0;
  const breakEndKm = Number(form.breakEndKm) || 0;
  const endKm = Number(form.endKm) || 0;

  const hasLunchSplit = form.breakStartKm !== "" && form.breakEndKm !== "";
  const hasFullDay = form.startKm !== "" && form.endKm !== "";

  const daySequenceValid = hasFullDay
    ? hasLunchSplit
      ? startKm <= breakStartKm &&
        breakStartKm <= breakEndKm &&
        breakEndKm <= endKm
      : startKm <= endKm
    : true;

  const workKm = !hasFullDay || !daySequenceValid
    ? 0
    : hasLunchSplit
    ? Number((breakStartKm - startKm + (endKm - breakEndKm)).toFixed(2))
    : Number((endKm - startKm).toFixed(2));

  const lunchGapKm = hasLunchSplit && daySequenceValid
    ? Number((breakEndKm - breakStartKm).toFixed(2))
    : 0;

  // Prévia do "buraco entre expedientes": compara com o KM atual
  // cadastrado do veículo (= KM Final do último expediente salvo).
  // O cálculo definitivo é sempre feito no servidor.
  const vehicleCurrentKm = selectedVehicle ? Number(selectedVehicle.currentKm) : null;
  const canPreviewInterDay = form.startKm !== "" && vehicleCurrentKm !== null;
  const interDayGapKm = canPreviewInterDay
    ? Number((startKm - vehicleCurrentKm).toFixed(2))
    : null;
  const negativeInterDay = interDayGapKm !== null && interDayGapKm < 0;

  const totalPersonalPreview =
    interDayGapKm !== null ? Number((lunchGapKm + Math.max(interDayGapKm, 0)).toFixed(2)) : null;

  async function handleSubmit(e) {
    e.preventDefault();

    if (!hasFullDay) {
      enqueueSnackbar("Preencha ao menos o KM Inicial (8:00) e o KM Final (18:00).", {
        variant: "error",
      });
      return;
    }

    if (!daySequenceValid) {
      enqueueSnackbar(
        "Os KMs do dia precisam ser crescentes: Inicial (8:00) ≤ Final (12:00) ≤ Inicial (14:00) ≤ Final (18:00).",
        { variant: "error" }
      );
      return;
    }

    const payload = {
      vehicleId: Number(form.vehicleId),
      technicianId: Number(form.technicianId),

      startKm: Number(form.startKm),
      initialTime: form.initialTime,

      ...(hasLunchSplit && {
        breakStartKm: Number(form.breakStartKm),
        breakStartTime: form.breakStartTime,
        breakEndKm: Number(form.breakEndKm),
        breakEndTime: form.breakEndTime,
      }),

      endKm: Number(form.endKm),
      finalTime: form.finalTime,

      client: form.client,
      city: form.city,
      purpose: form.purpose,
      notes: form.notes,
    };

    try {
      if (trip) {
        await api.put(`/trips/${trip.id}`, payload);
        enqueueSnackbar("Viagem atualizada com sucesso!", { variant: "success" });
      } else {
        await api.post("/trips", payload);
        enqueueSnackbar("Viagem cadastrada com sucesso!", { variant: "success" });
      }

      onSuccess();
    } catch (error) {
      console.error(error);
      enqueueSnackbar(
        error.response?.data?.message || "Erro ao salvar viagem.",
        { variant: "error" }
      );
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Veículo</label>

      <select name="vehicleId" value={form.vehicleId} onChange={handleChange}>
        <option value="">Selecione</option>
        {vehicles.map((vehicle) => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.plate} - {vehicle.brand} {vehicle.model}
          </option>
        ))}
      </select>

      {selectedVehicle && (
        <p style={{ color: "#64748B", fontSize: 13, margin: "4px 0" }}>
          📍 KM disponível (final do último expediente): <b>{selectedVehicle.currentKm} km</b>
        </p>
      )}

      <br />

      <label>Técnico</label>

      <select name="technicianId" value={form.technicianId} onChange={handleChange}>
        <option value="">Selecione</option>
        {technicians.map((technician) => (
          <option key={technician.id} value={technician.id}>
            {technician.name}
          </option>
        ))}
      </select>

      <hr style={{ margin: "16px 0" }} />

      <strong>🌅 Manhã</strong>
      <br /><br />

      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="number"
          name="startKm"
          placeholder="KM Inicial (8:00)"
          value={form.startKm}
          onChange={handleChange}
        />
        <input type="time" name="initialTime" value={form.initialTime} onChange={handleChange} />
      </div>

      <br />

      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="number"
          name="breakStartKm"
          placeholder="KM Final (12:00) - opcional"
          value={form.breakStartKm}
          onChange={handleChange}
        />
        <input type="time" name="breakStartTime" value={form.breakStartTime} onChange={handleChange} />
      </div>

      <br />

      <strong>🌇 Tarde</strong>
      <br /><br />

      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="number"
          name="breakEndKm"
          placeholder="KM Inicial (14:00) - opcional"
          value={form.breakEndKm}
          onChange={handleChange}
        />
        <input type="time" name="breakEndTime" value={form.breakEndTime} onChange={handleChange} />
      </div>

      <br />

      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="number"
          name="endKm"
          placeholder="KM Final (18:00)"
          value={form.endKm}
          onChange={handleChange}
        />
        <input type="time" name="finalTime" value={form.finalTime} onChange={handleChange} />
      </div>

      <p style={{ color: "#94A3B8", fontSize: 12, margin: "6px 0" }}>
        Se não parou pro almoço, deixe os campos das 12:00/14:00 em branco — o dia inteiro conta como trabalho.
      </p>

      {hasFullDay && (
        <p
          style={{
            color: daySequenceValid ? "#16A34A" : "#DC2626",
            fontWeight: "bold",
            margin: "8px 0",
          }}
        >
          {daySequenceValid
            ? `🧰 Trabalho no dia: ${workKm} km` +
              (hasLunchSplit ? `  |  🍽️ Particular no almoço: ${lunchGapKm} km` : "")
            : "⚠️ Os KMs do dia precisam ser crescentes: Inicial (8:00) ≤ Final (12:00) ≤ Inicial (14:00) ≤ Final (18:00)."}
        </p>
      )}

      {canPreviewInterDay && daySequenceValid && (
        <p
          style={{
            color: negativeInterDay ? "#DC2626" : "#2563EB",
            fontWeight: "bold",
            margin: "8px 0",
          }}
        >
          {negativeInterDay
            ? `⚠️ KM Inicial (8:00) menor que o KM disponível do veículo (${vehicleCurrentKm}). Confira o hodômetro — a viagem pode não salvar.`
            : `🏠 Particular entre expedientes: ${Math.max(interDayGapKm, 0)} km  →  Total particular estimado: ${totalPersonalPreview} km`}
        </p>
      )}

      <hr style={{ margin: "16px 0" }} />

      <input
        type="text"
        name="client"
        placeholder="Cliente"
        value={form.client}
        onChange={handleChange}
      />

      <br /><br />

      <input
        type="text"
        name="city"
        placeholder="Cidade"
        value={form.city}
        onChange={handleChange}
      />

      <br /><br />

      <select name="purpose" value={form.purpose} onChange={handleChange}>
        <option value="WORK">Trabalho</option>
        <option value="PERSONAL">Particular</option>
      </select>

      <br /><br />

      <textarea
        name="notes"
        placeholder="Observações"
        value={form.notes}
        onChange={handleChange}
      />

      <br /><br />

      <button type="submit" disabled={hasFullDay && !daySequenceValid}>
        {trip ? "Atualizar Viagem" : "Salvar Viagem"}
      </button>
    </form>
  );
}

export default TripForm;
