const { userSearch, createUser } = require("../queries/UserQueries");
const { existsBy, insert } = require("../Queries/SharedQueries");
const { missingField } = require("../Helpers/ErrorHandler");
const User = require("../models/User");

const memberSearch = (req, res) => {
  let users = userSearch(req.query);
  let found = users.length;
  res.status(found ? 200 : 404).json(found ? users : `Not found`);
};

const updateAccount = (req, res) => {
  let oldUserProfile = userSearch({ id: req.params.id })[0];
  let newUserProfile = new User({ ...req.body });
  if (!oldUserProfile) {
    return res.status(400).send(`Not found`);
  }
};

const registerAccount = (req, res) => {
  const { email, username } = req.body;
  let requestIncomplete = missingField({ email, username });
  if (requestIncomplete) {
    return res.status(400).send(`Missing : ${requestIncomplete}`);
  }
  if (existsBy("users", { email, username })) {
    return res.status(409).send(`Username or email already taken`);
  }

  let user = insert("users", new User({ ...req.body }));

  res.status(user ? 200 : 401).send(user ? user : `Could not process request`);
};

module.exports = {
  memberSearch,
  registerAccount,
  updateAccount,
};
