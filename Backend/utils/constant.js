
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const STUDENT = process.env.STUDENT || 'default_student_value';  // Adjust as needed


module.exports = {
    roles: {
        admin: 'admin',
        student: 'student'
    }
};
