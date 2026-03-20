import type { AttendanceStatus, StudentOption } from "./instruktor-wyklady-types";

export function getAttendanceStatusLabel(status: AttendanceStatus) {
  if (status === "PRESENT") return "Obecny";
  if (status === "ABSENT") return "Nieobecny";
  return "Zapisany";
}

export function getStudentsWithoutCompletedTheory(students: StudentOption[]) {
  return students.filter((student) => !student.completedTheory);
}

export function toggleStudentInSelection(currentIds: string[], studentId: string, checked: boolean) {
  if (checked) {
    if (currentIds.includes(studentId)) return currentIds;
    return [...currentIds, studentId];
  }

  return currentIds.filter((id) => id !== studentId);
}

export function toggleAllIncompleteStudentsSelection(
  currentIds: string[],
  incompleteStudents: StudentOption[],
) {
  const currentSet = new Set(currentIds);
  const allSelected =
    incompleteStudents.length > 0 &&
    incompleteStudents.every((student) => currentSet.has(student.id));

  if (allSelected) {
    return currentIds.filter(
      (id) => !incompleteStudents.some((student) => student.id === id),
    );
  }

  const next = new Set(currentIds);
  for (const student of incompleteStudents) {
    next.add(student.id);
  }
  return [...next];
}
