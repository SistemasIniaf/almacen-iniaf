import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UnidadesService } from './unidades.service';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { Rol } from '../../common/enums/rol.enum';

@Controller('unidades')
export class UnidadesController {
  constructor(private unidadesService: UnidadesService) {}

  // Solo administrador puede crear unidades.
  @Post()
  @Roles(Rol.ADMINISTRADOR)
  create(@Body() dto: CreateUnidadDto) {
    return this.unidadesService.create(dto);
  }

  // -Todos los roles autenticados pueden listar unidades. ?soloActivos=true → filtra solo las activas.
  @Get()
  findAll(@Query('soloActivos') soloActivos?: string) {
    return this.unidadesService.findAll(soloActivos === 'true');
  }

  // Incluye la lista de usuarios asignados.
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.unidadesService.findOne(id);
  }

  // Solo administrador puede editar.
  @Patch(':id')
  @Roles(Rol.ADMINISTRADOR)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUnidadDto) {
    return this.unidadesService.update(id, dto);
  }

  // Activa o desactiva la unidad.
  @Patch(':id/toggle')
  @Roles(Rol.ADMINISTRADOR)
  @HttpCode(HttpStatus.OK)
  toggleActivo(@Param('id', ParseIntPipe) id: number) {
    return this.unidadesService.toggleActivo(id);
  }

  // Solo si no tiene usuarios asignados.
  @Delete(':id')
  @Roles(Rol.ADMINISTRADOR)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.unidadesService.remove(id);
  }
}
