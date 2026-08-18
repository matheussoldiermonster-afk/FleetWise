const prisma = require("../config/prisma");

async function assertVehicleBelongsToCompany(vehicleId, companyId) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: Number(vehicleId) },
  });

  if (!vehicle || vehicle.companyId !== companyId) {
    throw new Error("Veículo não encontrado.");
  }

  return vehicle;
}

async function assertTechnicianBelongsToCompany(technicianId, companyId) {
  const technician = await prisma.technician.findUnique({
    where: { id: Number(technicianId) },
  });

  if (!technician || technician.companyId !== companyId) {
    throw new Error("Técnico não encontrado.");
  }

  return technician;
}

async function getOwnedTrip(id, companyId) {
  const trip = await prisma.trip.findUnique({
    where: { id: Number(id) },
    include: { vehicle: true },
  });

  if (!trip || trip.vehicle.companyId !== companyId) {
    throw new Error("Viagem não encontrada.");
  }

  return trip;
}

/**
 * KM Trabalho e "buraco do almoço" (dentro do mesmo dia).
 * Se os KMs de almoço (12:00/14:00) não forem informados, o dia inteiro
 * conta como trabalho e não há buraco de almoço.
 */
function calculateDayWorkAndLunchGap(data) {
  const initialKm = Number(data.startKm);
  const finalKm = Number(data.endKm);

  if (Number.isNaN(initialKm) || Number.isNaN(finalKm)) {
    throw new Error("KM Inicial e KM Final são obrigatórios.");
  }

  const hasBreak =
    data.breakStartKm !== undefined &&
    data.breakStartKm !== null &&
    data.breakStartKm !== "" &&
    data.breakEndKm !== undefined &&
    data.breakEndKm !== null &&
    data.breakEndKm !== "";

  if (!hasBreak) {
    if (finalKm < initialKm) {
      throw new Error("KM Final não pode ser menor que o KM Inicial.");
    }

    return {
      workKm: Number((finalKm - initialKm).toFixed(2)),
      lunchGapKm: 0,
      breakStartKm: null,
      breakEndKm: null,
    };
  }

  const breakStartKm = Number(data.breakStartKm);
  const breakEndKm = Number(data.breakEndKm);

  if (
    breakStartKm < initialKm ||
    breakEndKm < breakStartKm ||
    finalKm < breakEndKm
  ) {
    throw new Error(
      "Os KMs do dia precisam ser crescentes: KM Inicial (8:00) ≤ KM Final (12:00) ≤ KM Inicial (14:00) ≤ KM Final (18:00)."
    );
  }

  const workKm = Number(
    (breakStartKm - initialKm + (finalKm - breakEndKm)).toFixed(2)
  );
  const lunchGapKm = Number((breakEndKm - breakStartKm).toFixed(2));

  return { workKm, lunchGapKm, breakStartKm, breakEndKm };
}

/**
 * "Buraco" entre o fim do expediente anterior e o início deste
 * (mesmo veículo, independente do técnico).
 */
async function findLastClosedTrip(vehicleId, excludeTripId) {
  return prisma.trip.findFirst({
    where: {
      vehicleId: Number(vehicleId),
      ...(excludeTripId && { id: { not: Number(excludeTripId) } }),
    },
    orderBy: {
      finalKm: "desc",
    },
  });
}

async function calculateInterDayGap(vehicleId, initialKm, excludeTripId) {
  const previousTrip = await findLastClosedTrip(vehicleId, excludeTripId);

  // Primeiro expediente já registrado para esse veículo: nada a comparar.
  if (!previousTrip) {
    return 0;
  }

  const gap = Number((initialKm - previousTrip.finalKm).toFixed(2));

  if (gap < 0) {
    throw new Error(
      `KM Inicial (${initialKm} km) não pode ser menor que o KM Final do último expediente deste veículo (${previousTrip.finalKm} km). Verifique o hodômetro.`
    );
  }

  return gap;
}

async function buildTripData(data, companyId, excludeTripId) {
  await assertVehicleBelongsToCompany(data.vehicleId, companyId);
  await assertTechnicianBelongsToCompany(data.technicianId, companyId);

  const initialKm = Number(data.startKm);
  const finalKm = Number(data.endKm);

  const { workKm, lunchGapKm, breakStartKm, breakEndKm } =
    calculateDayWorkAndLunchGap(data);

  const interDayGapKm = await calculateInterDayGap(
    data.vehicleId,
    initialKm,
    excludeTripId
  );

  const personalKm = Number((lunchGapKm + interDayGapKm).toFixed(2));

  return {
    vehicleId: Number(data.vehicleId),
    technicianId: Number(data.technicianId),

    initialKm,
    finalKm,
    breakStartKm,
    breakEndKm,

    initialTime: data.initialTime || null,
    breakStartTime: data.breakStartTime || null,
    breakEndTime: data.breakEndTime || null,
    finalTime: data.finalTime || null,

    workKm,
    personalKm,
  };
}

async function createTrip(data, companyId) {
  const tripData = await buildTripData(data, companyId);

  const trip = await prisma.trip.create({ data: tripData });

  await prisma.vehicle.update({
    where: { id: tripData.vehicleId },
    data: { currentKm: tripData.finalKm },
  });

  return trip;
}

async function getTrips(companyId) {
  return prisma.trip.findMany({
    where: {
      vehicle: { companyId },
    },
    include: {
      vehicle: true,
      technician: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

async function updateTrip(id, data, companyId) {
  await getOwnedTrip(id, companyId);

  const tripData = await buildTripData(data, companyId, id);

  return prisma.trip.update({
    where: { id: Number(id) },
    data: tripData,
  });
}

async function deleteTrip(id, companyId) {
  await getOwnedTrip(id, companyId);

  return prisma.trip.delete({
    where: {
      id: Number(id),
    },
  });
}

module.exports = {
  createTrip,
  getTrips,
  updateTrip,
  deleteTrip,
};
