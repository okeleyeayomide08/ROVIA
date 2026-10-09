import { getCollection } from '../../config/database.js';
import ApiError from '../../utils/ApiError.js';
import { pickFields, toApiDocument, toObjectId } from '../../utils/mongoDocument.js';

class ExperienceService {
  async create(userId, data) {
    const document = {
      ...pickFields(data, ['company', 'position', 'startDate', 'endDate', 'description']),
      userId
    };
    const result = await getCollection('experience').insertOne(document);
    return toApiDocument({ ...document, _id: result.insertedId });
  }

  async getAll(userId) {
    const documents = await getCollection('experience').find({ userId }).toArray();
    return documents.map(toApiDocument);
  }

  async getById(userId, id) {
    const experience = await getCollection('experience').findOne({ _id: toObjectId(id), userId });
    if (!experience) {
      throw new ApiError(404, 'NOT_FOUND', 'Experience record not found');
    }
    return toApiDocument(experience);
  }

  async update(userId, id, data) {
    const experience = await getCollection('experience').findOneAndUpdate(
      { _id: toObjectId(id), userId },
      { $set: pickFields(data, ['company', 'position', 'startDate', 'endDate', 'description']) },
      { returnDocument: 'after', includeResultMetadata: false }
    );
    if (!experience) {
      throw new ApiError(404, 'NOT_FOUND', 'Experience record not found');
    }
    return toApiDocument(experience);
  }

  async delete(userId, id) {
    const result = await getCollection('experience').deleteOne({ _id: toObjectId(id), userId });
    if (result.deletedCount === 0) {
      throw new ApiError(404, 'NOT_FOUND', 'Experience record not found');
    }
    return { message: 'Experience record deleted successfully' };
  }
}

export default new ExperienceService();