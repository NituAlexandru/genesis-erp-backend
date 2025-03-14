// src/modules/roles/role.controller.js
import Role from "./roleModel.js";

// CREATE
export const createRole = async (req, res) => {
  try {
    const { name, permissions, description } = req.body;
    const newRole = await Role.create({ name, permissions, description });
    res.status(201).json(newRole);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// READ (get all roles)
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// READ (get one role by id)
export const getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ msg: "Role not found" });
    res.json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// UPDATE
export const updateRole = async (req, res) => {
  try {
    const { name, permissions, description } = req.body;
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { name, permissions, description },
      { new: true }
    );
    if (!role) return res.status(404).json({ msg: "Role not found" });
    res.json(role);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};

// DELETE
export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ msg: "Role not found" });
    res.json({ msg: "Role deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};
