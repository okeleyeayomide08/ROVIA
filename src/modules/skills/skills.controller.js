import skillsService from './skills.service.js';

class SkillsController {
  async create(req, res) {
    const data = await skillsService.create(req.user.id, req.body);
    res.status(201).json(data);
  }

  async getAll(req, res) {
    const data = await skillsService.getAll(req.user.id);
    res.json(data);
  }

  async getById(req, res) {
    const data = await skillsService.getById(req.user.id, req.params.id);
    res.json(data);
  }

  async update(req, res) {
    const data = await skillsService.update(req.user.id, req.params.id, req.body);
    res.json(data);
  }

  async delete(req, res) {
    const data = await skillsService.delete(req.user.id, req.params.id);
    res.json(data);
  }
}

export default new SkillsController();