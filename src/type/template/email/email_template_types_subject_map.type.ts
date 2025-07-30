import { EmailTemplateType } from './email_template_types.type';

export const EmailTemplateTypesSubjectMap = {
  [EmailTemplateType.adm_autoadmision]: 'Autoadmisión',
  [EmailTemplateType.adm_bienvenida]: 'Bienvenida',
  [EmailTemplateType.adm_citas_turnos]: 'Citas y Turnos',
  [EmailTemplateType.adm_documento_derivacion_aprobado]:
    'Documento de Derivación Aprobado',
  [EmailTemplateType.adm_documento_derivacion_pendiente]:
    'Documento de Derivación Pendiente',
  [EmailTemplateType.adm_documento_derivacion_rechazado]:
    'Documento de Derivación Rechazado',
  [EmailTemplateType.adm_reagendamiento]: 'Reagendamiento',
  [EmailTemplateType.adm_recordatorio_cita]: 'Recordatorio de Cita',
  [EmailTemplateType.base]: 'Base',
  [EmailTemplateType.fac_factura_lista]: 'Factura Lista',
  [EmailTemplateType.his_certificado_medico]: 'Certificado Médico',
  [EmailTemplateType.his_programacion_quirofano]: 'Programación Quirófano',
  [EmailTemplateType.his_receta_medica]: 'Receta Médica',
  [EmailTemplateType.his_resultado_examen_imagen]: 'Resultado Examen Imagen',
  [EmailTemplateType.his_resultado_examen_laboratorio]:
    'Resultado Examen Laboratorio',
  [EmailTemplateType.his_resultado_examen_patologia]:
    'Resultado Examen Patología',
  [EmailTemplateType.his_solicitud_examen_imagen]: 'Solicitud Examen Imagen',
  [EmailTemplateType.his_solicitud_examen_laboratorio]:
    'Solicitud Examen Laboratorio',
  [EmailTemplateType.his_solicitud_examen_patologia]:
    'Solicitud Examen Patología',
  [EmailTemplateType.mkt_cotizacion]: 'Cotización',
  [EmailTemplateType.pin_login]: 'Pin de seguridad de ingreso al SANOSOFT',
  [EmailTemplateType.pin_recovery]: 'Pin de seguridad cambio de clave',
  [EmailTemplateType.pin_register]:
    'Pin de seguridad registro de ingreso al SANOSOFT',
  [EmailTemplateType.pin_result]: 'Pin de seguridad para visualizar resultados',
};
