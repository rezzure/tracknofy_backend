const Attendance = require("../../../Schema/attendance.schema/attendance.model");

const getAttendance = async (req, res) => {
  try {
    const { user_id, startDate, endDate, date } = req.query;

    let query = {};

    if (user_id) {
      query.user_id = user_id;
    }

    if (date) {
      query.date = new Date(date);
    } else if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const attendance = await Attendance.find(query)
      .populate("user_id", "name email role")
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: "Date parameter is required",
      });
    }

    const attendance = await Attendance.find({
      date: new Date(date),
    }).sort({ marked_at: -1 });

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error: " + error.message,
    });
  }
};

module.exports = {
  getAttendance,
  getAttendanceByDate,
};
