import Employee from "../models/Employee.js";
import User from "../models/User.js";

// GET /api/profile
export const getProfile = async (req, res) => {
  try {
    const session = req.session;
    const employee = await Employee.findOne({ userId: session.userId });

    if (!employee) {
      // Admin — return user record
      const user = await User.findById(session.userId).lean();
      return res.json({
        firstName: "Admin",
        lastName: "",
        email: user?.email || "",
        bio: user?.bio || "",
        role: "ADMIN",
      });
    }

    return res.json(employee);
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// Update profile
// PUT /api/profile
export const updateProfile = async (req, res) => {
  try {
    const session = req.session;
    const employee = await Employee.findOne({ userId: session.userId });

    if (!employee) {
      // Admin — update bio on User model
      if (session.role !== "ADMIN") {
        return res.status(404).json({ error: "Employee not found" });
      }

      await User.findByIdAndUpdate(session.userId, {
        bio: req.body.bio,
      });

      return res.json({ success: true });
    }

    if (employee.isDeleted) {
      return res.status(403).json({
        error: "Your account is deactivated. You cannot update your profile.",
      });
    }

    await Employee.findByIdAndUpdate(employee._id, {
      bio: req.body.bio,
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ error: "Failed to update profile" });
  }
};