import { getCollection } from '../../config/database.js';
import ApiError from '../../utils/ApiError.js';
import { pickFields, toApiDocument, toObjectId } from '../../utils/mongoDocument.js';

class SkillsService {
  async create(userId, data) {
    const document = {
      ...pickFields(data, ['name', 'proficiencyLevel']),
      userId
    };
    const result = await getCollection('skills').insertOne(document);
    return toApiDocument({ ...document, _id: result.insertedId });
  }

  async getAll(userId) {
    const documents = await getCollection('skills').find({ userId }).toArray();
    return documents.map(toApiDocument);
  }

  async getById(userId, id) {
    const skill = await getCollection('skills').findOne({ _id: toObjectId(id), userId });
    if (!skill) {
      throw new ApiError(404, 'NOT_FOUND', 'Skill not found');
    }
    return toApiDocument(skill);
  }

  async update(userId, id, data) {
    const skill = await getCollection('skills').findOneAndUpdate(
      { _id: toObjectId(id), userId },
      { $set: pickFields(data, ['name', 'proficiencyLevel']) },
      { returnDocument: 'after', includeResultMetadata: false }
    );
    if (!skill) {
      throw new ApiError(404, 'NOT_FOUND', 'Skill not found');
    }
    return toApiDocument(skill);
  }

  async delete(userId, id) {
    const result = await getCollection('skills').deleteOne({ _id: toObjectId(id), userId });
    if (result.deletedCount === 0) {
      throw new ApiError(404, 'NOT_FOUND', 'Skill not found');
    }
    return { message: 'Skill deleted successfully' };
  }
}

export default new SkillsService();