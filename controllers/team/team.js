const Team = require('../../models/teamModel');
const { db } = require('../../models/user');
const catchAsync = require('../../utils/catchAsync');
const { teamValidation } = require('../../schemas');
const AppError = require('../../utils/appError');
const { errorCodes } = require('../../utils/constants');
const User = require('../../models/user');
const { generateTeamToken } = require("./utils");

exports.getTeam = async (req, res, next) => {
    // console.log("User ID: " + req.user._id);
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(
            res.status(401).json({ "message": "User Not Found" })
        );
    }
    const email = user.email;
    // console.log(user);
    const team = await Team.findOne({ leaderEmail: email });
    if (!team) {
        return next(
            res.status(404).json({ "message": "Team Not Found" })
        );
    }
    res.json({
        team
    })
}

exports.makeTeam = catchAsync(async (req, res, next) => {
    const { error } = teamValidation(req.body);
    if (error) {
        return next(
            res.status(400).json({ "message": error.message })
        )
    }

    //check whether teamname already taken
    const team_by_name = await Team.findOne({ teamName: req.body.teamName });
    if (team_by_name) {
        return next(
            res.status(412).json({ "message": "Team Name Already Exists" })
        );
    }

    const team_by_number = await Team.findOne({ teamNumber: req.body.teamNumber });
    if (team_by_number) {
        return next(
            res.status(412).json({ "message": "Team Number Already Exists" })
        );
    };
    const userID = req.user._id;
    const user = await User.findById(userID);
    if (req.body.leaderEmail !== user.email) {
        return next(
            res.status(401).json({ "message": "Enter the same email you logged in with" })
        );
    }
    const teamByEmail = await Team.findOne({ email: req.body.leaderEmail })
    console.log(req.body.leaderEmail);
    console.log(teamByEmail);
    if (teamByEmail) {
        return next(
            res.status(401).json({ "message": "Team with this Email ID already Exists" })
        );
    }
    const newTeam = await new Team({
        teamName: req.body.teamName,
        teamNumber: req.body.teamNumber,
        leaderName: req.body.leaderName,
        leaderEmail: req.body.leaderEmail,
        vps: 15000,
        isQualified: true,
        hasSubmittedSectors: false,
        currentRound: "Not Started"
    }).save();
    await User.findOneAndUpdate({ email: req.body.leaderEmail }, { $set: { hasFilledDetails: true } })
    console.log(req.body);
    res.status(201).json({
        message: "New Team Created Successfully",
        teamId: newTeam._id,
    });
});
