import experienceService from './experience.service.js';

class ExperienceController {
  async create(req, res) {
    const data = await experienceService.create(req.user.id, req.body);
    res.status(201).json(data);
  }

  async getAll(req, res) {
    const data = await experienceService.getAll(req.user.id);
    res.json(data);
  }

  async getById(req, res) {
    const data = await experienceService.getById(req.user.id, req.params.id);
    res.json(data);
  }

  async update(req, res) {
    const data = await experienceService.update(req.user.id, req.params.id, req.body);
    res.json(data);
  }

  async delete(req, res) {
    const data = await experienceService.delete(req.user.id, req.params.id);
    res.json(data);
  }
}

export default new ExperienceController();