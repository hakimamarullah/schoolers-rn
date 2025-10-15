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
  displayDay: string;
  startTime: string;
  endTime: string;

}
export interface ClassroomSchedulesInfo {
  classromId: number;
  classroomName: string;
  schedules: Record<string, ScheduleInfo[]>;
}


export interface AttendanceInfo {
  attendedSessions: number;
  totalSessions: number;
  hasClocked: boolean;
}
export interface SessionInfo {
  sessionId: number;
  startTime: string;
  endTime: string;
  scheduleId: number;
  subjectName: string;
  room: string;
  teacherName: string;
  datetime: string;
  sessionDate: string;
  displayDate: string;
  displayTime: string;
  topic: string;
  status: string;
  attendanceInfo: AttendanceInfo;
}

export interface AttendanceStats {
  date: string;
  dayName: string;
  finishedClasses: number;
  totalClasses: number;
}

export interface HomepageInfo {
  attendanceStats: AttendanceStats;
  ongoingSessions: SessionInfo[];
  upcomingSessions: SessionInfo[];
  cancelledSessions: SessionInfo[];
  finishedSessions: SessionInfo[];
}

export interface GetClassroomSessionRequest {
  classroomId: number;
  status: string;
  sessionDate: string;
}
