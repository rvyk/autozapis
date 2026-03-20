import type { InstructorStudentFilter, StudentItem } from "./instruktor-kursanci-types";

export function getFilteredStudents(
  students: StudentItem[],
  filter: InstructorStudentFilter,
) {
  if (filter === "MOI") {
    return students.filter((student) => student.assignedToMe);
  }

  if (filter === "WOLNI") {
    return students.filter((student) => !student.assignedToAnyone);
  }

  return students;
}

export function getFilteredUnassignedStudents(students: StudentItem[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  return students.filter((student) => {
    if (student.assignedToAnyone) return false;
    if (!normalizedQuery) return true;

    return (
      student.fullName.toLowerCase().includes(normalizedQuery) ||
      student.phone.toLowerCase().includes(normalizedQuery)
    );
  });
}
