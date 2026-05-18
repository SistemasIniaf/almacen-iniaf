import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { PrismaService } from 'prisma/prisma.service';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
import { PaginationDto, paginate } from 'src/common/dto/pagination.dto';

@Injectable()
export class UnidadesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUnidadDto) {
    const existe = await this.prisma.unidad.findUnique({
      where: { sigla: dto.sigla.toUpperCase() },
    });

    if (existe) {
      throw new BadRequestException(
        `Ya existe una unidad con la sigla "${dto.sigla.toUpperCase()}"`,
      );
    }

    return this.prisma.unidad.create({
      data: {
        ...dto,
        sigla: dto.sigla.toUpperCase(),
      },
    });
  }

  // sin paginar solo activas
  findAllActive() {
    return this.prisma.unidad.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
      select: { id: true, nombre: true, sigla: true },
    });
  }

  async findAll(pagination: PaginationDto, soloActivos?: boolean) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const skip = (page - 1) * limit;
    const where = soloActivos ? { activo: true } : undefined;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.unidad.findMany({
        where,
        skip,
        take: limit,
        orderBy: { nombre: 'asc' },
        select: {
          id: true,
          nombre: true,
          sigla: true,
          activo: true,
          _count: { select: { usuarios: true } },
        },
      }),
      this.prisma.unidad.count({ where }),
    ]);

    return paginate(data, total, page, limit);
  }

  async findOne(id: number) {
    const unidad = await this.prisma.unidad.findUnique({
      where: { id },
      include: {
        usuarios: {
          select: {
            id: true,
            nombre: true,
            usuario: true,
            rol: true,
            activo: true,
          },
        },
      },
    });

    if (!unidad) {
      throw new NotFoundException(`Unidad con id ${id} no encontrada`);
    }

    return unidad;
  }

  async update(id: number, dto: UpdateUnidadDto) {
    await this.findOne(id); // valida existencia

    if (dto.sigla) {
      const siglaUpper = dto.sigla.toUpperCase();
      const duplicado = await this.prisma.unidad.findFirst({
        where: { sigla: siglaUpper, NOT: { id } },
      });

      if (duplicado) {
        throw new BadRequestException(
          `Ya existe otra unidad con la sigla "${siglaUpper}"`,
        );
      }

      dto.sigla = siglaUpper;
    }

    return this.prisma.unidad.update({
      where: { id },
      data: dto,
    });
  }

  async toggleActivo(id: number) {
    const unidad = await this.findOne(id);

    return this.prisma.unidad.update({
      where: { id },
      data: { activo: !unidad.activo },
      select: { id: true, nombre: true, sigla: true, activo: true },
    });
  }

  async remove(id: number) {
    const unidad = await this.prisma.unidad.findUnique({
      where: { id },
      include: { _count: { select: { usuarios: true } } },
    });

    if (!unidad) {
      throw new NotFoundException(`Unidad con id ${id} no encontrada`);
    }

    if (unidad._count.usuarios > 0) {
      throw new BadRequestException(
        `No se puede eliminar la unidad "${unidad.nombre}" porque tiene ${unidad._count.usuarios} usuario(s) asignado(s). Desactívala en su lugar.`,
      );
    }

    return this.prisma.unidad.delete({ where: { id } });
  }
}
