import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { AuditAction } from '@aled/shared';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async log(data: {
    userId?: string;
    action: AuditAction;
    entity: string;
    entityId: string;
    before?: any;
    after?: any;
    ip?: string;
    userAgent?: string;
  }) {
    await this.prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        before: data.before || null,
        after: data.after || null,
        ip: data.ip,
        userAgent: data.userAgent,
      },
    });
  }

  async getLogs(params: {
    skip?: number;
    take?: number;
    userId?: string;
    entity?: string;
    action?: AuditAction;
  }) {
    const { skip, take, userId, entity, action } = params;

    const where: any = {};
    if (userId) where.userId = userId;
    if (entity) where.entity = entity;
    if (action) where.action = action;

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { logs, total };
  }
}
