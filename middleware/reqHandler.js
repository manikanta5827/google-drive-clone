const reqHandler = (req, res, next) => {
    req.get = function (key) {
        if (req.params && key in req.params) return req.params[key];
        if (req.body && key in req.body) return req.body[key];
        if (req.query && key in req.query) return req.query[key];
        return undefined;
      };
      next();
}

export default reqHandler;