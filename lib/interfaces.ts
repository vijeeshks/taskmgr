interface ITask {
  taskid: string;
  title: string;
  description: string;
  statusid: number;
  status: string;
  createdate: string;
}

interface IStatus {
  statusid: number;
  status: string;
}

export type { ITask, IStatus };
