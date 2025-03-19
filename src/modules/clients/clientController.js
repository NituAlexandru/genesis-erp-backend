import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
} from "./clientService.js";

export async function createClientController(req, res) {
  try {
    const client = await createClient(req.body);
    res.status(201).json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
}

export async function getAllClientsController(req, res) {
  try {
    const clients = await getAllClients();
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
}

export async function getClientByIdController(req, res) {
  try {
    const client = await getClientById(req.params.id);
    if (!client) {
      return res.status(404).json({ msg: "Client not found" });
    }
    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
}

export async function updateClientController(req, res) {
  try {
    const client = await updateClient(req.params.id, req.body);
    if (!client) {
      return res.status(404).json({ msg: "Client not found" });
    }
    res.json(client);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
}

export async function deleteClientController(req, res) {
  try {
    const client = await deleteClient(req.params.id);
    if (!client) {
      return res.status(404).json({ msg: "Client not found" });
    }
    res.json({ msg: "Client deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
}
