const {Router} = require("express");
const { courseModel } = require("../db");
const courseRouter = Router();

// Get all courses (public route)
courseRouter.get("/", async function(req, res) {
    try {
        const courses = await courseModel.find({});
        res.json({
            courses
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error fetching courses"
        });
    }
});

// Get course by ID
courseRouter.get("/:id", async function(req, res) {
    try {
        const course = await courseModel.findById(req.params.id);
        if (!course) {
            return res.status(404).json({
                msg: "Course not found"
            });
        }
        res.json({
            course
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error fetching course"
        });
    }
});

// Search courses
courseRouter.get("/search/:query", async function(req, res) {
    try {
        const query = req.params.query;
        const courses = await courseModel.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        });
        res.json({
            courses
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error searching courses"
        });
    }
});

module.exports = {
    courseRouter: courseRouter
}