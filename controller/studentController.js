const Student = require('../models/studentModel');

// แสดงนักเรียนทั้งหมด
exports.showAllStudents = async (req, res, next) => {
    try {
        console.log("📥 GET: /students - เรียกดูข้อมูลนักเรียนทั้งหมด");
        const result = await Student.find();
        res.json({ studentData: result });
    } catch (error) {
        console.error("❌ ERROR in showAllStudents:", error.message);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูล", error: error.message });
    }
};

// แสดงนักเรียนรายบุคคลตาม id
exports.showStudentsByID = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(`📥 GET: /students/${id} - ค้นหานักเรียนด้วย ID`);
        const std = await Student.findById(id);
        if (!std) {
            return res.status(404).json({ message: "ไม่พบนักเรียนรายนี้" });
        }
        res.json({ data: std });
    } catch (error) {
        console.error("❌ ERROR in showStudentsByID:", error.message);
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: error.message });
    }
};

// เพิ่มนักเรียนใหม่
exports.InsertStudent = async (req, res, next) => {
    try {
        const { name, age, sex, email } = req.body;
        console.log("📥 POST: /students - เพิ่มนักเรียนใหม่", req.body);

        const exitemail = await Student.findOne({ email: email });

        if (exitemail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const std = new Student({
            name,
            age,
            sex,
            email
        });

        await std.save();

        console.log("✅ นักเรียนถูกบันทึก:", std);

        res.json({ message: "Student added successfully", student: std });

    } catch (error) {
        console.error("❌ ERROR in InsertStudent:", error.message);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล", error: error.message });
    }
};

// อัปเดตข้อมูลนักเรียน
exports.updateStudent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, age, sex, email } = req.body;
        console.log(`📥 PUT: /students/${id} - อัปเดตข้อมูล`, req.body);

        const std = await Student.findById(id);

        if (!std) {
            return res.status(404).json({ message: "ไม่พบนักเรียนรายนี้" });
        }

        if (name) std.name = name;
        if (age) std.age = age;
        if (sex) std.sex = sex;
        if (email) std.email = email;

        await std.save();

        console.log("✅ ข้อมูลนักเรียนหลังอัปเดต:", std);

        res.json({ message: "อัพเดทข้อมูลนักเรียนสำเร็จ", student: std });

    } catch (error) {
        console.error("❌ ERROR in updateStudent:", error.message);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดต", error: error.message });
    }
};

// ลบนักเรียน
exports.deleteStudent = async (req, res, next) => {
    try {
        const { id } = req.params;
        console.log(`📥 DELETE: /students/${id} - ลบนักเรียน`);

        const result = await Student.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            throw new Error(`ไม่สามารถลบข้อมูลของไอดี ${id}`);
        }

        console.log("✅ ลบข้อมูลนักเรียนเรียบร้อย");

        res.json({ message: "ลบข้อมูลเรียบร้อย" });

    } catch (error) {
        console.error("❌ ERROR in deleteStudent:", error.message);
        res.status(400).json({ message: "ไม่สามารถลบข้อมูลได้", error: error.message });
    }
};
