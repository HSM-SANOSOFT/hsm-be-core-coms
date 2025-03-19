import Mailchimp from '@mailchimp/mailchimp_transactional';
import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  templateHtmlParcer(
    templateEmail: string,
    templateEmailVersion: string,
    templateBaseVersion: string,
  ) {
    const baseTemplatePath = path.resolve(
      __dirname,
      '../templates',
      'HMS-TE-BASE',
      `v${templateBaseVersion}.hbs`,
    );
    if (!fs.existsSync(baseTemplatePath)) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Base template v${templateBaseVersion} not found`,
      });
    }

    const templatePath = path.resolve(
      __dirname,
      '../templates',
      templateEmail,
      `v${templateEmailVersion}.hbs`,
    );
    if (!fs.existsSync(templatePath)) {
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Template ${templateEmail} v${templateEmailVersion} not found`,
      });
    }
    const baseTemplateContent = fs.readFileSync(baseTemplatePath, 'utf-8');
    const templateEmailContent = fs.readFileSync(templatePath, 'utf-8');
    const anioActual = new Date().getFullYear().toString();
    const htmlTemplate = baseTemplateContent
      .replace('{{body}}', templateEmailContent)
      .replace('{{current_year}}', anioActual);
    return htmlTemplate;
  }

  templateDataParcer(data: object) {
    const datas = Object.keys(data).map(key => ({
      name: key,
      content: data[key] as string,
    }));
    return datas;
  }

  templateSubjectParcer(template: string) {
    const subjectMap: { [key: string]: string } = {
      'HSM-TE-HIS-FRM-RECETAS': 'Recetas Medicas',
      'HSM-TE-HIS-CERTIFICADOS': 'Certificados de Pacientes',
      'HSM-TE-HIS-SOLICITUDES-LAB': 'Solicitudes de Laboratorio',
      'HSM-TE-HIS-RESULTADOS-LAB': 'Resultados de Laboratorio',
      'HSM-TE-HIS-SOLICITUDES-IMG': 'Solicitudes de Imagenes',
      'HSM-TE-HIS-RESULTADOS-IMG': 'Resultados de Imagenes',
      'HSM-TE-HAS-ADM-CITAS-TURNO': 'Comprobante de Turno asignado',
      'HSM-TE-HIS-PCT-AGENDADO': 'Paciente Agendado',
      'HSM-TE-HAS-FAC': 'Factura',
      'HSM-TE-HAS-ADM-AUTOADMISION': 'Código de verificación',
      'HSM-TE-CORE-PIN-LOGIN': 'PIN DE SEGURIDAD SANOSOFT ACCESS',
      'HSM-TE-CORE-PIN-RECOVERY':
        'PIN DE SEGURIDAD CAMBIO DE CLAVE EN EL SANOSOFT',
      'HSM-TE-CORE-PIN-REGISTER': 'REGISTRO DE INGRESO AL SANOSOFT',
      'HSM-TE-HAS-ADM-REAGENDAMIENTO': 'Reagendamiento de cita',
      'HSM-TE-HAS-BIENVENIDA': 'Mensaje apertura',
      'HSM-TE-HAS-ADM-DOC-DERV-APROB':
        'Documentación de aprobación de su derivación',
      'HSM-TE-GAA-MKT-COTIZACION': 'Recordatorio de Cotización',
    };

    if (!subjectMap[template]) {
      this.logger.error(`Subject for ${template} not found`);
      throw new RpcException({
        statusCode: HttpStatus.NOT_FOUND,
        message: `Subject for ${template} not found.`,
      });
    }
    return subjectMap[template];
  }

  templateAttachmentsParcer(
    files: Express.Multer.File[],
  ): Mailchimp.MessageAttachment[] {
    if (!files) {
      return [];
    }
    const attachments = files.map(file => ({
      type: file.mimetype,
      name: file.originalname,
      content: file.buffer.toString('base64'),
    })) as Mailchimp.MessageAttachment[];
    return attachments;
  }
}
