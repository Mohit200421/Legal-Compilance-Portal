const fs = require("fs");
const lawyerControllerPath = "backend/controllers/lawyerController.js";
let content = fs.readFileSync(lawyerControllerPath, "utf8");

// Add the getLawyerProfile export at the end
const newExport = `
// Public lawyer profile
exports.getLawyerProfile = async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id)
      .populate('category', 'name')
      .populate('city', 'name')
      .populate('state', 'name');
    
    if (!lawyer) {
      return res.status(404).json({ msg: "Lawyer not found" });
    }
    
    res.json(lawyer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};`;

content = content + "\n" + newExport;
fs.writeFileSync(lawyerControllerPath, content);
console.log("Added getLawyerProfile export");
