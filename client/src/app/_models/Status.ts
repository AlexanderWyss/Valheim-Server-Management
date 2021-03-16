export interface Status {
  status: string;
  exitCode: number;
  error: string;
  startedAt: string;
  finishedAt: string;
  runningOrRestarting: boolean;
}
