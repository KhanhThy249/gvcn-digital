export type Role = "gvcn" | "student" | "parent" | "admin";

export type StatusTone =
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "neutral"
  | "primary";

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  description?: string;
}

export interface Student {
  id: string;
  mssv: string;
  name: string;
  gender: "Nam" | "Nữ";
  birthDate: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  address: string;
  status: "Đang học" | "Đã chuyển trường" | "Nghỉ học";
  avatar: string;
  note?: string;
}

export interface ClassRoom {
  id: string;
  name: string;
  grade: string;
  homeroomTeacher: string;
  room: string;
  studentCount: number;
  syncedAt: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: "thong-bao" | "thiep";
  audience: "Học sinh" | "Phụ huynh" | "Cả hai";
  className: string;
  createdAt: string;
  deadline?: string;
  status: "active" | "draft" | "closed";
  stats: {
    total: number;
    viewed: number;
    confirmed: number;
    responded: number;
    pending: number;
  };
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  status: "draft" | "open" | "closed";
  anonymous: boolean;
  audience: string;
  openAt: string;
  closeAt: string;
  questions: SurveyQuestion[];
  responses: number;
  totalTarget: number;
}

export interface SurveyQuestion {
  id: string;
  type: "single" | "multiple" | "text" | "scale";
  question: string;
  options?: string[];
}

export interface SurveyResultRow {
  label: string;
  value: number;
  percentage: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeType: "Học sinh" | "Phụ huynh" | "Cả hai";
  className: string;
  dueDate: string;
  createdAt: string;
  priority: "Thấp" | "Bình thường" | "Cao";
  status: "pending" | "doing" | "done" | "overdue";
  completedCount: number;
  totalCount: number;
  evidenceId?: string;
}

export interface Evidence {
  id: string;
  evidenceCode: string;
  title: string;
  category:
    | "Thông báo"
    | "Khảo sát"
    | "Nhiệm vụ"
    | "Họp"
    | "Sinh hoạt"
    | "Hồ sơ học sinh";
  className: string;
  date: string;
  audience: string;
  participants: number;
  result: string;
  images: string[];
  attachments: number;
  qrValue: string;
  createdBy: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  time: string;
  tone: StatusTone;
  evidenceCode?: string;
}

export interface ReportConfig {
  scope: string;
  period: string;
  activityType: string;
  className: string;
}

export interface StudentHomeItem {
  id: string;
  title: string;
  type: "thong-bao" | "khao-sat" | "nhiem-vu" | "xac-nhan";
  due?: string;
  status: "todo" | "done" | "late";
  actionLabel: string;
}