
import { AuditLog, UserRole } from '../types';

class AuditService {
  private logs: AuditLog[] = [];

  constructor() {
    // Initialize with some mock logs if needed
  }

  log(actorId: string, actorName: string, action: string, resourceType: string, resourceId?: string, metadata?: any) {
    // Fix: Removed non-existent 'orgId' property from the AuditLog literal to match the interface definition in types.ts
    const newLog: AuditLog = {
      id: Math.random().toString(36).substring(7),
      actorUserId: actorId,
      actorName,
      action,
      resourceType,
      resourceId,
      metadata,
      createdAt: new Date().toISOString(),
    };
    this.logs.unshift(newLog);
    console.log(`[AUDIT]: ${action} on ${resourceType} by ${actorName}`);
  }

  getLogs(userRole: UserRole): AuditLog[] {
    if (userRole === UserRole.ADMIN || userRole === UserRole.AUDITOR || userRole === UserRole.SUPERADMIN) {
      return this.logs;
    }
    return [];
  }
}

export const auditService = new AuditService();
