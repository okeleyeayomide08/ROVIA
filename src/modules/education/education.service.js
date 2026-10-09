import { getCollection } from '../../config/database.js';
import ApiError from '../../utils/ApiError.js';
import { pickFields, toApiDocument, toObjectId } from '../../utils/mongoDocument.js';

class EducationService {
  async create(userId, data) {
    const document = {
      ...pickFields(data, ['school', 'degree', 'fieldOfStudy', 'startDate', 'endDate']),
      userId
    };
    const result = await getCollection('education').insertOne(document);
    return toApiDocument({ ...document, _id: result.insertedId });
  }

  async getAll(userId) {
    const documents = await getCollection('education').find({ userId }).toArray();
    return documents.map(toApiDocument);
  }

  async getById(userId, id) {
    const education = await getCollection('education').findOne({ _id: toObjectId(id), userId });
    if (!education) {
      throw new ApiError(404, 'NOT_FOUND', 'Education record not found');
    }
    return toApiDocument(education);
  }

  async update(userId, id, data) {
    const education = await getCollection('education').findOneAndUpdate(
      { _id: toObjectId(id), userId },
      { $set: pickFields(data, ['school', 'degree', 'fieldOfStudy', 'startDate', 'endDate']) },
      { returnDocument: 'after', includeResultMetadata: false }
    );
    if (!education) {
      throw new ApiError(404, 'NOT_FOUND', 'Education record not found');
    }
    return toApiDocument(education);
  }

  async delete(userId, id) {
    const result = await getCollection('education').deleteOne({ _id: toObjectId(id), userId });
    if (result.deletedCount === 0) {
      throw new ApiError(404, 'NOT_FOUND', 'Education record not found');
    }
    return { message: 'Education record deleted successfully' };
  }
}

export default new EducationService();