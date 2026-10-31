import { worklogEndpoints } from '@/api/endpoints/worklog';
import type { WorklogListParams, WorklogListResponse } from '@/api/endpoints/worklog';

export const worklogApi = {
  startWorkShift: worklogEndpoints.startWorkShift,
  endWorkShift: worklogEndpoints.endWorkShift,
  getWorklogs: worklogEndpoints.getWorklogs,
  getWorklogByDate: worklogEndpoints.getWorklogByDate,
};

// WorklogItem and the request types are exported from ./types.
export type { WorklogListParams, WorklogListResponse };
