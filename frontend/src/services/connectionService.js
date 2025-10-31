import api from "../config/api";

export const connectionService = {
  getSuggestedAlumni: (studentId) =>
    api.get(`/connections/suggested/${studentId}`).then((res) => res.data),

  sendConnectionRequest: (studentId, alumniId) =>
    api.post(`/connections/send?studentId=${studentId}&alumniId=${alumniId}`).then((res) => res.data),

  getPendingRequests: (alumniId) =>
    api.get(`/connections/pending/${alumniId}`).then((res) => res.data),

  acceptRequest: (connectionId) =>
    api.post(`/connections/accept/${connectionId}`).then((res) => res.data),

  rejectRequest: (connectionId) =>
    api.post(`/connections/reject/${connectionId}`).then((res) => res.data),

  getStudentConnections: (studentId) =>
    api.get(`/connections/student/${studentId}`).then((res) => res.data),

  getAlumniConnections: (alumniId) =>
    api.get(`/connections/alumni/${alumniId}`).then((res) => res.data),

  // ✅ Add this
  getAllAlumni: () =>
    api.get("/connections/allAlumni").then((res) => res.data),
};
