export interface DashboardSummary {
  totalStudents: number;
  totalRecruiters: number;
  totalOffers: number;
}

export interface SummaryMetrics {
totalStudents: number;
interestedInBand: number;
offersSent: number;
offersAccepted: number;
averageRatingGiven?: number;
}

export type ActivityType = 'video_upload' | 'student_interest' | 'rating_left' | 'offer_status';


export interface ActivityItem {
type: ActivityType;
timestamp: string;
studentId?: string;
studentName?: string;
videoId?: string;
details?: string;
}