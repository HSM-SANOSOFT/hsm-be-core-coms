export type HasMedCensoEmailTemplate = { 
    censo: Array<{
        num: string;
        cama: string;
        hc: string;
        paciente: string;
        med_tratante: string;
        dx: string;
        fech_ingreso: string;
        dias: string;
        fecha_censo: string;
    }>;
};
