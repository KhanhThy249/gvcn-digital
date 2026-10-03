import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  BookUser,
  ClipboardCheck,
  ClipboardList,
  FileBarChart,
  FolderArchive,
  Gauge,
  IdCard,
  ListChecks,
  QrCode,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

import type { Role } from "@/lib/types";

export interface NavEntry {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Nhóm chức năng để gom trên mobile */
  group: string;
  description: string;
}

const iconSize = 20;

function entry(
  label: string,
  href: string,
  icon: LucideIcon,
  group: string,
  description: string,
): NavEntry {
  return { label, href, icon, group, description };
}

export const navigationByRole: Record<Role, NavEntry[]> = {
  gvcn: [
    entry("Tổng quan", "/", Gauge, "Tổng quan", "Công việc hôm nay và tin nhắn cần xử lý"),
    entry("Lớp học", "/lop-hoc", Users, "Quản lý lớp", "Danh sách và hồ sơ học sinh"),
    entry("Thông báo & Thiệp", "/thong-bao", Bell, "Truyền thông", "Gửi và theo dõi thông báo, thiệp"),
    entry("Khảo sát", "/khao-sat", ClipboardList, "Tương tác", "Tạo khảo sát và xem kết quả"),
    entry("Nhiệm vụ", "/nhiem-vu", ListChecks, "Tương tác", "Giao nhiệm vụ và theo dõi tiến độ"),
    entry("Theo dõi tiến độ", "/theo-doi", ClipboardCheck, "Theo dõi", "Ai đã làm, ai chưa làm, ai quá hạn"),
    entry("Minh chứng", "/minh-chung", FolderArchive, "Minh chứng", "Hồ sơ minh chứng công tác"),
    entry("Báo cáo", "/bao-cao", FileBarChart, "Báo cáo", "Tổng hợp và xuất báo cáo PDF"),
    entry("Cài đặt", "/cai-dat", Settings, "Hệ thống", "Tuỳ chỉnh thông báo và tài khoản"),
  ],
  student: [
    entry("Trang chủ", "/", Gauge, "Trang chủ", "Việc cần làm hôm nay"),
    entry("Thông báo", "/thong-bao", Bell, "Nhận thông tin", "Thông báo và thiệp từ cô"),
    entry("Khảo sát", "/khao-sat", ClipboardList, "Thực hiện", "Tham gia khảo sát đang mở"),
    entry("Nhiệm vụ", "/nhiem-vu", ListChecks, "Thực hiện", "Bài tập và nhiệm vụ được giao"),
    entry("Hồ sơ của tôi", "/lop-hoc", BookUser, "Hồ sơ", "Thông tin cá nhân của bạn"),
    entry("Minh chứng", "/minh-chung", FolderArchive, "Minh chứng", "Minh chứng bạn đã tham gia"),
  ],
  parent: [
    entry("Trang chủ", "/", Gauge, "Trang chủ", "Việc cần làm hôm nay"),
    entry("Thông báo & Thiệp", "/thong-bao", Bell, "Nhận thông tin", "Thông báo, thiệp điện tử"),
    entry("Khảo sát", "/khao-sat", ClipboardList, "Thực hiện", "Khảo sát phụ huynh"),
    entry("Nhiệm vụ", "/nhiem-vu", ListChecks, "Thực hiện", "Xác nhận và nộp minh chứng"),
    entry("Minh chứng", "/minh-chung", FolderArchive, "Minh chứng", "Minh chứng của học sinh"),
  ],
  admin: [
    entry("Tổng quan", "/", BarChart3, "Tổng quan", "Số liệu toàn trường"),
    entry("Quản lý lớp", "/lop-hoc", Users, "Quản lý", "Lớp học và danh sách học sinh"),
    entry("Tài khoản & Phân quyền", "/tai-khoan", IdCard, "Quản lý", "Tài khoản và quyền truy cập"),
    entry("Dữ liệu & Báo cáo", "/bao-cao", FileBarChart, "Báo cáo", "Tổng hợp dữ liệu toàn trường"),
    entry("Minh chứng", "/minh-chung", FolderArchive, "Minh chứng", "Kho minh chứng toàn trường"),
    entry("Nhật ký hoạt động", "/nhat-ky", ShieldCheck, "Hệ thống", "Lịch sử thao tác trên hệ thống"),
    entry("Cài đặt hệ thống", "/cai-dat", Settings, "Hệ thống", "Cấu hình chung"),
  ],
};

export const roleIconSize = iconSize;

export const qrIcon = QrCode;