export type HealthStatus = {
  status: "ok";
};

export interface HealthRepository {
  checkConnection(): Promise<void>;
}

export interface HealthService {
  check(): Promise<HealthStatus>;
}
