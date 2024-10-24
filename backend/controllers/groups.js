const User = require("../models/User");
const Group = require("../models/Group");
const UserGroup = require("../models/UserGroup");
const UserChannel = require("../models/UserChannel");
const Emoji = require("../models/Emoji");

const {asyncWrapper} = require("../middleware/async");
const { createCustomError } = require("../errors/customError");

const { getGroups } = require("../mongoAggregates/groups");

const createGroup = asyncWrapper(async (req, res, next) => {
 const user = await User.findOne({ _id: res.user._id });
  if (!user) {
    return next(createCustomError(`You have been logged out 1`, 401));
  }
  const newGroup = new Group({
    name: req.body.name,
    admin: user._id,
  });
  const group = await newGroup.save();
 user.groupsAdmin.push(group);
  user.save();
 await UserGroup.updateOne(
    { groupId: group._id, userId: user._id },
    {},
    { upsert: true }
  );

  const groups = await getGroups(user._id);
  res.status(200).json({
    success: true,
    groups: groups,
  });
});

const getAllGroups = asyncWrapper(async (req, res, next) => {
  const groups = await getGroups(res.user._id);
  if (!groups) {
    return next(createCustomError(`You have been logged out 1`, 401));
  }

  res.status(200).json({
    success: true,
    groups: groups,
  });
});

const addToGroup = asyncWrapper(async (req, res, next) => {
  const user = await User.findOne({ _id: res.user._id });
  if (!user) {
    return next(createCustomError(`You have been logged out 1`, 401));
  }
  const group = await Group.findOne({ _id: req.body.groupId });
  if (!group) {
    return next(createCustomError(`Group not found 1`, 404));
  }
  await UserGroup.updateOne(
    {
      groupId: group._id,
      userId: user._id,
      color: req.body.color || "black",
    },
    {},
    { upsert: true }
  );
  for (const x of group.channels) {
    await UserChannel.updateOne(
      {
        channelId: x,
        userId: user._id,
      },
      {},
      { upsert: true }
    );
  }

  const groups = await getGroups(user._id);
  res.status(200).json({
    success: true,
    groups: groups,
  });
});


const createEmoji = asyncWrapper(async (req, res, next) => {
  const user = await User.findOne({ _id: res.user._id });
  if (!user) {
    return next(createCustomError(`You have been logged out 5`, 401));
  }
  const group = await Group.findOne({ _id: req.body.groupId });
  if (!group) {
    return next(createCustomError(`No such group 5`, 400));
  }

  const newEmoji = new Emoji({
    group: group._id,
    name: req.body.name,
    file: req.body.file,
  });
  const emj = await newEmoji.save();

  group.emojis.push(emj);
  group.save();

  res.status(200).json({
    success: true,
    // emojis: emojis,
  });
});

const getGroupById = async (req, res, next) => {
  try {
    console.log(req.params.id)
    const group = await Group.findById(req.params.id);
    if (!group) {
      return next(createCustomError(`No such group 5`, 400));
    }

    res.status(200).json({
      success: true,
      group: group,
    });
  } catch (e) {
    return next(createCustomError(`No such group 6`, 400));
  }
};

module.exports = {
  createGroup,
  getAllGroups,
  addToGroup,
  createEmoji,
  getGroupById,
};
