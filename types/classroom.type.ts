export interface SimpleClassroomInfo {
  id: number;
  name: string;
  grade: string;
  academicYear: string;
}


export interface ScheduleInfo {
  id: number;
  subjectName: string;
  teacherName: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;

}
export interface ClassroomSchedulesInfo {
  classromId: number;
  classroomName: string;
  schedules: Record<string, ScheduleInfo[]>;
}