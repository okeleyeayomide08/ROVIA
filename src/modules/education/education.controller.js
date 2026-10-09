import educationService from './education.service.js';

class EducationController {
  async create(req, res) {
    const data = await educationService.create(req.user.id, req.body);
    res.status(201).json(data);
  }

  async getAll(req, res) {
    const data = await educationService.getAll(req.user.id);
    res.json(data);
  }

  async getById(req, res) {
    const data = await educationService.getById(req.user.id, req.params.id);
    res.json(data);
  }

  async update(req, res) {
    const data = await educationService.update(req.user.id, req.params.id, req.body);
    res.json(data);
  }

  async delete(req, res) {
    const data = await educationService.delete(req.user.id, req.params.id);
    res.json(data);
  }
}

export default new EducationController();