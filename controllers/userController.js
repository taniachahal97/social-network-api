const User = require('../models/User');

module.exports = {
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  getSingleUser(req, res) {
    console.log('get single user: req.paramas.userId= ',req.params.userId);
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .populate({ path: 'thoughts', select: '-__v' })
      .populate({ path: 'friends', select: '-__v' })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.status(500).json(err));
  },

  // Update a current User by ID
  updateUser({params, body}, res) {
    User.findOneAndUpdate({_id: params.userId}, body, {new: true, runValidators: true})
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({message: 'No User with this particular ID!'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => res.json(err))
},

deleteUser({params}, res) {
    User.findOneAndDelete({_id: params.userId})
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({message: 'No User with this particular ID!'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
},

addFriend({params}, res) {
    User.findOneAndUpdate({_id: params.userId}, {$push: { friends: params.friendId}}, {new: true})
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({message: 'No User with this particular ID!'});
            return;
        }
    res.json(dbUserData);
    })
    .catch(err => res.json(err));
},

deleteFriend({params}, res) {
    User.findOneAndUpdate({_id: params.userId}, {$pull: { friends: params.friendId}}, {new: true})
    .populate({path: 'friends', select: '-__v'})
    .select('-__v')
    .then(dbUserData => {
        if(!dbUserData) {
            res.status(404).json({message: 'No User with this particular ID!'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => res.status(400).json(err));
}

};
