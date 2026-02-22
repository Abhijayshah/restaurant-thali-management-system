import Menu from "../models/Menu.js";

export const listMenu = async (req, res, next) => {
  try {
    const { category, shift } = req.query;
    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (shift) {
      filter.shift = shift;
    }
    const items = await Menu.find(filter);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

export const createMenuItem = async (req, res, next) => {
  try {
    const item = await Menu.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    next(error);
  }
};

export const updateMenuItem = async (req, res, next) => {
  try {
    const item = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.json(item);
  } catch (error) {
    next(error);
  }
};

export const deleteMenuItem = async (req, res, next) => {
  try {
    const item = await Menu.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

