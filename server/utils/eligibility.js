// Compares a student's profile against a job's requirements.
// Returns whether they're eligible, plus a breakdown for the UI to show why.
export const checkEligibility = (job, studentProfile) => {
  const reasons = [];

  const cgpaOk = studentProfile.cgpa >= job.minCGPA;
  if (!cgpaOk) {
    reasons.push(`CGPA ${studentProfile.cgpa} is below the required ${job.minCGPA}`);
  }

  const branchOk = job.branch
    .map((b) => b.toLowerCase())
    .includes(studentProfile.branch.toLowerCase());
  if (!branchOk) {
    reasons.push(`Branch '${studentProfile.branch}' is not in the eligible list (${job.branch.join(', ')})`);
  }

  const studentSkillsLower = studentProfile.skills.map((s) => s.toLowerCase());
  const requiredSkillsLower = job.skills.map((s) => s.toLowerCase());
  const matchedSkills = requiredSkillsLower.filter((s) => studentSkillsLower.includes(s));
  const skillsOk = requiredSkillsLower.length === 0 || matchedSkills.length === requiredSkillsLower.length;
  if (!skillsOk) {
    const missing = job.skills.filter((s) => !studentSkillsLower.includes(s.toLowerCase()));
    reasons.push(`Missing required skills: ${missing.join(', ')}`);
  }

  return {
    eligible: cgpaOk && branchOk && skillsOk,
    cgpaOk,
    branchOk,
    skillsOk,
    skillMatch: `${matchedSkills.length}/${requiredSkillsLower.length}`,
    reasons,
  };
};
