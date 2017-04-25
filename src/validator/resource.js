class Resource {
  static checkBody(req, res, next) {
  // Body's rules
  req.checkBody('name', 'The field name is required.').notEmpty();

  req.getValidationResult()
    .then((result) => {
      if (!result.isEmpty()) {
        res.status(400).json(result.array());
      } else {
        // Continue your job, all is good
        next();
      }
    });
  }
}

export default Resource;
