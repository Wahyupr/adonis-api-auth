'use strict'

class GlobalModule {
  async list(request, modelName) {
    const Model = use(`App/Models/${modelName}`)

    const page = request.page || 1
    const limit = request.limit || 50

    return await Model.query()
      .filter(request)
      .paginate(page, limit)
  }

  async listAll(modelName) {
    const Model = use(`App/Models/${modelName}`)

    return await Model.query()
      .setHidden(['id', 'created_at', 'updated_at'])
      .fetch()
  }
}

module.exports = GlobalModule
