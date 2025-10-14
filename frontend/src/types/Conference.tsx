export interface Conference {
  id: string;
  name: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  state: "Accepted" | "Rejected" | "Not Assigned";
  companyName: string;
  organizerName: string;
  createdDate: string;
  lastUpdated: string;
}
