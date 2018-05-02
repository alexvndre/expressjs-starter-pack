import AbstractRepository from './abstractRepository';

class ResourceRepository extends AbstractRepository {
  constructor() {
    super('Resource');
  }
}

export default new ResourceRepository();
