export class UpdateMatchDto {
  matchId: string;
  homeScore: number;
  awayScore: number;
  status?: string; // e.g., "live", "finished"
  timestamp?: number;
}
