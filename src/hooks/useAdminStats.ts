import { useEffect, useState } from 'react';
import { ApiService } from '../data/api/ApiService';

interface AdminStatsState {
    activeElectionsCount: number;
    totalCandidatesCount: number;
    totalVotesCount: number;
    isLoading: boolean;
}

export function useAdminStats(cpf?: string): AdminStatsState {
    const [activeElectionsCount, setActiveElectionsCount] = useState<number>(0);
    const [totalCandidatesCount, setTotalCandidatesCount] = useState<number>(0);
    const [totalVotesCount, setTotalVotesCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        let isCancelled = false;
        const service = new ApiService();

        const load = async (): Promise<void> => {
            try {
                const [elections, candidates] = await Promise.all([
                    service.buscarEleicoes(),
                    service.buscarCandidatos(),
                ]);

                if (isCancelled) return;

                // Buscar total de votos de todas as eleições
                const resultsPromises = elections.map(e => 
                    service.buscarResultados(e.id).catch(() => ({ totalVotos: 0 } as any))
                );
                const results = await Promise.all(resultsPromises);
                const totalVotes = results.reduce((acc, curr) => acc + (curr.totalVotos || 0), 0);

                const active = elections.filter(e => e.status === 'ativa').length;

                setActiveElectionsCount(active);
                setTotalCandidatesCount(candidates.length);
                setTotalVotesCount(totalVotes);
            } finally {
                if (!isCancelled) setIsLoading(false);
            }
        };

        void load();
        return () => {
            isCancelled = true;
        };
    }, [cpf]);

    return { activeElectionsCount, totalCandidatesCount, totalVotesCount, isLoading };
}


