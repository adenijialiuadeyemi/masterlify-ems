import Employee from "../models/Employee.js";
import Payslip from "../models/Payslip.js";

// Create payslip
// POST /api/payslips
export const createPayslip = async (req, res) => {
  try {
    const { employeeId, month, year, basicSalary, allowances, deductions } = req.body;

    if (!employeeId || !month || !year || !basicSalary) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Check employee exists
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ error: "Employee not found" });

    const netSalary =
      Number(basicSalary) + Number(allowances || 0) - Number(deductions || 0);

    const payslip = await Payslip.create({
      employeeId,
      month: Number(month),
      year: Number(year),
      basicSalary: Number(basicSalary),
      allowances: Number(allowances || 0),
      deductions: Number(deductions || 0),
      netSalary,
    });

    return res.json({ success: true, data: payslip });
  } catch (error) {
    console.error("Create payslip error:", error);
    return res.status(500).json({ error: "Failed" });
  }
};

// Get payslips
// GET /api/payslips
export const getPayslips = async (req, res) => {
  try {
    const session = req.session;
    const isAdmin = session.role === "ADMIN";

    if (isAdmin) {
      const payslips = await Payslip.find({})
        .populate("employeeId")
        .sort({ createdAt: -1 });

      const data = payslips.map((p) => {
        const obj = p.toObject();
        return {
          ...obj,
          id: obj._id.toString(),
          employee: obj.employeeId,
          employeeId: obj.employeeId?._id?.toString(),
        };
      });

      return res.json({ data });
    } else {
      const employee = await Employee.findOne({ userId: session.userId });
      if (!employee) return res.status(404).json({ error: "Employee not found" });

      const payslips = await Payslip.find({ employeeId: employee._id })
        .sort({ createdAt: -1 });

      // Map to include employee info for each payslip
      const data = payslips.map((p) => {
        const obj = p.toObject();
        return {
          ...obj,
          id: obj._id.toString(),
          employee: {
            _id: employee._id.toString(),
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            position: employee.position,
            department: employee.department,
          },
        };
      });

      return res.json({ data });
    }
  } catch (error) {
    console.error("Get payslips error:", error);
    return res.status(500).json({ error: "Failed" });
  }
};

// Get payslip by ID
// GET /api/payslips/:id
export const getPayslipById = async (req, res) => {
  try {
    const payslip = await Payslip.findById(req.params.id)
      .populate("employeeId")
      .lean();

    if (!payslip) return res.status(404).json({ error: "Not found" });

    const emp = payslip.employeeId;

    const result = {
      ...payslip,
      id: payslip._id.toString(),
      employeeId: emp?._id?.toString(),
      employee: emp
        ? {
            _id: emp._id.toString(),
            firstName: emp.firstName,
            lastName: emp.lastName,
            email: emp.email,
            position: emp.position,
            department: emp.department,
          }
        : null,
    };

    return res.json({ data: result });
  } catch (error) {
    console.error("Get payslip by ID error:", error);
    return res.status(500).json({ error: "Failed" });
  }
};