import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { calcularTempoRestante } from '../../../utils/dateUtils';

interface ElectionTimerProps {
    dataInicio: Date;
    dataFim: Date;
    status: 'futura' | 'ativa' | 'encerrada';
}

export const ElectionTimer: React.FC<ElectionTimerProps> = ({
    dataInicio,
    dataFim,
    status
}) => {
    const [tempoRestante, setTempoRestante] = useState(() => {
        if (status === 'futura') {
            return calcularTempoRestante(dataInicio);
        } else if (status === 'ativa') {
            return calcularTempoRestante(dataFim);
        }
        return { anos: 0, meses: 0, dias: 0, horas: 0, minutos: 0, segundos: 0, total: 0 };
    });

    useEffect(() => {
        const interval = setInterval(() => {
            if (status === 'futura') {
                setTempoRestante(calcularTempoRestante(dataInicio));
            } else if (status === 'ativa') {
                setTempoRestante(calcularTempoRestante(dataFim));
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [dataInicio, dataFim, status]);

    const formatarTempo = () => {
        const { anos, meses, dias, horas, minutos } = tempoRestante;

        if (anos > 0) {
            return `${anos}a ${meses}M ${dias}d`;
        } else if (meses > 0) {
            return `${meses}M ${dias}d ${horas}h`;
        } else if (dias > 0) {
            return `${dias}d ${horas}h ${minutos}m`;
        } else if (horas > 0) {
            return `${horas}h ${minutos}m`;
        } else if (minutos > 0) {
            return `${minutos}m`;
        } else {
            return 'Finalizado';
        }
    };

    const getTimerLabel = () => {
        if (status === 'futura') {
            return 'Começa em:';
        } else if (status === 'ativa') {
            return 'Termina em:';
        }
        return 'Encerrada';
    };

    const getTimerColor = () => {
        if (status === 'futura') {
            return 'text-blue-600';
        } else if (status === 'ativa') {
            return 'text-green-600';
        }
        return 'text-gray-500';
    };

    if (status === 'encerrada') {
        return (
            <div className="flex items-center gap-2 text-gray-500">
                <Clock size={16} />
                <span className="text-sm">Encerrada</span>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Clock size={16} className={getTimerColor()} />
            <div className="text-sm text-center">
                <div className={`font-medium ${getTimerColor()}`}>
                    {getTimerLabel()}
                </div>
                <div className={`font-bold ${getTimerColor()}`}>
                    {formatarTempo()}
                </div>
            </div>
        </div>
    );
};
