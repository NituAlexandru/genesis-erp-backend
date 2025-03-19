import Client from "./clientModel.js";

export async function createClient(data) {
  return await Client.create(data);
}

export async function getAllClients() {
  return await Client.find({});
}

export async function getClientById(id) {
  return await Client.findById(id);
}

export async function updateClient(id, data) {
  return await Client.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteClient(id) {
  return await Client.findByIdAndDelete(id);
}
